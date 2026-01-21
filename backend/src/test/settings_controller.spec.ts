
import { describe, expect, it, vi, beforeEach } from 'vitest';
import request from "supertest";
import { UserModel } from "../models/User.js";
import { EventModel } from "../models/Event.js";

// Mock dependencies
vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findById = vi.fn();
    (UserModelMock as any).findByIdAndUpdate = vi.fn();
    return { UserModel: UserModelMock };
});

vi.mock("../models/Event.js", () => {
    const EventModelMock = vi.fn();
    (EventModelMock as any).find = vi.fn();
    (EventModelMock as any).findOneAndUpdate = vi.fn();
    return { EventModel: EventModelMock };
});

vi.mock("../handlers/middleware.js", () => {
    return {
        middleware: {
            requireAuth: vi.fn((req, res, next) => {
                req.user_id = "test_user_id";
                req['user_id'] = "test_user_id";
                next();
            }),
            optionalAuth: vi.fn((req, res, next) => {
                req['user_id'] = "test_user_id";
                next();
            })
        }
    }
});

vi.mock("csrf-csrf", () => {
    return {
        doubleCsrf: () => ({
            doubleCsrfProtection: (req, res, next) => next(),
            generateCsrfToken: () => "mock_csrf_token"
        })
    };
});

describe("Settings Controller", () => {
    let app: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = "test_secret";
        const { init } = await import("../server.js");
        app = init(0);
    });

    describe("PUT /api/v1/user/settings", () => {
        it("should import valid settings correctly", async () => {
            const userSettings = { theme: "dark", language: "en" };
            const events = [{ title: "Event 1", url: "http://example.com/1" }];

            (UserModel.findByIdAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({})
            });
            (EventModel.findOneAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({})
            });

            const res = await request(app)
                .put("/api/v1/user/settings")
                .send({ user: userSettings, events });

            expect(res.status).toBe(200);
            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "test_user_id",
                { $set: userSettings },
                { new: true, runValidators: true }
            );
            expect(EventModel.findOneAndUpdate).toHaveBeenCalled();
        });

        it("should strip keys starting with $ from userSettings", async () => {
            const unsafeSettings = {
                theme: "dark",
                "$where": "sleep(1000)",
                "$ne": "value"
            };

            (UserModel.findByIdAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({})
            });

            const res = await request(app)
                .put("/api/v1/user/settings")
                .send({ user: unsafeSettings });

            expect(res.status).toBe(200);

            const updateCall = (UserModel.findByIdAndUpdate as any).mock.calls[0];
            const updateArg = updateCall[1];
            expect(updateArg.$set.theme).toBe("dark");
            expect(updateArg.$set["$where"]).toBeUndefined();
            expect(updateArg.$set["$ne"]).toBeUndefined();
        });

        it("should strip keys starting with $ from eventData", async () => {
            const unsafeEvent = {
                title: "Safe Event",
                url: "safe-url",
                "$where": "sleep(1000)"
            };

            (EventModel.findOneAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({})
            });

            const res = await request(app)
                .put("/api/v1/user/settings")
                .send({ events: [unsafeEvent] });

            expect(res.status).toBe(200);

            const updateCall = (EventModel.findOneAndUpdate as any).mock.calls[0];
            const updateArg = updateCall[1];
            expect(updateArg.$set.title).toBe("Safe Event");
            expect(updateArg.$set["$where"]).toBeUndefined();
        });

        it("should validate event url", async () => {
            const invalidEvent = {
                title: "Invalid Event",
                url: { "$ne": null } // Object injection
            };

            (EventModel.findOneAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({})
            });

            const res = await request(app)
                .put("/api/v1/user/settings")
                .send({ events: [invalidEvent] });

            expect(res.status).toBe(200);
            expect(EventModel.findOneAndUpdate).not.toHaveBeenCalled();
        });

        it("should remove sensitive fields from userSettings", async () => {
            const sensitiveSettings = {
                theme: "dark",
                _id: "fake_id",
                email: "fake@email.com",
                google_tokens: "fake_token",
                roles: ["admin"]
            };

            (UserModel.findByIdAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({})
            });

            const res = await request(app)
                .put("/api/v1/user/settings")
                .send({ user: sensitiveSettings });

            expect(res.status).toBe(200);

            const updateCall = (UserModel.findByIdAndUpdate as any).mock.calls[0];
            const updateArg = updateCall[1];
            expect(updateArg.$set.theme).toBe("dark");
            expect(updateArg.$set._id).toBeUndefined();
            expect(updateArg.$set.email).toBeUndefined();
            expect(updateArg.$set.google_tokens).toBeUndefined();
            expect(updateArg.$set.roles).toBeUndefined();
        });

        it("should handle unique constraint violations for user_url and picture_url", async () => {
            const conflictingSettings = {
                theme: "dark",
                user_url: "taken_url",
                picture_url: "taken_picture_url"
            };

            // Simulate collision check finding existing users
            (UserModel as any).find = vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    lean: vi.fn().mockReturnValue({
                        exec: vi.fn().mockImplementation(() => {
                            // Return conflict for both
                            return Promise.resolve([
                                { _id: "other_user_1", user_url: "taken_url" },
                                { _id: "other_user_2", picture_url: "taken_picture_url" }
                            ]);
                        })
                    })
                })
            });

            (UserModel.findByIdAndUpdate as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({})
            });

            const res = await request(app)
                .put("/api/v1/user/settings")
                .send({ user: conflictingSettings });

            expect(res.status).toBe(200);

            const updateCall = (UserModel.findByIdAndUpdate as any).mock.calls[0];
            const updateArg = updateCall[1];
            expect(updateArg.$set.theme).toBe("dark");
            // These should be undefined because they conflict
            expect(updateArg.$set.user_url).toBeUndefined();
            expect(updateArg.$set.picture_url).toBeUndefined();
        });
    });

    describe("GET /api/v1/user/settings", () => {
        it("should export settings correctly", async () => {
            const mockUser = {
                _id: "test_user_id",
                email: "test@example.com",
                google_tokens: "secret_tokens",
                roles: ["user"],
                createdAt: new Date(),
                updatedAt: new Date(),
                __v: 0,
                theme: "dark",
                language: "en"
            };

            const mockEvents = [
                {
                    _id: "event_id_1",
                    user: "test_user_id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    __v: 0,
                    title: "Event 1",
                    url: "event-1"
                }
            ];

            (UserModel.findById as any).mockReturnValue({
                lean: vi.fn().mockReturnValue({
                    exec: vi.fn().mockResolvedValue(mockUser)
                })
            });

            (EventModel.find as any).mockReturnValue({
                lean: vi.fn().mockReturnValue({
                    exec: vi.fn().mockResolvedValue(mockEvents)
                })
            });

            const res = await request(app).get("/api/v1/user/settings");

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/application\/json/);
            expect(res.headers['content-disposition']).toMatch(/attachment; filename="settings-.*\.json"/);

            expect(res.body.user).toEqual({
                theme: "dark",
                language: "en",
                email: "test@example.com",
                roles: ["user"]
            });
            expect(res.body.user._id).toBeUndefined();
            expect(res.body.user.google_tokens).toBeUndefined();

            expect(res.body.events).toHaveLength(1);
            expect(res.body.events[0]).toEqual({
                title: "Event 1",
                url: "event-1"
            });
            expect(res.body.events[0]._id).toBeUndefined();
            expect(res.body.events[0].user).toBeUndefined();
        });

        it("should handle user not found", async () => {
            (UserModel.findById as any).mockReturnValue({
                lean: vi.fn().mockReturnValue({
                    exec: vi.fn().mockResolvedValue(null)
                })
            });

            const res = await request(app).get("/api/v1/user/settings");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "User not found" });
        });

        it("should handle export errors", async () => {
            (UserModel.findById as any).mockReturnValue({
                lean: vi.fn().mockReturnValue({
                    exec: vi.fn().mockRejectedValue(new Error("DB Error"))
                })
            });

            const res = await request(app).get("/api/v1/user/settings");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: "Failed to export settings" });
        });
    });
});
