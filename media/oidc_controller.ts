import { Request, Response } from 'express';
import { Configuration, buildAuthorizationUrl, authorizationCodeGrant, ClientSecretBasic, None } from 'openid-client';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import crypto from 'node:crypto';
import { UserModel } from '../models/User.js';
import pkg from 'jsonwebtoken';
import { logger } from '../logging.js';
import { createUserWithUniqueUrl } from '../services/user_service.js';

const { sign } = pkg;

// Cache for configs: issuer -> Configuration
const configCache: Record<string, Configuration> = {};

const getConfig = async (issuer?: string): Promise<Configuration | null> => {
    // Determine which issuer config to use
    let targetIssuer = process.env.OIDC_ISSUER;
    let targetClientId = process.env.OIDC_CLIENT_ID;
    let targetClientSecret = process.env.OIDC_CLIENT_SECRET;

    if (issuer && process.env.LTI_ISSUER && issuer === process.env.LTI_ISSUER) {
        targetIssuer = process.env.LTI_ISSUER;
        targetClientId = process.env.LTI_CLIENT_ID;
        targetClientSecret = process.env.LTI_CLIENT_SECRET;

        // Allow overriding endpoints for LTI
        if (process.env.LTI_AUTH_ENDPOINT) {
            const serverMetadata = {
                issuer: targetIssuer,
                authorization_endpoint: process.env.LTI_AUTH_ENDPOINT,
                token_endpoint: process.env.LTI_TOKEN_ENDPOINT || `${targetIssuer}/token`, // Fallback or strict requirement?
                userinfo_endpoint: process.env.LTI_USERINFO_ENDPOINT || `${targetIssuer}/userinfo`,
                jwks_uri: process.env.LTI_JWKS_URI || `${targetIssuer}/certs`,
            };

            // ... (rest of logic tailored for manual metadata)
            const clientAuth = targetClientSecret ? ClientSecretBasic(targetClientSecret) : None();

            const config = new Configuration(
                serverMetadata,
                targetClientId,
                {
                    client_id: targetClientId,
                    client_secret: targetClientSecret,
                    redirect_uris: [`${process.env.BASE_URL}/oidc-callback`],
                    response_types: ['id_token'],
                    token_endpoint_auth_method: targetClientSecret ? 'client_secret_basic' : 'none',
                },
                clientAuth
            );
            configCache[targetIssuer] = config;
            return config;
        }
    }

    if (!targetIssuer || !targetClientId) {
        return null;
    }

    if (configCache[targetIssuer]) {
        return configCache[targetIssuer];
    }
    logger.info("OIDC Config: Issuer=%s, ClientID=%s", targetIssuer, targetClientId);

    try {
        const issuerUrl = targetIssuer.replace(/\/$/, ""); // Remove trailing slash if present

        // Manual construction to avoid discovery issues and strict validation
        const serverMetadata = {
            issuer: issuerUrl,
            authorization_endpoint: `${issuerUrl}/protocol/openid-connect/auth`,
            token_endpoint: `${issuerUrl}/protocol/openid-connect/token`,
            userinfo_endpoint: `${issuerUrl}/protocol/openid-connect/userinfo`,
            jwks_uri: `${issuerUrl}/protocol/openid-connect/certs`,
        };

        const clientAuth = targetClientSecret ? ClientSecretBasic(targetClientSecret) : None();

        const config = new Configuration(
            serverMetadata,
            targetClientId,
            {
                client_id: targetClientId,
                client_secret: targetClientSecret,
                redirect_uris: [`${process.env.BASE_URL}/oidc-callback`],
                response_types: ['code'],
                token_endpoint_auth_method: targetClientSecret ? 'client_secret_basic' : 'none',
            },
            clientAuth
        );
        configCache[targetIssuer] = config;
        return config;
    } catch (err) {
        if (err instanceof Error) {
            logger.error(`Failed to configure OIDC: ${err.message}`);
        } else {
            logger.error("Failed to configure OIDC: %o", err);
        }
        return null;
    }
};

