/**
 * @module router/google
 */
import { Router } from "express";
import rateLimit from "express-rate-limit";

export const googleRouter = Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

import { generateAuthUrl, googleCallback, revokeScopes, getCalendarList } from "../controller/google_controller.js";

import { middleware } from "../handlers/middleware.js";


/**
 * @openapi
 * /api/v1/google/revoke:
 *   delete:
 *     summary: Revoke Google Calendar access
 *     description: Delete the Google Calendar access token for the current user
 *     tags:
 *       - Google
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: Access revoked successfully
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
googleRouter.delete("/revoke", limiter, middleware.requireAuth, revokeScopes);

/**
 * @openapi
 * /api/v1/google/generateUrl:
 *   get:
 *     summary: Generate Google OAuth URL
 *     description: Generate an authorization URL to connect Google Calendar API
 *     tags:
 *       - Google
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: Authorization URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Google OAuth authorization URL
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
googleRouter.get("/generateUrl", limiter, middleware.requireAuth, generateAuthUrl);

/**
 * @openapi
 * /api/v1/google/calendarList:
 *   get:
 *     summary: Get Google calendars
 *     description: Retrieve list of Google calendars for the authenticated user
 *     tags:
 *       - Google
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: Calendar list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 calendars:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Calendar ID
 *                       summary:
 *                         type: string
 *                         description: Calendar name
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
googleRouter.get("/calendarList", limiter, middleware.requireAuth, getCalendarList);

/**
 * @openapi
 * /api/v1/google/oauthcallback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Callback endpoint for Google OAuth flow (set in Google Developer Console)
 *     tags:
 *       - Google
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       302:
 *         description: Redirect to client application
 *       400:
 *         description: Invalid authorization code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
googleRouter.get("/oauthcallback", limiter, googleCallback);



export default googleRouter;

