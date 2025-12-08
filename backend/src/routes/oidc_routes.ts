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

oidcRouter.get("/config", (req, res) => {
    res.json({
        enabled: !!(process.env.OIDC_ISSUER && process.env.OIDC_CLIENT_ID)
    });
});

oidcRouter.get("/url", oidcUrlRateLimiter, getAuthUrl);
oidcRouter.post("/login", loginLimiter, oidcLoginController);
