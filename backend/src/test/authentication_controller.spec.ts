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

const OAuth2ClientMock = vi.fn().mockImplementation(function () {
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
        }),
        getToken: vi.fn().mockResolvedValue({
            tokens: {
                id_token: "mock_id_token"
            }
        })
    });
});

vi.mock("google-auth-library", () => {
    return {
        OAuth2Client: OAuth2ClientMock
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

vi.mock("../services/user_service.js", () => ({
    createUserWithUniqueUrl: vi.fn(),
    validateUrl: vi.fn(),
}));

import { createUserWithUniqueUrl } from "../services/user_service.js";

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
        process.env.BASE_URL = "http://localhost:3000";

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
        it("should login existing user successfully (update picture)", async () => {
            await getCsrfToken();

            // Mock finding existing user
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(USER)
            });

            // Mock updating existing user
            (UserModel.findOneAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    ...USER,
                    picture_url: "http://example.com/pic.jpg"
                })
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
            // Verify findOne was called
            expect(UserModel.findOne).toHaveBeenCalled();
            // Verify findOneAndUpdate was called (existing user path)
            expect(UserModel.findOneAndUpdate).toHaveBeenCalled();
            // Verify createUserWithUniqueUrl was NOT called
            expect(createUserWithUniqueUrl).not.toHaveBeenCalled();
        });

        it("should create new user successfully using service", async () => {
            await getCsrfToken();
            vi.clearAllMocks();

            // Mock NOT finding existing user
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            // Mock service response
            (createUserWithUniqueUrl as any).mockResolvedValue(USER);

            const res = await request(app)
                .post("/api/v1/auth/google_oauth2_code")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    code: "google_auth_code"
                });

            expect(res.status).toEqual(200);
            expect(res.body.user).toBeDefined();

            // Verify findOne was called
            expect(UserModel.findOne).toHaveBeenCalled();
            // Verify service was called
            expect(createUserWithUniqueUrl).toHaveBeenCalledWith(
                "google_id_123",
                "google@example.com",
                "Google User",
                "http://example.com/pic.jpg"
            );
        });

        it("should handle user creation/update failure", async () => {
            await getCsrfToken();

            // Mock NOT finding existing user
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            // Mock service failure (return null)
            (createUserWithUniqueUrl as any).mockResolvedValue(null);

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