export const getAuthUrl = async (req: Request, res: Response): Promise<void> => {
    const { login_hint, lti_message_hint, iss, target_link_uri } = { ...req.query, ...req.body };
    logger.info("getAuthUrl called with: login_hint=%s, lti_message_hint=%s, iss=%s", login_hint, lti_message_hint, iss);

    const oidcConfig = await getConfig(iss);
    if (!oidcConfig) {
        res.status(503).json({ error: "OIDC not configured" });
        return;
    }

    // Validate Issuer if provided (LTI 1.3 Security)
    // If iss is provided but doesn't match any configured issuer, getConfig might return default or null depending on logic.
    // Our logic currently defaults to OIDC_ISSUER if iss doesn't match LTI_ISSUER. 
    // We should probably log if `iss` was present but not matched if we want to be strict, but for now this is fine.

    const params: any = {
        scope: 'openid email profile',
        redirect_uri: `${process.env.BASE_URL}/oidc-callback`,
    };

    // For LTI, we must redirect to the backend because the frontend cannot handle the POST request
    if (iss && process.env.LTI_ISSUER && iss === process.env.LTI_ISSUER) {
        // Use BASE_URL (frontend) + /api proxy path so we don't need to expose backend port directly
        // Vite proxy in client/vite.config.ts forwards /api to backend
        const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
        params.redirect_uri = `${baseUrl}/api/v1/oidc/login`;

        params.scope = 'openid'; // Moodle auth.php requires strict 'openid' scope
        params.response_type = 'id_token';
        params.response_mode = 'form_post';
        params.nonce = crypto.randomUUID();
        params.state = crypto.randomUUID();
    } else {
        params.response_type = 'code';
    }

    if (login_hint) {
        params.login_hint = login_hint;
    }
    if (lti_message_hint) {
        params.lti_message_hint = lti_message_hint;
    }

    // Generates the auth url that the frontend should redirect the user to
    const url = await buildAuthorizationUrl(oidcConfig, params);

    // If it is a Third-Party Initiated Login (indicated by login_hint), we should redirect directly
    if (login_hint) {
        res.redirect(url.href);
        return;
    }

    res.json({ url: url.href });
};

const updateExistingUser = async (user: any, name?: string, picture?: string) => {
    // User exists - update details if needed (e.g. name, picture)
    // We use findOneAndUpdate to ensure we only update specific fields and do not overwrite 
    // other fields like google_tokens if the user object instance was partial or stale.
    const update: any = {};

    if (!user.use_gravatar && picture) {
        update.picture_url = picture;
    }
    if (name) {
        update.name = name;
    }

    if (Object.keys(update).length > 0) {
        return await UserModel.findOneAndUpdate(
            { _id: user._id },
            { $set: update },
            { new: true, runValidators: true }
        ).exec();
    }
    return user;
};

const mapRoles = (claims: any): string[] => {
    const roles: string[] = [];
    const ltiRoles = claims['https://purl.imsglobal.org/spec/lti/claim/roles'] ||
        claims['roles'] ||
        [];

    if (Array.isArray(ltiRoles)) {
        for (const r of ltiRoles) {
            if ((r.toLowerCase().includes('student') || r.toLowerCase().includes('learner')) && !roles.includes('student')) {
                roles.push('student');
            }
        }
    }
    return roles;
};

const updateUserRoles = async (user: any, roles: string[]) => {
    if (roles.length > 0) {
        const params: any = { roles: { $each: roles } };
        await UserModel.updateOne({ _id: user._id }, { $addToSet: params }).exec();
        return await UserModel.findById(user._id).exec();
    }
    return user;
};

const findOrCreateUser = async (sub: string, email: string, name?: string, picture?: string, roles: string[] = []) => {
    let user = await UserModel.findById(sub).exec();

    if (!user) {
        user = await UserModel.findOne({ email }).exec();
    }

    if (user) {
        // Update roles first (atomic)
        user = await updateUserRoles(user, roles);
        // Then update profile info (name, picture)
        return await updateExistingUser(user, name, picture);
    }

    return await createUserWithUniqueUrl(sub, email, name, picture, roles);
};

