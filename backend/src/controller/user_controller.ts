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
      "google_tokens.access_token": 1
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
  /* eslint-disable @typescript-eslint/naming-convention */
  const { user_url, use_gravatar, ...otherFieldsRaw } = req.body.data as User;

  // Securely build the update object: allow only permitted keys, validate types.
  const ALLOWED_UPDATE_FIELDS = new Set([
    "name", "email", "pull_calendars", "push_calendar", "welcome"
  ]);
  let update: Record<string, any> = {};

  // Filter out any dangerous field names, deep objects, or operators
  for (const key of Object.keys(otherFieldsRaw)) {
    if (
      ALLOWED_UPDATE_FIELDS.has(key) &&
      typeof otherFieldsRaw[key] !== "object" &&
      typeof key === "string" &&
      !key.startsWith("$") &&
      !key.includes(".")
    ) {
      update[key] = otherFieldsRaw[key];
    }
    // else: Ignore the key; optionally log/reject malicious input
  }

  // Validate user_url type and sanitize
  if (typeof user_url === "string" && user_url && !user_url.startsWith("$") && !user_url.includes(".")) {
    update.user_url = user_url;
  }

  // Handle Gravatar toggle, validate type
  if (typeof use_gravatar === "boolean") {
    update.use_gravatar = use_gravatar;
  }

  UserModel.findById(userid).exec()
    .then(currentUser => {
      if (!currentUser) throw new Error("User not found");

      if (use_gravatar !== undefined && use_gravatar !== currentUser.use_gravatar) {
        if (use_gravatar) {
          // Switched to Gravatar
          const emailHash = crypto.createHash('md5').update(currentUser.email.toLowerCase().trim()).digest('hex');
          update.picture_url = `https://www.gravatar.com/avatar/${emailHash}?d=mp`;
        } else {
          // Switched back to Google picture (or empty if not available)
          update.picture_url = currentUser.google_picture_url || "";
        }
      }

      return UserModel.findByIdAndUpdate(userid, update,
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
            "use_gravatar": 1 // Return this too
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
  UserModel.findOne({ user_url: <string>user_url })
    .select("_id email name picture_url user_url welcome")
    .exec()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(400).json({ error, query: { user_url: <string>user_url } });
    })
};
