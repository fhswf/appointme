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
 * Route to delete an access token from a given user
 * @name delete/revoke
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
googleRouter.delete("/revoke", limiter, middleware.requireAuth, revokeScopes);

/**
 * Route to generate an URL to connect the google cal api
 * @name get/generateUrl
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
googleRouter.get("/generateUrl", limiter, middleware.requireAuth, generateAuthUrl);

googleRouter.get("/calendarList", limiter, middleware.requireAuth, getCalendarList);

/**
 * Callback function - Set in google developer console
 * @name get/oauthcallback
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
googleRouter.get("/oauthcallback", limiter, googleCallback);


export default googleRouter;
