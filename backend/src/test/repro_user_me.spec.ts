
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import request from "supertest";
import { UserModel } from "../models/User.js";
import { USER } from './USER.js';

// Mock dependencies
vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findOne = vi.fn();
    (UserModelMock as any).findById = vi.fn();
    return { UserModel: UserModelMock };
});

vi.mock("../handlers/middleware.js", () => {
    return {
        middleware: {
            requireAuth: vi.fn((req, res, next) => {
                req.user_id = USER._id;
                req['user_id'] = USER._id;
                next();
            })
        }
    }
});

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

    beforeAll(async () => {
        process.env.JWT_SECRET = "test_secret";
        const { init } = await import("../server.js");
        app = init(0);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterAll(async () => {
        if (app?.close) await app.close();
    });

    it("should return 404 when user is not found", async () => {
        (UserModel.findOne as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(null)
        });

        const res = await request(app).get("/api/v1/user/me");

        expect(res.status).toBe(404);
        expect(res.headers['cache-control']).toBe('no-store');
        expect(res.body.error).toBe("User not found");
    });
});
