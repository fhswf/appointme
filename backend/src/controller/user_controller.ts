/**
 * @module user_controller
 */
import { UserModel } from "../models/User.js";
import { User } from "common/src/types";
import { Request, Response } from 'express';
import crypto from 'node:crypto';
// ...
// (We need to be careful with multi-replacements. I'll use multi_replace for safety as there are scattered changes)


/**
 * Middleware to get the logged in user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getUser = (req: Request, res: Response): void => {
  const userid = req['user_id'];
  if (typeof userid !== 'string') {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }
  void UserModel.findOne({ _id: userid },
    {
      "_id": 1,
      "email": 1,
      "name": 1,
      "picture_url": 1,
      "pull_calendars": 1,
      "push_calendar": 1,
      "user_url": 1,
      "welcome": 1,
      "updatedAt": 1,
      "send_invitation_email": 1,
      "google_tokens.access_token": 1,
      "use_gravatar": 1
    })
    .exec()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/** Filter out the google_tokens key from user.
 * This is necessary since we do *not* want to overwrite the google_tokens 
 * since the client only has the access_token, not the refresh_token!
 */
const filterUser = (user) => Object.keys(user)
  .filter(key => key != 'google_tokens')
  .reduce((obj, key) => { obj[key] = user[key]; return obj }, {});

export const updateUser = (req: Request, res: Response): void => {
  const userid = req['user_id'];
  if (typeof userid !== 'string') {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  const userData = req.body.data as Partial<User>;
  const update: Record<string, any> = {};

  // Explicitly allowlist and validate fields
  if (typeof userData.name === 'string') update.name = userData.name;
  if (typeof userData.email === 'string') update.email = userData.email;
  if (typeof userData.welcome === 'string') update.welcome = userData.welcome;

  // Validate arrays and specific types
  if (Array.isArray(userData.pull_calendars)) {
    // Ensure all elements are strings
    if (userData.pull_calendars.every(c => typeof c === 'string')) {
      update.pull_calendars = userData.pull_calendars.map(c => String(c));
    }
  }

  if (typeof userData.push_calendar === 'string') {
    update.push_calendar = userData.push_calendar;
  } else if (userData.push_calendar === null || userData.push_calendar === undefined) {
    // Allow clearing it if needed, or just ignore. 
    // Based on original code, it seems we might just want to set it if it's a string.
  }

  // Handle User URL
  if (typeof userData.user_url === "string" && userData.user_url && !userData.user_url.startsWith("$") && !userData.user_url.includes(".")) {
    update.user_url = userData.user_url;
  }

  // Handle Gravatar
  if (typeof userData.use_gravatar === "boolean") {
    update.use_gravatar = userData.use_gravatar;
  }

  if (typeof userData.send_invitation_email === "boolean") {
    update.send_invitation_email = userData.send_invitation_email;
  }

  UserModel.findById(userid).exec()
    .then(currentUser => {
      if (!currentUser) throw new Error("User not found");

      if (userData.use_gravatar !== undefined && userData.use_gravatar !== currentUser.use_gravatar) {
        if (userData.use_gravatar) {
          // Switched to Gravatar
          const emailHash = crypto.createHash('md5').update(currentUser.email.toLowerCase().trim()).digest('hex');
          update.picture_url = `https://www.gravatar.com/avatar/${emailHash}?d=mp`;
        } else {
          // Switched back to Google picture (or empty if not available)
          update.picture_url = currentUser.google_picture_url || "";
        }
      }

      return UserModel.findByIdAndUpdate(userid, { $set: update },
        {
          new: true,
          projection: {
            "_id": 1,
            "email": 1,
            "name": 1,
            "picture_url": 1,
            "pull_calendars": 1,
            "push_calendar": 1,
            "user_url": 1,
            "welcome": 1,
            "updatedAt": 1,
            "google_tokens.access_token": 1,
            "use_gravatar": 1,
            "send_invitation_email": 1
          }
        }).exec();
    })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      if (err.code === 11000 && err.keyPattern?.user_url) {
        res.status(409).json({ error: "User user_url already exists", field: "user_url" });
      } else {
        res.status(400).json({ error: err });
      }
    });
};

/**
 * Middleware to get a user by their url
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getUserByUrl = (req: Request, res: Response): void => {
  const user_url = req.params.url || req.query.url;

  if (typeof user_url !== 'string') {
    res.status(400).json({ error: "Invalid user_url" });
    return;
  }

  UserModel.findOne({ user_url: user_url })
    .select("_id email name picture_url user_url welcome")
    .exec()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(400).json({ error, query: { user_url: user_url } });
    })
};
