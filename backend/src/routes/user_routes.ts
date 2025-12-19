/**
 * @module router/user
 */
import { Router } from "express";
import { middleware } from "../handlers/middleware.js";
import { userRateLimiter } from "../config/rateLimit.js";
import { getUserByUrl, updateUser, getUser, getAppointments } from "../controller/user_controller.js";

const { requireAuth } = middleware;

export const userRouter = Router();



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
userRouter.get("/me", userRateLimiter, requireAuth, getUser);

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


