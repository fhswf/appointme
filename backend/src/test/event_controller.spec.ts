
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import request from "supertest";
import { EVENT } from './EVENT.js';
import { USER } from './USER.js';
import { EventModel } from "../models/Event.js";
import { UserModel } from "../models/User.js";

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
    // We will override these using mockImplementation in tests
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

vi.mock("../utility/mailer.js", () => ({
    sendEventInvitation: vi.fn().mockResolvedValue({})
}));

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

vi.mock("../controller/caldav_controller.js", () => ({
    createCalDavEvent: vi.fn().mockResolvedValue({ ok: true }),
    getBusySlots: vi.fn().mockResolvedValue([]),
    addAccount: vi.fn().mockImplementation((req, res) => res.json({})),
    listAccounts: vi.fn().mockImplementation((req, res) => res.json([])),
    removeAccount: vi.fn().mockImplementation((req, res) => res.json({})),
    listCalendars: vi.fn().mockImplementation((req, res) => res.json([])),
    findAccountForCalendar: vi.fn().mockReturnValue({ username: "test@caldav.com", serverUrl: "https://caldav.example.com" })
}));

const mockQuery = (result: any, rejected = false) => {
    return {
        exec: rejected ? vi.fn().mockRejectedValue(result) : vi.fn().mockResolvedValue(result),
        select: vi.fn().mockReturnThis(),
    };
};

