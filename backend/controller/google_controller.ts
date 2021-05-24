/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @module google_controller
 */


import { addMinutes, parseISO, parse } from 'date-fns';
const { body } = require("express-validator");
import { calendar_v3, google } from 'googleapis';
import { GaxiosPromise } from "gaxios";
import { OAuth2Client, Credentials } from 'google-auth-library';
import Schema$Event = calendar_v3.Schema$Event;
import { UserModel, User, GoogleTokens } from "../models/User";
import { Request, Response } from 'express';


const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirectUri: `${process.env.API_URL}/google/oauthcallback`,
});
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

/**
 * Middleware to generate a URL to connect the google calendar
 * @param {request} req
 * @param {response} res
 */
export const generateAuthUrl = (req: Request, res: Response) => {
  const userid = req.user_id;
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state: userid,
  });
  return res.json({ url: authUrl });
};

/**
 * Callback function, gets called after connecting google cal API
 * Set in Google Developer Console as redirect URI
 * @function
 * @param {request} req
 * @param {response} res
 */
export const googleCallback = (req: Request, res: Response): void => {
  const code = <string>req.query.code;
  const user = <string>req.query.state;
  if (code) {
    void oAuth2Client.getToken(code)
      .then(token => {
        saveTokens(user, token);
        res.redirect(`${process.env.CLIENT_URL}/integration/select`);
      })
      .catch(error => {
        res.status(400).json({ message: "Error retrieving access token", error });
      });
  } else {
    res.status(400).json({ err: "No authorization code was provided." });
  }
};

/**
 * Middleware to insert an event to google calendar.
 * @function
 * @param {request} req
 * @param {response} res
 */
export async function insertEventToGoogleCal(req: Request, res: Response): Promise<void> {
  const starttime = new Date(Number.parseInt(req.body.starttime));
  const endtime = addMinutes(starttime, req.body.event.duration);
  console.log("insertEvent: %s %o", req.body.starttime, starttime);

  const event: Schema$Event = {
    summary: <string>req.body.event.name + " with " + <string>req.body.name,
    location: <string>req.body.event.location,
    description: req.body.event.description as string,
    start: {
      dateTime: starttime.toISOString(),
      timeZone: "Europe/Berlin",
    },
    end: {
      dateTime: endtime.toISOString(),
      timeZone: "Europe/Berlin",
    },
    attendees: [
      {
        email: req.body.email as string,
      },
    ],
  };

  void UserModel.findOne({ _id: req.params.user_id })
    .then(user => {
      oAuth2Client.setCredentials(user.google_tokens);
      void google.calendar({ version: "v3" }).events
        .insert({
          auth: oAuth2Client,
          calendarId: user.push_calendar,
          sendUpdates: "all",
          requestBody: event,
        })
        .then((event: any) => {
          res.json({ success: true, message: "Event wurde gebucht", event: event });
        })
        .catch(error => {
          res.status(400).json({ error });
        })
    })
    .catch(error => {
      res.status(400).json({ error });
    })
};

/**
 * Middleware function to delete an google Access Token from a user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const revokeScopes = (req: Request, res: Response): void => {
  const userid = req.user_id;
  let tokens = null;
  const query = UserModel.findOne({ _id: userid });
  void query.exec()
    .then((user: User) => {
      tokens = user.google_tokens;
      if (tokens.expiry_date <= Date.now()) {
        deleteTokens(userid);
      } else {
        oAuth2Client.revokeToken(tokens.access_token)
          .then(value => {
            deleteTokens(userid);
          })
          .catch(err => {
            console.log(err);
          });
      }
      res.json({ msg: "ok" });
    })
    .catch(err => {
      res.status(400).json({ error: <unknown>err });
    });
};

/**
 * Set authorization on oAuth2Client.
 * @param user_id 
 */
export async function getAuth(user_id: string): Promise<OAuth2Client> {
  return UserModel.findOne({ _id: user_id })
    .exec()
    .then((user: User) => {
      const google_tokens = user.google_tokens;
      oAuth2Client.setCredentials(google_tokens);
      return oAuth2Client;
    });
}

/**
 * Get the calendarList of the user
 * @param req 
 * @param res 
 */
export async function getCalendarList(req: Request, res: Response) {
  google.calendar({ version: "v3", auth: await getAuth(req.user_id) })
    .calendarList.list()
    .then(list => {
      console.log("calendarList: %j", list);
      res.json(list);
    })
    .catch(error => {
      res.status(400).json({ error });
    })
}



export const freeBusy = async (user_id: string, timeMin: string, timeMax: string, event) => {
  const user: User = await UserModel.findOne({ _id: user_id });
  const google_tokens = user.google_tokens;
  console.log('freeBusy: tokens: %o', google_tokens);
  oAuth2Client.setCredentials(google_tokens);
  const items = user.pull_calendars.map(id => { return { id } });
  console.log('freeBusy: item=%o', items);
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  return calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items
    }
  })
}

function deleteTokens(userid: string) {
  void UserModel.findOneAndUpdate(
    { _id: userid },
    { $unset: { google_tokens: "" } }
  ).then(res => {
    console.log(res);
  });
}

/**
 * Function to store google tokens.
 * @function
 * @param {string} userid - User who gave consent to connect Calendar API
 * @param {object} token  - The Token Object retrieved from Google
 */
function saveTokens(user: string, token) {
  const _KEYS = ["access_token", "refresh_token", "scope", "expiry_date"];
  const google_tokens = {};
  _KEYS.forEach(key => {
    if (key in token.tokens && token.tokens[key]) {
      google_tokens[key] = <string>token.tokens[key];
    }
  });
  void UserModel.findOneAndUpdate({ _id: user }, { google_tokens }, { new: true })
    .then(user => {
      console.log('saveTokens: %o', user)
    })
    .catch(err => {
      console.error('saveTokens: %o', err)
    });
}