/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @module event_controller
 */
import { EventDocument, EventModel } from "../models/Event";
import { Day } from "@fhswf/bookme-common";
import { freeBusy } from "./google_controller";
import { validationResult } from "express-validator";
import { errorHandler } from "../handlers/errorhandler";
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
  const date = new Date(<string>req.query.day);
  const day = <Day>(date.getDay());
  const url = <string>req.query.url;
  const userid = <string>req.query.user;
  const query = EventModel.findOne({ url: url, user: userid }).select(
    `available bufferbefore bufferafter -_id`
  );
  void query.exec((err, event) => {
    if (err) {
      res.status(400).json({ erorr: err });
    } else {
      console.log("Event: %o; day: %o, %o", event, day, event.available[day]);
      const slot = event.available[day][0];
      let start = new Date(date);
      console.log("start: %o, %j", start, slot)
      start.setHours(Number.parseInt(slot.start.substring(0, 2)),
        Number.parseInt(slot.start.substring(3, 5)), 0);
      console.log("start: %o", start);
      start = zonedTimeToUtc(start, 'Europe/Berlin');
      let end = new Date(date);
      end.setHours(Number.parseInt(slot.end.substring(0, 2)),
        Number.parseInt(slot.end.substring(3, 5)), 0);
      end = zonedTimeToUtc(end, 'Europe/Berlin');
      console.log('TZ: %s', process.env.TZ);
      console.log("event: %j %o %s %s", event, slot, start, end);
      freeBusy(userid, start, end, event)
        .then(slots => {
          res.status(200).json(slots);
        })
        .catch(err => {
          console.log('freeBusy failed: %o', err);
          res.status(400).json({ error: <unknown>err });
        });
    }
  });
};

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
