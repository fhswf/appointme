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
 *             properties:
 *               name:
 *                 type: string
 *                 description: User full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               url:
 *                 type: string
 *                 description: User URL slug
 *               locale:
 *                 type: string
 *                 description: User preferred locale
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
 */
userRouter.put("/me", userRateLimiter, requireAuth, updateUser);

export default userRouter;

