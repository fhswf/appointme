
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import request from "supertest";
import { EVENT } from './EVENT.js';
import { USER } from './USER.js';
import { AppointmentModel } from "../models/Appointment.js";
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
    (EventModelMock as any).findById = vi.fn();

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
            _id: "appointment_123",
            save: vi.fn().mockResolvedValue({
                ...data,
                _id: "appointment_123"
            })
        };
    });
    (AppointmentModelMock as any).find = vi.fn().mockReturnThis();
    (AppointmentModelMock as any).findById = vi.fn().mockReturnThis();
    (AppointmentModelMock as any).updateMany = vi.fn();
    (AppointmentModelMock as any).countDocuments = vi.fn().mockResolvedValue(0);
    (AppointmentModelMock as any).exec = vi.fn().mockResolvedValue([]);
    return { AppointmentModel: AppointmentModelMock };
});


vi.mock("../services/sync_service.js", () => ({
    syncAppointment: vi.fn().mockResolvedValue(true)
}));

vi.mock("../controller/google_controller.js", () => ({
    checkFree: vi.fn().mockResolvedValue(true),
    revokeScopes: vi.fn(),
    generateAuthUrl: vi.fn().mockReturnValue("http://auth.url"),
    getCalendarList: vi.fn().mockResolvedValue([]),
    googleCallback: vi.fn().mockImplementation((req, res) => res.json({})),
    // ... other mocks if needed
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

const mockQuery = (result: any) => {
    return {
        exec: vi.fn().mockResolvedValue(result),
        select: vi.fn().mockReturnThis(),
    };
};

describe("Async Appointment Sync Verification", () => {
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

    it("should create pending appointment and trigger async sync", async () => {
        (EventModel.findById as any).mockImplementation(() => mockQuery({
            ...EVENT,
            duration: 60,
            user: USER._id
        }));

        (UserModel.findOne as any).mockImplementation(() => mockQuery({
            ...USER,
            push_calendars: ["google_calendar_id"]
        }));

        const { syncAppointment } = await import("../services/sync_service.js");

        const res = await request(app)
            .post("/api/v1/event/123/slot")
            .send({
                start: Date.now().toString(),
                attendeeName: "Guest",
                attendeeEmail: "guest@example.com",
                description: "Notes"
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.seriesId).toBeUndefined(); // Single event has no seriesId

        // Verify Appointment was created with pending status
        expect(AppointmentModel).toHaveBeenCalledWith(expect.objectContaining({
            status: 'pending'
        }));

        // Verify syncAppointment was triggered
        expect(syncAppointment).toHaveBeenCalled();
        expect(syncAppointment).toHaveBeenCalledWith("appointment_123");
    });
    it("should reconcile pending appointments via cron endpoint", async () => {
        // Mock pending appointments
        const pendingApp = {
            _id: "appointment_pending_1",
            status: "pending",
            user: USER._id,
            save: vi.fn().mockResolvedValue(true)
        };

        (AppointmentModel.find as any).mockImplementation(() => mockQuery([pendingApp]));

        const { syncAppointment } = await import("../services/sync_service.js");

        // Mock ADMIN_API_KEY
        process.env.ADMIN_API_KEY = "test_key";

        const res = await request(app)
            .post("/api/v1/cron/reconcile")
            .set("x-api-key", "test_key");

        expect(res.status).toBe(200);
        expect(res.body.total).toBe(1);
        expect(res.body.success).toBe(1);

        expect(syncAppointment).toHaveBeenCalledWith("appointment_pending_1");
    });
});
