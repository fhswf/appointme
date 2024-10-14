/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @module google_controller
 */


import { addMinutes } from 'date-fns';
//const { body } = require("express-validator");
import { calendar_v3, google } from 'googleapis';
import { GaxiosResponse, GaxiosPromise } from "gaxios";
import { OAuth2Client } from 'google-auth-library';
import Schema$Event = calendar_v3.Schema$Event;
import { User } from "common/src/types";
import { UserModel } from "../models/User.js";
import { Request, Response } from 'express';

import { Event, IntervalSet } from 'common';

//import { remark } from 'remark';
//import html from 'remark-html';


// Dotenv Config
import dotenv from "dotenv";
import { isValidObjectId } from 'mongoose';

const env = dotenv.config({
  path: "./src/config/config.env",
});

const config = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: `${process.env.API_URL}/google/oauthcallback`,
}

console.log("google_controller: ", config);

const oAuth2Client = new OAuth2Client(config);
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

/**
 * Middleware to generate a URL to connect the google calendar
 * @param {request} req
 * @param {response} res
 */
export const generateAuthUrl = (req: Request, res: Response): Response => {
  const userid = req['user_id'];
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
    oAuth2Client.getToken(code)
      .then(token => {
        saveTokens(user, token);
        res.redirect(`${process.env.CLIENT_URL}/integration/select`);
      })
      .catch(error => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        res.status(400).json({ message: "Error retrieving access token", error });
      });
  } else {
    res.status(400).json({ err: "No authorization code was provided." });
  }
};

export const freeBusy = (user_id: string, timeMin: string, timeMax: string): GaxiosPromise<calendar_v3.Schema$FreeBusyResponse> => {
  return UserModel.findOne({ _id: user_id })
    .then((user: User) => {
      const google_tokens = user.google_tokens;
      oAuth2Client.setCredentials(google_tokens);
      const items = user.pull_calendars.map(id => { return { id } });
      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
      return calendar.freebusy.query({
        requestBody: {
          timeMin,
          timeMax,
          items
        }
      })
    })
}

async function checkFree(event: Event, userid: string, timeMin: Date, timeMax: Date): Promise<boolean> {
  const interval = new IntervalSet(timeMin, timeMax)
  return freeBusy(userid, timeMin.toISOString(), timeMax.toISOString())
    .then(res => {
      let freeSlots = new IntervalSet(timeMin, timeMax, event.available, "Europe/Berlin");

      for (const key in res.data.calendars) {
        const calIntervals = new IntervalSet();
        let current = timeMin;
        for (const busy of res.data.calendars[key].busy) {
          //console.log('freeBusy: %o %o %d %d', busy.start, busy.end, event.bufferbefore, event.bufferafter);
          const _start = addMinutes(new Date(busy.start), -event.bufferbefore);
          const _end = addMinutes(new Date(busy.end), event.bufferafter);
          if (current < _start)
            calIntervals.push({ start: current, end: _start });
          current = _end;
        }
        if (current < timeMax) {
          calIntervals.push({ start: current, end: timeMax });
        }
        freeSlots = freeSlots.intersect(calIntervals)
      }
      const intersection = freeSlots.intersect(interval)
      return intersection.length == 1 && IntervalSet.equals(intersection[0], interval[0]);
    })
}

/**
 * Middleware to insert an event to google calendar.
 * @function
 * @param {request} req
 * @param {response} res
 */
export function insertEventToGoogleCal(req: Request, res: Response) {
  const starttime = new Date(Number.parseInt(req.body.starttime));
  const endtime = addMinutes(starttime, req.body.event.duration);
  console.log("insertEvent: %s %o", req.body.starttime, starttime);

  checkFree(req.body.event, req.params.user_id, starttime, endtime)
    .then(free => {
      if (!free) {
        res.status(400).json({ error: "requested slot not available" });
        return;
      }

      /*
        const htmlDescription = await remark()
        .use(html)
        .process(req.body.event.description as string)
      */

      UserModel.findOne({ _id: req.params.user_id })
        .then(user => {

          const event: Schema$Event = {
            summary: <string>req.body.event.name + " mit " + <string>req.body.name,
            location: <string>req.body.event.location,
            description: String(req.body.event.description) + "<br>" + (req.body.description as string),
            start: {
              dateTime: starttime.toISOString(),
              timeZone: "Europe/Berlin",
            },
            end: {
              dateTime: endtime.toISOString(),
              timeZone: "Europe/Berlin",
            },
            organizer: {
              displayName: user.name,
              email: user.email,
              id: user._id as string
            },
            attendees: [
              {
                displayName: req.body.name as string,
                email: req.body.email as string,
              }
            ],
            source: {
              title: "Appointment",
              url: "https://appoint.gawron.cloud",
            },
            guestsCanModify: true,
            guestsCanInviteOthers: true,
          };

          oAuth2Client.setCredentials(user.google_tokens);
          console.log('insert: event=%j', event)
          google.calendar({ version: "v3" }).events
            .insert({
              auth: oAuth2Client,
              calendarId: user.push_calendar,
              sendUpdates: "all",
              requestBody: event,
            })
            .then((evt: GaxiosResponse<Schema$Event>) => {
              console.log('insert returned %j', evt)
              res.json({ success: true, message: "Event wurde gebucht", event: evt });
            })
            .catch(error => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              res.status(400).json({ error });
            })
        })

    })
    .catch(error => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      res.status(400).json({ error });
    })
}

/**
 * Middleware function to delete an google Access Token from a user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const revokeScopes = (req: Request, res: Response): void => {
  const userid = req['user_id'];
  let tokens = null;
  const query = UserModel.findOne({ _id: userid });
  query.exec()
    .then((user: User) => {
      tokens = user.google_tokens;
      if (tokens.expiry_date <= Date.now()) {
        deleteTokens(userid);
      } else {
        oAuth2Client.revokeToken(tokens.access_token)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .then(_value => {
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
export function getCalendarList(req: Request, res: Response): void {
  getAuth(req['user_id'])
    .then(auth => {
      google.calendar({ version: "v3", auth })
        .calendarList.list()
        .then(list => {
          console.log("calendarList: %j", list);
          res.json(list);
        })
        .catch(error => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          res.status(400).json({ error });
        })
    })
}




export const events = (user_id: string, timeMin: string, timeMax: string): Promise<calendar_v3.Schema$Event[]> => {
  return UserModel.findOne({ _id: user_id })
    .then((user: User) => {
      return getAuth(user_id)
        .then(auth => {
          const google_tokens = user.google_tokens;
          oAuth2Client.setCredentials(google_tokens);
          const calendar = google.calendar({ version: "v3", auth });
          return calendar.events.list({
            calendarId: user.push_calendar,
            timeMin,
            timeMax,
            singleEvents: true
          })
        })
        .then(response => {
          return response.data.items
        })
        .catch(err => {
          console.log('error in calendar.events.list: %o', err)
          return []
        })
    })
}

function deleteTokens(userid: string) {
  UserModel.findOneAndUpdate(
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
  UserModel.findOneAndUpdate({ _id: user }, { google_tokens }, { new: true })
    .then(user => {
      console.log('saveTokens: %o', user)
    })
    .catch(err => {
      console.error('saveTokens: %o', err)
    });
}
