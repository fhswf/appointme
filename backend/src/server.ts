import "./config/env.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
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
import { swaggerSpec } from "./config/swagger.js";

// logger
import { logger } from "./logging.js";

logger.info("NODE_ENV: %s", process.env.NODE_ENV);
logger.info("CLIENT_URL: %s", process.env.CLIENT_URL);
logger.info("MONGO_URI: %s", process.env.MONGO_URI);
logger.info("CLIENT_ID: %s", process.env.CLIENT_ID);

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const ORIGINS = [process.env.CLIENT_URL, "https://appointme.gawron.cloud"];
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

app.use(cookieParser(process.env.CSRF_SECRET));

//Connecting to the database
dataBaseConn();

//Bodyparser
app.use(bodyParser.json());

import { doubleCsrf } from "csrf-csrf";

const {
  doubleCsrfProtection,
  generateCsrfToken
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "Secret",
  cookieName: "x-csrf-token",
  cookieOptions: {
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
  getSessionIdentifier: (req) => req.cookies['access_token'] || "",
});

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

const csrfProtection = (req, res, next) => {
  // Exclude POST /api/v1/events/:id/slot from CSRF protection
  if (req.method === 'POST' && /^\/api\/v1\/event\/[^/]+\/slot$/.test(req.path)) {
    next();
  } else {
    doubleCsrfProtection(req, res, next);
  }
};

app.use(csrfProtection);

//Use routes
const router = express.Router();
router.use("/auth/", authenticationRouter);
router.use("/event/", eventRouter);
router.use("/google/", googleRouter);
router.use("/user/", userRouter);
router.use("/caldav/", caldavRouter);
router.use("/oidc/", oidcRouter);
router.get("/ping", (req, res) => {
  res.status(200).send("OK")
})

app.get("/healthz", async (req, res) => {
  //@todo: check database connection!
  res.status(200).send("OK")
});

app.use("/api/v1", router);

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
