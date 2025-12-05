/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/**
 * @module authentication_controller
 */
import { UserDocument, UserModel } from "../models/User.js";
import { validationResult } from "express-validator";
import validator from "validator";
import { createTransport } from "nodemailer";
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from "express";
import pkg, { JwtPayload } from 'jsonwebtoken';
import { logger } from "../logging.js";

// Dotenv Config
import dotenv from "dotenv";
const env = dotenv.config({
  path: "./src/config/config.env",
});

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



const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
  secure: true,
  requireTLS: true,
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
        UserModel.findOneAndUpdate({ _id: sub }, { name, email, picture_url: picture, user_url }, { upsert: true })
          .exec()
          .then(user => {

            const { _id, name, email } = user;
            const access_token = sign(
              { _id, name, email },
              process.env.JWT_SECRET,
              {
                expiresIn: "1d",
              }
            );

            const sameSite = process.env.NODE_ENV === 'development' ? 'none' : 'strict';
            const domain = process.env.DOMAIN || "appoint.gawron.cloud";
            res
              .cookie('access_token',
                access_token, { maxAge: 60 * 60 * 24 * 1000, httpOnly: true, secure: true, sameSite, domain })
              .status(200)
              .json({
                user: { _id, email, name, picture_url: picture },
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
function validateUrl(userEmail: string): string {
  const newEmail = userEmail.split("@");
  const reg = new RegExp(/[~/]/g);
  let newUrl = newEmail[0].toLowerCase().replaceAll(/[. ,:]+/g, "-");
  newUrl = newUrl.replaceAll(reg, "-");
  return newUrl;
}
