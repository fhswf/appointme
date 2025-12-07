
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import request from "supertest";
import { EVENT } from './EVENT.js';
import { USER } from './USER.js';
import { EventModel } from "../models/Event.js";
import { UserModel } from "../models/User.js";

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
        EventDocument: {}
    }
});

vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findOne = vi.fn();
    return { UserModel: UserModelMock };
});


vi.mock("../handlers/middleware.js", () => {
    return {
        middleware: {
            requireAuth: vi.fn((req, res, next) => {
                req.user_id = USER._id;
                // Some controllers use req['user_id']
                req['user_id'] = USER._id;
                next();
            })
        }
    }
});

// Mock DB Connection
vi.mock("../config/dbConn.js", () => ({
    dataBaseConn: vi.fn()
}));

// Mock csrf-csrf to bypass protection
vi.mock("csrf-csrf", () => {
    return {
        doubleCsrf: () => ({
            doubleCsrfProtection: (req, res, next) => next(),
            generateCsrfToken: () => "mock_csrf_token"
        })
    };
});

// Mock mailer
vi.mock("../utility/mailer.js", () => ({
    sendEventInvitation: vi.fn().mockResolvedValue({})
}));

// Mock google_controller
vi.mock("../controller/google_controller.js", () => ({
    checkFree: vi.fn().mockResolvedValue(true),
    insertGoogleEvent: vi.fn().mockResolvedValue({ status: "confirmed", htmlLink: "http://google.com/event" }),
    events: vi.fn().mockResolvedValue([]),
    freeBusy: vi.fn().mockResolvedValue({ data: { calendars: {} } }),
    revokeScopes: vi.fn().mockResolvedValue({}),
    generateAuthUrl: vi.fn().mockReturnValue("http://auth.url"),
    getCalendarList: vi.fn().mockResolvedValue([]),
    googleCallback: vi.fn().mockResolvedValue({})
}));

// Mock caldav_controller
vi.mock("../controller/caldav_controller.js", () => ({
    createCalDavEvent: vi.fn().mockResolvedValue({ ok: true }),
    getBusySlots: vi.fn().mockResolvedValue([]),
    addAccount: vi.fn().mockImplementation((req, res) => res.json({})),
    listAccounts: vi.fn().mockImplementation((req, res) => res.json([])),
    removeAccount: vi.fn().mockImplementation((req, res) => res.json({})),
    listCalendars: vi.fn().mockImplementation((req, res) => res.json([]))
}));


describe("Event Controller", () => {
    let app: any;

    beforeAll(async () => {
        process.env.JWT_SECRET = "test_secret";

        // Re-import to ensure mocks are used
        const { init } = await import("../server.js");
        app = init(0);
    });

    afterAll(async () => {
        if (app?.close) await app.close();
    });

    describe("POST /api/v1/event/addEvent", () => {
        it("should add a new event successfully", async () => {
            const res = await request(app)
                .post("/api/v1/event/addEvent")
                .send(EVENT);

            expect(res.status).toEqual(201);
            expect(res.body.msg).toEqual("Successfully saved event!");
        });

        it("should return error if event validation fails (Mongoose)", async () => {
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
                .post("/api/v1/event/addEvent")
                .send({});

            expect(res.status).toEqual(400);
            expect(res.body.error).toEqual("Name is required");
        });
    });

    describe("DELETE /api/v1/event/:id", () => {
        it("should delete an event", async () => {
            (EventModel.findByIdAndDelete as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({})
            });

            const res = await request(app)
                .delete("/api/v1/event/123");

            expect(res.status).toBe(200);
            expect(res.body.msg).toBe("Successfully deleted the Event");
        });

        it("should handle error during deletion", async () => {
            (EventModel.findByIdAndDelete as any).mockReturnValue({
                exec: vi.fn().mockRejectedValue("DB Error")
            });

            const res = await request(app)
                .delete("/api/v1/event/123");

            expect(res.status).toBe(400);
        });
    });

    describe("GET /api/v1/event", () => {
        it("should get event list for user", async () => {
            (EventModel.find as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue([EVENT])
            });

            const res = await request(app)
                .get("/api/v1/event");

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });

    describe("GET /api/v1/event/:id", () => {
        it("should get event by ID", async () => {
            (EventModel.findById as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(EVENT)
            });

            const res = await request(app)
                .get("/api/v1/event/123");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(expect.objectContaining(EVENT));
        });

        it("should return 404 if not found", async () => {
            (EventModel.findById as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            const res = await request(app)
                .get("/api/v1/event/123");

            expect(res.status).toBe(404);
        });
    });

    describe("PUT /api/v1/event/:id", () => {
        it("should update event", async () => {
            (EventModel.findByIdAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(EVENT)
            });

            const res = await request(app)
                .put("/api/v1/event/123")
                .send({ data: { name: "Updated Name" } });

            expect(res.status).toBe(200);
            expect(res.body.msg).toBe("Update successful");
        });
    });

    describe("POST /api/v1/event/:id/slot (insertEvent)", () => {
        it("should insert event successfully (Google)", async () => {
            // Mock findById for event
            (EventModel.findById as any).mockResolvedValue({
                ...EVENT,
                duration: 60,
                user: USER._id
            });

            // Mock UserModel.findOne
            (UserModel.findOne as any).mockResolvedValue({
                ...USER,
                push_calendar: "google_calendar_id"
            });

            const res = await request(app)
                .post("/api/v1/event/123/slot")
                .send({
                    starttime: Date.now().toString(),
                    name: "Guest",
                    email: "guest@example.com",
                    description: "Notes"
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain("Event wurde gebucht");
        });

        it("should insert event successfully (CalDAV)", async () => {
            // Mock findById for event
            (EventModel.findById as any).mockResolvedValue({
                ...EVENT,
                duration: 60,
                user: USER._id
            });

            // Mock UserModel.findOne
            (UserModel.findOne as any).mockResolvedValue({
                ...USER,
                push_calendar: "https://caldav.example.com/cal"
            });

            const res = await request(app)
                .post("/api/v1/event/123/slot")
                .send({
                    starttime: Date.now().toString(),
                    name: "Guest",
                    email: "guest@example.com",
                    description: "Notes"
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain("Event wurde gebucht (CalDav)");
        });

        it("should handle unavailable slot", async () => {
            (EventModel.findById as any).mockResolvedValue({
                ...EVENT,
                duration: 60,
                user: USER._id
            });

            const { checkFree } = await import("../controller/google_controller.js");
            (checkFree as any).mockResolvedValue(false);

            const res = await request(app)
                .post("/api/v1/event/123/slot")
                .send({
                    starttime: Date.now().toString(),
                    name: "Guest",
                    email: "guest@example.com",
                    description: "Notes"
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("requested slot not available");
        });
    });
});
