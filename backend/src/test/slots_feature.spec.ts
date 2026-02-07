
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import request from "supertest";
import { EVENT } from './EVENT.js';
import { USER } from './USER.js';
import { EventModel } from "../models/Event.js";
import { UserModel } from "../models/User.js";

// Mock dependencies (copied from event_controller.spec.ts largely)
vi.mock("../models/Event.js", () => {
    const save = vi.fn().mockResolvedValue(EVENT);
    const EventModelMock = vi.fn().mockImplementation(function (data) {
        return ({
            ...data,
            save: save
        });
    });
    (EventModelMock as any).findOne = vi.fn();
    (EventModelMock as any).findByIdAndDelete = vi.fn();
    (EventModelMock as any).find = vi.fn();
    (EventModelMock as any).findById = vi.fn();
    (EventModelMock as any).findByIdAndUpdate = vi.fn();
    return { EventModel: EventModelMock, EventDocument: {} }
});

vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findOne = vi.fn();
    (UserModelMock as any).findById = vi.fn();
    return { UserModel: UserModelMock };
});

vi.mock("../models/Appointment.js", () => {
    const AppointmentModelMock = vi.fn().mockImplementation(function (data) {
        const doc = { ...data, _id: "mock_appointment_id" };
        doc.save = vi.fn().mockResolvedValue(doc);
        return doc;
    });
    return { AppointmentModel: AppointmentModelMock };
});

vi.mock("../handlers/middleware.js", () => ({
    middleware: {
        requireAuth: vi.fn((req, res, next) => {
            req.user_id = USER._id;
            req['user_id'] = USER._id;
            next();
        }),
        optionalAuth: vi.fn((req, res, next) => {
            next();
        })
    }
}));

vi.mock("../config/dbConn.js", () => ({ dataBaseConn: vi.fn() }));
vi.mock("csrf-csrf", () => ({
    doubleCsrf: () => ({
        doubleCsrfProtection: (req, res, next) => next(),
        generateCsrfToken: () => "mock_csrf_token"
    })
}));
vi.mock("../utility/mailer.js", () => ({ sendEventInvitation: vi.fn().mockResolvedValue({}) }));
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

describe("Slots Feature Verification", () => {
    let app: any;

    beforeAll(async () => {
        process.env.JWT_SECRET = "test_secret";
        const { init } = await import("../server.js");
        app = init(0);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-12-01T08:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    afterAll(async () => {
        if (app?.close) await app.close();
    });

    describe("GET /api/v1/event/:id/slot?slots=true", () => {
        it("should return chopped ISO string slots", async () => {
            (EventModel.findById as any).mockImplementation((() => {
                const res = mockQuery({
                    ...EVENT,
                    minFuture: 0,
                    maxFuture: 24 * 60 * 60,
                    duration: 30,
                    bufferbefore: 0,
                    bufferafter: 0,
                    available: {
                        0: [], 1: [{ start: "10:00", end: "11:00" }], 2: [], 3: [], 4: [], 5: [], 6: []
                    },
                    maxPerDay: 5,
                    user: USER._id
                });
                return res;
            }));

            (UserModel.findById as any).mockImplementation(() => mockQuery(USER));

            const { events, freeBusy } = await import("../controller/google_controller.js");
            const { getBusySlots } = await import("../controller/caldav_controller.js");

            (events as any).mockResolvedValue([]);
            (freeBusy as any).mockResolvedValue({ data: { calendars: { 'primary': { busy: [] } } } });
            (getBusySlots as any).mockResolvedValue([]);

            // Use a specific date: Monday 2025-12-01
            // 10:00-11:00 free. Duration 30. Should return 10:00 and 10:30.
            const res = await request(app)
                .get("/api/v1/event/123/slot")
                .query({
                    timeMin: "2025-12-01T00:00:00Z",
                    timeMax: "2025-12-01T23:59:59Z",
                    slots: "true"
                });

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            // Expect array of strings
            const slots = res.body; // TS types might infer any
            expect(typeof slots[0]).toBe("string");
            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.stringContaining("2025-12-01T09:00:00.000Z"),
                    expect.stringContaining("2025-12-01T09:30:00.000Z")
                ])
            );
            expect(slots.length).toBe(2);
        });
    });

    describe("POST /api/v1/event/:id/slot with ISO String", () => {
        it("should insert event successfully with ISO start time", async () => {
            (EventModel.findById as any).mockImplementation(() => mockQuery({
                ...EVENT,
                duration: 60,
                user: USER._id
            }));
            (UserModel.findOne as any).mockImplementation(() => mockQuery({
                ...USER,
                push_calendars: ["google_calendar_id"]
            }));

            const isoDate = "2025-12-01T10:00:00.000Z";

            const res = await request(app)
                .post("/api/v1/event/123/slot")
                .send({
                    start: isoDate,
                    attendeeName: "Guest",
                    attendeeEmail: "guest@example.com",
                    description: "Notes"
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });
    });
});
