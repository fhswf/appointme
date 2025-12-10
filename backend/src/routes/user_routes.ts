/**
 * @module router/user
 */
import { Router } from "express";
import { middleware } from "../handlers/middleware.js";
import { userRateLimiter } from "../config/rateLimit.js";
import { getUserByUrl, updateUser, getUser } from "../controller/user_controller.js";

const { requireAuth } = middleware;

export const userRouter = Router();


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
userRouter.get("/:url", userRateLimiter, getUserByUrl);

/**
 * Update the currently logged in user
 */
userRouter.put("/", userRateLimiter, requireAuth, updateUser);

export default userRouter;
