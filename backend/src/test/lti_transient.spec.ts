
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../server.js";
import { UserModel } from "../models/User.js";
import { EventModel } from "../models/Event.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

describe("LTI Transient User Support", () => {
    let persistentUser;
    let restrictedEvent;
    let transientToken;
    let transientTokenRecruiter;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/appointme-test");
        }

        const uniqueId = new mongoose.Types.ObjectId().toString();

        // Create a persistent user who owns the event
        persistentUser = new UserModel({
            _id: uniqueId,
            name: "EventManager",
            email: `manager_${uniqueId}@example.com`,
            user_url: `manager_${uniqueId}`,
            picture_url: `http://example.com/${uniqueId}.jpg`
        });
        await persistentUser.save();

        // Create a restricted event
        const startDate = new Date();
        startDate.setMinutes(0, 0, 0); // Start of hour
        restrictedEvent = new EventModel({
            user: persistentUser._id,
            name: "Restricted Interview",
            url: `interview_${uniqueId}`,
            duration: 30,
            allowed_roles: ["recruiter"] // Only recruiters can book
        });
        await restrictedEvent.save();

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

    afterAll(async () => {
        await UserModel.deleteMany({});
        await EventModel.deleteMany({});
    });

    describe("GET /api/v1/user/me", () => {
        it("should return transient user data for LTI token without _id", async () => {
            const res = await request(app)
                .get("/api/v1/user/me")
                .set("Authorization", `Bearer ${transientToken}`);

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
                .get("/api/v1/user/me")
                .set("Authorization", `Bearer invalid.token`);

            expect(res.status).toBe(401);
        });
    });

    describe("POST /api/v1/event/:id/book (insertEvent)", () => {
        it("should allow transient user with correct role to book ", async () => {
            // Recruiter role required
            const res = await request(app)
                .post(`/api/v1/event/${restrictedEvent._id}/book`)
                .set("Authorization", `Bearer ${transientTokenRecruiter}`)
                .send({
                    start: new Date().toISOString(),
                    attendeeName: "Transient Recruiter",
                    attendeeEmail: "recruiter@example.com",
                    description: "Interview"
                });

            // We expect success or at least passing the role check (failed due to other reasons e.g. calendar push is fine)
            // But here we mock minimal dependencies only if needed. 
            // Ideally it should pass role check. Status might be 200 or 400 depending on downstream services.
            expect([200, 201]).toContain(res.status);
        });

        it("should deny transient user with incorrect role", async () => {
            // Student role, but 'recruiter' required
            const res = await request(app)
                .post(`/api/v1/event/${restrictedEvent._id}/book`)
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
