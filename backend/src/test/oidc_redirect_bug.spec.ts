import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { init } from "../server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Mock dependencies
vi.mock("csrf-csrf", () => {
    return {
        doubleCsrf: () => ({
            doubleCsrfProtection: (req, res, next) => next(),
            generateCsrfToken: () => "mock_csrf_token"
        })
    };
});

vi.mock("jose", () => {
    return {
        createRemoteJWKSet: vi.fn(),
        jwtVerify: vi.fn().mockResolvedValue({
            payload: {
                sub: "lti_user_123",
                email: "test@example.com",
                "https://purl.imsglobal.org/spec/lti/claim/roles": [],
                "https://purl.imsglobal.org/spec/lti/claim/target_link_uri": "/", // Target link URI is just slash
            }
        })
    };
});

describe("OIDC Redirect Bug Reproduction", () => {
    let app: any;
    let originalBaseUrl: string | undefined;

    beforeAll(async () => {
        originalBaseUrl = process.env.BASE_URL;
        process.env.BASE_URL = "/"; // Simulate BASE_URL being just a slash
        process.env.JWT_SECRET = "test_secret";
        process.env.OIDC_ISSUER = "https://issuer.com";
        process.env.OIDC_CLIENT_ID = "client_id";
        process.env.LTI_ISSUER = "https://issuer.com"; // Trigger LTI logic
        process.env.LTI_CLIENT_ID = "client_id";
        process.env.LTI_JWKS_URI = "https://issuer.com/jwks";

        app = init(0);

        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/appointme-test");
    }, 30000);

    afterAll(async () => {
        process.env.BASE_URL = originalBaseUrl;
        await mongoose.disconnect();
        if (app) app.close();
    });

    it("should redirect to / even if BASE_URL is /", async () => {
        const res = await request(app)
            .post("/api/v1/oidc/login")
            .send({
                id_token: "mock_id_token" // Triggers LTI flow
            });

        // Current buggy behavior: returns 200 JSON because redirectUrl becomes ""
        // Expected behavior: returns 302 redirect to "/"
        if (res.status === 200) {
            console.log("Bug reproduced: Server returned 200 OK (JSON) instead of Redirect");
        }

        expect(res.status).toBe(302);
        expect(res.header.location).toBe("/");
    });
});
