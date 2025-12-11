import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getAuthUrl, oidcLoginController } from "../controller/oidc_controller.js";

export const oidcRouter = Router();

// Rate limit for /url endpoint: max 100 requests per 15 min per IP
const oidcUrlRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

// Rate limit: max 5 login attempts per minute per IP
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    message: "Too many login attempts from this IP, please try again after a minute"
});

/**
 * @openapi
 * /api/v1/oidc/config:
 *   get:
 *     summary: Get OIDC configuration
 *     description: Check if OIDC authentication is enabled
 *     tags:
 *       - OIDC
 *     responses:
 *       200:
 *         description: OIDC configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enabled:
 *                   type: boolean
 *                   description: Whether OIDC authentication is enabled
 */
oidcRouter.get("/config", (req, res) => {
    res.json({
        enabled: !!(process.env.OIDC_ISSUER && process.env.OIDC_CLIENT_ID)
    });
});

/**
 * @openapi
 * /api/v1/oidc/url:
 *   get:
 *     summary: Get OIDC authorization URL
 *     description: Generate an OIDC authorization URL for authentication
 *     tags:
 *       - OIDC
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
 *                   description: OIDC authorization URL
 *       500:
 *         description: OIDC not configured
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
oidcRouter.get("/url", oidcUrlRateLimiter, getAuthUrl);

/**
 * @openapi
 * /api/v1/oidc/login:
 *   post:
 *     summary: OIDC login
 *     description: Authenticate user using OIDC authorization code
 *     tags:
 *       - OIDC
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
 *                 description: OIDC authorization code
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
oidcRouter.post("/login", loginLimiter, oidcLoginController);

export default oidcRouter;
