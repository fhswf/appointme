/** Express router providing event related routes
 * @module routers/events
 */

const express = require("express");
const router = express.Router();

const {
  addEventController,
  getEventListController,
  deleteEventController,
  getEventByIdController,
  updateEventController,
  getActiveEventsController,
  getEventByUrl,
  getAvailableTimesForDay,
} = require("../controller/event_controller");

const { requireAuth } = require("../handlers/middleware");

/**
 * Route to add a new event.
 * @name post/addEvent
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post("/addEvent", requireAuth, addEventController);

/**
 * Route to delete an event
 * @name delete/deleteEvent/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.delete("/deleteEvent/:id", requireAuth, deleteEventController);

/**
 * Route to update an Event.
 * @name update/updateEvent
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put("/updateEvent/:id", requireAuth, updateEventController);

/**
 * Route to fetch all events of the logged in user
 * @name get/getEvents
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/getEvents", requireAuth, getEventListController);

/**
 * Route to fetch an event of an given eventid
 * @name get/getEvent/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/getEvent/:id", requireAuth, getEventByIdController);

/**
 * Route to fetch all active events of an given user
 * @name get/getActiveEvents
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/getActiveEvents", getActiveEventsController);
/**
 * Route to fetch an event of an url and user
 * @name get/getEventBy
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/getEventBy", getEventByUrl);
/**
 * Route to fetch available times to book this event
 * @name get/getAvailable
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/getAvailable", getAvailableTimesForDay);

module.exports = router;
