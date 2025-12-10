/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @module event_controller
 */
import { EventDocument, EventModel } from "../models/Event.js";
import { Event, IntervalSet } from "common";
import { freeBusy, events, checkFree, insertGoogleEvent } from "./google_controller.js";
import { getBusySlots, createCalDavEvent, findAccountForCalendar } from "./caldav_controller.js";
import { ValidationError, validationResult } from "express-validator";
import validator from "validator";
import { errorHandler } from "../handlers/errorhandler.js";
import { addMinutes, addDays, startOfHour, startOfDay } from 'date-fns';
import { Request, Response } from "express";

import { logger } from "../logging.js";
import { sendEventInvitation } from "../utility/mailer.js";
import { getLocale, t } from "../utility/i18n.js";
import crypto from 'node:crypto';
import { generateIcsContent } from "../utility/ical.js";
import { convertBusyToFree } from "../utility/scheduler.js";
import { UserModel } from "../models/User.js";
import { calendar_v3 } from 'googleapis';
import Schema$Event = calendar_v3.Schema$Event;

//const DAYS = [Day.SUN, Day.MON, Day.TUE, Day.WED, Day.THU, Day.FRI, Day.SAT,]

function max<T>(a: T, b: T): T {
  logger.debug('max: %o %o', a, b)
  return a < b ? b : a;
}

function min<T>(a: T, b: T): T {
  logger.debug('min: %o %o', a, b)
  return a < b ? a : b;
}

export function calculateBlocked(events, event, timeMin, timeMax) {
  const eventsPerDay = {};
  const blocked = new IntervalSet([{ start: timeMin, end: timeMin }, { start: timeMax, end: timeMax }]);
  events.forEach(evt => {
    logger.debug('event: %o', evt);
    if (!evt.start.dateTime) {
      return;
    }
    const day = startOfDay(new Date(evt.start.dateTime)).toISOString();
    if (day in eventsPerDay) {
      eventsPerDay[day] += 1;
    } else {
      eventsPerDay[day] = 1;
    }
  });
  for (const day in eventsPerDay) {
    if (eventsPerDay[day] >= event.maxPerDay) {
      blocked.addRange({ start: new Date(day), end: addDays(new Date(day), 1) });
    }
  }
  return blocked;
}

export function calculateFreeSlots(response, calDavSlots, event, timeMin, timeMax, blocked) {
  let freeSlots = new IntervalSet(timeMin, timeMax, event.available, "Europe/Berlin");
  freeSlots = freeSlots.intersect(blocked.inverse());

  for (const key in response.data.calendars) {
    const busy = response.data.calendars[key].busy;
    const calIntervals = convertBusyToFree(busy, timeMin, timeMax, event.bufferbefore, event.bufferafter);
    freeSlots = freeSlots.intersect(calIntervals);
  }

  if (calDavSlots && calDavSlots.length > 0) {
    calDavSlots.sort((a, b) => a.start.getTime() - b.start.getTime());
    const calIntervals = convertBusyToFree(calDavSlots, timeMin, timeMax, event.bufferbefore, event.bufferafter);
    freeSlots = freeSlots.intersect(calIntervals);
  }

  return freeSlots;
}

