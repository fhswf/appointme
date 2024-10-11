/**
 * @module router/google
 */
import { Router } from "express";

export const googleRouter = Router();

import { generateAuthUrl, googleCallback, revokeScopes, insertEventToGoogleCal, getCalendarList } from "../controller/google_controller.js";

import { middleware } from "../handlers/middleware.js";

/**
 * Route to delete an access token from a given user
 * @name delete/revoke
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
googleRouter.delete("/revoke", middleware.requireAuth, revokeScopes);

/**
 * Route to generate an URL to connect the google cal api
 * @name get/generateUrl
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
googleRouter.get("/generateUrl", middleware.requireAuth, generateAuthUrl);

googleRouter.get("/calendarList", middleware.requireAuth, getCalendarList);

/**
 * Callback function - Set in google developer console
 * @name get/oauthcallback
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
googleRouter.get("/oauthcallback", googleCallback);

/**
 * Route to insert an event into the google calendar of a given user
 * @name post/insertEvent/:user_id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
googleRouter.post("/insertEvent/:user_id", insertEventToGoogleCal);

export default googleRouter;
