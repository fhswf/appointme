
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import request from "supertest";
import { EVENT } from './EVENT.js';
import { USER } from './USER.js';
import { EventModel } from "../models/Event.js";

// Mock dependencies
vi.mock("../models/Event.js", () => {
    const save = vi.fn().mockResolvedValue(EVENT);
    const EventModelMock = vi.fn().mockImplementation(function (data) {
        return ({
            ...data,
            save: save
        });
    });

    // Default implementations that return object with exec spy
    (EventModelMock as any).find = vi.fn();
    (EventModelMock as any).findOne = vi.fn();

    return {
        EventModel: EventModelMock,
        EventDocument: {}
    }
});

vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findOne = vi.fn();
    (UserModelMock as any).findById = vi.fn();
    return { UserModel: UserModelMock };
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

// Mock middleware to simulate different auth states
vi.mock("../handlers/middleware.js", () => {
    return {
        middleware: {
            requireAuth: vi.fn((req, res, next) => {
                req.user_id = USER._id;
                req['user'] = USER;
                next();
            }),
            optionalAuth: vi.fn((req, res, next) => {
                // Simple mock: if header present, set user
                if (req.headers['x-mock-user']) {
                    req['user'] = JSON.parse(req.headers['x-mock-user'] as string);
                }
                next();
            })
        }
    }
});


const mockQuery = (result: any, rejected = false) => {
    return {
        exec: rejected ? vi.fn().mockRejectedValue(result) : vi.fn().mockResolvedValue(result),
        select: vi.fn().mockReturnThis(),
    };
};

describe("Event Controller - Restricted Access", () => {
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
        await mongoose.disconnect();
    });

    describe("GET /api/v1/event/active/:userId", () => {
        it("should return all events if no roles are restricted", async () => {
            const unrestrictedEvent = { ...EVENT, allowed_roles: [] };
            (EventModel.find as any).mockImplementation(() => mockQuery([unrestrictedEvent]));

            const res = await request(app)
                .get(`/api/v1/event/active/${USER._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });

        it("should NOT return restricted events for anonymous user", async () => {
            const restrictedEvent = { ...EVENT, allowed_roles: ['student'] };
            (EventModel.find as any).mockImplementation(() => mockQuery([restrictedEvent]));

            const res = await request(app)
                .get(`/api/v1/event/active/${USER._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
        });

        it("should return restricted events for user with matching role", async () => {
            const restrictedEvent = { ...EVENT, allowed_roles: ['student'] };
            (EventModel.find as any).mockImplementation(() => mockQuery([restrictedEvent]));

            const studentUser = { ...USER, roles: ['student'] };

            const res = await request(app)
                .get(`/api/v1/event/active/${USER._id}`)
                .set('x-mock-user', JSON.stringify(studentUser)); // Rely on our mocked middleware

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });
});