const setAuthCookie = (res: Response, user: any, redirectUrl?: string, req?: Request) => {
    const payload: any = {
        name: user.name,
        email: user.email,
        roles: user.roles,
        picture_url: user.picture_url,
    };

    if (user._id) {
        payload._id = user._id;
    }
    if (user.sub) {
        payload.sub = user.sub;
    }
    if (user.lti_context_id) {
        payload.lti_context_id = user.lti_context_id;
    }
    if (user.lti_claims) {
        Object.assign(payload, user.lti_claims);
    }

    const access_token = sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    const isDev = process.env.NODE_ENV === 'development';
    const isLocalhost = req?.hostname === 'localhost' || req?.hostname === '127.0.0.1';

    // Warn if NODE_ENV is mismatching expectation
    if (!isDev && isLocalhost) {
        logger.warn("Running on localhost but NODE_ENV is not development. Cookies might be Secure.");
    }

    const domain = process.env.DOMAIN;
    const sameSite = isDev ? 'lax' : 'strict';

    const cookieOptions: any = {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
        // Force non-secure on localhost to avoid issues with HTTP, regardless of NODE_ENV
        secure: !isLocalhost && !isDev,
        sameSite
    };
    if (domain) {
        cookieOptions.domain = domain;
    }

    // Use 'lti_token' for transient users (no _id), 'access_token' for persistent users
    const cookieName = user._id ? 'access_token' : 'lti_token';

    res.cookie(cookieName, access_token, cookieOptions);

    if (redirectUrl) {
        res.redirect(redirectUrl);
    } else {
        res.status(200).json({
            user: payload,
        });
    }
};

const verifyLtiToken = async (id_token: string): Promise<any> => {
    let jwksUri = process.env.LTI_JWKS_URI;
    // Fallback to constructing from issuer if not explicitly set, 
    // but only if we have an LTI_ISSUER to base it on.
    if (!jwksUri && process.env.LTI_ISSUER) {
        jwksUri = `${process.env.LTI_ISSUER}/certs`;
    }

    if (!jwksUri) {
        throw new Error("Cannot verify LTI token: Missing LTI_JWKS_URI configuration");
    }

    const JWKS = createRemoteJWKSet(new URL(jwksUri));

    const { payload } = await jwtVerify(id_token, JWKS, {
        issuer: process.env.LTI_ISSUER, // Strict issuer check
        audience: process.env.LTI_CLIENT_ID, // Strict audience check
    });

    logger.debug("LTI Token Verified. Claims: %o", payload);
    return payload;
};

const exchangeCodeForToken = async (code: string, oidcConfig: Configuration): Promise<any> => {
    const currentUrl = new URL(`${process.env.BASE_URL}/oidc-callback`);
    currentUrl.searchParams.set('code', code);

    const tokenSet = await authorizationCodeGrant(
        oidcConfig,
        currentUrl,
        {
            pkceCodeVerifier: undefined,
        },
        {
            redirect_uri: `${process.env.BASE_URL}/oidc-callback`,
        }
    );
    return tokenSet.claims();
};

