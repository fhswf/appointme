/**
 * @module router/user
 */
import { Router } from "express";
import { middleware } from "../handlers/middleware.js";
import { userRateLimiter } from "../config/rateLimit.js";
import {
    getUserByUrl,
    updateUser,
    getUser,
    getTransientUser,
    getAppointments,
    getCalendars,
    getCalendarEvents,
    searchUsers
} from "../controller/user_controller.js";
import { exportSettings, importSettings } from "../controller/settings_controller.js";

const { requireAuth } = middleware;



export const userRouter = Router();

/**
 * @openapi
 * /api/v1/user/settings:
 *   get:
 *     summary: Export user settings
 *     description: Export user settings and events as a JSON file
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: Settings exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Not authenticated
 */

userRouter.get("/settings", userRateLimiter, requireAuth, exportSettings);

/**
 * @openapi
 * /api/v1/user/settings:
 *   put:
 *     summary: Import user settings
 *     description: Import user settings and events from a JSON file
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Settings imported successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 */
userRouter.put("/settings", userRateLimiter, requireAuth, importSettings);

/**
 * @openapi
 * /api/v1/user/me:
 *   get:
 *     summary: Get current user
 *     description: Retrieve the currently logged in user's profile
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get("/me", userRateLimiter, middleware.optionalAuth, getUser);

/**
 * @openapi
 * /api/v1/user/transient:
 *   get:
 *     summary: Get transient user
 *     description: Retrieve the currently logged in transient user's profile (LTI)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get("/transient", userRateLimiter, middleware.optionalAuth, getTransientUser);

/**
 * @openapi
 * /api/v1/user:
 *   get:
 *     summary: Search users
 *     description: Search for users by name or email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Users found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing query parameter
 *       401:
 *         description: Not authenticated
 */
userRouter.get("/", userRateLimiter, searchUsers);

/**
 * @openapi
 * /api/v1/user/{id}/appointment:
 *   get:
 *     summary: Get user appointments
 *     description: Retrieve all appointments for the specified user (must be authenticated user)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID or 'me'
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 */
userRouter.get("/:id/appointment", userRateLimiter, requireAuth, getAppointments);

/**
 * @openapi
 * /api/v1/user/{id}/calendar:
 *   get:
 *     summary: Get user calendars
 *     description: Retrieve all calendars (Google + CalDAV) for the specified user
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID or 'me'
 *     responses:
 *       200:
 *         description: Calendars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [google, caldav]
 *                   primary:
 *                     type: boolean
 *                   color:
 *                     type: string
 *                   accountId:
 *                     type: string
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 */
userRouter.get("/:id/calendar", userRateLimiter, requireAuth, getCalendars);

/**
 * @openapi
 * /api/v1/user/{id}/calendar/{calendarId}/event:
 *   get:
 *     summary: Get calendar events
 *     description: Retrieve events for a specific calendar (Google or CalDAV)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID or 'me'
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: string
 *         description: Calendar ID (Google calendar ID or CalDAV calendar URL)
 *       - in: query
 *         name: timeMin
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start time for events (ISO 8601)
 *       - in: query
 *         name: timeMax
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End time for events (ISO 8601)
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Calendar not found
 */
userRouter.get("/:id/calendar/:calendarId/event", userRateLimiter, requireAuth, getCalendarEvents);

/**
 * @openapi
 * /api/v1/user/{id}/calendar/{accountId}/{calendarId}/event:
 *   get:
 *     summary: Get calendar events with account ID
 *     description: Retrieve events for a specific calendar (Google or CalDAV) using explicit account ID
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID or 'me'
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID (for CalDAV) or 'google'
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: string
 *         description: Calendar ID
 *       - in: query
 *         name: timeMin
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start time for events (ISO 8601)
 *       - in: query
 *         name: timeMax
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End time for events (ISO 8601)
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Calendar or Account not found
 */
userRouter.get("/:id/calendar/:accountId/:calendarId/event", userRateLimiter, requireAuth, getCalendarEvents);

/**
 * @openapi
 * /api/v1/user/{url}:
 *   get:
 *     summary: Get user by URL
 *     description: Retrieve a user's public profile by their URL slug
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: User URL slug
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get("/:url", userRateLimiter, getUserByUrl);

/**
 * @openapi
 * /api/v1/user/me:
 *   put:
 *     summary: Update current user
 *     description: Update the currently logged in user's profile
 *     tags:
 *       - Users
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
 *               - data
 *             properties:
 *               data:
 *                 type: object
 *                 description: User data to update
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: User full name
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: User email address
 *                   user_url:
 *                     type: string
 *                     description: User URL slug
 *                   welcome:
 *                     type: string
 *                     description: Welcome message
 *                   pull_calendars:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Calendar IDs to pull events from
 *                   push_calendar:
 *                     type: string
 *                     description: Calendar ID to push events to
 *                   use_gravatar:
 *                     type: boolean
 *                     description: Whether to use Gravatar for profile picture
 *                   send_invitation_email:
 *                     type: boolean
 *                     description: Whether to send invitation emails
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *       409:
 *         description: User URL already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 field:
 *                   type: string
 */
userRouter.put("/me", userRateLimiter, requireAuth, updateUser);

export default userRouter;


