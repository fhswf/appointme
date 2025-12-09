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

    (UserModelMock as any).findOne = vi.fn();
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

    describe("POST /api/v1/auth/register", () => {
        it("should register a new user successfully", async () => {
            await getCsrfToken();
            // Mock UserModel.findOne to return null (user does not exist)
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            const res = await request(app)
                .post("/api/v1/auth/register")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    name: "New User",
                    email: "new@example.com",
                    password: "password123"
                });

            expect(res.status).toEqual(200);
            expect(res.body.message).toContain("Email has been send");
        });

        it("should return error if email already exists", async () => {
            await getCsrfToken();
            // Mock UserModel.findOne to return a user
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(USER)
            });

            const res = await request(app)
                .post("/api/v1/auth/register")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    name: "Existing User",
                    email: "existing@example.com",
                    password: "password123"
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors).toEqual("Email already exists!");
        });

        it("should return validation error for invalid email", async () => {
            await getCsrfToken();
            const res = await request(app)
                .post("/api/v1/auth/register")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    name: "Invalid User",
                    email: "invalid-email",
                    password: "password123"
                });

            expect(res.status).toEqual(422);
        });
    });

    describe("POST /api/v1/auth/activate", () => {
        it("should activate account successfully", async () => {
            await getCsrfToken();
            const token = jsonwebtoken.sign(
                { name: "New User", email: "new@example.com" },
                process.env.ACCOUNT_ACTIVATION,
                { expiresIn: "10m" }
            );

            // Mock save success
            // The mock implementation in vi.mock above handles save

            const res = await request(app)
                .post("/api/v1/auth/activate")
                .set("Authorization", `Bearer ${token}`)
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ token });

            expect(res.status).toEqual(201);
            expect(res.body.message).toEqual("You successfully signed up!");
        });

        it("should return error for invalid token", async () => {
            await getCsrfToken();
            const res = await request(app)
                .post("/api/v1/auth/activate")
                .set("Authorization", "Bearer invalid_token")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ token: "invalid_token" });

            expect(res.status).toEqual(400);
            expect(res.body.errors).toEqual("Error! Please signup again!");
        });
    });

    describe("POST /api/v1/auth/login", () => {
        it("should login successfully", async () => {
            await getCsrfToken();
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(USER)
            });

            const res = await request(app)
                .post("/api/v1/auth/login")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    email: "test@fh-swf.de",
                    password: "password"
                });

            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty("access_token");
        });

        it("should return error if user does not exist", async () => {
            await getCsrfToken();
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            const res = await request(app)
                .post("/api/v1/auth/login")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    email: "nonexistent@example.com",
                    password: "password"
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors).toEqual("User does not exist!");
        });
    });

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

        it("should handle Google OAuth verification failure", async () => {
            await getCsrfToken();
            
            // Mock OAuth2Client to reject
            const { OAuth2Client } = await import("google-auth-library");
            const mockClient = new OAuth2Client();
            vi.mocked(mockClient.verifyIdToken).mockRejectedValueOnce(new Error("Invalid token"));

            const res = await request(app)
                .post("/api/v1/auth/google_oauth2_code")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    code: "invalid_code"
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors).toContain("Google login failed");
        });

        it("should handle unverified email from Google", async () => {
            await getCsrfToken();
            
            // Mock OAuth2Client to return unverified email
            const { OAuth2Client } = await import("google-auth-library");
            const mockClient = new OAuth2Client();
            vi.mocked(mockClient.verifyIdToken).mockResolvedValueOnce({
                getAttributes: () => ({
                    payload: {
                        email_verified: false,
                        name: "Google User",
                        email: "google@example.com",
                        picture: "http://example.com/pic.jpg",
                        sub: "google_id_123"
                    }
                })
            } as any);

            const res = await request(app)
                .post("/api/v1/auth/google_oauth2_code")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    code: "google_auth_code"
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors).toContain("Google login failed");
        });

        it("should handle user creation failure", async () => {
            await getCsrfToken();
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

    describe("POST /api/v1/auth/register - additional error cases", () => {
        it("should handle email send failure", async () => {
            await getCsrfToken();
            
            // Mock sendMail to fail
            const nodemailer = await import("nodemailer");
            const mockTransport = nodemailer.createTransport({});
            vi.mocked(mockTransport.sendMail).mockImplementationOnce((mailOptions, callback: any) => {
                callback(new Error("Email send failed"), null);
            });

            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            const res = await request(app)
                .post("/api/v1/auth/register")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    name: "New User",
                    email: "new@example.com",
                    password: "password123"
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors).toContain("Couldnt send email");
        });

        it("should handle database error", async () => {
            await getCsrfToken();
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockRejectedValue(new Error("Database error"))
            });

            const res = await request(app)
                .post("/api/v1/auth/register")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    name: "New User",
                    email: "new@example.com",
                    password: "password123"
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors).toContain("Something went wrong");
        });
    });

    describe("POST /api/v1/auth/activate - additional error cases", () => {
        it("should handle missing authorization header", async () => {
            await getCsrfToken();
            const res = await request(app)
                .post("/api/v1/auth/activate")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({});

            expect(res.status).toEqual(400);
            expect(res.body.errors).toContain("Error! Please signup again!");
        });

        it("should handle user save failure", async () => {
            await getCsrfToken();
            const token = jsonwebtoken.sign(
                { name: "New User", email: "new@example.com" },
                process.env.ACCOUNT_ACTIVATION,
                { expiresIn: "10m" }
            );

            // Mock save to fail
            const UserModelMock = vi.mocked(UserModel);
            const saveMock = vi.fn().mockRejectedValue(new Error("Save failed"));
            UserModelMock.mockImplementationOnce(function (data) {
                return {
                    ...data,
                    save: saveMock
                } as any;
            });

            const res = await request(app)
                .post("/api/v1/auth/activate")
                .set("Authorization", `Bearer ${token}`)
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({ token });

            expect(res.status).toEqual(400);
            expect(res.body.errors).toContain("You already have an Account");
        });
    });

    describe("POST /api/v1/auth/login - additional error cases", () => {
        it("should handle database error during login", async () => {
            await getCsrfToken();
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockRejectedValue(new Error("Database error"))
            });

            const res = await request(app)
                .post("/api/v1/auth/login")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    email: "test@example.com",
                    password: "password"
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors).toEqual("User does not exist!");
        });

        it("should handle invalid email format", async () => {
            await getCsrfToken();
            const res = await request(app)
                .post("/api/v1/auth/login")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({
                    email: "invalid-email",
                    password: "password"
                });

            expect(res.status).toEqual(422);
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

