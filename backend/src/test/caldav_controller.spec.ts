import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { UserModel } from "../models/User.js";
import { DAVClient } from 'tsdav';
import * as caldavController from '../controller/caldav_controller.js';
import { Request, Response } from 'express';

// Mock DAVClient
vi.mock('tsdav', () => {
    const DAVClientMock = vi.fn().mockImplementation(function () {
        return ({
            login: vi.fn().mockResolvedValue(true),
            fetchCalendars: vi.fn().mockResolvedValue([
                { url: 'url1', displayName: 'Calendar 1' },
                { url: 'url2', displayName: 'Calendar 2' }
            ]),
            fetchCalendarObjects: vi.fn().mockResolvedValue([
                {
                    data: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BookMe//EN
BEGIN:VEVENT
UID:12345
DTSTAMP:20251224T090000Z
DTSTART:20251224T100000Z
DTEND:20251224T110000Z
SUMMARY:Test Event
END:VEVENT
END:VCALENDAR`
                }
            ]),
            createCalendarObject: vi.fn().mockResolvedValue({ ok: true, status: 201, statusText: 'Created' }),
        });
    })
    return { DAVClient: DAVClientMock };
});

// Mock UserModel
vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn().mockImplementation(function (data) {
        return ({
            ...data,
            save: vi.fn().mockResolvedValue(data)
        });
    });
    (UserModelMock as any).findOne = vi.fn();
    (UserModelMock as any).updateOne = vi.fn();
    return { UserModel: UserModelMock };
});

// Mock Encryption
vi.mock('../utility/encryption.js', () => ({
    encrypt: vi.fn((text) => `encrypted_${text}`),
    decrypt: vi.fn((text) => text.replace('encrypted_', '')),
}));

// Mock logger
vi.mock('../logging.js', () => ({
    logger: {
        info: vi.fn(),
        debug: vi.fn(),
        error: vi.fn((...args) => console.error("Logger Error:", ...args)),
        warn: vi.fn(),
    }
}));

// Mock DB Connection
vi.mock("../config/dbConn.js", () => ({
    dataBaseConn: vi.fn()
}));

describe("CalDAV Controller Unit Tests", () => {

    // Mock Request and Response
    const mockRequest = () => {
        const req: Partial<Request> = {
            body: {},
            params: {},
            headers: {}
        };
        // @ts-ignore
        req['user_id'] = "test_user_id";
        return req as Request;
    };

    const mockResponse = () => {
        const res: Partial<Response> = {};
        res.status = vi.fn().mockReturnValue(res);
        res.json = vi.fn().mockReturnValue(res);
        res.send = vi.fn().mockReturnValue(res);
        return res as Response;
    };

    describe("addAccount", () => {
        it("should add a new account successfully", async () => {
            const req = mockRequest();
            req.body = {
                serverUrl: "https://caldav.example.com",
                username: "user",
                password: "password",
                name: "Test Account",
                email: "test@example.com"
            };
            const res = mockResponse();

            await caldavController.addAccount(req, res);

            // expect(res.status).toHaveBeenCalledWith(200); // Not called explicitly
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

            expect(UserModel.updateOne).toHaveBeenCalledWith(
                { _id: "test_user_id" },
                expect.objectContaining({
                    $push: expect.objectContaining({
                        caldav_accounts: expect.objectContaining({
                            serverUrl: "https://caldav.example.com",
                            email: "test@example.com"
                        })
                    })
                })
            );
        });

        it("should retry with homeUrl if first attempt fails", async () => {
            const { DAVClient } = await import('tsdav');
            const loginMock = vi.fn()
                .mockRejectedValueOnce(new Error("First login failed"))
                .mockResolvedValueOnce(true);

            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: loginMock,
                    // @ts-ignore
                    fetchCalendars: vi.fn().mockResolvedValue([]),
                });
            })

            const req = mockRequest();
            req.body = {
                serverUrl: "https://caldav.example.com",
                username: "user",
                password: "password",
                name: "Retry Account"
            };
            const res = mockResponse();

            await caldavController.addAccount(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
            expect(loginMock).toHaveBeenCalledTimes(2);
        });

        it("should return error if both attempts fail", async () => {
            const { DAVClient } = await import('tsdav');
            const loginMock = vi.fn().mockRejectedValue(new Error("All logins failed"));

            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: loginMock,
                });
            })

            const req = mockRequest();
            req.body = {
                serverUrl: "https://caldav.example.com",
                username: "user",
                password: "password",
                name: "Fail Account"
            };
            const res = mockResponse();

            await caldavController.addAccount(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Failed to connect to CalDAV server' }));
        });
    });

    describe("listAccounts", () => {
        it("should list accounts", async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    caldav_accounts: [
                        { _id: "acc1", name: "Account 1", serverUrl: "url1" }
                    ]
                })
            });

            const req = mockRequest();
            const res = mockResponse();

            await caldavController.listAccounts(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ name: "Account 1" })
            ]));
        });

        it("should handle error when listing accounts", async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockRejectedValue(new Error("DB Error"))
            });

            const req = mockRequest();
            const res = mockResponse();

            await caldavController.listAccounts(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Failed to list accounts') }));
        });
    });

    describe("removeAccount", () => {
        it("should remove an account", async () => {
            const req = mockRequest();
            req.params.id = "acc123";
            const res = mockResponse();

            await caldavController.removeAccount(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
            expect(UserModel.updateOne).toHaveBeenCalledWith(
                { _id: "test_user_id" },
                { $pull: { caldav_accounts: { _id: "acc123" } } }
            );
        });

        it("should handle error when removing account", async () => {
            (UserModel.updateOne as any).mockRejectedValue(new Error("DB Error"));

            const req = mockRequest();
            req.params.id = "acc123";
            const res = mockResponse();

            await caldavController.removeAccount(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Failed to remove account') }));
        });
    });

    describe("listCalendars", () => {
        it("should list calendars for an account", async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    caldav_accounts: [
                        { _id: "acc1", name: "Account 1", serverUrl: "url1", username: "u", password: "p" }
                    ]
                })
            });

            const req = mockRequest();
            req.params.id = "acc1";
            const res = mockResponse();

            // Re-mock DAVClient to ensure default behavior for this test
            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([
                        { url: 'url1', displayName: 'Calendar 1' },
                        { url: 'url2', displayName: 'Calendar 2' }
                    ]),
                });
            })

            await caldavController.listCalendars(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ id: 'url1' })
            ]));
        });

        it("should return 404 if account not found", async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    caldav_accounts: []
                })
            });

            const req = mockRequest();
            req.params.id = "acc1";
            const res = mockResponse();

            await caldavController.listCalendars(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Account not found' }));
        });
    });

    describe("getBusySlots", () => {
        it("should return busy slots from fetched events", async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    _id: "test_user_id",
                    caldav_accounts: [
                        { _id: "acc1", name: "Account 1", serverUrl: "url1", username: "u", password: "p" }
                    ],
                    pull_calendars: ["url1"]
                })
            });

            const { DAVClient } = await import('tsdav');
            const fetchObjectsMock = vi.fn().mockResolvedValue([
                {
                    data: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BookMe//EN
BEGIN:VEVENT
UID:12345
DTSTAMP:20251224T090000Z
DTSTART:20251224T100000Z
DTEND:20251224T110000Z
SUMMARY:Test Event
END:VEVENT
END:VCALENDAR`
                }
            ]);

            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([
                        { url: 'url1', displayName: 'Calendar 1' }
                    ]),
                    fetchCalendarObjects: fetchObjectsMock
                });
            })

            const timeMin = "2025-12-24T00:00:00Z";
            const timeMax = "2025-12-25T00:00:00Z";

            const slots = await caldavController.getBusySlots("test_user_id", timeMin, timeMax);

            expect(slots).toBeDefined();
            // The default mock logic should parse the event
            expect(slots.length).toBeGreaterThan(0);
        });
    });

    describe("createCalDavEvent", () => {
        it("should create an event successfully", async () => {
            const { DAVClient } = await import('tsdav');
            const createObjectMock = vi.fn().mockResolvedValue({
                ok: true,
                status: 201,
                statusText: "Created",
                text: vi.fn().mockResolvedValue("")
            });

            const fetchObjectsMock = vi.fn().mockResolvedValue([
                {
                    data: `BEGIN:VCALENDAR
PRODID:-//BookMe//EN
BEGIN:VEVENT
UID:verified-uid
SUMMARY:Christmas Brunch
END:VEVENT
END:VCALENDAR` }
            ]);

            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([
                        { url: "https://caldav.example.com/calendar-1", displayName: "Main Calendar" }
                    ]),
                    createCalendarObject: createObjectMock,
                    // Verification fetch
                    fetchCalendarObjects: fetchObjectsMock
                });
            })

            const user = {
                caldav_accounts: [
                    {
                        serverUrl: "https://caldav.example.com",
                        username: "user",
                        password: "encrypted_password",
                        name: "Main Account"
                    }
                ],
                push_calendar: "https://caldav.example.com/calendar-1"
            };

            const eventDetails = {
                start: { dateTime: "2025-12-25T10:00:00Z" },
                end: { dateTime: "2025-12-25T11:00:00Z" },
                summary: "Christmas Brunch",
                description: "Desc",
                location: "Loc",
                organizer: { displayName: "Org", email: "org@test.com" },
                attendees: []
            };

            // @ts-ignore
            const result = await caldavController.createCalDavEvent(user as any, eventDetails, undefined, "https://caldav.example.com/calendar-1");

            expect(result).toBeDefined();
            expect(result.ok).toBe(true);
        });

        it("should use account email as organizer if configured for createCalDavEvent", async () => {
            const { DAVClient } = await import('tsdav');
            const createObjectMock = vi.fn().mockResolvedValue({
                ok: true,
                status: 201,
                statusText: "Created",
                text: vi.fn().mockResolvedValue("")
            });

            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([
                        { url: "https://caldav.example.com/calendar-1", displayName: "Main Calendar" }
                    ]),
                    createCalendarObject: createObjectMock,
                    fetchCalendarObjects: vi.fn()
                });
            })

            const user = {
                caldav_accounts: [
                    {
                        serverUrl: "https://caldav.example.com",
                        username: "user",
                        password: "encrypted_password",
                        name: "Main Account",
                        email: "custom@example.com"
                    }
                ],
                push_calendar: "https://caldav.example.com/calendar-1"
            };

            const eventDetails = {
                start: { dateTime: "2025-12-25T10:00:00Z" },
                end: { dateTime: "2025-12-25T11:00:00Z" },
                summary: "Christmas Brunch",
                description: "Desc",
                location: "Loc",
                organizer: { displayName: "Org", email: "original@test.com" },
                attendees: []
            };

            // @ts-ignore
            await caldavController.createCalDavEvent(user as any, eventDetails, undefined, "https://caldav.example.com/calendar-1");

            // Check if the generated ICS content in the call includes the custom email
            const createCall = createObjectMock.mock.calls[0][0];
            expect(createCall.iCalString).toContain("ORGANIZER;CN=Org:mailto:custom@example.com");
        });

        it("should throw error if account not found for push calendar", async () => {
            const user = {
                caldav_accounts: [],
                push_calendar: "https://caldav.example.com/calendar-1"
            };
            const eventDetails = {};

            // @ts-ignore
            await expect(caldavController.createCalDavEvent(user as any, eventDetails, undefined, "https://caldav.example.com/calendar-1"))
                .rejects.toThrow('CalDav account not found for calendar');
        });

        it("should throw error if target calendar not found", async () => {
            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([]), // No calendars found
                });
            });

            const user = {
                caldav_accounts: [
                    {
                        serverUrl: "https://caldav.example.com",
                        username: "user",
                        password: "encrypted_password",
                        name: "Main Account"
                    }
                ],
                push_calendar: "https://caldav.example.com/calendar-1"
            };
            // @ts-ignore
            await expect(caldavController.createCalDavEvent(user as any, {}, undefined, "https://caldav.example.com/calendar-1"))
                .rejects.toThrow('Target calendar not found');
        });
    });

    describe("findAccountForCalendar", () => {
        it("should find account for a given calendar URL", async () => {
            const user = {
                caldav_accounts: [
                    { _id: "acc1", name: "Account 1", serverUrl: "https://caldav.example.com", username: "u" }
                ]
            };
            // @ts-ignore
            const account = await caldavController.findAccountForCalendar(user, "https://caldav.example.com/calendars/u/cal");

            expect(account).toBeDefined();
            expect(account.name).toBe("Account 1");
        });

        it("should return undefined if no matching account found", async () => {
            const user = {
                caldav_accounts: [
                    { _id: "acc1", name: "Account 1", serverUrl: "https://other.example.com", username: "u" }
                ]
            };

            // @ts-ignore
            const account = await caldavController.findAccountForCalendar(user, "https://caldav.example.com/calendars/u/cal");

            expect(account).toBeUndefined();
        });
    });
});
