/**
 * @module user_controller
 */
import { UserModel } from "../models/User.js";
import { AppointmentModel } from "../models/Appointment.js";
import { User } from "common";
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
  res.set("Cache-Control", "no-store");
  void UserModel.findOne({ _id: userid },
    {
      "_id": 1,
      "email": 1,
      "name": 1,
      "picture_url": 1,
      "pull_calendars": 1,
      "push_calendars": 1,
      "user_url": 1,
      "welcome": 1,
      "updatedAt": 1,
      "send_invitation_email": 1,
      "google_tokens.access_token": 1,
      "use_gravatar": 1,
      "defaultAvailable": 1
    })
    .exec()
    .then(user => {
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
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

const buildUserUpdateObject = (userData: Partial<User>): Record<string, any> => {
  const update: Record<string, any> = {};

  // Explicitly allowlist and validate fields
  if (typeof userData.name === 'string') update.name = userData.name;
  if (typeof userData.email === 'string') update.email = userData.email;
  if (typeof userData.welcome === 'string') update.welcome = userData.welcome;

  // Validate arrays and specific types
  if (Array.isArray(userData.pull_calendars) && userData.pull_calendars.every(c => typeof c === 'string')) {
    update.pull_calendars = userData.pull_calendars.map(String);
  }

  if (Array.isArray(userData.push_calendars) && userData.push_calendars.every(c => typeof c === 'string')) {
    update.push_calendars = userData.push_calendars.map(String);
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

  if (userData.defaultAvailable && typeof userData.defaultAvailable === 'object') {
    update.defaultAvailable = userData.defaultAvailable;
  }

  return update;
};

const resolvePictureUrl = (currentUser: any, userData: Partial<User>): string | undefined => {
  if (userData.use_gravatar !== undefined && userData.use_gravatar !== currentUser.use_gravatar) {
    if (userData.use_gravatar) {
      // Switched to Gravatar
      const emailHash = crypto.createHash('md5').update(currentUser.email.toLowerCase().trim()).digest('hex');
      return `https://www.gravatar.com/avatar/${emailHash}?d=mp`;
    } else {
      // Switched back to Google picture (or empty if not available)
      return currentUser.google_picture_url || "";
    }
  }
  return undefined;
};

export const updateUser = (req: Request, res: Response): void => {
  const userid = req['user_id'];
  if (typeof userid !== 'string') {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  const userData = req.body.data as Partial<User>;
  const update = buildUserUpdateObject(userData);

  UserModel.findById(userid).exec()
    .then(currentUser => {
      if (!currentUser) throw new Error("User not found");

      const newPictureUrl = resolvePictureUrl(currentUser, userData);
      if (newPictureUrl !== undefined) {
        update.picture_url = newPictureUrl;
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
            "push_calendars": 1,
            "user_url": 1,
            "welcome": 1,
            "updatedAt": 1,
            "google_tokens.access_token": 1,
            "use_gravatar": 1,
            "send_invitation_email": 1,
            "defaultAvailable": 1
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

/**
 * Middleware to fetch appointments for a user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getAppointments = (req: Request, res: Response): void => {
  const userId = req.params.id;
  const currentUserId = req['user_id'];

  // Check if requesting own appointments
  // For now we restrict to own appointments. Admin access logic could be added here.
  if (userId !== 'me' && userId !== currentUserId) {
    res.status(403).json({ error: "Forbidden: Can only access own appointments" });
    return;
  }

  const targetId = userId === 'me' ? currentUserId : userId;

  AppointmentModel.find({ user: targetId })
    .populate("event")
    .sort({ start: 1 })
    .exec()
    .then(appointments => {
      res.status(200).json(appointments);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to fetch all calendars (Google + CalDAV) for a user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getCalendars = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const currentUserId = req['user_id'];

  // Check if requesting own calendars
  if (userId !== 'me' && userId !== currentUserId) {
    res.status(403).json({ error: "Forbidden: Can only access own calendars" });
    return;
  }

  const targetId = userId === 'me' ? currentUserId : userId;
  const calendars: any[] = [];

  try {
    // Fetch user to get CalDAV accounts
    const user = await UserModel.findOne({ _id: targetId }).exec();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Fetch Google calendars if user has Google tokens
    if (user.google_tokens?.access_token) {
      try {
        const { google } = await import('googleapis');
        const { OAuth2Client } = await import('google-auth-library');

        const oAuth2Client = new OAuth2Client({
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          redirectUri: `${process.env.API_URL}/google/oauthcallback`,
        });

        oAuth2Client.setCredentials(user.google_tokens);

        const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
        const list = await calendar.calendarList.list();

        if (list.data.items) {
          list.data.items.forEach((cal: any) => {
            calendars.push({
              id: cal.id,
              summary: cal.summary || cal.id,
              type: 'google',
              primary: cal.primary || false,
              color: cal.backgroundColor,
            });
          });
        }
      } catch (err) {
        console.error("Error fetching Google calendars:", err);
        // Continue to CalDAV even if Google fails
      }
    }

    // Fetch CalDAV calendars
    if (user.caldav_accounts && user.caldav_accounts.length > 0) {
      const { DAVClient } = await import('tsdav');
      const { decrypt } = await import('../utility/encryption.js');

      for (const account of user.caldav_accounts) {
        try {
          const client = new DAVClient({
            serverUrl: account.serverUrl,
            credentials: {
              username: account.username,
              password: decrypt(account.password),
            },
            authMethod: 'Basic',
            defaultAccountType: 'caldav',
            fetchOptions: {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Thunderbird/143.0'
              }
            }
          });

          await client.login();
          const caldavCalendars = await client.fetchCalendars();

          caldavCalendars.forEach((cal: any) => {
            calendars.push({
              id: cal.url,
              summary: cal.displayName || cal.url,
              type: 'caldav',
              color: cal.color,
              accountId: account._id?.toString(),
            });
          });
        } catch (err) {
          console.error(`Error fetching CalDAV calendars for account ${account._id}:`, err);
          // Continue to next account
        }
      }
    }

    res.status(200).json(calendars);
  } catch (err) {
    console.error("Error in getCalendars:", err);
    res.status(500).json({ error: "Failed to fetch calendars" });
  }
};

/**
 * Middleware to fetch events for a specific calendar
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getCalendarEvents = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const calendarId = req.params.calendarId;
  const currentUserId = req['user_id'];
  const timeMin = req.query.timeMin as string;
  const timeMax = req.query.timeMax as string;

  // Check if requesting own calendar events
  if (userId !== 'me' && userId !== currentUserId) {
    res.status(403).json({ error: "Forbidden: Can only access own calendar events" });
    return;
  }

  const targetId = userId === 'me' ? currentUserId : userId;

  try {
    const user = await UserModel.findOne({ _id: targetId }).exec();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const events: any[] = [];

    // Check if it's a Google calendar (doesn't start with http)
    if (!calendarId.startsWith('http')) {
      // Google calendar
      if (user.google_tokens?.access_token) {
        try {
          const { google } = await import('googleapis');
          const { OAuth2Client } = await import('google-auth-library');

          const oAuth2Client = new OAuth2Client({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            redirectUri: `${process.env.API_URL}/google/oauthcallback`,
          });

          oAuth2Client.setCredentials(user.google_tokens);

          const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
          const response = await calendar.events.list({
            calendarId,
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: 'startTime'
          });

          if (response.data.items) {
            events.push(...response.data.items);
          }
        } catch (err) {
          console.error("Error fetching Google calendar events:", err);
          res.status(500).json({ error: "Failed to fetch Google calendar events" });
          return;
        }
      } else {
        res.status(401).json({ error: "Google authentication required" });
        return;
      }
    } else {
      // CalDAV calendar
      const { DAVClient } = await import('tsdav');
      const { decrypt } = await import('../utility/encryption.js');
      const ical = await import('node-ical');

      const accountId = req.params.accountId;
      let account;

      if (accountId) {
        account = user.caldav_accounts?.find(acc => acc._id?.toString() === accountId);
      }

      // Fallback or explicit search if accountId not provided or not found (though if provided and not found it might be better to 404, 
      // but strictly following the logic: checking if it was a "google" placeholder or similar)
      if (!account && !accountId) {
        // Find the account that owns this calendar by URL matching (Legacy/Fallback)
        account = user.caldav_accounts?.find(acc => calendarId.startsWith(acc.serverUrl));
      }

      if (!account) {
        res.status(404).json({ error: "CalDAV account not found for this calendar" });
        return;
      }

      try {
        const client = new DAVClient({
          serverUrl: account.serverUrl,
          credentials: {
            username: account.username,
            password: decrypt(account.password),
          },
          authMethod: 'Basic',
          defaultAccountType: 'caldav',
          fetchOptions: {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Thunderbird/143.0'
            }
          }
        });

        await client.login();
        const calendars = await client.fetchCalendars();
        const targetCalendar = calendars.find(c => c.url === calendarId);

        if (!targetCalendar) {
          res.status(404).json({ error: "Calendar not found" });
          return;
        }

        const objects = await client.fetchCalendarObjects({
          calendar: targetCalendar,
          timeRange: timeMin && timeMax ? { start: timeMin, end: timeMax } : undefined
        });

        for (const obj of objects) {
          if (obj.data) {
            const parsed = ical.default.parseICS(obj.data);
            for (const k in parsed) {
              const event = parsed[k];
              if (event.type === 'VEVENT') {
                events.push({
                  id: event.uid,
                  summary: event.summary,
                  start: { dateTime: event.start },
                  end: { dateTime: event.end },
                  description: event.description,
                  location: event.location,
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching CalDAV calendar events:", err);
        res.status(500).json({ error: "Failed to fetch CalDAV calendar events" });
        return;
      }
    }

    res.status(200).json(events);
  } catch (err) {
    console.error("Error in getCalendarEvents:", err);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};
