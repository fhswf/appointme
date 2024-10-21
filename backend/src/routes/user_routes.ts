/**
 * @module router/user
 */
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getUser, getUserByUrl, putUser } from "../controller/user_controller.js";

import { middleware } from "../handlers/middleware.js";

export const userRouter = Router();

const userRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});


/**
 * Route to fetch a the currently logged in user
 * @name get/getUser
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
userRouter.get("/user", middleware.requireAuth, getUser);

/**
 * Route to fetch a user by a given url
 * @name get/findUserByUrl
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
userRouter.get("/user/:url", userRateLimiter, getUserByUrl);

/**
 * Update the currently logged in user
 */
userRouter.put("/user", middleware.requireAuth, putUser);

export default userRouter;
