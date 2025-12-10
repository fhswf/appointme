import { Router } from "express";
import rateLimit from "express-rate-limit";
import { middleware } from "../handlers/middleware.js";
import { addAccount, removeAccount, listAccounts, listCalendars } from "../controller/caldav_controller.js";

export const caldavRouter = Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
});

/**
 * @openapi
 * /api/v1/caldav/account:
 *   post:
 *     summary: Add CalDAV account
 *     description: Add a new CalDAV calendar account for the current user
 *     tags:
 *       - CalDAV
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
 *               - serverUrl
 *               - username
 *               - password
 *             properties:
 *               serverUrl:
 *                 type: string
 *                 description: CalDAV server URL
 *                 example: "https://caldav.example.com"
 *               username:
 *                 type: string
 *                 description: CalDAV username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: CalDAV password
 *               name:
 *                 type: string
 *                 description: Optional display name for the account
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Optional email associated with the account
 *     responses:
 *       200:
 *         description: Account added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid input data or failed to connect to CalDAV server
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
caldavRouter.post("/account", limiter, middleware.requireAuth, addAccount);

/**
 * @openapi
 * /api/v1/caldav/account/{id}:
 *   delete:
 *     summary: Remove CalDAV account
 *     description: Remove a CalDAV account by ID
 *     tags:
 *       - CalDAV
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: CalDAV account ID
 *     responses:
 *       200:
 *         description: Account removed successfully
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
caldavRouter.delete("/account/:id", limiter, middleware.requireAuth, removeAccount);

/**
 * @openapi
 * /api/v1/caldav/account:
 *   get:
 *     summary: List CalDAV accounts
 *     description: Get all CalDAV accounts for the current user
 *     tags:
 *       - CalDAV
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: Accounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarAccount'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
caldavRouter.get("/account", limiter, middleware.requireAuth, listAccounts);

/**
 * @openapi
 * /api/v1/caldav/account/{id}/calendars:
 *   get:
 *     summary: List calendars for CalDAV account
 *     description: Get all calendars available in a specific CalDAV account
 *     tags:
 *       - CalDAV
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: CalDAV account ID
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
 *                   url:
 *                     type: string
 *                     description: Calendar URL
 *                   displayName:
 *                     type: string
 *                     description: Calendar display name
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
caldavRouter.get("/account/:id/calendars", limiter, middleware.requireAuth, listCalendars);

export default caldavRouter;

