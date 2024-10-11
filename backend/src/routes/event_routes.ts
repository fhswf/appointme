/** Express router providing event related routes
 * @module routers/events
 */

import { Router } from "express";

import {
  addEventController,
  getEventListController,
  deleteEventController,
  getEventByIdController,
  updateEventController,
  getActiveEventsController,
  getEventByUrl,
  getAvailableTimes,
} from "../controller/event_controller.js";

import { middleware } from "../handlers/middleware.js";

export const eventRouter = Router();
/**
 * Route to add a new event.
 * @name post/addEvent
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.post("/addEvent", middleware.requireAuth, addEventController);

/**
 * Route to delete an event
 * @name delete/deleteEvent/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.delete("/deleteEvent/:id", middleware.requireAuth, deleteEventController);

/**
 * Route to update an Event.
 * @name update/updateEvent
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.put("/updateEvent/:id", middleware.requireAuth, updateEventController);

/**
 * Route to fetch all events of the logged in user
 * @name get/getEvents
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.get("/getEvents", middleware.requireAuth, getEventListController);

/**
 * Route to fetch an event of an given eventid
 * @name get/getEvent/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.get("/getEvent/:id", middleware.requireAuth, getEventByIdController);

/**
 * Route to fetch all active events of an given user
 * @name get/getActiveEvents
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.get("/getActiveEvents", getActiveEventsController);
/**
 * Route to fetch an event of an url and user
 * @name get/getEventBy
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.get("/getEventBy", getEventByUrl);
/**
 * Route to fetch available times to book this event
 * @name get/getAvailable
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.get("/getAvailable", getAvailableTimes);
