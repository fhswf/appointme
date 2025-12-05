import { Router } from "express";
import rateLimit from "express-rate-limit";
import { middleware } from "../handlers/middleware.js";
import { addAccount, removeAccount, listAccounts, listCalendars } from "../controller/caldav_controller.js";

export const caldavRouter = Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

caldavRouter.post("/account", limiter, middleware.requireAuth, addAccount);
caldavRouter.delete("/account/:id", limiter, middleware.requireAuth, removeAccount);
caldavRouter.get("/account", limiter, middleware.requireAuth, listAccounts);
caldavRouter.get("/account/:id/calendars", limiter, middleware.requireAuth, listCalendars);

export default caldavRouter;
