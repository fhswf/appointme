/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @module google_controller
 */


import { calendar_v3, google } from 'googleapis';
import { GaxiosResponse, GaxiosPromise } from "gaxios";
import { OAuth2Client } from 'google-auth-library';
import Schema$Event = calendar_v3.Schema$Event;
import { UserModel, UserDocument } from "../models/User.js";
import { Request, Response } from 'express';

import { Event, IntervalSet } from 'common';

import { logger } from '../logging.js';
import { getBusySlots } from './caldav_controller.js';



const config = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: `${process.env.API_URL}/google/oauthcallback`,
}

logger.debug("google_controller: ", config);

const createOAuthClient = (userId?: string): OAuth2Client => {
  const client = new OAuth2Client(config);
  if (userId) {
    client.on('tokens', (tokens) => {
      logger.debug('Tokens refreshed for user %s', userId);
      saveTokens(userId, { tokens });
    });
  }
  return client;
};
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
  const oAuth2Client = createOAuthClient(userid);
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
    const oAuth2Client = createOAuthClient(user);
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
  return UserModel
    .findOne({ _id: { $eq: user_id } })
    .exec()
    .then((user: UserDocument | null) => {
      if (!user) throw new Error("User not found");
      const google_tokens = user.google_tokens;
      if (!google_tokens || !google_tokens.access_token) {
        // @ts-ignore
        return { data: { calendars: {} } } as any;
      }
      const oAuth2Client = createOAuthClient(user_id);
      oAuth2Client.setCredentials(google_tokens);
      const items = user.pull_calendars
        .filter(id => !id.startsWith('http') && !id.startsWith('/'))
        .map(id => { return { id } });

      if (items.length === 0) {
        // @ts-ignore
        return { data: { calendars: {} } } as any;
      }

      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
      return calendar.freebusy.query({
        requestBody: {
          timeMin,
          timeMax,
          items
        }
      })
        .catch(err => {
          logger.error('freeBusy failed inside: %o', err);
          if (err instanceof Error) {
            logger.error(err.stack);
          }
          throw err;
        })
    })
}

import { convertBusyToFree } from '../utility/scheduler.js';

async function fetchFreeBusyData(userid: string, timeMin: Date, timeMax: Date) {
  return Promise.all([
    (async () => {
      const user = await UserModel.findOne({ _id: userid }).exec();
      if (user?.google_tokens?.access_token) {
        return freeBusy(userid, timeMin.toISOString(), timeMax.toISOString()).catch(err => {
          logger.error('Google freeBusy error', err);
          return null;
        });
      }
      return null;
    })(),
    getBusySlots(userid, timeMin.toISOString(), timeMax.toISOString())
  ]);
}

export async function checkFree(event: Event, userid: string, timeMin: Date, timeMax: Date): Promise<boolean> {
  const interval = new IntervalSet(timeMin, timeMax);
  let freeSlots = new IntervalSet(timeMin, timeMax, event.available, "Europe/Berlin");

  const [googleRes, calDavSlots] = await fetchFreeBusyData(userid, timeMin, timeMax);

  if (googleRes?.data?.calendars) {
    for (const key in googleRes.data.calendars) {
      const busy = googleRes.data.calendars[key].busy;
      const calIntervals = convertBusyToFree(busy, timeMin, timeMax, event.bufferbefore, event.bufferafter);
      freeSlots = freeSlots.intersect(calIntervals)
    }
  }

  if (calDavSlots && calDavSlots.length > 0) {
    calDavSlots.sort((a, b) => a.start.getTime() - b.start.getTime());
    const calIntervals = convertBusyToFree(calDavSlots, timeMin, timeMax, event.bufferbefore, event.bufferafter);
    freeSlots = freeSlots.intersect(calIntervals);
  }

  const intersection = freeSlots.intersect(interval)
  return intersection.length == 1 && IntervalSet.equals(intersection[0], interval[0]);
}

/**
 * Helper to insert event into Google Calendar
 */
export async function insertGoogleEvent(user: UserDocument, event: Schema$Event, calendarId: string = 'primary'): Promise<GaxiosResponse<Schema$Event>> {
  if (!user.google_tokens || !user.google_tokens.access_token) {
    throw new Error("No Google account connected");
  }

  const oAuth2Client = createOAuthClient(user._id as string);
  oAuth2Client.setCredentials(user.google_tokens);
  logger.debug('insert: event=%j', event)

  return google.calendar({ version: "v3" }).events.insert({
    auth: oAuth2Client,
    calendarId,
    sendUpdates: "all",
    requestBody: event,
  });
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
  const query = UserModel.findOne({ _id: { $eq: userid } });
  query.exec()
    .then((user: UserDocument) => {
      tokens = user.google_tokens;
      if (tokens.expiry_date <= Date.now()) {
        deleteTokens(userid);
      } else {
        const oAuth2Client = createOAuthClient(userid);
        oAuth2Client.revokeToken(tokens.access_token)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .then(_value => {
            deleteTokens(userid);
          })
          .catch(err => {
            logger.error(err);
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
  return UserModel.findOne({ _id: { $eq: user_id } })
    .exec()
    .then((user: UserDocument) => {
      const google_tokens = user.google_tokens;
      const oAuth2Client = createOAuthClient(user_id);
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
          logger.debug("calendarList: %j", list);
          res.json(list);
        })
        .catch(error => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          res.status(400).json({ error });
        })
    })
    .catch(error => {
      logger.error("getAuth failed: %o", error);
      // Return 401 to indicate Google authentication is needed
      res.status(401).json({ error: "Google authentication required", message: "Please connect your Google Calendar" });
    });
}




export const events = (user_id: string, timeMin: string, timeMax: string, calendarId: string = 'primary'): Promise<calendar_v3.Schema$Event[]> => {
  return UserModel
    .findOne({ _id: { $eq: user_id } })
    .exec()
    .then((user: UserDocument) => {
      const google_tokens = user.google_tokens;
      if (!google_tokens || !google_tokens.access_token) {
        return [];
      }
      const oAuth2Client = createOAuthClient(user_id);
      oAuth2Client.setCredentials(google_tokens);
      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
      return calendar.events.list({
        calendarId,
        timeMin,
        timeMax,
        singleEvents: true
      })
        .then(response => {
          return response.data.items
        })
        .catch(err => {
          logger.debug('error in calendar.events.list: %o', err);
          if (err instanceof Error) {
            logger.debug(err.stack);
          }
          return []
        })
    })
}

function deleteTokens(userid: string) {
  UserModel.findOneAndUpdate(
    { _id: { $eq: userid } },
    { $unset: { google_tokens: "" } }
  ).then(res => {
    logger.debug(res);
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
  const update = {};
  for (const key of _KEYS) {
    if (key in token.tokens && token.tokens[key]) {
      update[`google_tokens.${key}`] = <string>token.tokens[key];
    }
  }
  UserModel.findOneAndUpdate({ _id: { $eq: user } }, { $set: update }, { new: true })
    .then(user => {
      logger.debug('saveTokens: %o', user)
    })
    .catch(err => {
      logger.error('saveTokens: %o', err)
    });
}
