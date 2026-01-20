import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { init } from "../server";
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

// Mock Mongoose Models to avoid real DB connection
vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findOne = vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });
    (UserModelMock as any).findById = vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });
    return { UserModel: UserModelMock };
});

vi.mock("../models/Event.js", () => ({
    EventModel: vi.fn()
}));

// Mock DB Connection
vi.mock("../config/dbConn.js", () => ({
    dataBaseConn: vi.fn()
}));

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

        // No need to connect to mongoose if we mock it
        app = init(0);
    });

    afterAll(async () => {
        process.env.BASE_URL = originalBaseUrl;
        if (app) app.close();
    });

    it("should redirect to / even if BASE_URL is /", async () => {
        const res = await request(app)
            .post("/api/v1/oidc/login")
            .send({
                id_token: "mock_id_token" // Triggers LTI flow
            });

        expect(res.status).toBe(302);
        expect(res.header.location).toBe("/");
    });
});
