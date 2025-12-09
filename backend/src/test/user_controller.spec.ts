
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import request from "supertest";
import { UserModel } from "../models/User.js";
import { USER } from './USER.js';

// Mock dependencies
vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findOne = vi.fn();
    (UserModelMock as any).findByIdAndUpdate = vi.fn();
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

describe("User Controller", () => {
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

    describe("PUT /api/v1/user", () => {
        it("should successfully update user URL", async () => {
            (UserModel.findByIdAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({ ...USER, user_url: "new-unique-url" })
            });

            const res = await request(app)
                .put("/api/v1/user")
                .send({ data: { user_url: "new-unique-url" } });

            expect(res.status).toBe(200);
            expect(res.body.user_url).toBe("new-unique-url");
        });

        it("should fail when updating with a duplicate user URL", async () => {
            const duplicateError = {
                code: 11000,
                message: "Duplicate key error collection: test.users index: user_url_1 dup key: { user_url: \"existing-url\" }"
            };

            (UserModel.findByIdAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockRejectedValue(duplicateError)
            });

            const res = await request(app)
                .put("/api/v1/user")
                .send({ data: { user_url: "existing-url" } });

            expect(res.status).toBe(400);
            expect(res.body.error).toEqual(duplicateError);
        });
    });
});
