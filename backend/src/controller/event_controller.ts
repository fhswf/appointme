/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @module event_controller
 */
import { EventDocument, EventModel } from "../models/Event.js";
import { AppointmentModel } from "../models/Appointment.js";
import { Event, IntervalSet } from "common";
import { freeBusy, events, checkFree } from "./google_controller.js";
import { getBusySlots } from "./caldav_controller.js";
import { ValidationError, validationResult } from "express-validator";
import { errorHandler } from "../handlers/errorhandler.js";
import { addMinutes, addDays, startOfHour, startOfDay } from 'date-fns';
import { syncAppointment } from "../services/sync_service.js";
import { Request, Response } from "express";

import { logger } from "../logging.js";
import { t } from "../utility/i18n.js";
import crypto from 'node:crypto';
import { convertBusyToFree } from "../utility/scheduler.js";
import { UserModel } from "../models/User.js";
import { calendar_v3 } from 'googleapis';
import "../config/env.js";
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

/**
 * Calculate all instance dates for a recurring event
 * @param startTime First occurrence start time
 * @param recurrence Recurrence rule configuration
 * @returns Array of Date objects for each instance
 */
function calculateRecurrenceInstances(
  startTime: Date,
  recurrence: { enabled: boolean; frequency: string; interval: number; count?: number; until?: string; span?: { value: number; unit: 'weeks' | 'months' } }
): Date[] {
  if (!recurrence?.enabled) {
    return [startTime];
  }

  const instances: Date[] = [];
  let current = new Date(startTime);
  const maxInstances = recurrence.count || 52; // Default max 52 if no count/until/span
  let untilDate = recurrence.until ? new Date(recurrence.until) : null;

  if (recurrence.span) {
    const spanDate = new Date(startTime);
    if (recurrence.span.unit === 'months') {
      spanDate.setMonth(spanDate.getMonth() + recurrence.span.value);
    } else {
      spanDate.setDate(spanDate.getDate() + (recurrence.span.value * 7));
    }
    // If until date is also set, use the earlier one, otherwise use calculated span date
    untilDate = untilDate ? min(untilDate, spanDate) : spanDate;
  }

  // Calculate interval in days based on frequency
  let intervalDays: number;
  switch (recurrence.frequency) {
    case 'weekly':
      intervalDays = 7;
      break;
    case 'biweekly':
      intervalDays = 14;
      break;
    case 'triweekly':
      intervalDays = 21;
      break;
    case 'monthly':
      intervalDays = 30; // Approximate for monthly
      break;
    default:
      intervalDays = recurrence.interval * 7; // Fallback to weeks
  }

  for (let i = 0; i < maxInstances; i++) {
    // Stop if we've passed the until date
    if (untilDate && current > untilDate) {
      break;
    }

    instances.push(new Date(current));

    // Calculate next occurrence
    current = addDays(current, intervalDays);
  }

  return instances;
}

/**
 * Validate that all slots in a recurring series are available
 * @param eventDoc Event document
 * @param userId User ID
 * @param instances Array of instance start times
 * @returns Promise<boolean> true if all slots are available
 */
async function validateAllSlotsAvailable(
  eventDoc: EventDocument,
  userId: string,
  instances: Date[]
): Promise<{ available: boolean; conflictDate?: Date }> {
  for (const startTime of instances) {
    const endTime = addMinutes(startTime, eventDoc.duration);
    const isFree = await checkFree(eventDoc as unknown as Event, userId, startTime, endTime);

    if (!isFree) {
      return { available: false, conflictDate: startTime };
    }
  }

  return { available: true };
}

