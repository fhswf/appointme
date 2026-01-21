
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import request from "supertest";
import { UserModel } from "../models/User.js";
import { USER } from './USER.js';
import jsonwebtoken from "jsonwebtoken";

// Mock dependencies
vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findOne = vi.fn();
    (UserModelMock as any).findById = vi.fn();
    return { UserModel: UserModelMock };
});

// Do NOT mock middleware, use the real one to test auth logic
// vi.mock("../handlers/middleware.js", ...);

vi.mock("../config/dbConn.js", () => ({
    dataBaseConn: vi.fn()
}));

vi.mock("csrf-csrf", () => {
    return {
        doubleCsrf: () => ({
            doubleCsrfProtection: (req, res, next) => next(),
            generateCsrfToken: () => "mock_csrf_token"
        })
    };
});

describe("GET /api/v1/user/me Reproduction", () => {
    let app: any;
    const JWT_SECRET = "test_secret";

    beforeAll(async () => {
        process.env.JWT_SECRET = JWT_SECRET;
        // Ensure env var logic matches
        process.env.DOMAIN = "localhost";

        const { init } = await import("../server.js");
        app = init(0);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });



    afterAll(async () => {
        if (app?.close) await app.close();
        await mongoose.disconnect();
    });

    it("should return 200 and user data when authenticated and user exists", async () => {
        // 1. Create valid token
        const token = jsonwebtoken.sign({ _id: "user_id_123" }, JWT_SECRET);

        // 2. Mock User Found
        (UserModel.findOne as any).mockReturnValue({
            lean: vi.fn().mockReturnValue({
                exec: vi.fn().mockResolvedValue({ ...USER, _id: "user_id_123" })
            })
        });

        // 3. Request with Cookie
        const res = await request(app)
            .get("/api/v1/user/me")
            .set("Cookie", [`access_token=${token}`]);

        expect(res.status).toBe(200);
        expect(res.body._id).toBe("user_id_123");
    });

    it("should return 404 when authenticated but user not found in DB", async () => {
        const token = jsonwebtoken.sign({ _id: "user_id_404" }, JWT_SECRET);

        (UserModel.findOne as any).mockReturnValue({
            lean: vi.fn().mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            })
        });

        const res = await request(app)
            .get("/api/v1/user/me")
            .set("Cookie", [`access_token=${token}`]);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("User not found");
    });

    it("should return 401 when access_token is invalid", async () => {
        const token = "invalid_token_string";

        const res = await request(app)
            .get("/api/v1/user/me")
            .set("Cookie", [`access_token=${token}`]);

        // Middleware should block this
        expect(res.status).toBe(401);
    });

    it("should return 401 when access_token is missing", async () => {
        const res = await request(app)
            .get("/api/v1/user/me");
        // No cookie set

        expect(res.status).toBe(401);
    });
});
