
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
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
    (UserModelMock as any).findById = vi.fn();
    return { UserModel: UserModelMock };
});

vi.mock("../models/Appointment.js", () => {
    const AppointmentModelMock = vi.fn().mockImplementation(function (this: any, data: any) {
        return {
            ...data,
            save: vi.fn().mockResolvedValue(data)
        };
    });
    return { AppointmentModel: AppointmentModelMock };
});


vi.mock("../handlers/middleware.js", () => {
    return {
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

describe("Recurrence Availability", () => {
    let app: any;

    beforeAll(async () => {
        process.env.JWT_SECRET = "test_secret";
        const { init } = await import("../server.js");
        app = init(0);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        // Sunday, Nov 30, 2025. Monday Dec 1 is the start of tests.
        vi.setSystemTime(new Date('2025-11-30T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });



    afterAll(async () => {
        if (app?.close) await app.close();
        await mongoose.disconnect();
    });

    it("should return slots for weekly recurrence when all instances are free", async () => {
        const recurringEvent = {
            ...EVENT,
            minFuture: 0,
            maxFuture: 24 * 60 * 60 * 30,
            duration: 60,
            user: USER._id,
            available: {
                1: [{ start: "09:00", end: "10:00" }] // Mon 09-10
            },
            recurrence: {
                enabled: true,
                frequency: 'weekly',
                interval: 1,
                count: 4
            }
        };

        (EventModel.findById as any).mockImplementation(() => mockQuery(recurringEvent));
        (UserModel.findById as any).mockImplementation(() => mockQuery(USER));

        const { events, freeBusy } = await import("../controller/google_controller.js");
        const { getBusySlots } = await import("../controller/caldav_controller.js");

        (events as any).mockResolvedValue([]);
        (freeBusy as any).mockResolvedValue({ data: { calendars: { 'primary': { busy: [] } } } });
        (getBusySlots as any).mockResolvedValue([]);

        const res = await request(app)
            .get("/api/v1/event/123/slot")
            .query({
                timeMin: "2025-12-01T00:00:00Z",
                timeMax: "2025-12-07T23:59:59Z"
            });

        expect(res.status).toBe(200);
        expect(res.status).toBe(200);
        if (!Array.isArray(res.body)) {
            console.log("Recurrence test failed, body:", JSON.stringify(res.body));
        }
        expect(res.body).toHaveLength(1); // One slot on Monday
        const firstSlot = res.body[0];
        expect(firstSlot.start).toContain("2025-12-01T08:00:00.000Z");
    });

    it("should filter out slots if a future instance is blocked (Weekly)", async () => {
        const recurringEvent = {
            ...EVENT,
            minFuture: 0,
            maxFuture: 24 * 60 * 60 * 30,
            duration: 60,
            user: USER._id,
            available: {
                1: [{ start: "09:00", end: "10:00" }]
            },
            recurrence: {
                enabled: true,
                frequency: 'weekly',
                interval: 1,
                count: 4
            }
        };

        (EventModel.findById as any).mockImplementation(() => mockQuery(recurringEvent));
        (UserModel.findById as any).mockImplementation(() => mockQuery(USER));

        const { events, freeBusy } = await import("../controller/google_controller.js");
        (events as any).mockResolvedValue([]);

        // 2nd instance: Dec 8 (Mon) 09:00 - 10:00 -> BLOCKED
        (freeBusy as any).mockResolvedValue({
            data: {
                calendars: {
                    'primary': {
                        busy: [
                            { start: "2025-12-08T09:00:00Z", end: "2025-12-08T10:00:00Z" }
                        ]
                    }
                }
            }
        });

        const res = await request(app)
            .get("/api/v1/event/123/slot")
            .query({
                timeMin: "2025-12-01T00:00:00Z",
                timeMax: "2025-12-07T23:59:59Z"
            });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: "No slots available for the selected period.",
            slots: []
        }); // Should be filtered out
    });

    it("should handle daily recurrence correctly", async () => {
        const recurringEvent = {
            ...EVENT,
            minFuture: 0,
            maxFuture: 24 * 60 * 60 * 30, // 30 days
            duration: 60,
            user: USER._id,
            available: {
                1: [{ start: "09:00", end: "10:00" }] // Mon 09-10
            },
            recurrence: {
                enabled: true,
                frequency: 'weekly', // Keep weekly to force same-day-of-week checks
                interval: 1,
                count: 4
            }
        };
        // Changing to daily requires availability on all days usually, but let's test that 
        // if frequency is daily, checking next day works.
        // Actually, if frequency is daily, we check N consecutive days.
        recurringEvent.recurrence.frequency = 'daily' as any;
        recurringEvent.available = {
            0: [{ start: "09:00", end: "10:00" }],
            1: [{ start: "09:00", end: "10:00" }],
            2: [{ start: "09:00", end: "10:00" }],
            3: [{ start: "09:00", end: "10:00" }],
            4: [{ start: "09:00", end: "10:00" }],
            5: [{ start: "09:00", end: "10:00" }],
            6: [{ start: "09:00", end: "10:00" }],
        };

        (EventModel.findById as any).mockImplementation(() => mockQuery(recurringEvent));
        (UserModel.findById as any).mockImplementation(() => mockQuery(USER));

        const { events, freeBusy } = await import("../controller/google_controller.js");
        (events as any).mockResolvedValue([]);

        // Block the NEXT day (Dec 2 Tuesday)
        (freeBusy as any).mockResolvedValue({
            data: {
                calendars: {
                    'primary': {
                        busy: [
                            { start: "2025-12-02T08:00:00Z", end: "2025-12-02T10:00:00Z" }
                        ]
                    }
                }
            }
        });

        // Query strict Dec 1 (Mon)
        const res = await request(app)
            .get("/api/v1/event/123/slot")
            .query({
                timeMin: "2025-12-01T00:00:00Z",
                timeMax: "2025-12-01T23:59:59Z"
            });

        expect(res.status).toBe(200);
        // Dec 1 is free, but Dec 2 is blocked.
        // Since frequency is daily, instance 2 is on Dec 2.
        // So Dec 1 slot should be removed because the series is broken on day 2.
        expect(res.body).toEqual({
            message: "No slots available for the selected period.",
            slots: []
        });
    });

    it("should respect recurrence count limit", async () => {
        // If count is 2, only first 2 instances matter. Blocking 3rd shouldn't matter.
        const recurringEvent = {
            ...EVENT,
            minFuture: 0,
            maxFuture: 24 * 60 * 60 * 30,
            duration: 60,
            user: USER._id,
            available: { 1: [{ start: "09:00", end: "10:00" }] },
            recurrence: {
                enabled: true,
                frequency: 'weekly',
                interval: 1,
                count: 2 // Only verify 2 instances
            }
        };

        (EventModel.findById as any).mockImplementation(() => mockQuery(recurringEvent));
        (UserModel.findById as any).mockImplementation(() => mockQuery(USER));

        const { events, freeBusy } = await import("../controller/google_controller.js");
        (events as any).mockResolvedValue([]);

        // Block 3rd instance (Dec 15)
        (freeBusy as any).mockResolvedValue({
            data: {
                calendars: {
                    'primary': {
                        busy: [
                            { start: "2025-12-15T09:00:00Z", end: "2025-12-15T10:00:00Z" }
                        ]
                    }
                }
            }
        });

        const res = await request(app)
            .get("/api/v1/event/123/slot")
            .query({
                timeMin: "2025-12-01T00:00:00Z",
                timeMax: "2025-12-07T23:59:59Z"
            });

        expect(res.status).toBe(200);
        // Should NOT be filtered because blocked instance is beyond count=2
        // Instances: Dec 1, Dec 8. Blocked: Dec 15 (Index 2, i.e., 3rd instance).
        expect(res.body).toHaveLength(1);
    });



});
