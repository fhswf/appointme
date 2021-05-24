/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @module event_controller
 */
import { EventDocument, EventModel } from "../models/Event";
import { Day, Event, IntervalSet, Slot } from "@fhswf/bookme-common";
import { freeBusy } from "./google_controller";
import { validationResult } from "express-validator";
import { errorHandler } from "../handlers/errorhandler";
import { addMinutes, parseISO, parse } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Request, Response } from "express";

//const DAYS = [Day.SUN, Day.MON, Day.TUE, Day.WED, Day.THU, Day.FRI, Day.SAT,]

/**
 * Middleware to get available times for one weekday of a given user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getAvailableTimesForDay = (req: Request, res: Response): void => {
  console.log('getAvailableTimesForDay: %s', req.query.day);

  const timeMin = new Date(<string>req.query.timeMin);
  const timeMax = new Date(<string>req.query.timeMax);
  const url = <string>req.query.url;
  const userid = <string>req.query.userid;
  const query = EventModel.findOne({ url: url, user: userid }).select(
    `available bufferbefore bufferafter -_id`
  );
  void query.exec()
    .then(event => {
      console.log("Event: %o; timeMin: %s, timeMax: %s", event, timeMin, timeMax);
      try {
        freeBusy(userid, timeMin.toISOString(), timeMax.toISOString(), event)
          .then(res => {
            let freeSlots = new IntervalSet(timeMin, timeMax, event.available, "Europe/Berlin");
            for (const key in res.data.calendars) {
              const calIntervals = new IntervalSet();
              let current = timeMin;
              for (const busy of res.data.calendars[key].busy) {
                console.log('freeBusy: %o %o %d %d', busy.start, busy.end, event.bufferbefore, event.bufferafter);
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
            console.log('freeBusy: %j', freeSlots);
            return freeSlots;
          })
          .catch(err => {
            console.log('freebusy failed: %o', err);
            throw err;
          })
          .then(slots => {
            res.status(200).json(slots);
          })
          .catch(err => {
            console.log('freeBusy failed: %o', err);
            res.status(400).json({ error: <unknown>err });
          });
      }
      catch (err) {
        console.exception("Exception in getAvailableTimesForDay: %o", err);
        res.status(400).json({ erorr: err });
      }
    })
    .catch((err) => { res.status(400).json({ erorr: err }); });
}



/**
 * Middleware to create a new event
 * @function
 * @param {request} req
 * @param {response} res
 */
export const addEventController = (req: Request, res: Response): void => {
  const userid = req.user_id;
  const errors = validationResult(req);
  console.log('errors: %j', errors);

  const event: Event = req.body;
  console.log('event: %j', event)

  if (!errors.isEmpty()) {
    const newError = errors.array().map(error => error.msg)[0];
    res.status(422).json({ error: newError });
  } else {
    const eventToSave = new EventModel(event);

    void eventToSave.save()
      .then((doc: EventDocument) => {
        res.status(201).json({
          success: true,
          message: doc,
          msg: "Successfully saved event!",
        })
      })
      .catch((err: any) => {
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
  void EventModel.findByIdAndDelete(eventid)
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
  const userid = req.user_id;
  const query = EventModel.find({ user: userid });
  void query.exec()
    .then(event => {
      res.status(200).json(event);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to fetch all active events of an given user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getActiveEventsController = (req: Request, res: Response): void => {
  const userid = <string>req.query.user;
  const query = EventModel.find({ user: userid, isActive: true });

  void query.exec(function (err, event) {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      res.status(200).json(event);
    }
  });
};

/**
 * Middleware to get an event by id
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getEventByIdController = (req: Request, res: Response): void => {
  const event_id = req.params.id;
  const query = EventModel.findById({ _id: event_id });
  void query.exec()
    .then(event => {
      console.log("getEvent: %s %o", event_id, event);
      res.status(200).json(event);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to get an event by the url
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getEventByUrl = (req: Request, res: Response): void => {
  const userid = <string>req.query.user;
  const url = <string>req.query.url;

  const query = EventModel.findOne({ url: url, user: userid });
  void query.exec(function (err, event) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json(event);
    }
  });
};

/**
 * Middleware to update an event
 * @function
 * @param {request} req
 * @param {response} res
 */
export const updateEventController = (req: Request, res: Response): void => {
  const event = req.body.data;
  const event_id = req.params.id;
  void EventModel.findByIdAndUpdate(event_id, event)
    .then((doc: EventDocument) => {
      res.status(200).json({ msg: "Update successful", event: doc })
    })
    .catch((err: any) => {
      res.status(400).json({ error: err });
    });

};
