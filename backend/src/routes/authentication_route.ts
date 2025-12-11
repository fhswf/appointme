/** Express router providing authentication related routes
 * @module routers/auth
 */

import { Router } from "express";
export const authenticationRouter = Router();

import { loginController, googleLoginController, getConfig } from "../controller/authentication_controller.js";

import { validateRegister, validateLogin } from "../handlers/validation.js";


/**
 * @openapi
 * /api/v1/auth/config:
 *   get:
 *     summary: Get authentication configuration
 *     description: Retrieve authentication configuration including available auth methods
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Authentication configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 googleEnabled:
 *                   type: boolean
 *                   description: Whether Google authentication is enabled
 *                 oidcEnabled:
 *                   type: boolean
 *                   description: Whether OIDC authentication is enabled
 */
authenticationRouter.get("/config", getConfig);

/**
 * @openapi
 * /api/v1/auth/google_oauth2_code:
 *   post:
 *     summary: Google OAuth2 login
 *     description: Authenticate or create a user using Google OAuth2 authorization code
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Google OAuth2 authorization code
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authenticationRouter.post("/google_oauth2_code", googleLoginController);

export default authenticationRouter;

