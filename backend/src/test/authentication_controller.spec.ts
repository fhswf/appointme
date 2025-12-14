import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import request from "supertest";
import { USER } from './USER.js';
import jsonwebtoken from "jsonwebtoken";
import { UserModel } from "../models/User.js";

// Mock dependencies
vi.mock("nodemailer", () => {
    return {
        createTransport: vi.fn(() => ({
            sendMail: vi.fn((mailOptions, callback) => {
                console.log("mocked sendMail");
                callback(null, "Email sent");
            })
        }))
    }
});

vi.mock("google-auth-library", () => {
    return {
        OAuth2Client: vi.fn().mockImplementation(function () {
            return ({
                verifyIdToken: vi.fn().mockResolvedValue({
                    getAttributes: () => ({
                        payload: {
                            email_verified: true,
                            name: "Google User",
                            email: "google@example.com",
                            picture: "http://example.com/pic.jpg",
                            sub: "google_id_123"
                        }
                    })
                })
            });
        })
    }
});

vi.mock("../models/User.js", () => {
    const save = vi.fn().mockResolvedValue(USER);
    const UserModelMock = vi.fn().mockImplementation(function (data) {
        return ({
            ...data,
            save: save
        });
    });

    (UserModelMock as any).findOne = vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(null)
    });
    (UserModelMock as any).findById = vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(USER)
    });
    (UserModelMock as any).findOneAndUpdate = vi.fn();

    return {
        UserModel: UserModelMock,
    }
});

describe("Authentication Controller", () => {
    let app: any;
    let csrfToken: string;
    let csrfCookie: string;

    beforeAll(async () => {
        process.env.JWT_SECRET = "test_secret";
        process.env.ACCOUNT_ACTIVATION = "activation_secret";
        process.env.CLIENT_ID = "test_client_id";
        process.env.CLIENT_SECRET = "test_client_secret";
        process.env.EMAIL_FROM = "test@example.com";
        process.env.EMAIL_PASSWORD = "password";
        process.env.CLIENT_URL = "http://localhost:3000";

        // Re-import to ensure mocks are used
        const { init } = await import("../server.js");
        app = init(0);
    });

    afterAll(async () => {
        await app.close();
    });

    // Helper to get CSRF token
    const getCsrfToken = async () => {
        const res = await request(app).get("/api/v1/csrf-token");
        csrfToken = res.body.csrfToken;
        csrfCookie = res.headers["set-cookie"][0];
    };







    describe("POST /api/v1/auth/google_oauth2_code", () => {
        it("should login with google successfully", async () => {
            await getCsrfToken();
            (UserModel.findOneAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(USER)
            });

            const res = await request(app)
                .post("/api/v1/auth/google_oauth2_code")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    code: "google_auth_code"
                });

            expect(res.status).toEqual(200);
            expect(res.body.user).toBeDefined();
        });


        it("should handle user creation failure", async () => {
            await getCsrfToken();
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });
            (UserModel.findOneAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            const res = await request(app)
                .post("/api/v1/auth/google_oauth2_code")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    code: "google_auth_code"
                });

            expect(res.status).toEqual(400);
            expect(res.body.message).toContain("User signup failed");
        });
    });







    describe("GET /api/v1/auth/config", () => {
        it("should return auth configuration", async () => {
            const res = await request(app)
                .get("/api/v1/auth/config");

            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty("googleEnabled");
            expect(res.body).toHaveProperty("oidcEnabled");
        });

        it("should indicate Google is enabled when CLIENT_ID is set", async () => {
            process.env.CLIENT_ID = "test_client_id";
            process.env.DISABLE_GOOGLE_LOGIN = "false";

            const res = await request(app)
                .get("/api/v1/auth/config");

            expect(res.body.googleEnabled).toBe(true);
        });

        it("should indicate Google is disabled when DISABLE_GOOGLE_LOGIN is true", async () => {
            process.env.DISABLE_GOOGLE_LOGIN = "true";

            const res = await request(app)
                .get("/api/v1/auth/config");

            expect(res.body.googleEnabled).toBe(false);
        });
    });
});