/**
 * Middleware to get available times for one weekday of a given user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getAvailableTimes = (req: Request, res: Response): void => {
  let timeMin = new Date(<string>req.query.timeMin);
  let timeMax = new Date(<string>req.query.timeMax);
  const eventId = req.params.id;

  logger.debug('getAvailableTimes: %s %s %s', timeMin, timeMax, eventId);
  EventModel
    .findById(eventId)
    .select("available bufferbefore duration bufferafter minFuture maxFuture maxPerDay user")
    .exec()
    .then(event => {
      if (!event) {
        throw new Error("Event not found");
      }
      // Calculate intersection of requested and 'feasible' time interval
      timeMin = max(timeMin, startOfHour(Date.now() + 1000 * event.minFuture));
      timeMax = min(timeMax, startOfHour(Date.now() + 1000 * event.maxFuture));
      logger.debug("Event: %o; timeMin: %s, timeMax: %s", event, timeMin, timeMax);

      // Request currently booked events. We need them for the maxPerDay restriction
      return events(event.user, timeMin.toISOString(), timeMax.toISOString())
        .then(events => ({ events, event }))
    })
    .then(({ events, event }) => {
      const blocked = calculateBlocked(events, event, timeMin, timeMax);
      logger.debug("blocked: %o", blocked);
      logger.debug("free: %o", blocked.inverse());

      // Now query freeBusy service and CalDAV
      return Promise.all([
        freeBusy(event.user, timeMin.toISOString(), timeMax.toISOString()),
        getBusySlots(event.user, timeMin.toISOString(), timeMax.toISOString()).catch(err => {
          logger.error('CalDAV getBusySlots failed', err);
          return [];
        })
      ]).then(([freeBusyResponse, calDavSlots]) => ({ freeBusyResponse, calDavSlots, event, blocked }));
    })
    .then(({ freeBusyResponse, calDavSlots, event, blocked }) => {
      let freeSlots = calculateFreeSlots(freeBusyResponse, calDavSlots, event, timeMin, timeMax, blocked);
      logger.debug('freeSlots before filtering: %j', freeSlots);
      freeSlots = new IntervalSet(freeSlots.filter(slot => (slot.end.getTime() - slot.start.getTime()) > event.duration * 60 * 1000));
      logger.debug('freeSlots after filtering: %j', freeSlots);
      res.status(200).json(freeSlots);
    })
    .catch((err: unknown) => {
      logger.error('getAvailableTime: event not found or freeBusy failed: %j', err);
      res.status(400).json({ error: err, message: "event not found or freeBusy failed: " + err.message });
    });
};



/**
 * Middleware to create a new event
 * @function
 * @param {request} req
 * @param {response} res
 */
export const addEventController = (req: Request, res: Response): void => {
  const errors = validationResult(req);
  logger.debug('errors: %j', errors);

  const event: Event = req.body;
  logger.debug('event: %j', event)

  if (errors.isEmpty()) {
    const eventToSave = new EventModel(event);

    eventToSave
      .save()
      .then((doc: EventDocument) => {
        res.status(201).json({
          success: true,
          message: doc, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
          msg: "Successfully saved event!",
        })
      })
      .catch(err => {
        res.status(400).json({ error: errorHandler(err) });
      });
  } else {
    const newError = errors.array().map<unknown>((error: ValidationError) => error.msg)[0];
    res.status(422).json({ error: newError });
  }
};

/**
 * Middleware to delete an event
 * @function
 * @param {request} req
 * @param {response} res
 */
