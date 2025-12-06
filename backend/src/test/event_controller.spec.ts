
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import request from "supertest";
import { EVENT } from './EVENT.js';
import { USER } from './USER.js';
import { EventModel } from "../models/Event.js";

// Mock dependencies
vi.mock("../models/Event.js", () => {
    const save = vi.fn().mockResolvedValue(EVENT);
    const EventModelMock = vi.fn().mockImplementation((data) => ({
        ...data,
        save: save
    }));

    (EventModelMock as any).findOne = vi.fn();
    (EventModelMock as any).findByIdAndDelete = vi.fn();
    (EventModelMock as any).find = vi.fn();
    (EventModelMock as any).findById = vi.fn();
    (EventModelMock as any).findByIdAndUpdate = vi.fn();

    return {
        EventModel: EventModelMock,
    }
});

vi.mock("../handlers/middleware.js", () => {
    return {
        middleware: {
            requireAuth: vi.fn((req, res, next) => {
                req.user_id = USER._id;
                next();
            })
        }
    }
});

describe("Event Controller", () => {
    let app: any;
    let csrfToken: string;
    let csrfCookie: string;

    beforeAll(async () => {
        process.env.JWT_SECRET = "test_secret";

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

    describe("POST /api/v1/events/addEvent", () => {
        it("should add a new event successfully", async () => {
            await getCsrfToken();
            const res = await request(app)
                .post("/api/v1/events/addEvent")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send(EVENT);

            expect(res.status).toEqual(201);
            expect(res.body.msg).toEqual("Successfully saved event!");
        });

        it("should return error if event validation fails (Mongoose)", async () => {
            await getCsrfToken();

            const validationError = {
                errors: {
                    name: { message: "Name is required" }
                }
            };

            (EventModel as any).mockImplementationOnce((data) => ({
                ...data,
                save: vi.fn().mockRejectedValue(validationError)
            }));

            const res = await request(app)
                .post("/api/v1/events/addEvent")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send({});

            expect(res.status).toEqual(400);
            expect(res.body.error).toEqual("Name is required");
        });

        it("should handle duplicate key error via errorHandler", async () => {
            await getCsrfToken();

            // Mock save to throw duplicate key error
            const duplicateError = {
                code: 11000,
                message: "E11000 duplicate key error collection: test.events index: url_1 dup key: { url: \"test-event\" }"
            };

            (EventModel as any).mockImplementationOnce((data) => ({
                ...data,
                save: vi.fn().mockRejectedValue(duplicateError)
            }));

            const res = await request(app)
                .post("/api/v1/events/addEvent")
                .set("x-csrf-token", csrfToken)
                .set("Cookie", csrfCookie)
                .send(EVENT);

            expect(res.status).toEqual(400);
            // The errorHandler extracts "url" from the message
            // "Field url already exists"
            expect(res.body.error).toContain("already exists");
        });
    });
});
