/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/**
 * @module authentication_controller
 */
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from "express";
import pkg from 'jsonwebtoken';
import { logger } from "../logging.js";
import { findOrUpdateGoogleUser } from "../services/user_service.js";
import { UserDocument } from "../models/User.js";


const { sign, verify } = pkg;

const REDIRECT_URI = `postmessage`;
logger.info("redirectUri: %s", REDIRECT_URI);
if (!process.env.CLIENT_SECRET) {
  logger.error("CLIENT_SECRET not set!")
}
if (process.env.CLIENT_ID) {
  logger.info("clientId: %s", process.env.CLIENT_ID);
}
else {
  logger.error("CLIENT_ID not set!")
}
const oAuth2Client = new OAuth2Client({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

export const googleLoginController = (req: Request, res: Response): void => {
  // Get authorization code from request
  const code = req.body.code;

  oAuth2Client
    .getToken(code)
    .then(({ tokens }) => {
      logger.debug("Tokens received: %o", tokens);
      return oAuth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.CLIENT_ID
      });
    })
    .then(async response => {
      const { email_verified, name, email, picture, sub } = response.getAttributes().payload;
      logger.debug('picture: %s', picture);
      if (email_verified) {
        try {
          const user = await findOrUpdateGoogleUser(sub, email, name, picture);

          if (!user) {
            throw new Error("User creation/update failed");
          }

          setGoogleAuthCookie(res, user);

        } catch (error) {
          logger.error('Error saving user: %o', error);
          res.status(400).json({ message: "User signup failed with google", error: error instanceof Error ? error.message : String(error) })
        }
      } else {
        res.status(400).json({
          errors: "Google login failed. Try again",
        });
      }
    })
    .catch(err => {
      logger.error('Error retrieving access token', err);
      res.status(400).json({
        errors: "Google login failed. Try again",
      });
    });
};

const setGoogleAuthCookie = (res: Response, user: UserDocument) => {
  const { _id } = user;
  const access_token = sign(
    { _id, name: user.name, email: user.email },
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

  res
    .cookie('access_token', access_token, cookieOptions)
    .status(200)
    .json({
      user: { _id, email: user.email, name: user.name, picture_url: user.picture_url },
    });
};

export const logout = (req: Request, res: Response): void => {
  const isDev = process.env.NODE_ENV === 'development';
  const domain = process.env.DOMAIN;
  const sameSite = isDev ? 'lax' : 'strict';

  const cookieOptions: any = {
    httpOnly: true,
    secure: true,
    sameSite
  };
  if (domain) {
    cookieOptions.domain = domain;
  }

  res.clearCookie('access_token', cookieOptions).status(200).json({ message: "Logged out successfully" });
};




export const getConfig = (req: Request, res: Response): void => {
  res.json({
    googleEnabled: process.env.DISABLE_GOOGLE_LOGIN !== "true" && !!process.env.CLIENT_ID,
    oidcEnabled: !!(process.env.OIDC_ISSUER && process.env.OIDC_CLIENT_ID),
    oidcName: process.env.OIDC_NAME,
    oidcIcon: process.env.OIDC_ICON,
    contactInfo: process.env.CONTACT_INFO,
  });
};
