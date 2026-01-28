import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from "vitest";
import request from "supertest";
import { init } from "../server.js";
import { UserModel } from "../models/User.js";
import { EventModel } from "../models/Event.js";
import jwt from "jsonwebtoken";

// Mock dependencies
vi.mock("csrf-csrf", () => {
    return {
        doubleCsrf: () => ({
            doubleCsrfProtection: (req, res, next) => next(),
            generateCsrfToken: () => "mock_csrf_token"
        })
    };
});

// Mock Mongoose Models
vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findOne = vi.fn();
    (UserModelMock as any).findById = vi.fn();
    return { UserModel: UserModelMock };
});

vi.mock("../models/Event.js", () => {
    const EventModelMock = vi.fn();
    (EventModelMock as any).findById = vi.fn();
    return { EventModel: EventModelMock };
});

// Mock AppointmentModel
vi.mock("../models/Appointment.js", () => {
    const AppointmentModelMock = vi.fn().mockImplementation(function (data) {
        const doc = { ...data, _id: "mock_appointment_id" };
        doc.save = vi.fn().mockResolvedValue(doc);
        return doc;
    });
    return { AppointmentModel: AppointmentModelMock };
});

// Mock Mailer
vi.mock("../utility/mailer.js", () => ({
    sendEventInvitation: vi.fn().mockResolvedValue({})
}));

// Mock DB Connection
vi.mock("../config/dbConn.js", () => ({
    dataBaseConn: vi.fn()
}));

// Mock Google Controller to assume success
vi.mock("../controller/google_controller.js", () => ({
    checkFree: vi.fn().mockResolvedValue(true),
    insertGoogleEvent: vi.fn().mockResolvedValue({ status: "confirmed" }),
    events: vi.fn().mockResolvedValue([]),
    freeBusy: vi.fn().mockResolvedValue({ data: { calendars: {} } }),
    revokeScopes: vi.fn().mockResolvedValue({}),
    generateAuthUrl: vi.fn().mockReturnValue("http://auth.url"),
    getCalendarList: vi.fn().mockResolvedValue([]),
    googleCallback: vi.fn().mockResolvedValue({})
}));


describe("LTI Transient User Support", () => {
    let app: any;
    let transientToken: string;
    let transientTokenRecruiter: string;
    const mockEventId = "mock_event_id_unique";
    const mockUserId = "mock_user_id_unique";

    beforeAll(async () => {
        app = init(0);
        process.env.JWT_SECRET = "test_secret";

        // Create transient token (no _id) - Student role
        const payloadStudent = {
            sub: "lti_student_123",
            name: "Transient Student",
            email: "student@example.com",
            roles: ["student"],
            picture: "http://example.com/pic.jpg"
        };
        transientToken = jwt.sign(payloadStudent, process.env.JWT_SECRET as string);

        // Create transient token (no _id) - Recruiter role
        const payloadRecruiter = {
            sub: "lti_recruiter_456",
            name: "Transient Recruiter",
            email: "recruiter@example.com",
            roles: ["recruiter"],
            picture: "http://example.com/pic_recruiter.jpg"
        };
        transientTokenRecruiter = jwt.sign(payloadRecruiter, process.env.JWT_SECRET as string);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterAll(async () => {
        if (app) app.close();
    });

    const mockQuery = (result: any) => {
        return {
            exec: vi.fn().mockResolvedValue(result),
            select: vi.fn().mockReturnThis(),
        };
    };

    describe("GET /api/v1/user/transient", () => {
        it("should return transient user data for LTI token in cookie", async () => {
            const res = await request(app)
                .get("/api/v1/user/transient")
                .set("Cookie", [`lti_token=${transientToken}`]);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                name: "Transient Student",
                email: "student@example.com",
                picture_url: "http://example.com/pic.jpg",
                isTransient: true
            });
            expect(res.body._id).toBeUndefined();
        });

        it("should return 401 for invalid token", async () => {
            const res = await request(app)
                .get("/api/v1/user/transient")
                .set("Cookie", [`lti_token=invalid.token`]);

            expect(res.status).toBe(401);
        });
    });

    describe("GET /api/v1/event/ (Restricted Route)", () => {
        it("should deny access to transient user with only lti_token", async () => {
            const res = await request(app)
                .get("/api/v1/event/")
                .set("Cookie", [`lti_token=${transientToken}`]);

            expect(res.status).toBe(401);
        });
    });

    describe("POST /api/v1/event/:id/slot (insertEvent) with Roles", () => {
        const mockPersistentUser = {
            _id: mockUserId,
            name: "EventManager",
            email: "manager@example.com",
            push_calendars: []
        };

        const mockRestrictedEvent = {
            _id: mockEventId,
            user: mockPersistentUser._id,
            name: "Restricted Interview",
            duration: 30,
            allowed_roles: ["recruiter"]
        };

        it("should allow transient user with correct role to book", async () => {
            // Mock Event finding
            (EventModel.findById as any).mockImplementation(() => mockQuery(mockRestrictedEvent));

            // Mock User finding (for event owner)
            (UserModel.findOne as any).mockImplementation(() => mockQuery(mockPersistentUser));
            (UserModel.findById as any).mockImplementation(() => mockQuery(mockPersistentUser));

            const res = await request(app)
                .post(`/api/v1/event/${mockEventId}/slot`)
                .set("Authorization", `Bearer ${transientTokenRecruiter}`)
                .send({
                    start: new Date().toISOString(),
                    attendeeName: "Transient Recruiter",
                    attendeeEmail: "recruiter@example.com",
                    description: "Interview"
                });



            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it("should deny transient user with incorrect role", async () => {
            // Mock Event finding
            (EventModel.findById as any).mockImplementation(() => mockQuery(mockRestrictedEvent));

            const res = await request(app)
                .post(`/api/v1/event/${mockEventId}/slot`)
                .set("Authorization", `Bearer ${transientToken}`)
                .send({
                    start: new Date().toISOString(),
                    attendeeName: "Transient Student",
                    attendeeEmail: "student@example.com",
                    description: "Interview"
                });

            expect(res.status).toBe(403);
            expect(res.body.error).toContain("Access denied");
        });
    });
});
