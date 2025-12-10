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
  getEventByUrlController,
  getAvailableTimes,
  insertEvent
} from "../controller/event_controller.js";

import { middleware } from "../handlers/middleware.js";

export const eventRouter = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

/**
 * @openapi
 * /api/v1/event/:
 *   post:
 *     summary: Create a new event
 *     description: Add a new event for the authenticated user
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *                 description: Event title
 *               description:
 *                 type: string
 *                 description: Event description
 *               duration:
 *                 type: number
 *                 description: Event duration in minutes
 *               url:
 *                 type: string
 *                 description: Event URL slug
 *               active:
 *                 type: boolean
 *                 description: Whether the event is active
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
eventRouter.post("/", limiter, middleware.requireAuth, addEventController);
eventRouter.post("/addEvent", limiter, middleware.requireAuth, addEventController);

/**
 * @openapi
 * /api/v1/event/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event by ID
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
eventRouter.delete("/:id", limiter, middleware.requireAuth, deleteEventController);

/**
 * @openapi
 * /api/v1/event/{id}:
 *   put:
 *     summary: Update an event
 *     description: Update an existing event by ID
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Event title
 *               description:
 *                 type: string
 *                 description: Event description
 *               duration:
 *                 type: number
 *                 description: Event duration in minutes
 *               url:
 *                 type: string
 *                 description: Event URL slug
 *               active:
 *                 type: boolean
 *                 description: Whether the event is active
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
eventRouter.put("/:id", limiter, middleware.requireAuth, updateEventController);

/**
 * @openapi
 * /api/v1/event/:
 *   get:
 *     summary: Get all user events
 *     description: Fetch all events for the authenticated user
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
eventRouter.get("/", limiter, middleware.requireAuth, getEventListController);

/**
 * @openapi
 * /api/v1/event/{id}:
 *   get:
 *     summary: Get event by ID
 *     description: Fetch a specific event by its ID
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
eventRouter.get("/:id", limiter, middleware.requireAuth, getEventByIdController);

/**
 * @openapi
 * /api/v1/event/active/{userId}:
 *   get:
 *     summary: Get active events for user
 *     description: Fetch all active (public) events for a specific user
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Active events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
eventRouter.get("/active/:userId", limiter, getActiveEventsController);

/**
 * @openapi
 * /api/v1/event/{id}/slot:
 *   get:
 *     summary: Get available time slots
 *     description: Retrieve available time slots for booking an event
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for availability check
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for availability check
 *     responses:
 *       200:
 *         description: Available slots retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date-time
 *                         description: Slot start time
 *                       end:
 *                         type: string
 *                         format: date-time
 *                         description: Slot end time
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
eventRouter.get("/:id/slot", getAvailableTimes);

/**
 * @openapi
 * /api/v1/event/{userId}/{eventUrl}:
 *   get:
 *     summary: Get event by URL
 *     description: Fetch a public event by user ID and event URL slug
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: eventUrl
 *         required: true
 *         schema:
 *           type: string
 *         description: Event URL slug
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
eventRouter.get("/:userId/:eventUrl", getEventByUrlController);

/**
 * @openapi
 * /api/v1/event/{id}/slot:
 *   post:
 *     summary: Book a time slot
 *     description: Book an appointment in the specified time slot (no CSRF protection for public booking)
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start
 *               - end
 *               - attendeeName
 *               - attendeeEmail
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *                 description: Appointment start time
 *               end:
 *                 type: string
 *                 format: date-time
 *                 description: Appointment end time
 *               attendeeName:
 *                 type: string
 *                 description: Attendee name
 *               attendeeEmail:
 *                 type: string
 *                 format: email
 *                 description: Attendee email address
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 appointmentId:
 *                   type: string
 *                   description: Created appointment ID
 *       400:
 *         description: Invalid input or slot not available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
eventRouter.post("/:id/slot", limiter, insertEvent);

export default eventRouter;

