
import "./config/env.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import { dataBaseConn } from "./config/dbConn.js";

//Load routes
import { authenticationRouter } from "./routes/authentication_route.js";
import { eventRouter } from "./routes/event_routes.js";
import { googleRouter } from "./routes/google_routes.js";
import { userRouter } from "./routes/user_routes.js";
import { caldavRouter } from "./routes/caldav_routes.js";
import { oidcRouter } from "./routes/oidc_routes.js";

// Swagger documentation
import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";
import { swaggerSpec } from "./config/swagger.js";

// logger
import { logger } from "./logging.js";

logger.info("NODE_ENV: %s", process.env.NODE_ENV);
logger.info("BASE_URL: %s", process.env.BASE_URL);
logger.info("MONGO_URI: %s", process.env.MONGO_URI);
logger.info("CLIENT_ID: %s", process.env.CLIENT_ID);

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);


const {
  doubleCsrfProtection,
  generateCsrfToken
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "default_csrf_secret",
  cookieName: "x-csrf-token",
  cookieOptions: {
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
  size: 64,
  // Only safe, idempotent methods are ignored; all state-changing methods
  // (e.g., POST, PUT, PATCH, DELETE) are protected by default.
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
  getSessionIdentifier: (req) => req.cookies['access_token'] || req.cookies['lti_token'] || "",
});

// Helper: a request is considered "authenticated" if it carries either of the
// cookies used for identifying a user session.
const isAuthenticatedRequest = (req: express.Request): boolean => {
  return !!(req.cookies['access_token'] || req.cookies['lti_token']);
};

const csrfProtection: express.RequestHandler = (req, res, next) => {
  // For POST requests, selectively allow certain unauthenticated endpoints
  if (req.method === 'POST') {
    // OIDC init/login endpoints are handled via their own protocol flows and
    // must not rely on cookie-based authentication.
    if (req.path === '/api/v1/oidc/init' || req.path === '/api/v1/oidc/login' || req.path.startsWith('/api/v1/cron/')) {
      return next();
    }
    // Public booking endpoint /api/v1/event/:id/slot:
    // - If the request is anonymous (no access_token and no lti_token), allow it without CSRF.
    // - If an access_token or lti_token cookie is present (authenticated flow), require CSRF.
    const bookingPathRegex = /^\/api\/v1\/event\/[^/]+\/slot$/;
    if (bookingPathRegex.test(req.path) && !isAuthenticatedRequest(req)) {
      return next();
    }
  }
  // All other requests (including all authenticated, state-changing ones)
  // are protected by the doubleCsrf middleware.
  return doubleCsrfProtection(req, res, next);
};

app.use(cookieParser(process.env.CSRF_SECRET));
app.use(csrfProtection);


const ORIGINS = [process.env.BASE_URL, "https://appointme.gawron.cloud"];
if (process.env.NODE_ENV === "development") {
  ORIGINS.push("http://localhost:5173");
}
if (process.env.CORS_ALLOWED_ORIGINS) {
  for (const origin of process.env.CORS_ALLOWED_ORIGINS.split(",")) {
    ORIGINS.push(origin.trim());
  }
}

logger.info("enabling CORS for %j", ORIGINS);
app.use(
  cors({
    origin: ORIGINS,
    credentials: true,
  })
);



//Connecting to the database
if (process.env.NODE_ENV !== "test") {
  dataBaseConn();
}

//Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @openapi
 * /api/v1/csrf-token:
 *   get:
 *     summary: Get CSRF token
 *     description: Retrieve a CSRF token for state-changing operations
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: CSRF token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 csrfToken:
 *                   type: string
 *                   description: CSRF token to include in request headers
 */
app.get("/api/v1/csrf-token", (req, res) => {
  const csrfToken = generateCsrfToken(req, res);
  res.json({ csrfToken });
});

// Swagger UI - must be before CSRF protection
app.use('/api/docs', swaggerUi.serve as any, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Appoint Me API Documentation'
}) as any);



//Use routes
const router = express.Router();
router.use("/auth/", authenticationRouter);
router.use("/event/", eventRouter);
router.use("/google/", googleRouter);
router.use("/user/", userRouter);
router.use("/caldav/", caldavRouter);
router.use("/oidc/", oidcRouter);

import { validateGoogleTokens, reconcileAppointments } from "./controller/cron_controller.js";

const cronLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/cron/validate-tokens", cronLimiter, validateGoogleTokens);
router.post("/cron/reconcile", cronLimiter, reconcileAppointments);

router.get("/ping", (req, res) => {
  res.status(200).send("OK")
})

app.get("/healthz", async (req, res) => {
  //@todo: check database connection!
  res.status(200).send("OK")
});


app.use("/api/v1", router);

// Sentry error handler must be before any other error middleware and after all controllers
import * as Sentry from "@sentry/node";
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

const PORT = process.env.PORT || 5000;

export const init = (port?: number) => {
  const p = port ?? (Number(process.env.PORT) || 5000);
  const server = app.listen(p, () => {
    logger.info(`Server running on Port ${p}`);
  });
  return server;
}

import * as url from 'node:url';

if (import.meta.url.startsWith('file:')) { // (A)
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) { // (B)
    init()
  }
}
