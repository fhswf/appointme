/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/**
 * @module authentication_controller
 */
import { UserModel } from "../models/User.js";
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from "express";
import pkg from 'jsonwebtoken';
import { logger } from "../logging.js";


const { sign, verify } = pkg;

const REDIRECT_URI = `${process.env.API_URL}/google/oauthcallback`;
logger.debug("redirectUri: %s", REDIRECT_URI);
if (!process.env.CLIENT_SECRET) {
  logger.error("CLIENT_SECRET not set!")
}
if (process.env.CLIENT_ID) {
  logger.debug("clientId: %s", process.env.CLIENT_ID);
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
    .then(response => {
      const { email_verified, name, email, picture, sub } = response.getAttributes().payload;
      logger.debug('picture: %s', picture);
      if (email_verified) {
        const user_url = validateUrl(email);

        const user = new UserModel({ name, email, picture_url: picture, user_url });
        user._id = sub;
        logger.debug('user: %o', user);

        // Find existing user by email or _id
        UserModel.findOne({ $or: [{ email: email }, { _id: sub }] }).exec().then(existingUser => {
          let updateData: any = {
            name,
            email,
            google_picture_url: picture
          };

          if (existingUser) {
            // Existing user: only update picture_url if NOT using gravatar
            if (!existingUser.use_gravatar) {
              updateData.picture_url = picture;
            }
            logger.debug('Found existing user: %s', existingUser._id);

            // Update the existing user
            return UserModel.findOneAndUpdate(
              { _id: existingUser._id },
              { $set: updateData },
              { new: true }
            ).exec();

          } else {
            // New user: set user_url and picture_url
            updateData.user_url = user_url;
            updateData.picture_url = picture;

            // Create new user with sub as _id
            return UserModel.findOneAndUpdate(
              { _id: sub },
              {
                $set: updateData,
                $setOnInsert: { user_url: user_url }
              },
              { upsert: true, new: true }
            ).exec();
          }
        })
          .then(user => {
            if (!user) {
              throw new Error("User creation failed");
            }

            const { _id, name, email } = user;
            const access_token = sign(
              { _id, name, email },
              process.env.JWT_SECRET,
              {
                expiresIn: "1d",
              }
            );

            const isDev = process.env.NODE_ENV === 'development';
            const domain = process.env.DOMAIN;
            const sameSite = isDev ? 'lax' : 'strict';

            // Only set domain if explicitly configured to avoid undefined domain breaking cookies
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
                user: { _id, email, name, picture_url: user.picture_url },
              });
          })
          .catch(error => {
            logger.error('Error saving user: %o', error);
            res.status(400).json({ message: "User signup failed with google", error: error instanceof Error ? error.message : String(error) })
          });
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
}


/**
 * Generates a URL based on the given email
 * @function
 * @param {string} userEmail
 */
export function validateUrl(userEmail: string): string {
  const newEmail = userEmail.split("@");
  const reg = new RegExp(/[~/]/g);
  let newUrl = newEmail[0].toLowerCase().replaceAll(/[. ,:]+/g, "-");
  newUrl = newUrl.replaceAll(reg, "-");
  return newUrl;
}

export const getConfig = (req: Request, res: Response): void => {
  res.json({
    googleEnabled: process.env.DISABLE_GOOGLE_LOGIN !== "true" && !!process.env.CLIENT_ID,
    oidcEnabled: !!(process.env.OIDC_ISSUER && process.env.OIDC_CLIENT_ID),
    oidcName: process.env.OIDC_NAME,
    oidcIcon: process.env.OIDC_ICON,
    contactInfo: process.env.CONTACT_INFO,
  });
};
