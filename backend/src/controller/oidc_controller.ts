import { Request, Response } from 'express';
import { Issuer, Client } from 'openid-client';
import { UserModel } from '../models/User.js';
import pkg from 'jsonwebtoken';
import { logger } from '../logging.js';
import { validateUrl } from './authentication_controller.js';

const { sign } = pkg;

let client: Client | null = null;

const getClient = async (): Promise<Client | null> => {
    if (client) return client;
    if (!process.env.OIDC_ISSUER || !process.env.OIDC_CLIENT_ID) return null;
    logger.info("OIDC Config: Issuer=%s, ClientID=%s", process.env.OIDC_ISSUER, process.env.OIDC_CLIENT_ID);

    try {
        const issuerUrl = process.env.OIDC_ISSUER.replace(/\/$/, ""); // Remove trailing slash if present

        // Manual construction to avoid discovery issues and strict validation
        const issuer = new Issuer({
            issuer: issuerUrl,
            authorization_endpoint: `${issuerUrl}/protocol/openid-connect/auth`,
            token_endpoint: `${issuerUrl}/protocol/openid-connect/token`,
            userinfo_endpoint: `${issuerUrl}/protocol/openid-connect/userinfo`,
            jwks_uri: `${issuerUrl}/protocol/openid-connect/certs`,
        });
        client = new issuer.Client({
            client_id: process.env.OIDC_CLIENT_ID,
            client_secret: process.env.OIDC_CLIENT_SECRET,
            redirect_uris: [`${process.env.CLIENT_URL}/oidc-callback`],
            response_types: ['code'],
            token_endpoint_auth_method: process.env.OIDC_CLIENT_SECRET ? 'client_secret_basic' : 'none',
        });
        return client;
    } catch (err) {
        if (err instanceof Error) {
            logger.error(`Failed to discover OIDC issuer: ${err.message}`);
        } else {
            logger.error("Failed to discover OIDC issuer: %o", err);
        }
        return null;
    }
};

export const getAuthUrl = async (req: Request, res: Response): Promise<void> => {
    const oidcClient = await getClient();
    if (!oidcClient) {
        res.status(503).json({ error: "OIDC not configured" });
        return;
    }

    // Generates the auth url that the frontend should redirect the user to
    const url = oidcClient.authorizationUrl({
        scope: 'openid email profile',
    });

    res.json({ url });
};

export const oidcLoginController = async (req: Request, res: Response): Promise<void> => {
    // Frontend sends the code it received
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ error: "Authorization code missing" });
        return;
    }

    const oidcClient = await getClient();

    if (!oidcClient) {
        res.status(503).json({ error: "OIDC not configured" });
        return;
    }

    try {
        // Exchange code for tokens
        // We must pass the same redirect_uri that was used in the authorization request
        const tokenSet = await oidcClient.callback(
            `${process.env.CLIENT_URL}/oidc-callback`,
            { code }
        );

        const claims = tokenSet.claims();
        const { sub, email, name, picture } = claims;

        if (!email) {
            res.status(400).json({ error: "Email not provided by ID provider" });
            return;
        }

        // 1. Check if user exists by email (to handle "User with this email already exists" scenario)
        let user = await UserModel.findOne({ email }).exec();

        // If user doesn't exist, create it
        if (!user) {
            let user_url = validateUrl(email);
            const picture_url = picture || "";
            const userName = name || email.split('@')[0];

            // 2. Retry loop for user_url uniqueness
            let retry = 0;
            const maxRetries = 5;

            while (retry < maxRetries) {
                try {
                    // Try to upsert/create user
                    // Note: We use findOneAndUpdate with upsert: true. 
                    // However, we are searching by _id (sub). 
                    // If the ID is new but email exists (which we checked above, but race condition possible),
                    // or if user_url exists, it might fail.
                    // We already checked email above, so main concern is user_url collision 
                    // or concurrent email registration.

                    user = await UserModel.findOneAndUpdate(
                        { _id: sub },
                        { name: userName, email, picture_url, user_url },
                        { upsert: true, new: true, runValidators: true }
                    ).exec();

                    break; // Success
                } catch (err: any) {
                    if (err.code === 11000) {
                        // Check which key violated uniqueness
                        if (err.keyPattern && err.keyPattern.user_url) {
                            // User URL collision, append suffix and retry
                            user_url = `${validateUrl(email)}-${Math.floor(Math.random() * 10000)}`;
                            retry++;
                            continue;
                        }
                        // If it's email collision (rare race condition if we checked above), likely unrecoverable here
                        // or other constraint.
                        throw err;
                    }
                    throw err;
                }
            }
        }

        if (!user) {
            throw new Error("User creation failed after retries");
        }


        const access_token = sign(
            { _id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const isDev = process.env.NODE_ENV === 'development';
        const domain = process.env.DOMAIN;
        const sameSite = isDev ? 'lax' : 'strict';

        res.cookie('access_token', access_token, {
            maxAge: 60 * 60 * 24 * 1000,
            httpOnly: true,
            secure: true,
            sameSite,
            domain
        })
            .status(200)
            .json({
                user: { _id: user._id, email: user.email, name: user.name, picture_url: user.picture_url },
            });

    } catch (err: any) {
        logger.error("OIDC Login failed: %o", err);
        if (err.code === 11000) {
            res.status(409).json({ error: "User with this email already exists via another provider." });
        } else {
            res.status(401).json({ error: "Authentication failed", details: err.message });
        }
    }
};
