
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
    const AppointmentModelMock = vi.fn();
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

describe("Missing Slots Reproduction (Feb 13, 2026)", () => {
    let app: any;

    beforeAll(async () => {
        process.env.JWT_SECRET = "test_secret";
        const { init } = await import("../server.js");
        app = init(0);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        // Set current time to somewhat before Feb 2026, e.g., Feb 6, 2026
        vi.setSystemTime(new Date('2026-02-06T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    afterAll(async () => {
        if (app?.close) await app.close();
    });

    it("should return slots for Friday Feb 13, 2026", async () => {
        (EventModel.findById as any).mockImplementation((() => {
            const res = mockQuery({
                ...EVENT,
                minFuture: 0,
                maxFuture: 24 * 60 * 60 * 365, // 1 year
                duration: 30,
                bufferbefore: 0,
                bufferafter: 0,
                available: {
                    // 5 is Friday. 
                    5: [{ start: "09:00", end: "17:00" }]
                },
                maxPerDay: 5,
                user: USER._id,
                availabilityMode: 'define'
            });
            return res;
        }));

        (UserModel.findById as any).mockImplementation(() => mockQuery(USER));

        const { events, freeBusy } = await import("../controller/google_controller.js");
        const { getBusySlots } = await import("../controller/caldav_controller.js");

        (events as any).mockResolvedValue([]);
        (freeBusy as any).mockResolvedValue({ data: { calendars: { 'primary': { busy: [] } } } });
        (getBusySlots as any).mockResolvedValue([]);

        // Simulate request for Friday Feb 13, but sent as 23:00 UTC Previous Day (due to Berlin TZ)
        // Berlin is UTC+1 (Winter). Friday 00:00 Berlin = Thursday 23:00 UTC.
        // If frontend sends this exact start time:
        const requestStart = "2026-02-12T23:00:00Z";
        const requestEnd = "2026-02-13T23:00:00Z";

        const res = await request(app)
            .get("/api/v1/event/123/slot")
            .query({
                timeMin: requestStart,
                timeMax: requestEnd,
                slots: "true"
            });

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        // We expect plenty of slots between 9am and 5pm
        console.log(`Slots returned: ${res.body.length}`);
        if (res.body.length === 0) {
            console.log("No slots returned! Reproduction successful (if failure expected).");
        }
        expect(res.body.length).toBeGreaterThan(0);
    });
});
