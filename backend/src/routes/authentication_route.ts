/** Express router providing authentication related routes
 * @module routers/auth
 */

import { Router } from "express";
export const authenticationRouter = Router();

import { registerController, activationController, loginController, googleLoginController, getConfig } from "../controller/authentication_controller.js";

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
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *               name:
 *                 type: string
 *                 description: User full name
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authenticationRouter.post("/register", validateRegister, registerController);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
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
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authenticationRouter.post("/login", validateLogin, loginController);

/**
 * @openapi
 * /api/v1/auth/activate:
 *   post:
 *     summary: Activate user account
 *     description: Persist a new user into the database after email verification
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Activation token from email
 *     responses:
 *       200:
 *         description: Account activated successfully
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authenticationRouter.post("/activate", activationController);

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

