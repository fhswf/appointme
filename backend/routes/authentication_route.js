/** Express router providing authentication related routes
 * @module routers/auth
 */

import { Router } from "express";
export const authenticationRouter = Router();

import { registerController, activationController, loginController, googleLoginController } from "../controller/authentication_controller.js";

import { validateRegister, validateLogin } from "../handlers/validation.js";

/**
 * Route to register a new user.
 * @name post/register
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @access public
 */
authenticationRouter.post("/register", validateRegister, registerController);

/**
 * Route to login a user.
 * @name post/login
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @access public
 */
authenticationRouter.post("/login", validateLogin, loginController);

/**
 * Route persist a new user into the DB.
 * @name post/activate
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @access public
 */
authenticationRouter.post("/activate", activationController);

/**
 * Route to login a user. When the user does not exist we create one.
 * @name post/google_oauth2_oidc
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @access public
 */
authenticationRouter.post("/google_oauth2_oidc", googleLoginController);

export default authenticationRouter;
