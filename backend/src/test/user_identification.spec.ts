import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import request from "supertest";
import { UserModel } from "../models/User.js";

// Mock dependencies
vi.mock("nodemailer", () => {
    return {
        createTransport: vi.fn(() => ({
            sendMail: vi.fn((mailOptions, callback) => callback(null, "Email sent"))
        }))
    }
});

// Mock OAuth2Client
vi.mock("google-auth-library", () => {
    return {
        OAuth2Client: vi.fn().mockImplementation(function () {
            return {
                verifyIdToken: vi.fn().mockResolvedValue({
                    getAttributes: () => ({
                        payload: {
                            email_verified: true,
                            name: "Google User",
                            email: "test@example.com",
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
            };
        })
    }
});

// Mock OIDC Client
vi.mock("openid-client", () => {
    return {
        Configuration: vi.fn().mockImplementation(function () {
            return {
                serverMetadata: () => ({}),
                clientMetadata: () => ({}),
            };
        }),
        buildAuthorizationUrl: vi.fn(),
        authorizationCodeGrant: vi.fn().mockResolvedValue({
            claims: vi.fn().mockReturnValue({
                sub: "oidc_id_456",
                email: "test@example.com", // Same email as Google User
                name: "OIDC User",
                picture: "http://example.com/oidc_pic.jpg"
            })
        }),
        ClientSecretBasic: vi.fn(),
        None: vi.fn(),
    };
});


// Mock UserModel
vi.mock("../models/User.js", () => {
    const save = vi.fn().mockResolvedValue({});
    const UserModelMock = vi.fn().mockImplementation(function (data) {
        return ({
            ...data,
            save: save
        });
    });

    (UserModelMock as any).findOne = vi.fn();
    (UserModelMock as any).findOneAndUpdate = vi.fn();
    (UserModelMock as any).findById = vi.fn();
    (UserModelMock as any).updateOne = vi.fn();

    return {
        UserModel: UserModelMock,
    }
});

describe("User Identification by Email", () => {
    let app: any;
    let csrfToken: string;
    let csrfCookie: string;

    beforeAll(async () => {
        vi.resetModules();
        process.env.JWT_SECRET = "test_secret";
        process.env.CLIENT_ID = "test_client_id";
        process.env.CLIENT_SECRET = "test_client_secret";
        process.env.OIDC_ISSUER = "http://localhost:8080/auth/realms/test";
        process.env.OIDC_CLIENT_ID = "test_oidc_client";
        process.env.OIDC_CLIENT_SECRET = "test_oidc_secret";
        process.env.BASE_URL = "http://localhost:3000";

        // Setup in-memory MongoDB or mock Mongoose (using existing server setup if possible, or mocks)
        // Here we rely on the server.ts setup which likely connects to a test DB or we mock UserModel.
        // Given complexity of mocking Mongoose fully for integration, we'll try to use the real logic with mocked models if unit test
        // But since we want to test the controller logic flow, let's mock the UserModel methods to behave as we expect for scenarios.

        // Actually, let's look at how other tests do it. They seem to verify controller logic with mocked Mongoose.
        // Let's refine the mock to simulate our DB state.
        const { init } = await import("../server.js");
        app = init(0);
    });

    afterAll(async () => {
        await app.close();
        vi.resetModules();
    });

    const getCsrfToken = async () => {
        const res = await request(app).get("/api/v1/csrf-token");
        csrfToken = res.body.csrfToken;
        csrfCookie = res.headers["set-cookie"][0];
    };

    // We will use a more integration-style approach with mocks for the DB calls to return what we want.

    it("should link OIDC login to existing Google user if email matches", async () => {
        await getCsrfToken();
        // 1. Simulate finding a user created by Google
        const existingUser = {
            _id: "google_id_123",
            email: "test@example.com",
            name: "Google User",
            picture_url: "http://example.com/pic.jpg",
            save: vi.fn(),
            roles: []
        };

        // Mock UserModel.findById to return null (not found by OIDC sub)
        (UserModel.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(null)
        });

        // Mock UserModel.findOne to return this user when searched by email OR _id
        (UserModel.findOne as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(existingUser)
        });

        // Mock UserModel.findOneAndUpdate to return the updated user (or same user)
        // This is needed because updateExistingUser calls findOneAndUpdate
        (UserModel.findOneAndUpdate as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(existingUser)
        });

        // Mock request/response for OIDC login
        // Since we are using supertest for Google test, let's use it here too for consistency if possible, 
        // BUT the first test passed with direct call and mocking req/res. 
        // Direct call tests are faster but less integrated. 
        // Mixing styles is bad. Let's switch this to supertest too.

        // However, I need to mock openid-client behavior.
        // The mock for openid-client at the top mocks the Client class.
        // I need to ensure the mocked client is used by the controller.

        // The controller gets client via `getClient()`.

        const res = await request(app)
            .post("/api/v1/oidc/login")
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ code: "auth_code" });

        // Verify successful login
        expect(res.status).toEqual(200);
        expect(res.body.user).toEqual(expect.objectContaining({
            _id: "google_id_123",
            email: "test@example.com"
        }));

        // Verify user was updated (checked via spy if needed, but response confirms logic)
    });

    it("should link Google login to existing OIDC user if email matches", async () => {
        await getCsrfToken();
        // 1. Simulate finding a user created by OIDC
        const existingUser = {
            _id: "oidc_id_456",
            email: "test@example.com",
            name: "OIDC User",
            picture_url: "http://example.com/oidc.jpg",
            save: vi.fn(),
            use_gravatar: false,
            roles: []
        };

        (UserModel.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(null)
        });

        (UserModel.findOne as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(existingUser)
        });

        (UserModel.findOneAndUpdate as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(existingUser)
        });


        // Use supertest to handle async nature of controller
        const res = await request(app)
            .post("/api/v1/auth/google_oauth2_code")
            .set("x-csrf-token", csrfToken)
            .set("Cookie", csrfCookie)
            .send({ code: "google_code" });

        // Verify successful login
        expect(res.status).toBe(200);
        // Verify we got the existing user ID
        expect(res.body.user).toEqual(expect.objectContaining({
            _id: "oidc_id_456",
            email: "test@example.com"
        }));
    });
});
