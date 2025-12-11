/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/**
 * @module authentication_controller
 */
import { UserDocument, UserModel } from "../models/User.js";
import { validationResult } from "express-validator";
import validator from "validator";
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from "express";
import pkg, { JwtPayload } from 'jsonwebtoken';
import { logger } from "../logging.js";
import { transporter } from "../utility/mailer.js";


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





/**
 * Middleware to register a new User
 * @function
 * @param {request} req
 * @param {response} res
 */
export const registerController = (req: Request, res: Response): void => {
  const name = <string>req.body.name;
  const email = <string>req.body.email;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newError = errors.array().map(error => error.msg)[0];
    res.status(422).json({ errors: newError });
    return;
  }

  UserModel.findOne({ email }).exec()
    .then(user => {
      if (user) {
        res.status(400).json({ errors: "Email already exists!" });
      } else {
        const token = sign(
          { name, email },
          process.env.ACCOUNT_ACTIVATION,
          { expiresIn: "10m" }
        );

        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Account activation "Bookme" ',
          html: `<h1>Click the link below to activate your account</h1>
                       <p>${process.env.CLIENT_URL}/activate/${token}</p>`,
        };

        transporter.sendMail(mailOptions, function (error) {
          if (error) {
            res.status(400).json({
              success: false,
              errors: "Couldnt send email,try again",
            });
          } else {
            res.status(200).json({
              message: `Email has been send to ${email}`,
            });
          }
        });
      }
    })
    .catch(err => {
      res.status(400).json({ errors: "Something went wrong, please try again." });
    });
};

/**
 * Middleware to create a new user object and activate an Account.
 * @function
 * @param {request} req
 * @param {response} res
 */
export const activationController = (req: Request, res: Response): void => {
  const header = req.headers.authorization;
  const token = header.split(" ")[1];

  if (token) {

    verify(token, process.env.ACCOUNT_ACTIVATION, (err, decoded: JwtPayload) => {
      if (err) {
        res.status(400).json({ errors: "Error! Please signup again!" }); //Verify failed
        return
      }

      //Decode the jwt for User information
      let name = "";
      let email = "";

      if ('name' in decoded) {
        name = decoded['name']
      }
      if ('email' in decoded) {
        email = decoded['email']
      }

      const user_url = validateUrl(email);
      //Create a new User
      const userToSave = new UserModel({ name, email, user_url });
      //Save the new created User to the DB
      userToSave.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "You successfully signed up!",
          });
        })
        .catch(err => {
          res.status(400).json({ errors: "You already have an Account", err });
        });

    });
  } else {
    res.status(400).json({ errors: "Error! Please signup again!" });
  }
};

/**
 * Middleware to log in a user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const loginController = (req: Request, res: Response): void => {
  let { email } = req.body;
  email = validator.isEmail(email) ? validator.normalizeEmail(email) : "";
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newError = errors.array().map(error => error.msg)[0];
    res.status(422).json({ errors: newError });
    return;
  }

  UserModel
    .findOne({ email: { $eq: email } })
    .exec()
    .then((user: UserDocument) => {
      if (!user) {
        res.status(400).json({ errors: "User does not exist!" });
        return;
      }
      const { _id, name, email } = user;
      const access_token = sign(
        { _id, name, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({
        access_token,
        user: {
          name,
        },
      });

    })
    .catch(err => {
      res.status(400).json({ errors: "User does not exist!" });
    });
};

export const googleLoginController = (req: Request, res: Response): void => {
  // Get authorization code from request
  const idToken = req.body.code;

  oAuth2Client
    .verifyIdToken({ idToken, audience: process.env.CLIENT_ID })
    .then(response => {
      const { email_verified, name, email, picture, sub } = response.getAttributes().payload;
      logger.debug('picture: %s', picture);
      if (email_verified) {
        const user_url = validateUrl(email);

        const user = new UserModel({ name, email, picture_url: picture, user_url });
        user._id = sub;
        logger.debug('user: %o', user);

        // Find existing user first to check gravatar preference
        UserModel.findById(sub).exec().then(existingUser => {
          let updateData: any = {
            name,
            email,
            google_picture_url: picture
          };

          if (!existingUser) {
            // New user: set user_url and picture_url
            updateData.user_url = user_url;
            updateData.picture_url = picture;
          } else {
            // Existing user: only update picture_url if NOT using gravatar
            if (!existingUser.use_gravatar) {
              updateData.picture_url = picture;
            }
          }

          return UserModel.findOneAndUpdate(
            { _id: sub },
            {
              $set: updateData,
              $setOnInsert: { user_url: user_url } // Fallback if race condition (though findById handles most)
            },
            { upsert: true, new: true }
          ).exec();
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
    contactInfo: process.env.CONTACT_INFO,
  });
};