const completeLogin = async (req: Request, res: Response, claims: any, isLti: boolean) => {
    const sub = claims.sub as string;
    const email = claims.email as string;
    const name = claims.name as string | undefined;
    const picture = claims.picture as string | undefined;

    // Check both 'roles' and LTI-specific roles
    const roles = mapRoles(claims);

    if (!email && !isLti) {
        res.status(400).json({ error: "Email not provided by ID provider" });
        return;
    }

    if (isLti) {
        // LTI Launch: Transient user, check for existing by email
        let user: any = {
            sub,
            email,
            name,
            picture_url: picture,
            roles,
            lti_claims: {
                "https://purl.imsglobal.org/spec/lti/claim/roles": claims["https://purl.imsglobal.org/spec/lti/claim/roles"],
                "https://purl.imsglobal.org/spec/lti/claim/context": claims["https://purl.imsglobal.org/spec/lti/claim/context"],
                "https://purl.imsglobal.org/spec/lti/claim/resource_link": claims["https://purl.imsglobal.org/spec/lti/claim/resource_link"],
                "https://purl.imsglobal.org/spec/lti/claim/launch_presentation": claims["https://purl.imsglobal.org/spec/lti/claim/launch_presentation"],
                "https://purl.imsglobal.org/spec/lti/claim/tool_platform": claims["https://purl.imsglobal.org/spec/lti/claim/tool_platform"],
                "https://purl.imsglobal.org/spec/lti/claim/custom": claims["https://purl.imsglobal.org/spec/lti/claim/custom"],
                "https://purl.imsglobal.org/spec/lti/claim/message_type": claims["https://purl.imsglobal.org/spec/lti/claim/message_type"],
                "https://purl.imsglobal.org/spec/lti/claim/version": claims["https://purl.imsglobal.org/spec/lti/claim/version"]
            }
        };

        const existingUser = email ? await UserModel.findOne({ email }).exec() : null;
        if (existingUser) {
            user._id = existingUser._id;
            // Merge roles if needed, or just use LTI roles? 
            // User request: "helps teachers who want to administrate...". 
            // Implication: they need their internal permissions.
            // But LTI roles might be context specific. 
            // Safest: Use LTI roles for this session, or merge?
            // "The LTI token should *not* be translated to lokal users... for booking of restricted event types only"
            // "However... add the (internal) _id"
            // If I add _id, the system might treat them as the user.
            // I will strictly follow: Add _id. Keep roles from LTI (as calculated by mapRoles).
        }

        const ltiContext = claims['https://purl.imsglobal.org/spec/lti/claim/context'];
        if (ltiContext?.id) {
            user.lti_context_id = ltiContext.id;
        }

        let baseUrl = process.env.BASE_URL || '/';
        const customClaims = claims['https://purl.imsglobal.org/spec/lti/claim/custom'];
        const targetLinkUri = claims['https://purl.imsglobal.org/spec/lti/claim/target_link_uri'];

        let userSlug = customClaims?.u || customClaims?.user;
        let eventSlug = customClaims?.e || customClaims?.event || customClaims?.url;

        if (targetLinkUri) {
            try {
                const url = new URL(targetLinkUri);
                // Use target_link_uri as base, stripping query params
                baseUrl = url.origin + url.pathname;
                // Remove trailing slash to avoid double slashes when appending
                if (baseUrl.endsWith('/')) {
                    baseUrl = baseUrl.slice(0, -1);
                }

                if (!userSlug) userSlug = url.searchParams.get('u') || url.searchParams.get('user');
                if (!eventSlug) eventSlug = url.searchParams.get('e') || url.searchParams.get('event') || url.searchParams.get('url');
            } catch (err) {
                logger.warn("Failed to parse target_link_uri: %s", targetLinkUri);
            }
        }

        let redirectUrl = baseUrl;
        if (userSlug && eventSlug) {
            redirectUrl = `${baseUrl}/users/${userSlug}/${eventSlug}`;
        } else if (userSlug) {
            redirectUrl = `${baseUrl}/users/${userSlug}`;
        }

        if (!redirectUrl) {
            redirectUrl = '/';
        }

        setAuthCookie(res, user, redirectUrl, req);
    } else {
        // Standard OIDC Login: Persistent user
        const user = await findOrCreateUser(sub, email, name, picture, roles);

        if (!user) {
            throw new Error("User creation failed after retries");
        }
        // Standard users have _id from DB.
        setAuthCookie(res, user, undefined, req);
    }
};

export const oidcLoginController = async (req: Request, res: Response): Promise<void> => {
    // Frontend sends the code (Code Flow) or id_token (Implicit Flow/LTI)
    const { code, id_token } = req.body;

    if (!code && !id_token) {
        res.status(400).json({ error: "Authorization code or id_token missing" });
        return;
    }

    const oidcConfig = await getConfig(); // Uses default for now if no arg

    if (!oidcConfig) {
        res.status(503).json({ error: "OIDC not configured" });
        return;
    }

    try {
        let claims: any;
        const isLti = !!id_token;

        if (isLti) {
            claims = await verifyLtiToken(id_token as string);
        } else {
            claims = await exchangeCodeForToken(code as string, oidcConfig);
        }

        await completeLogin(req, res, claims, isLti);

    } catch (err: any) {
        logger.error("OIDC Login failed: %o", err);
        if (err.code === 11000) {
            res.status(409).json({ error: "User with this email already exists via another provider." });
        } else {
            res.status(401).json({ error: "Authentication failed", details: err.message });
        }
    }
};
