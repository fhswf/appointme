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

    // Generates the auth url that the frontend should redirect the user to
    const url = await buildAuthorizationUrl(oidcConfig, {
        scope: 'openid email profile',
        redirect_uri: `${process.env.BASE_URL}/oidc-callback`,
    });

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

const createNewUser = async (sub: string, email: string, name?: string, picture?: string) => {
    let user_url = validateUrl(email);
    const picture_url = picture || "";
    const userName = name || email.split('@')[0];

    // 2. Retry loop for user_url uniqueness
    let retry = 0;
    const maxRetries = 5;

    while (retry < maxRetries) {
        try {
            // Try to upsert/create user
            return await UserModel.findOneAndUpdate(
                { _id: sub },
                { name: userName, email, picture_url, user_url },
                { upsert: true, new: true, runValidators: true }
            ).exec();
        } catch (err: any) {
            if (err.code === 11000) {
                // Check which key violated uniqueness
                if (err.keyPattern?.user_url) {
                    // User URL collision, append suffix and retry
                    user_url = `${validateUrl(email)}-${Math.floor(Math.random() * 10000)}`;
                    retry++;
                    continue;
                }
                // If it's email collision (rare race condition if we checked above), likely unrecoverable here
                throw err;
            }
            throw err;
        }
    }
    throw new Error("User creation failed after retries");
};

const findOrCreateUser = async (sub: string, email: string, name?: string, picture?: string) => {
    // 1. Check if user exists by email (to handle "User with this email already exists" scenario)
    // Also check by _id to support legacy users or same provider
    let user = await UserModel.findOne({ $or: [{ email: email }, { _id: sub }] }).exec();

    // If user doesn't exist, create it
    if (user) {
        return await updateExistingUser(user, name, picture);
    } else {
        return await createNewUser(sub, email, name, picture);
    }
};

const setAuthCookie = (res: Response, user: any) => {
    const access_token = sign(
        { _id: user._id, name: user.name, email: user.email },
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
            user: { _id: user._id, email: user.email, name: user.name, picture_url: user.picture_url },
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
        const { sub, email, name, picture } = claims;

        if (!email) {
            res.status(400).json({ error: "Email not provided by ID provider" });
            return;
        }

        const user = await findOrCreateUser(sub as string, email as string, name as string | undefined, picture as string | undefined);

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
