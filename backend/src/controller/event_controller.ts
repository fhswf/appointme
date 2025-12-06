/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @module event_controller
 */
import { EventDocument, EventModel } from "../models/Event.js";
import { Event, IntervalSet } from "common";
import { freeBusy, events } from "./google_controller.js";
import { ValidationError, validationResult } from "express-validator";
import { errorHandler } from "../handlers/errorhandler.js";
import { addMinutes, addDays, startOfHour, startOfDay } from 'date-fns';
import { Request, Response } from "express";

import { logger } from "../logging.js";

//const DAYS = [Day.SUN, Day.MON, Day.TUE, Day.WED, Day.THU, Day.FRI, Day.SAT,]

function max<T>(a: T, b: T): T {
  logger.debug('max: %o %o', a, b)
  return a < b ? b : a;
}

function min<T>(a: T, b: T): T {
  logger.debug('min: %o %o', a, b)
  return a < b ? a : b;
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
      return events(event.user as string, timeMin.toISOString(), timeMax.toISOString())
        .then(events => ({ events, event }));
    })
    .then(({ events, event }) => {
      const blocked = calculateBlocked(events, event, timeMin, timeMax);
      logger.debug("blocked: %o", blocked);
      logger.debug("free: %o", blocked.inverse());

      // Now query freeBusy service
      return freeBusy(event.user as string, timeMin.toISOString(), timeMax.toISOString())
        .then(freeBusyResponse => ({ freeBusyResponse, event, blocked }));
    })
    .then(({ freeBusyResponse, event, blocked }) => {
      let freeSlots = calculateFreeSlots(freeBusyResponse, event, timeMin, timeMax, blocked);
      logger.debug('freeSlots before filtering: %j', freeSlots);
      freeSlots = new IntervalSet(freeSlots.filter(slot => (slot.end.getTime() - slot.start.getTime()) > event.duration * 60 * 1000));
      logger.debug('freeSlots after filtering: %j', freeSlots);
      res.status(200).json(freeSlots);
    })
    .catch((err: unknown) => {
      logger.error('getAvailableTime: event not found or freeBusy failed: %o', err);
      res.status(400).json({ error: err });
    });

  function calculateBlocked(events, event, timeMin, timeMax) {
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

  function calculateFreeSlots(response, event, timeMin, timeMax, blocked) {
    let freeSlots = new IntervalSet(timeMin, timeMax, event.available, "Europe/Berlin");
    freeSlots = freeSlots.intersect(blocked.inverse());
    for (const key in response.data.calendars) {
      const calIntervals = new IntervalSet();
      let current = timeMin;
      for (const busy of response.data.calendars[key].busy) {
        logger.debug('freeBusy: %o %o %d %d', busy.start, busy.end, event.bufferbefore, event.bufferafter);
        const _start = addMinutes(new Date(busy.start), -event.bufferbefore);
        const _end = addMinutes(new Date(busy.end), event.bufferafter);
        if (current < _start)
          calIntervals.push({ start: current, end: _start });
        current = _end;
      }
      if (current < timeMax) {
        calIntervals.push({ start: current, end: timeMax });
      }
      freeSlots = freeSlots.intersect(calIntervals);
    }
    return freeSlots;
  }
}



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

  if (!errors.isEmpty()) {
    const newError = errors.array().map<unknown>((error: ValidationError) => error.msg)[0];
    res.status(422).json({ error: newError });
  } else {
    const eventToSave = new EventModel(event);

    eventToSave
      .save()
      .then((doc: EventDocument) => {
        res.status(201).json({
          success: true,
          message: doc,
          msg: "Successfully saved event!",
        })
      })
      .catch(err => {
        res.status(400).json({ error: errorHandler(err) });
      });
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
      if (!event) {
        res.status(404).json({ error: "Event not found" });
      } else {
        res.status(200).json(event);
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
      if (!event) {
        res.status(404).json({ error: "Event not found" });
      } else {
        res.status(200).json(event);
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
import { checkFree, insertGoogleEvent } from "./google_controller.js";
import { createCalDavEvent } from "./caldav_controller.js";
import { UserModel } from "../models/User.js";
import { calendar_v3 } from 'googleapis';
import Schema$Event = calendar_v3.Schema$Event;

export const insertEvent = (req: Request, res: Response): void => {
  const starttime = new Date(Number.parseInt(req.body.starttime));
  const eventId = req.params.id;
  logger.debug("insertEvent: %s %o", req.body.starttime, starttime);

  EventModel.findById(eventId).then(eventDoc => {
    if (!eventDoc) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    const endtime = addMinutes(starttime, eventDoc.duration);
    const userId = eventDoc.user as string;

    checkFree(eventDoc, userId, starttime, endtime)
      .then(free => {
        if (!free) {
          res.status(400).json({ error: "requested slot not available" });
          return;
        }

        UserModel.findOne({ _id: { $eq: userId } })
          .then(user => {
            if (!user) {
              res.status(404).json({ error: "User not found" });
              return;
            }

            const event: Schema$Event = {
              summary: <string>eventDoc.name + " mit " + <string>req.body.name,
              location: <string>eventDoc.location,
              description: String(eventDoc.description) + "<br>" + (req.body.description as string),
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

            // Check if push_calendar is a CalDav URL (heuristic: starts with http/https)
            if (user.push_calendar && (user.push_calendar.startsWith('http') || user.push_calendar.startsWith('/'))) {
              createCalDavEvent(user, event)
                .then((evt) => {
                  logger.debug('CalDav insert returned %j', evt);
                  res.json({ success: true, message: "Event wurde gebucht (CalDav)", event: evt });
                })
                .catch(error => {
                  logger.error('CalDav insert failed', error);
                  res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create event on CalDav server' });
                });
            } else {
              // Fallback to Google Calendar
              insertGoogleEvent(user, event)
                .then((evt) => {
                  logger.debug('insert returned %j', evt)
                  res.json({ success: true, message: "Event wurde gebucht", event: evt });
                })
                .catch(error => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  res.status(400).json({ error });
                })
            }
          })

      })
      .catch(error => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        res.status(400).json({ error });
      })
  }).catch(err => {
    res.status(400).json({ error: err });
  });
};
