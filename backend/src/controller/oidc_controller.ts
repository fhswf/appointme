import { Request, Response } from 'express';
import { Configuration, buildAuthorizationUrl, authorizationCodeGrant, ClientSecretBasic, None } from 'openid-client';
import { UserModel } from '../models/User.js';
import pkg from 'jsonwebtoken';
import { logger } from '../logging.js';
import { validateUrl } from './authentication_controller.js';

const { sign } = pkg;

let config: Configuration | null = null;

const getConfig = async (): Promise<Configuration | null> => {
    if (config) return config;
    if (!process.env.OIDC_ISSUER || !process.env.OIDC_CLIENT_ID) {
        return null;
    }
    logger.info("OIDC Config: Issuer=%s, ClientID=%s", process.env.OIDC_ISSUER, process.env.OIDC_CLIENT_ID);

    try {
        const issuerUrl = process.env.OIDC_ISSUER.replace(/\/$/, ""); // Remove trailing slash if present

        // Manual construction to avoid discovery issues and strict validation
        const serverMetadata = {
            issuer: issuerUrl,
            authorization_endpoint: `${issuerUrl}/protocol/openid-connect/auth`,
            token_endpoint: `${issuerUrl}/protocol/openid-connect/token`,
            userinfo_endpoint: `${issuerUrl}/protocol/openid-connect/userinfo`,
            jwks_uri: `${issuerUrl}/protocol/openid-connect/certs`,
        };

        const clientId = process.env.OIDC_CLIENT_ID;
        const clientSecret = process.env.OIDC_CLIENT_SECRET;
        const clientAuth = clientSecret ? ClientSecretBasic(clientSecret) : None();

        config = new Configuration(
            serverMetadata,
            clientId,
            {
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uris: [`${process.env.BASE_URL}/oidc-callback`],
                response_types: ['code'],
                token_endpoint_auth_method: clientSecret ? 'client_secret_basic' : 'none',
            },
            clientAuth
        );
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
    const oidcConfig = await getConfig();
    if (!oidcConfig) {
        res.status(503).json({ error: "OIDC not configured" });
        return;
    }

    const { login_hint, lti_message_hint, iss, target_link_uri } = { ...req.query, ...req.body };

    // Validate Issuer if provided (LTI 1.3 Security)
    if (iss && iss !== process.env.OIDC_ISSUER) {
        logger.warn(`LTI Launch attempted with invalid issuer: ${iss}`);
        // We might want to continue if we trust the configured issuer regardless, but usually we should check.
        // For now, we trust the configured OIDC_ISSUER.
    }

    const params: any = {
        scope: 'openid email profile',
        redirect_uri: `${process.env.BASE_URL}/oidc-callback`,
    };

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
    // We do not change _id here, even if it doesn't match `sub`.
    if (!user.use_gravatar && picture) {
        user.picture_url = picture;
    }
    if (name) {
        user.name = name;
    }
    // Save updates
    await user.save();
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

const createNewUser = async (sub: string, email: string, name?: string, picture?: string, roles: string[] = []) => {
    let user_url = validateUrl(email);
    const picture_url = picture || "";
    const userName = name || email.split('@')[0];
    let user;

    let retry = 0;
    const maxRetries = 5;

    while (retry < maxRetries) {
        try {
            user = await UserModel.findOneAndUpdate(
                { _id: sub },
                { name: userName, email, picture_url, user_url, roles },
                { upsert: true, new: true, runValidators: true }
            ).exec();
            break;
        } catch (err: any) {
            if (err.code === 11000 && err.keyPattern?.user_url) {
                user_url = `${validateUrl(email)}-${Math.floor(Math.random() * 10000)}`;
                retry++;
                continue;
            }
            throw err;
        }
    }

    if (!user) throw new Error("User creation failed after retries");
    return user;
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
    const user = await UserModel.findOne({ email }).exec();

    if (user) {
        return await updateUserRoles(user, roles);
    }

    return await createNewUser(sub, email, name, picture, roles);
};

const setAuthCookie = (res: Response, user: any) => {
    const access_token = sign(
        { _id: user._id, name: user.name, email: user.email, roles: user.roles },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    const isDev = process.env.NODE_ENV === 'development';
    const domain = process.env.DOMAIN;
    const sameSite = isDev ? 'lax' : 'strict';

    const cookieOptions: any = {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
        secure: true,
        sameSite
    };
    if (domain) {
        cookieOptions.domain = domain;
    }

    res.cookie('access_token', access_token, cookieOptions)
        .status(200)
        .json({
            user: { _id: user._id, email: user.email, name: user.name, picture_url: user.picture_url, roles: user.roles },
        });
};

export const oidcLoginController = async (req: Request, res: Response): Promise<void> => {
    // Frontend sends the code it received
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ error: "Authorization code missing" });
        return;
    }

    const oidcConfig = await getConfig();

    if (!oidcConfig) {
        res.status(503).json({ error: "OIDC not configured" });
        return;
    }

    try {
        // Exchange code for tokens
        // We must pass the same redirect_uri that was used in the authorization request
        // construct URL with code
        const currentUrl = new URL(`${process.env.BASE_URL}/oidc-callback`);
        currentUrl.searchParams.set('code', code);

        const tokenSet = await authorizationCodeGrant(
            oidcConfig,
            currentUrl,
            {
                pkceCodeVerifier: undefined, // Add if we implement PKCE
            },
            {
                redirect_uri: `${process.env.BASE_URL}/oidc-callback`,
            }
        );

        const claims = tokenSet.claims();
        const sub = claims.sub as string;
        const email = claims.email as string;
        const name = claims.name as string | undefined;
        const picture = claims.picture as string | undefined;
        const roles = mapRoles(claims);

        if (!email) {
            res.status(400).json({ error: "Email not provided by ID provider" });
            return;
        }

        const user = await findOrCreateUser(sub, email, name, picture, roles);

        if (!user) {
            throw new Error("User creation failed after retries");
        }

        setAuthCookie(res, user);

    } catch (err: any) {
        logger.error("OIDC Login failed: %o", err);
        if (err.code === 11000) {
            res.status(409).json({ error: "User with this email already exists via another provider." });
        } else {
            res.status(401).json({ error: "Authentication failed", details: err.message });
        }
    }
};