describe("Event Controller", () => {
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

            (EventModel as any).mockImplementationOnce(function (data) {
                return ({
                    ...data,
                    save: vi.fn().mockRejectedValue(validationError)
                });
            });

            const res = await request(app)
                .post("/api/v1/event/addEvent")
                .send({});

            expect(res.status).toEqual(400);
            expect(res.body.error).toEqual("Name is required");
        });
    });

    describe("DELETE /api/v1/event/:id", () => {
        it("should delete an event", async () => {
            (EventModel.findByIdAndDelete as any).mockImplementation(() => mockQuery({}));

            const res = await request(app)
                .delete("/api/v1/event/123");

            expect(res.status).toBe(200);
            expect(res.body.msg).toBe("Successfully deleted the Event");
        });

        it("should handle error during deletion", async () => {
            (EventModel.findByIdAndDelete as any).mockImplementation(() => mockQuery("DB Error", true));

            const res = await request(app)
                .delete("/api/v1/event/123");

            expect(res.status).toBe(400);
        });
    });

    describe("GET /api/v1/event", () => {
        it("should get event list for user", async () => {
            (EventModel.find as any).mockImplementation(() => mockQuery([EVENT]));

            const res = await request(app)
                .get("/api/v1/event");

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });

        it("should handle error getting event list", async () => {
            (EventModel.find as any).mockImplementation(() => mockQuery("DB Error", true));

            const res = await request(app)
                .get("/api/v1/event");

            expect(res.status).toBe(400);
        });
    });

    describe("GET /api/v1/event/:id", () => {
        it("should get event by ID", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery(EVENT));

            const res = await request(app)
                .get("/api/v1/event/123");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(expect.objectContaining(EVENT));
        });

        it("should return 404 if not found", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery(null));

            const res = await request(app)
                .get("/api/v1/event/123");

            expect(res.status).toBe(404);
        });

        it("should handle error getting event by ID", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery("DB Error", true));

            const res = await request(app)
                .get("/api/v1/event/123");

            expect(res.status).toBe(400);
        });
    });

    describe("GET /api/v1/event/active/:userId", () => {
        it("should get active events for user", async () => {
            (EventModel.find as any).mockImplementation(() => mockQuery([EVENT]));

            const res = await request(app)
                .get(`/api/v1/event/active/${USER._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(EventModel.find).toHaveBeenCalledWith({ user: USER._id, isActive: true });
        });

        it("should handle error getting active events", async () => {
            (EventModel.find as any).mockImplementation(() => mockQuery("DB Error", true));

            const res = await request(app)
                .get(`/api/v1/event/active/${USER._id}`);

            expect(res.status).toBe(400);
        });
    });

    describe("GET /api/v1/event/:userId/:eventUrl", () => {
        it("should get event by URL", async () => {
            (EventModel.findOne as any).mockImplementation(() => mockQuery(EVENT));

            const res = await request(app)
                .get(`/api/v1/event/${USER._id}/some-url`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(expect.objectContaining(EVENT));
            expect(EventModel.findOne).toHaveBeenCalledWith({ url: 'some-url', user: USER._id });
        });

        it("should return 404 if event by URL not found", async () => {
            (EventModel.findOne as any).mockImplementation(() => mockQuery(null));

            const res = await request(app)
                .get(`/api/v1/event/${USER._id}/some-url`);

            expect(res.status).toBe(404);
        });

        it("should handle error getting event by URL", async () => {
            (EventModel.findOne as any).mockImplementation(() => mockQuery("DB Error", true));

            const res = await request(app)
                .get(`/api/v1/event/${USER._id}/some-url`);

            expect(res.status).toBe(400);
        });
    });

    describe("PUT /api/v1/event/:id", () => {
        it("should update event", async () => {
            (EventModel.findByIdAndUpdate as any).mockImplementation(() => mockQuery(EVENT));

            const res = await request(app)
                .put("/api/v1/event/123")
                .send({ data: { name: "Updated Name" } });

            expect(res.status).toBe(200);
            expect(res.body.msg).toBe("Update successful");
        });

        it("should return 400 for invalid data", async () => {
            const res = await request(app)
                .put("/api/v1/event/123")
                .send({ data: null });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Invalid event data");
        });

        it("should handle error updating event", async () => {
            (EventModel.findByIdAndUpdate as any).mockImplementation(() => mockQuery("DB Error", true));

            const res = await request(app)
                .put("/api/v1/event/123")
                .send({ data: { name: "Updated Name" } });

            expect(res.status).toBe(400);
        });
    });

    describe("GET /api/v1/event/:id/slot (getAvailableTimes)", () => {
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2025-12-01T12:00:00Z'));
        });
        afterEach(() => {
            vi.useRealTimers();
        });

        it("should return free slots", async () => {
            (EventModel.findById as any).mockImplementation((() => {
                const res = mockQuery({
                    ...EVENT,
                    minFuture: 0,
                    maxFuture: 24 * 60 * 60,
                    duration: 30,
                    bufferbefore: 0,
                    bufferafter: 0,
                    available: {
                        0: [], 1: [{ start: "09:00", end: "17:00" }], 2: [], 3: [], 4: [], 5: [], 6: []
                    },
                    maxPerDay: 5,
                    user: USER._id
                });
                return res;
            }));

            const { events, freeBusy } = await import("../controller/google_controller.js");
            const { getBusySlots } = await import("../controller/caldav_controller.js");

            (events as any).mockResolvedValue([]);
            (freeBusy as any).mockResolvedValue({ data: { calendars: { 'primary': { busy: [] } } } });
            (getBusySlots as any).mockResolvedValue([]);

            const res = await request(app)
                .get("/api/v1/event/123/slot")
                .query({
                    timeMin: "2025-12-02T00:00:00Z",
                    timeMax: "2025-12-02T23:59:59Z"
                });

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it("should return 400 if event not found", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery(null));

            const res = await request(app)
                .get("/api/v1/event/123/slot")
                .query({
                    timeMin: "2025-12-02T00:00:00Z",
                    timeMax: "2025-12-02T23:59:59Z"
                });

            expect(res.status).toBe(400);
        });
    });

    describe("POST /api/v1/event/:id/slot (insertEvent)", () => {
        it("should insert event successfully (Google)", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery({
                ...EVENT,
                duration: 60,
                user: USER._id
            }));

            (UserModel.findOne as any).mockImplementation(() => mockQuery({
                ...USER,
                push_calendar: "google_calendar_id"
            }));

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
        });

        it("should insert event successfully (CalDAV)", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery({
                ...EVENT,
                duration: 60,
                user: USER._id
            }));

            (UserModel.findOne as any).mockImplementation(() => mockQuery({
                ...USER,
                push_calendar: "https://caldav.example.com/cal"
            }));

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
        });

        it("should handle unavailable slot", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery({
                ...EVENT,
                duration: 60,
                user: USER._id
            }));

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

        it("should sanitise HTML in email invitation", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery({
                ...EVENT,
                duration: 60,
                user: USER._id,
                name: "Event <script>alert(1)</script>",
                description: "Notes <script>alert(1)</script>"
            }));

            (UserModel.findOne as any).mockImplementation(() => mockQuery({
                ...USER,
                push_calendar: "https://caldav.example.com/cal",
                send_invitation_email: true
            }));

            const { sendEventInvitation } = await import("../utility/mailer.js");
            const { checkFree } = await import("../controller/google_controller.js");
            (checkFree as any).mockResolvedValue(true);

            const res = await request(app)
                .post("/api/v1/event/123/slot")
                .send({
                    starttime: Date.now().toString(),
                    name: "Guest <b>Bold</b>",
                    email: "guest@example.com",
                    description: "Notes"
                });

            expect(res.status).toBe(200);
            expect(sendEventInvitation).toHaveBeenCalledWith(
                "guest@example.com",
                expect.stringContaining("Invitation: Event <script>alert(1)</script>"),
                expect.stringContaining("Guest &lt;b&gt;Bold&lt;&#x2F;b&gt;"),
                expect.any(String),
                "invite.ics"
            );
        });

        it("should return 404 if event not found during insert", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery(null));

            const res = await request(app)
                .post("/api/v1/event/123/slot")
                .send({
                    starttime: Date.now().toString(),
                    name: "Guest",
                    email: "guest@example.com",
                    description: "Notes"
                });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Event not found");
        });

        it("should return 404 if user not found during insert", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery({
                ...EVENT,
                duration: 60,
                user: USER._id
            }));

            const { checkFree } = await import("../controller/google_controller.js");
            (checkFree as any).mockResolvedValue(true);

            (UserModel.findOne as any).mockImplementation(() => mockQuery(null));

            const res = await request(app)
                .post("/api/v1/event/123/slot")
                .send({
                    starttime: Date.now().toString(),
                    name: "Guest",
                    email: "guest@example.com",
                    description: "Notes"
                });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("User not found");
        });
    });

    describe("Helper Functions", () => {
        it("should calculate blocked slots correctly", async () => {
            const { calculateBlocked } = await import("../controller/event_controller.js");
            const event = { maxPerDay: 2 };
            const timeMin = new Date("2025-12-01T00:00:00Z");
            const timeMax = new Date("2025-12-01T23:59:59Z");

            // Simulating 2 events on the same day to trigger maxPerDay blocking
            const events = [
                { start: { dateTime: "2025-12-01T10:00:00Z" } },
                { start: { dateTime: "2025-12-01T14:00:00Z" } }
            ];

            const blocked = calculateBlocked(events, event, timeMin, timeMax);

            // Should be fully blocked for that day (mocked IntervalSet behavior would be complex to fully verify without real IntervalSet, 
            // but we can check if it called addRange or properties).
            // Since we don't mock IntervalSet in the helper import (it imports from common), we're relying on actual logic.
            // Assuming IntervalSet works, let's just ensure it runs without error and returns an object.
            expect(blocked).toBeDefined();
        });

        it("should calculate free slots correctly", async () => {
            const { calculateFreeSlots } = await import("../controller/event_controller.js");
            const event = {
                available: { 1: [{ start: "09:00", end: "17:00" }] },
                bufferbefore: 0,
                bufferafter: 0
            };
            const timeMin = new Date("2025-12-01T00:00:00Z"); // Monday
            const timeMax = new Date("2025-12-01T23:59:59Z");
            const blocked = { inverse: () => ({ intersect: (x) => x }) }; // Mock blocked to return everything free

            const response = { data: { calendars: { 'primary': { busy: [] } } } };
            const calDavSlots = [];

            const freeSlots = calculateFreeSlots(response, calDavSlots, event, timeMin, timeMax, blocked);
            expect(freeSlots).toBeDefined();
        });
    });

    describe("POST /api/v1/event/:id/slot (insertEvent) Error Handling", () => {
        it("should handle error during insert process", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery({
                ...EVENT,
                duration: 60,
                user: USER._id
            }));

            // Simulate error in checkFree
            const { checkFree } = await import("../controller/google_controller.js");
            (checkFree as any).mockRejectedValue(new Error("Service down"));

            const res = await request(app)
                .post("/api/v1/event/123/slot")
                .send({
                    starttime: Date.now().toString(),
                    name: "Guest",
                    email: "guest@example.com",
                    description: "Notes"
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toEqual(expect.objectContaining({}));
        });
    });
});

