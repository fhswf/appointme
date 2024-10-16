/** Express router providing event related routes
 * @module routers/events
 */

import { Router } from "express";
import rateLimit from "express-rate-limit";

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
/**
 * Route to add a new event.
 * @name post/addEvent
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
*/
eventRouter.post("/event", limiter, middleware.requireAuth, addEventController);
eventRouter.post("/addEvent", limiter, middleware.requireAuth, addEventController);

/**
 * Route to delete an event
 * @name delete/deleteEvent/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.delete("/event/:id", limiter, middleware.requireAuth, deleteEventController);
eventRouter.delete("/deleteEvent/:id", limiter, middleware.requireAuth, deleteEventController);

/**
 * Route to update an Event.
 * @name update/updateEvent
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.put("/event/:id", limiter, middleware.requireAuth, updateEventController);
eventRouter.put("/updateEvent/:id", limiter, middleware.requireAuth, updateEventController);

/**
 * Route to fetch all events of the logged in user
 * @name get/getEvents
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.get("/event", limiter, middleware.requireAuth, getEventListController);
eventRouter.get("/getEvents", limiter, middleware.requireAuth, getEventListController);

/**
 * Route to fetch an event of an given eventid
 * @name get/getEvent/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
eventRouter.get("/event/:id", limiter, middleware.requireAuth, getEventByIdController);
eventRouter.get("/getEvent/:id", limiter, middleware.requireAuth, getEventByIdController);

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
