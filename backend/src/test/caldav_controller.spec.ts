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

        it("should retry with homeUrl (Direct Access) if first attempt fails", async () => {
            const { DAVClient } = await import('tsdav');
            const loginMock = vi.fn()
                .mockRejectedValueOnce(new Error("First login failed"))
                .mockResolvedValueOnce(true);

            // Mock fetchCalendarObjects to succeed for the fallback verification
            const fetchObjectsMock = vi.fn().mockResolvedValue([]);

            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: loginMock,
                    // @ts-ignore
                    fetchCalendars: vi.fn().mockResolvedValue([]),
                    fetchCalendarObjects: fetchObjectsMock
                });
            })

            const req = mockRequest();
            req.body = {
                serverUrl: "https://caldav.example.com",
                username: "user",
                password: "password",
                name: "Retry Account",
                email: "test@example.com"
            };
            const res = mockResponse();

            await caldavController.addAccount(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
            // Call 1: login() (fails)
            expect(loginMock).toHaveBeenCalledTimes(1);
            // Call 2: fetchCalendarObjects() (fallback verification)
            expect(fetchObjectsMock).toHaveBeenCalledTimes(1);
        });

        it("should return error if both attempts fail", async () => {
            const { DAVClient } = await import('tsdav');
            const loginMock = vi.fn().mockRejectedValue(new Error("All logins failed"));
            // Fallback verification also fails
            const fetchObjectsFailMock = vi.fn().mockRejectedValue(new Error("Fetch failed"));

            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: loginMock,
                    fetchCalendars: vi.fn(),
                    fetchCalendarObjects: fetchObjectsFailMock
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
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Failed to connect to CalDAV server (Discovery and Direct Access failed)' }));
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

        it("should fallback to direct account calendar if discovery returns empty and account URL not in list", async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    caldav_accounts: [
                        { _id: "acc1", name: "Account 1", serverUrl: "http://direct.url/cal", username: "u", password: "p" }
                    ]
                })
            });

            const req = mockRequest();
            req.params.id = "acc1";
            const res = mockResponse();

            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([]), // Return empty
                });
            })

            await caldavController.listCalendars(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ id: 'http://direct.url/cal', summary: 'Account 1' })
            ]));
        });

        it("should fallback when discovery throws error", async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    caldav_accounts: [
                        { _id: "acc1", name: "Account 1", serverUrl: "http://direct.url/cal", username: "u", password: "p" }
                    ]
                })
            });

            const req = mockRequest();
            req.params.id = "acc1";
            const res = mockResponse();

            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockRejectedValue(new Error('Discovery failed')),
                });
            })

            await caldavController.listCalendars(req, res);

            expect(res.json).toHaveBeenCalledWith([
                expect.objectContaining({ id: 'http://direct.url/cal', summary: 'Account 1' })
            ]);
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
        it("should return busy slots from fetched events including recurring ones", async () => {
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
BEGIN:VEVENT
UID:12345
DTSTART:20251224T100000Z
DTEND:20251224T110000Z
SUMMARY:Regular Event
END:VEVENT
BEGIN:VEVENT
UID:recur1
DTSTART:20251224T120000Z
DTEND:20251224T130000Z
RRULE:FREQ=DAILY;COUNT=2
SUMMARY:Recurring Event
END:VEVENT
END:VCALENDAR`
                }
            ]);

            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([
                        { url: 'url1', displayName: 'Calendar 1' },
                        // Fallback check in controller might trigger a find
                    ]),
                    fetchCalendarObjects: fetchObjectsMock
                });
            })

            const timeMin = "2025-12-24T00:00:00Z";
            const timeMax = "2025-12-26T00:00:00Z";

            const slots = await caldavController.getBusySlots("test_user_id", timeMin, timeMax);

            expect(slots).toBeDefined();
            expect(slots.length).toBeGreaterThan(1); // Should have regular + 2 recurrences
            // Verify fallback logic coverage by ensuring fetchCalendars was called
        });

        it("should handle error in fetchAndProcessAccountCalendars gracefully", async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    _id: "test_user_id",
                    caldav_accounts: [{ _id: "acc1", name: "Account 1", serverUrl: "url1" }],
                    pull_calendars: ["url1"]
                })
            });
            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockRejectedValue(new Error("Login failed")),
                });
            })

            const slots = await caldavController.getBusySlots("test_user_id", "2025-01-01", "2025-01-02");
            expect(slots).toEqual([]); // Should be empty, logged error
        });

        it("should fallback to direct calendar in fetchAndProcessAccountCalendars if not discovered", async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    _id: "test_user_id",
                    caldav_accounts: [{ _id: "acc1", name: "Account 1", serverUrl: "http://direct/cal", username: "u", password: "p" }],
                    pull_calendars: ["http://direct/cal"]
                })
            });

            const fetchObjectsMock = vi.fn().mockResolvedValue([
                {
                    data: `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:direct1
DTSTART:20250101T100000Z
DTEND:20250101T110000Z
SUMMARY:Direct Event
END:VEVENT
END:VCALENDAR`
                }
            ]);

            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([]), // Return empty to trigger fallback
                    fetchCalendarObjects: fetchObjectsMock
                });
            });

            const slots = await caldavController.getBusySlots("test_user_id", "2025-01-01T00:00:00Z", "2025-01-02T00:00:00Z");

            expect(slots.length).toBe(1);
            expect(fetchObjectsMock).toHaveBeenCalled();
        });

        it("should ignore non-VEVENT objects and events outside range", async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    _id: "test_user_id",
                    caldav_accounts: [{ _id: "acc1", name: "Account 1", serverUrl: "url1", username: "u", password: "p" }],
                    pull_calendars: ["url1"]
                })
            });

            const fetchObjectsMock = vi.fn().mockResolvedValue([
                {
                    data: `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VTODO
UID:todo1
SUMMARY:Not an event
END:VTODO
BEGIN:VEVENT
UID:outside
DTSTART:20240101T100000Z
DTEND:20240101T110000Z
SUMMARY:Outside Range
END:VEVENT
END:VCALENDAR`
                },
                { data: null } // Should be ignored
            ]);

            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([{ url: 'url1', displayName: 'Calendar 1' }]),
                    fetchCalendarObjects: fetchObjectsMock
                });
            });

            const slots = await caldavController.getBusySlots("test_user_id", "2025-01-01T00:00:00Z", "2025-01-02T00:00:00Z");
            expect(slots.length).toBe(0);
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
            expect(result.response.ok).toBe(true);
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
                    fetchCalendarObjects: vi.fn().mockResolvedValue([])
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
            expect(createCall.iCalString).toContain('ORGANIZER;CN="Org":mailto:custom@example.com');
        });

        it("should verify successfully even if fetch returns many objects", async () => {
            const { DAVClient } = await import('tsdav');
            const createObjectMock = vi.fn().mockResolvedValue({
                ok: true,
                status: 201,
                statusText: "Created",
                text: vi.fn().mockResolvedValue("")
            });

            // Mock fetch to return multiple objects, one matching roughly what we expect (though we can't match strict UID easily without deep mocking)
            // Actually, we can just assert that the function completes successfully.
            // The verification logic inside logs a warning if not found, but doesn't throw.
            // So we just want to ensure it doesn't crash given many objects.
            const fetchObjectsMock = vi.fn().mockResolvedValue([
                { data: 'BEGIN:VCALENDAR\nUID:other-uid\nEND:VCALENDAR' },
                { data: 'BEGIN:VCALENDAR\nUID:another-uid\nEND:VCALENDAR' },
            ]);

            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([
                        { url: "https://caldav.example.com/calendar-1", displayName: "Main Calendar" }
                    ]),
                    createCalendarObject: createObjectMock,
                    fetchCalendarObjects: fetchObjectsMock
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

            const eventDetails = {
                start: { dateTime: "2025-12-25T10:00:00Z" },
                end: { dateTime: "2025-12-25T11:00:00Z" },
                summary: "Ex",
                description: "Desc",
                location: "Loc",
                organizer: { displayName: "Org", email: "org@test.com" },
                attendees: []
            };

            // @ts-ignore
            const result = await caldavController.createCalDavEvent(user as any, eventDetails, undefined, "https://caldav.example.com/calendar-1");

            expect(result.response.ok).toBe(true);
            expect(fetchObjectsMock).toHaveBeenCalled();
        });

        it("should throw error if creation fails", async () => {
            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([
                        { url: "https://caldav.example.com/calendar-1", displayName: "Main" }
                    ]),
                    createCalendarObject: vi.fn().mockResolvedValue({
                        ok: false,
                        status: 500,
                        statusText: "Server Error",
                        text: vi.fn().mockResolvedValue("Internal Error")
                    })
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
            };
            const eventDetails = {
                start: { dateTime: "2025-12-25T10:00:00Z" },
                end: { dateTime: "2025-12-25T11:00:00Z" },
                summary: "Christmas Brunch",
                organizer: { displayName: "Org", email: "org@test.com" },
                attendees: []
            };

            // @ts-ignore
            await expect(caldavController.createCalDavEvent(user as any, eventDetails, undefined, "https://caldav.example.com/calendar-1"))
                .rejects.toThrow('Failed to create event');
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

        it("should fallback to direct calendar in createCalDavEvent if not discovered", async () => {
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
                    fetchCalendars: vi.fn().mockResolvedValue([]), // Empty discovery
                    createCalendarObject: createObjectMock,
                    fetchCalendarObjects: vi.fn().mockResolvedValue([])
                });
            });

            const user = {
                caldav_accounts: [
                    {
                        serverUrl: "https://caldav.example.com/calendar-1", // Matches target
                        username: "user",
                        password: "p",
                        name: "Main Account"
                    }
                ]
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
            expect(result.response.ok).toBe(true);
        });

        it("should handle verification failure gracefully", async () => {
            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([{ url: "url", displayName: "Cal" }]),
                    createCalendarObject: vi.fn().mockResolvedValue({ ok: true, status: 201 }),
                    fetchCalendarObjects: vi.fn().mockResolvedValue([]) // Return empty to fail verification
                });
            });

            const user = {
                caldav_accounts: [{ serverUrl: "url", username: "u", password: "p", name: "A" }]
            };
            const eventDetails = {
                start: { dateTime: "2025-12-25T10:00:00Z" },
                end: { dateTime: "2025-12-25T11:00:00Z" },
                summary: "Ex",
                description: "Desc",
                location: "Loc",
                organizer: { displayName: "Org", email: "org@test.com" },
                attendees: []
            };

            // @ts-ignore
            const result = await caldavController.createCalDavEvent(user as any, eventDetails, undefined, "url");
            // Should succeed despite verification failing (it just logs warning)
            expect(result.response.ok).toBe(true);
        });

        it("should handle verification exception gracefully", async () => {
            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([{ url: "url", displayName: "Cal" }]),
                    createCalendarObject: vi.fn().mockResolvedValue({ ok: true, status: 201 }),
                    fetchCalendarObjects: vi.fn().mockRejectedValue(new Error("Verification Network Error"))
                });
            });

            const user = {
                caldav_accounts: [{ serverUrl: "url", username: "u", password: "p", name: "A" }]
            };
            const eventDetails = {
                start: { dateTime: "2025-12-25T10:00:00Z" },
                end: { dateTime: "2025-12-25T11:00:00Z" },
                summary: "Ex",
                organizer: { displayName: "Org", email: "org@test.com" },
                attendees: []
            };

            // @ts-ignore
            const result = await caldavController.createCalDavEvent(user as any, eventDetails, undefined, "url");
            expect(result.response.ok).toBe(true);
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

        it("should handle error parsing account URL gracefully", async () => {
            const user = {
                caldav_accounts: [
                    { _id: "acc1", name: "Account 1", serverUrl: "not-a-valid-url", username: "u" }
                ]
            };
            // @ts-ignore
            const account = await caldavController.findAccountForCalendar(user, "https://caldav.example.com/calendars/u/cal");
            expect(account).toBeUndefined();
        });
    });

    describe("processParsedEvent", () => {
        it("should handle recurrences returning Temporal-like objects (epochMilliseconds)", () => {
            const startRange = new Date("2024-01-01T00:00:00Z");
            const endRange = new Date("2024-01-02T00:00:00Z");
            const busySlots: { start: Date, end: Date }[] = [];

            const event = {
                type: 'VEVENT',
                // Main event outside range
                start: new Date("2023-12-01T10:00:00Z"),
                end: new Date("2023-12-01T11:00:00Z"),
                rrule: {
                    between: vi.fn().mockReturnValue([
                        {
                            epochMilliseconds: new Date("2024-01-01T10:00:00Z").getTime(),
                            toString: () => "2024-01-01T10:00:00Z"
                        }
                    ])
                }
            };

            caldavController.processParsedEvent(event, startRange, endRange, busySlots);

            expect(busySlots.length).toBe(1);
            expect(busySlots[0].start.toISOString()).toBe("2024-01-01T10:00:00.000Z");
        });

        it("should handle recurrences returning Temporal-like objects (toInstant)", () => {
            const startRange = new Date("2024-01-01T00:00:00Z");
            const endRange = new Date("2024-01-02T00:00:00Z");
            const busySlots: { start: Date, end: Date }[] = [];

            const event = {
                type: 'VEVENT',
                // Main event outside range
                start: new Date("2023-12-01T10:00:00Z"),
                end: new Date("2023-12-01T11:00:00Z"),
                rrule: {
                    between: vi.fn().mockReturnValue([
                        {
                            toInstant: () => ({ epochMilliseconds: new Date("2024-01-01T10:00:00Z").getTime() }),
                            toString: () => "2024-01-01T10:00:00Z"
                        }
                    ])
                }
            };

            caldavController.processParsedEvent(event, startRange, endRange, busySlots);

            expect(busySlots.length).toBe(1);
            expect(busySlots[0].start.toISOString()).toBe("2024-01-01T10:00:00.000Z");
        });

        it("should handle recurrences returning objects using toString fallback", () => {
            const startRange = new Date("2024-01-01T00:00:00Z");
            const endRange = new Date("2024-01-02T00:00:00Z");
            const busySlots: { start: Date, end: Date }[] = [];

            const event = {
                type: 'VEVENT',
                // Main event outside range
                start: new Date("2023-12-01T10:00:00Z"),
                end: new Date("2023-12-01T11:00:00Z"),
                rrule: {
                    between: vi.fn().mockReturnValue([
                        {
                            toString: () => "2024-01-01T10:00:00.000Z"
                        }
                    ])
                }
            };

            caldavController.processParsedEvent(event, startRange, endRange, busySlots);

            expect(busySlots.length).toBe(1);
            expect(busySlots[0].start.toISOString()).toBe("2024-01-01T10:00:00.000Z");
        });

        it("should handle recurrences returning custom objects with getTime", () => {
            const startRange = new Date("2024-01-01T00:00:00Z");
            const endRange = new Date("2024-01-02T00:00:00Z");
            const busySlots: { start: Date, end: Date }[] = [];

            const event = {
                type: 'VEVENT',
                // Main event outside range
                start: new Date("2023-12-01T10:00:00Z"),
                end: new Date("2023-12-01T11:00:00Z"),
                rrule: {
                    between: vi.fn().mockReturnValue([
                        {
                            getTime: () => new Date("2024-01-01T10:00:00Z").getTime()
                        }
                    ])
                }
            };

            caldavController.processParsedEvent(event, startRange, endRange, busySlots);

            expect(busySlots.length).toBe(1);
            expect(busySlots[0].start.toISOString()).toBe("2024-01-01T10:00:00.000Z");
        });
    });

    describe("verifyEvent", () => {
        it("should return false if account not found", async () => {
            const user = { caldav_accounts: [] };
            // @ts-ignore
            const result = await caldavController.verifyEvent(user, "uid", "http://cal", new Date(), new Date());
            expect(result).toBe(false);
        });

        it("should return true if event found in calendar", async () => {
            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([
                        { url: "http://cal", displayName: "Cal" }
                    ]),
                    fetchCalendarObjects: vi.fn().mockResolvedValue([
                        { data: "BEGIN:VCALENDAR\nUID:found_uid\nEND:VCALENDAR" }
                    ])
                });
            });

            const user = {
                caldav_accounts: [{ serverUrl: "http://cal", username: "u", password: "p" }]
            };
            // @ts-ignore
            const result = await caldavController.verifyEvent(user, "found_uid", "http://cal", new Date(), new Date());
            expect(result).toBe(true);
        });

        it("should return false if event not found", async () => {
            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockResolvedValue(true),
                    fetchCalendars: vi.fn().mockResolvedValue([
                        { url: "http://cal", displayName: "Cal" }
                    ]),
                    fetchCalendarObjects: vi.fn().mockResolvedValue([
                        { data: "BEGIN:VCALENDAR\nUID:other_uid\nEND:VCALENDAR" }
                    ])
                });
            });

            const user = {
                caldav_accounts: [{ serverUrl: "http://cal", username: "u", password: "p" }]
            };
            // @ts-ignore
            const result = await caldavController.verifyEvent(user, "missing_uid", "http://cal", new Date(), new Date());
            expect(result).toBe(false);
        });

        it("should handle error during verification gracefully", async () => {
            const { DAVClient } = await import('tsdav');
            // @ts-ignore
            DAVClient.mockImplementation(function () {
                return ({
                    login: vi.fn().mockRejectedValue(new Error("Network Error"))
                });
            });

            const user = {
                caldav_accounts: [{ serverUrl: "http://cal", username: "u", password: "p" }]
            };
            // @ts-ignore
            const result = await caldavController.verifyEvent(user, "uid", "http://cal", new Date(), new Date());
            expect(result).toBe(false);
        });
    });
});