export function calculateBlocked(events, event, timeMin, timeMax) {
  const eventsPerDay = {};
  const blocked = new IntervalSet([{ start: new Date(timeMin), end: new Date(timeMin) }, { start: new Date(timeMax), end: new Date(timeMax) }]);
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

export function calculateFreeSlots(response, calDavSlots, event, timeMin, timeMax, blocked, user) {
  let freeSlots = new IntervalSet(timeMin, timeMax, event.available, "Europe/Berlin");

  if (user && user.defaultAvailable) {
    if (event.availabilityMode === 'default') {
      freeSlots = new IntervalSet(timeMin, timeMax, user.defaultAvailable, "Europe/Berlin");
    }
  }

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
 * Helper function to shift an IntervalSet by a specific duration.
 * Used for checking availability of recurring event instances.
 * 
 * @param intervalSet - The set of intervals to shift
 * @param shiftMs - The number of milliseconds to shift (positive or negative)
 * @returns A new IntervalSet with shifted start/end times
 */
const shiftIntervalSet = (intervalSet: IntervalSet, shiftMs: number): IntervalSet => {
  const result = new IntervalSet();
  for (const range of intervalSet) {
    result.push({
      start: new Date(range.start.getTime() + shiftMs),
      end: new Date(range.end.getTime() + shiftMs)
    });
  }
  return result;
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
    .select("available bufferbefore duration bufferafter minFuture maxFuture maxPerDay user availabilityMode recurrence")
    .exec()
    .then(event => {
      if (!event) {
        throw new Error("Event not found");
      }
      return UserModel.findById(event.user).exec().then(user => {
        if (!user) throw new Error("User not found");
        return { event, user };
      });
    })
    .then(({ event, user }) => {
      // Calculate intersection of requested and 'feasible' time interval
      timeMin = max(timeMin, startOfHour(Date.now() + 1000 * event.minFuture));
      timeMax = min(timeMax, startOfHour(Date.now() + 1000 * event.maxFuture));
      logger.debug("Event: %o; timeMin: %s, timeMax: %s", event, timeMin, timeMax);

      // Determine the check range. For recurring events, we need to check future instances.
      let checkMax = new Date(timeMax);
      let recurrenceCount = 1;
      let recurrenceIntervalMs = 0;

      if (event.recurrence?.enabled) {
        const count = event.recurrence.count || 12; // Check up to 12 instances if not specified, to be safe/performant
        recurrenceCount = count;

        // Calculate interval in ms
        let intervalDays = 7;
        switch (event.recurrence.frequency) {
          case 'daily': intervalDays = 1; break;
          case 'weekly': intervalDays = 7; break;
          case 'biweekly': intervalDays = 14; break;
          case 'triweekly': intervalDays = 21; break;
          case 'monthly': intervalDays = 30; break;
          default: intervalDays = event.recurrence.interval * 7;
        }
        recurrenceIntervalMs = intervalDays * 24 * 60 * 60 * 1000;

        // Extend checkMax to cover the recurrence period
        const addedTime = (count - 1) * recurrenceIntervalMs;
        // Safety cap for checkMax (e.g. 1 year from now) to avoid performance issues
        const limitDate = addDays(new Date(), 365);

        const potentialMax = new Date(checkMax.getTime() + addedTime);
        checkMax = min(potentialMax, limitDate);

        if (event.recurrence.until) {
          checkMax = min(checkMax, new Date(event.recurrence.until));
        }
      }

      // Request currently booked events. We need them for the maxPerDay restriction
      return events(event.user, timeMin.toISOString(), checkMax.toISOString())
        .then(events => ({ events, event, user, timeMin, timeMax, checkMax, recurrenceCount, recurrenceIntervalMs }));
    })
    .then(({ events, event, user, timeMin, timeMax, checkMax, recurrenceCount, recurrenceIntervalMs }) => {
      const blocked = calculateBlocked(events, event, timeMin, checkMax);
      logger.debug("blocked: %o", blocked);
      logger.debug("free: %o", blocked.inverse());

      // Now query freeBusy service and CalDAV
      return Promise.all([
        (user.google_tokens && user.google_tokens.access_token) ?
          freeBusy(event.user, timeMin.toISOString(), checkMax.toISOString()).catch(err => {
            logger.error('Google freeBusy failed in getAvailableTimes (non-fatal): %s', err.message);
            return { data: { calendars: {} } };
          }) :
          Promise.resolve({ data: { calendars: {} } }),
        getBusySlots(event.user, timeMin.toISOString(), checkMax.toISOString()).catch(err => {
          logger.error('CalDAV getBusySlots failed', err);
          return [];
        })
      ]).then(([freeBusyResponse, calDavSlots]) => ({
        freeBusyResponse,
        calDavSlots,
        event,
        blocked,
        user,
        timeMin,
        timeMax,
        checkMax,
        recurrenceCount,
        recurrenceIntervalMs
      }));
    })
    .then(({ freeBusyResponse, calDavSlots, event, blocked, user, timeMin, timeMax, checkMax, recurrenceCount, recurrenceIntervalMs }) => {
      let freeSlots = calculateFreeSlots(freeBusyResponse, calDavSlots, event, timeMin, checkMax, blocked, user);

      // Filter slots by duration first
      freeSlots = new IntervalSet(freeSlots.filter(slot => (slot.end.getTime() - slot.start.getTime()) >= event.duration * 60 * 1000));

      // Handle recurrence validation
      if (event.recurrence?.enabled && recurrenceCount > 1 && recurrenceIntervalMs > 0) {
        let validatedSlots = new IntervalSet(freeSlots);

        for (let i = 1; i < recurrenceCount; i++) {
          const shiftAmount = -1 * i * recurrenceIntervalMs;
          const shifted = shiftIntervalSet(freeSlots, shiftAmount);

          // We intersect the current candidates with the available slots of the i-th instance (shifted back to base time)
          validatedSlots = validatedSlots.intersect(shifted);
        }
        freeSlots = validatedSlots;
      }

      // Finally clip to the requested view range
      const viewRange = new IntervalSet(timeMin, timeMax);
      freeSlots = freeSlots.intersect(viewRange);

      if (req.query.slots === 'true') {
        const slots: string[] = [];
        for (const slot of freeSlots) {
          let s = new Date(slot.start);
          const end = new Date(slot.end);
          // Check if at least one duration fits
          while (s.getTime() + event.duration * 60000 <= end.getTime()) {
            slots.push(s.toISOString());
            s = addMinutes(s, event.duration);
          }
        }
        res.status(200).json(slots);
        return;
      }

      logger.debug('freeSlots after filtering and recurrence check: %j', freeSlots);

      res.status(200).json(freeSlots);
    })
    .catch((err: unknown) => {
      logger.error('getAvailableTime: event not found or freeBusy failed: %j', err);
      if (err instanceof Error) {
        logger.error(err.stack);
      }
      const msg = err instanceof Error ? err.message : String(err);
      res.status(400).json({ error: err, message: "event not found or freeBusy failed: " + msg });
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
export const getActiveEventsController = async (req: Request, res: Response): Promise<void> => {
  const userid = req.params.userId;
  let userRoles: string[] = [];

  try {
    if (req["user"]) {
      userRoles = req["user"].roles || [];
    } else if (req["user_id"]) {
      const user = await UserModel.findById(req["user_id"]).exec();
      if (user) {
        userRoles = user.roles || [];
      }
    } else if (req['user_claims']) {
      userRoles = req['user_claims'].roles || [];
    }

    const events = await EventModel.find({ user: userid, isActive: true }).exec();
    const visibleEvents = events.filter(event => {
      if (!event.allowed_roles || event.allowed_roles.length === 0) {
        return true;
      }
      return event.allowed_roles.some(r => userRoles.includes(r));
    });

    res.status(200).json(visibleEvents);
  } catch (err) {
    res.status(400).json({ error: err });
  }
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

  // Build a sanitized update object to avoid MongoDB operator injection
  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(event)) {
    // Disallow MongoDB operator-style keys and dotted paths from user input
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    updateData[key] = value;
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No valid fields to update' });
    return;
  }

  void EventModel
    .findByIdAndUpdate(event_id, { $set: updateData })
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
  const startInput = req.body.start;
  const starttime = Number.isNaN(Number(startInput)) ? new Date(startInput) : new Date(Number(startInput));
  const eventId = req.params.id;
  logger.debug("insertEvent: %s %o", req.body.start, starttime);

  try {
    const context = await fetchEventAndUser(eventId);
    if ('error' in context) {
      res.status(404).json({ error: context.error });
      return;
    }
    const { eventDoc } = context;
    const userId = eventDoc.user;

    // Check for role restrictions
    if (eventDoc.allowed_roles && eventDoc.allowed_roles.length > 0) {
      let userRoles: string[] = [];

      if (!req["user"] && req["user_id"]) {
        try {
          const user = await UserModel.findById(req["user_id"]).exec();
          if (user) {
            req["user"] = user;
            userRoles = user.roles || [];
          }
        } catch (err) {
          logger.error("Failed to fetch user for role check", err);
        }
      } else if (req["user"]) {
        userRoles = req["user"].roles || [];
      } else if (req['user_claims']) {
        // Fallback to claims for transient users
        userRoles = req['user_claims'].roles || [];
      }

      // Check if current user is authenticated and has required role
      if (!eventDoc.allowed_roles.some(r => userRoles.includes(r))) {
        res.status(403).json({ error: "Access denied. RESTRICTED_TO_ROLES" });
        return;
      }
    }

    // Check if this is a recurring event and calculate all instances
    const instances = calculateRecurrenceInstances(starttime, eventDoc.recurrence || { enabled: false, frequency: 'weekly', interval: 1 });
    logger.debug("Recurring instances: %o", instances);

    const availability = await validateAvailability(eventDoc, userId, instances, starttime);
    if (!availability.available) {
      res.status(400).json({
        error: availability.error,
        conflictDate: availability.conflictDate
      });
      return;
    }

    const userComment = req.body.description as string;

    // Persist appointments locally first (Pending status)
    const { seriesId, appointmentIds } = await persistAppointments({
      userId,
      eventId,
      instances,
      eventDoc,
      attendeeName: req.body.attendeeName,
      attendeeEmail: req.body.attendeeEmail,
      userComment,
      // no googleId/caldavUid initially
    });

    // Trigger async sync for each appointment (or at least the first one/series master)
    // Note: If it's a series, our simple syncService might treat each as individual if we just loop.
    // However, constructGoogleEvent creates a single event with recurrence rule. 
    // The current architecture creates N appointments in DB for the instances.
    // We should probably only sync the first one if it is a recurring series?

    // In strict recurrence mode (google calendar recurrence), we only push the start event.
    // persistAppointments returns appointmentIds.

    if (appointmentIds.length > 0) {
      // Only sync the first appointment (the master or the single event)
      // If it's a recurring event, the Google/CalDAV logic uses the recurrence rule on the first event.
      syncAppointment(appointmentIds[0]).catch(err => {
        logger.error(`Async sync failed for appointment ${appointmentIds[0]}`, err);
      });
    }

    res.status(201).json({
      success: true,
      instancesCreated: instances.length,
      seriesId: seriesId,
      message: "Appointment booked successfully. Syncing to calendar in background."
    });

  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
}

async function fetchEventAndUser(eventId: string) {
  const eventDoc = await EventModel.findById(eventId).exec();
  if (!eventDoc) return { error: "Event not found" };

  const user = await UserModel.findOne({ _id: { $eq: eventDoc.user } }).exec();
  if (!user) return { error: "User not found" };

  return { eventDoc, user };
}

async function validateAvailability(eventDoc: EventDocument, userId: string, instances: Date[], starttime: Date): Promise<{ available: boolean, error?: string, conflictDate?: Date }> {
  // For recurring events, validate ALL slots are available
  if (eventDoc.recurrence?.enabled && instances.length > 1) {
    const validation = await validateAllSlotsAvailable(eventDoc, userId, instances);
    if (!validation.available) {
      const conflictDateStr = validation.conflictDate?.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      return {
        available: false,
        error: `This recurring series is not available. Slot on ${conflictDateStr} is already booked.`,
        conflictDate: validation.conflictDate
      };
    }
  } else {
    // Single event - check just the first slot
    const endtime = addMinutes(starttime, eventDoc.duration);
    const free = await checkFree(eventDoc as unknown as Event, userId, starttime, endtime);
    if (!free) {
      return { available: false, error: "requested slot not available" };
    }
  }
  return { available: true };
}

interface PersistAppointmentsParams {
  userId: string;
  eventId: string;
  instances: Date[];
  eventDoc: EventDocument;
  attendeeName: string;
  attendeeEmail: string;
  userComment: string;
  googleId?: string | null;
  caldavUid?: string | null;
}

async function persistAppointments(params: PersistAppointmentsParams) {
  const {
    userId,
    eventId,
    instances,
    eventDoc,
    attendeeName,
    attendeeEmail,
    userComment,
    googleId,
    caldavUid
  } = params;

  const seriesId = instances.length > 1 ? crypto.randomUUID() : undefined;
  const appointmentIds: string[] = [];

  for (let i = 0; i < instances.length; i++) {
    const instanceStart = instances[i];
    const instanceEnd = addMinutes(instanceStart, eventDoc.duration);

    const appointment = new AppointmentModel({
      user: userId,
      event: eventId,
      start: instanceStart,
      end: instanceEnd,
      attendeeName: attendeeName,
      attendeeEmail: attendeeEmail,
      description: userComment,
      location: eventDoc.location,
      googleId: i === 0 ? googleId : undefined,  // Only first instance gets googleId (it's a recurring event)
      caldavUid: i === 0 ? caldavUid : undefined,
      seriesId: seriesId,
      isRecurring: instances.length > 1,
      recurrenceIndex: i,
      status: 'pending' // Default to pending
    });
    const saved = await appointment.save();
    appointmentIds.push(saved._id.toString());
  }

  return { seriesId, appointmentIds };
}
