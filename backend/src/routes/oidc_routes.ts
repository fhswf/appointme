import { Router } from "express";
import { getAuthUrl, oidcLoginController } from "../controller/oidc_controller.js";

export const oidcRouter = Router();

oidcRouter.get("/config", (req, res) => {
    res.json({
        enabled: !!(process.env.OIDC_ISSUER && process.env.OIDC_CLIENT_ID)
    });
});

oidcRouter.get("/url", getAuthUrl);
oidcRouter.post("/login", oidcLoginController);
