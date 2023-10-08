/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/**
 * @module authentication_controller
 */
import { UserModel } from "../models/User.js";
import { validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import { google } from "googleapis";
import { OAuth2Client, Credentials } from 'google-auth-library';
import { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config({
  path: "./config/config.env",
});

import { compare } from 'bcrypt';

import { JwtPayload, decode, sign, verify } from 'jsonwebtoken';

const REDIRECT_URI = `${process.env.API_URL}/google/oauthcallback`;
console.log("redirectUri: %s", REDIRECT_URI);
console.log("clientId: %s", process.env.GOOGLE_ID);

const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirectUri: REDIRECT_URI,
});



const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
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
  const password = <string>req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newError = errors.array().map(error => error.msg)[0];
    res.status(422).json({ errors: newError });
  }
  else {
    UserModel.findOne({ email }).exec()
      .then(user => {
        if (user) {
          res.status(400).json({ errors: "Email already exists!" });
        } else {
          const token = sign(
            { name, email, password },
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
  }
};

/**
 * Middleware to create a new user object and activate an Account.
 * @function
 * @param {request} req
 * @param {response} res
 */
export const activationController = (req, res): void => {
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
      let password = "";

      if ('name' in decoded) {
        name = decoded['name']
      }
      if ('email' in decoded) {
        email = decoded['email']
      }
      if ('password' in decoded) {
        password = decoded['password']
      }
      const user_url = validateUrl(email);
      //Create a new User
      const userToSave = new UserModel({ name, email, password, user_url });
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
export const loginController = (req, res): void => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newError = errors.array().map(error => error.msg)[0];
    res.status(422).json({ errors: newError });
  } else {
    void UserModel.findOne({ email })
      .exec()
      .then(user => {
        if (!user) {
          res.status(400).json({ errors: "User does not exist!" });
        }
        compare(password, user.password)
          .then(result => {
            if (result) {
              const { _id, name, email } = user;
              const access_token = sign(
                { _id, name, email },
                process.env.JWT_SECRET_TOKEN,
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
            } else {
              console.log("error");
              res.status(400).json({ errors: "Wrong password or email!" });
            }
          })
          .catch(err => {
            res.status(400).json({ errors: "Coudlnt find user" });
          });
      })
      .catch(err => {
        res.status(400).json({ errors: "User does not exist!" });
      });
  }
};

export const googleLoginController = (req: Request, res: Response): void => {
  // Get authorization code from request
  const idToken = req.body.code;

  oAuth2Client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_ID })
    .then(response => {
      const { email_verified, name, email, picture, sub } = response.getAttributes().payload;
      console.log('picture: %s', picture);
      if (email_verified) {
        const randompw = makePassword(15);
        const password = randompw + process.env.JWT_SECRET_TOKEN;
        const user_url = validateUrl(email);

        const user = new UserModel({ name, email, password, picture_url: picture, user_url });
        user._id = sub;
        console.log('user: %o', user);
        UserModel.findOneAndUpdate({ _id: sub }, { name, email, password, picture_url: picture, user_url }, { upsert: true })
          .exec()
          .then(user => {

            const { _id, name, email } = user;
            const access_token = sign(
              { _id, name, email },
              process.env.JWT_SECRET_TOKEN,
              {
                expiresIn: "1d",
              }
            );

            res.status(200).json({
              access_token,
              user: { _id, email, name, picture_url: picture },
            });
          })
          .catch(error => {
            console.error('Error saving user: %o', error);
            res.status(400).json({ message: "User signup failed with google", error })
          });
      } else {
        res.status(400).json({
          errors: "Google login failed. Try again",
        });
      }
    })
    .catch((err) => {
      console.error('Error retrieving access token', err);
      res.status(400).json({
        errors: "Google login failed. Try again",
      });
    });
}

/**
 * Helper function to generate a random password
 * @function
 * @param {number} length - length of the password to generate
 */
function makePassword(length) {
  let result = "";
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"§$%&/()=?-._,';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Generates a URL based on the given email
 * @function
 * @param {string} userEmail
 */
function validateUrl(userEmail: string): string {
  const newEmail = userEmail.split("@");
  const reg = new RegExp(/[~\/]/g);
  let newUrl = newEmail[0].toLowerCase().replace(/[\. ,:]+/g, "-");
  newUrl = newUrl.replace(reg, "-");
  return newUrl;
}