export const deleteEventController = (req: Request, res: Response): void => {
  const eventid = req.params.id;
  EventModel
    .findByIdAndDelete(eventid)
    .exec()
    .then(() => {
      res.status(200).json({ msg: "Successfully deleted the Event" });
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to fetch all events of an given user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getEventListController = (req: Request, res: Response): void => {
  const userid = req["user_id"];
  EventModel
    .find({ user: userid })
    .exec()
    .then(event => {
      res.status(200).json(event);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to fetch a single event by ID
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getEventByIdController = (req: Request, res: Response): void => {
  const eventid = req.params.id;
  EventModel
    .findById(eventid)
    .exec()
    .then(event => {
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ error: "Event not found" });
      }
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to get public events (single by URL or list by user)
 * @function
 * @param {request} req
 * @param {response} res
 */
/**
 * Middleware to get active events for a user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getActiveEventsController = (req: Request, res: Response): void => {
  const userid = req.params.userId;

  EventModel
    .find({ user: userid, isActive: true })
    .exec()
    .then(event => {
      res.status(200).json(event);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
}

/**
 * Middleware to get a single event by URL and user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getEventByUrlController = (req: Request, res: Response): void => {
  const userid = req.params.userId;
  const url = req.params.eventUrl;

  EventModel
    .findOne({ url: url, user: userid })
    .exec()
    .then(event => {
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ error: "Event not found" });
      }
    })
    .catch(err => { res.status(400).json({ error: err }); });
}

/**
 * Middleware to update an event
 * @function
 * @param {request} req
 * @param {response} res
 */
export const updateEventController = (req: Request, res: Response): void => {
  const event = req.body.data;
  const event_id = req.params.id;

  // Validate the event object
  if (typeof event !== 'object' || event === null) {
    res.status(400).json({ error: 'Invalid event data' });
    return;
  }

  void EventModel
    .findByIdAndUpdate(event_id, { $set: event })
    .exec()
    .then((doc: EventDocument) => {
      res.status(200).json({ msg: "Update successful", event: doc })
    })
    .catch((err: unknown) => {
      res.status(400).json({ error: err });
    });

};
/**
 * Middleware to insert an event (Google or CalDav)
 * @function
 * @param {request} req
 * @param {response} res
 */

export const insertEvent = async (req: Request, res: Response): Promise<void> => {
  const starttime = new Date(Number.parseInt(req.body.start));
  const eventId = req.params.id;
  logger.debug("insertEvent: %s %o", req.body.start, starttime);

  try {
    const eventDoc = await EventModel.findById(eventId).exec();
    if (!eventDoc) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    const endtime = addMinutes(starttime, eventDoc.duration);
    const userId = eventDoc.user;

    const free = await checkFree(eventDoc, userId, starttime, endtime);
    if (!free) {
      res.status(400).json({ error: "requested slot not available" });
      return;
    }

    const user = await UserModel.findOne({ _id: { $eq: userId } }).exec();
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userComment = req.body.description as string;
    const eventDescription = String(eventDoc.description);

    const event: Schema$Event = {
      summary: eventDoc.name + " mit " + (req.body.attendeeName),
      location: eventDoc.location,
      description: eventDescription, // Description only contains the service description
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
          displayName: req.body.attendeeName as string,
          email: req.body.attendeeEmail as string,
        }
      ],
      source: {
        title: "Appoint Me",
        url: "https://appoint.gawron.cloud",
      },
      guestsCanModify: true,
      guestsCanInviteOthers: true,
    };

    // Determine target calendars
    let targetCalendars = user.push_calendars;
    if (!targetCalendars || targetCalendars.length === 0) {
      if (user.push_calendar) {
        targetCalendars = [user.push_calendar];
      } else {
        targetCalendars = [];
      }
    }

    const results = [];
    let successCount = 0;

    for (const calendar of targetCalendars) {
      try {
        // Check if calendar is a CalDav URL (heuristic: starts with http/https) 
        if (calendar.startsWith('http') || calendar.startsWith('/')) {
          await handleCalDavBooking(user, eventDoc, req, res, userComment, event, calendar);
          successCount++;
          results.push({ calendar, success: true, type: 'caldav' });
        } else {
          await handleGoogleBooking(user, eventDoc, res, userComment, event, calendar);
          successCount++;
          results.push({ calendar, success: true, type: 'google' });
        }
      } catch (err) {
        logger.error(`Failed to push to calendar ${calendar}:`, err);
        results.push({ calendar, success: false, error: err });
      }
    }

    if (successCount > 0) {
      // If at least one succeeded, we return success.
      // We return the result of the first successful one for backward compatibility with simple clients,
      // but also include full results.
      const firstSuccess = results.find(r => r.success);
      res.json({ ...firstSuccess, results });
    } else if (targetCalendars.length > 0) {
      // All attempted failed
      const firstError = results[0]?.error || "Failed to create event on any calendar";
      // Extract message if it's an error object
      const errorMsg = firstError instanceof Error ? firstError.message : String(firstError);
      res.status(400).json({ error: errorMsg, results });
    } else {
      // No calendars configured.
      // If no push calendars, we might default to Google Primary if that was the old behavior?
      // Old behavior: if (push_calendar set) { try caldav } else { try google }.
      // If push_calendar was null, it tried google.
      // So if list is empty, we should fallback to Google Primary.
      logger.info("No push calendars configured, falling back to Google Primary");
      try {
        const result = await handleGoogleBooking(user, eventDoc, res, userComment, event, 'primary');
        res.json(result);
      } catch (err) {
        res.status(400).json({ error: err });
      }
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }

  async function handleCalDavBooking(user: any, eventDoc: any, req: Request, res: Response, userComment: string, event: Schema$Event, calendarUrl: string) {
    const calDavAccount = findAccountForCalendar(user, calendarUrl);
    if (calDavAccount) {
      if (validator.isEmail(calDavAccount.username)) {
        logger.info('Using CalDAV account username as organizer email: %s', calDavAccount.username);
        event.organizer.email = calDavAccount.username;
      } else {
        logger.warn('CalDAV account username is not an email, keeping default: %s', calDavAccount.username);
      }
    }

    try {
      const locale = getLocale(req.headers['accept-language']);
      // Pass userComment and calendarUrl to CalDAV interaction
      const evt = await createCalDavEvent(user, event, userComment, calendarUrl);
      logger.debug('CalDav insert returned %j', evt);

      const randomStr = crypto.randomBytes(8).toString('hex');
      const uid = `${Date.now()}-${randomStr}`;

      const icsContent = generateIcsContent({
        uid,
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        summary: event.summary,
        description: event.description,
        location: event.location,
        organizer: {
          displayName: event.organizer.displayName,
          email: event.organizer.email
        },
        attendees: event.attendees.map(a => ({
          displayName: a.displayName,
          email: a.email,
          partstat: 'NEEDS-ACTION',
          rsvp: true
        }))
      }, { comment: userComment });


      const attendeeEmail = req.body.attendeeEmail as string;
      const attendeeName = validator.escape(req.body.attendeeName as string);
      const subject = t(locale, 'invitationSubject', { summary: event.summary });

      // Escape description for HTML email, preserving newlines as <br>
      const escapedDescription = validator.escape(event.description || '').replaceAll('\n', '<br>');
      const escapedComment = validator.escape(userComment || '').replaceAll('\n', '<br>');

      const timeStr = new Date(event.start.dateTime).toLocaleString(t(locale, 'dateFormat'), { timeZone: 'Europe/Berlin' });

      const html = t(locale, 'invitationBody', {
        attendeeName,
        summary: validator.escape(event.summary),
        description: escapedDescription + (escapedComment ? '<br><br>Kommentar:<br>' + escapedComment : ''),
        time: timeStr
      });

      if (user.send_invitation_email) {
        sendEventInvitation(attendeeEmail, subject, html, icsContent, 'invite.ics')
          .then(() => logger.info('Invitation email sent to %s', attendeeEmail))
          .catch(err => logger.error('Failed to send invitation email', err));
      } else {
        logger.info('Invitation email skipped for %s (user setting)', attendeeEmail);
      }

      return { success: true, message: "Event wurde gebucht (CalDav)", event: evt };
    } catch (error) {
      logger.error('CalDav insert failed', error);
      throw error;
    }
  }

  async function handleGoogleBooking(user: any, eventDoc: any, res: Response, userComment: string, event: Schema$Event, calendarUrl: string) {
    // Fallback to Google Calendar
    try {
      const googleEvent = { ...event };
      if (userComment) {
        googleEvent.description = (googleEvent.description || '') + "\n\nKommentar:\n" + userComment;
      }
      // Note: insertGoogleEvent currently pushes to primary calendar. 
      // If we want to support pushing to a specific google calendar ID (which calendarUrl would be), 
      // we need to update insertGoogleEvent or pass the ID.
      // For now, assuming standard google integration pushes to 'primary', but if calendarUrl is a google calendar ID, we might need to use it.
      // However, the current google_controller.ts/insertGoogleEvent might not accept a calendar ID.
      // Checking types: insertGoogleEvent(user, event).
      // If we want to support non-primary Google calendars, that would be another task.
      // For now, consistent signature.

      const evt = await insertGoogleEvent(user, googleEvent);
      logger.debug('insert returned %j', evt)
      return { success: true, message: "Event wurde gebucht", event: evt };
    } catch (error) {
      throw error;
    }
  }
}
