
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { google } from 'googleapis';
import { generateAuthUrl, googleCallback, getCalendarList, revokeScopes, checkFree, events, freeBusy, insertGoogleEvent } from './google_controller';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { UserModel } from '../models/User';


// Mock dependencies
// Mock dependencies
const calendarMock = {
    events: {
        insert: vi.fn(),
        list: vi.fn().mockResolvedValue({ data: { items: [] } })
    },
    calendarList: {
        list: vi.fn().mockResolvedValue({ data: { items: [] } })
    },
    freebusy: {
        query: vi.fn().mockResolvedValue({ data: { calendars: {} } })
    }
};

vi.mock('googleapis', () => {
    return {
        google: {
            calendar: () => calendarMock
        }
    };
});

vi.mock('../controller/caldav_controller.js', () => ({
    getBusySlots: vi.fn().mockResolvedValue([])
}));

vi.mock('google-auth-library', () => {
    const mOAuth2Client = {
        generateAuthUrl: vi.fn().mockReturnValue('http://mock-auth-url'),
        getToken: vi.fn().mockResolvedValue({
            tokens: {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                scope: 'mock-scope',
                expiry_date: 123456789
            }
        }),
        setCredentials: vi.fn(),
        on: vi.fn(),
        revokeToken: vi.fn().mockResolvedValue(true)
    };
    return {
        OAuth2Client: vi.fn().mockImplementation(function () {
            return mOAuth2Client;
        })
    };
});

vi.mock('../models/User', () => ({
    UserModel: {
        findOneAndUpdate: vi.fn().mockResolvedValue({}),
        findOne: vi.fn()
    }
}));

vi.mock('../logging.js', () => ({
    logger: {
        debug: vi.fn(),
        error: vi.fn(),
        info: vi.fn()
    }
}));



describe('Google Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let jsonMock: any;
    let redirectMock: any;
    let statusMock: any;

    beforeEach(() => {
        jsonMock = vi.fn();
        redirectMock = vi.fn();
        statusMock = vi.fn().mockReturnValue({ json: jsonMock });
        mockReq = {
            query: {},
        };
        mockRes = {
            json: jsonMock,
            redirect: redirectMock,
            status: statusMock
        };
        vi.clearAllMocks();
    });

    describe('generateAuthUrl', () => {
        it('should generate an auth url', () => {
            // @ts-ignore
            mockReq['user_id'] = 'test-user-id';

            generateAuthUrl(mockReq as Request, mockRes as Response);

            expect(jsonMock).toHaveBeenCalledWith({ url: 'http://mock-auth-url' });
            expect(OAuth2Client).toHaveBeenCalled();
        });
    });

    describe('googleCallback', () => {
        it('should handle missing code', () => {
            // @ts-ignore
            mockReq.query = { state: 'test-user' };

            googleCallback(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ err: "No authorization code was provided." });
        });

        it('should exchange code for tokens and redirect', async () => {
            // @ts-ignore
            mockReq.query = { code: 'test-code', state: 'test-user' };

            // We need to wait for promises to resolve since googleCallback doesn't return a promise but calls async functions
            await googleCallback(mockReq as Request, mockRes as Response);

            // Wait for microtasks
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(UserModel.findOneAndUpdate).toHaveBeenCalled();
            expect(redirectMock).toHaveBeenCalledWith(expect.stringContaining('/integration/select'));
        });

        it('should handle errors during token retrieval', async () => {
            // @ts-ignore
            mockReq.query = { code: 'test-code', state: 'test-user' };

            // Mock getToken to reject
            const clientInstance = new OAuth2Client();
            // @ts-ignore
            clientInstance.getToken.mockRejectedValueOnce(new Error('Auth Error'));

            await googleCallback(mockReq as Request, mockRes as Response);
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: "Error retrieving access token" }));
        });

        describe('getCalendarList', () => {
            it('should return calendar list', async () => {
                // @ts-ignore
                mockReq['user_id'] = 'test-user-id';
                (UserModel.findOne as any).mockReturnValue({
                    exec: vi.fn().mockResolvedValue({
                        google_tokens: { access_token: 'token' }
                    })
                });

                await getCalendarList(mockReq as Request, mockRes as Response);
                await new Promise(resolve => setTimeout(resolve, 0));

                expect(jsonMock).toHaveBeenCalled();
            });
        });

        describe('revokeScopes', () => {
            it('should revoke tokens', async () => {
                // @ts-ignore
                mockReq['user_id'] = 'test-user-id';
                const mockUser = {
                    google_tokens: {
                        access_token: 'token',
                        expiry_date: Date.now() + 10000
                    }
                };

                (UserModel.findOne as any).mockReturnValue({
                    exec: vi.fn().mockResolvedValue(mockUser)
                });

                await revokeScopes(mockReq as Request, mockRes as Response);
                await new Promise(resolve => setTimeout(resolve, 0));

                expect(jsonMock).toHaveBeenCalledWith({ msg: "ok" });
            });
        });

        describe('events', () => {
            it('should return events list', async () => {
                (UserModel.findOne as any).mockReturnValue({
                    exec: vi.fn().mockResolvedValue({
                        google_tokens: { access_token: 'token' },
                        push_calendar: 'primary'
                    })
                });

                const result = await events('user-id', '2025-01-01', '2025-01-02');
                expect(result).toEqual([]);
            });
        });

        describe('checkFree', () => {
            it('should return true if no conflicts', async () => {
                (UserModel.findOne as any).mockReturnValue({
                    exec: vi.fn().mockResolvedValue({
                        google_tokens: { access_token: 'token' }
                    })
                });

                const mockEvent = {
                    available: {
                        0: [], 1: [{ start: "00:00", end: "23:59" }], 2: [], 3: [], 4: [], 5: [], 6: []
                    },
                    bufferbefore: 0,
                    bufferafter: 0
                };

                // Assume Monday
                const start = new Date('2025-12-01T10:00:00Z'); // Monday
                const end = new Date('2025-12-01T11:00:00Z');

                const result = await checkFree(mockEvent as any, 'user-id', start, end);
                expect(result).toBe(true);
            });
        });

        describe('insertGoogleEvent', () => {
            it('should throw error if no google account connected', async () => {
                const user = { _id: 'user', google_tokens: {} };
                // @ts-ignore
                await expect(insertGoogleEvent(user, { summary: 'test' }))
                    .rejects.toThrow('No Google account connected');
            });

            it('should insert event if google account connected', async () => {
                const user = {
                    _id: 'user',
                    google_tokens: { access_token: 'token' },
                    push_calendar: 'primary'
                };

                // @ts-ignore
                await insertGoogleEvent(user, { summary: 'test' });

                // Verify google.calendar().events.insert called
                const insertMock = google.calendar({ version: 'v3' }).events.insert;
                expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
                    calendarId: 'primary',
                    requestBody: { summary: 'test' }
                }));
            });
        });

        describe('revokeScopes', () => {
            it('should delete tokens if expired', async () => {
                // @ts-ignore
                mockReq['user_id'] = 'test-user-id';
                const mockUser = {
                    google_tokens: {
                        access_token: 'token',
                        expiry_date: Date.now() - 10000 // Expired
                    }
                };

                (UserModel.findOne as any).mockReturnValue({
                    exec: vi.fn().mockResolvedValue(mockUser)
                });

                // Verify findOneAndUpdate is called for deleteTokens
                // We need to spy on it or check the mock

                await revokeScopes(mockReq as Request, mockRes as Response);
                await new Promise(resolve => setTimeout(resolve, 0));

                expect(jsonMock).toHaveBeenCalledWith({ msg: "ok" });
                // Check if deleteTokens logic ran (UserModel.findOneAndUpdate with $unset)
                expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
                    { _id: { $eq: 'test-user-id' } },
                    { $unset: { google_tokens: "" } }
                );
            });
        });

        describe('freeBusy', () => {
            it('should return null/empty if user not found', async () => {
                (UserModel.findOne as any).mockReturnValue({
                    exec: vi.fn().mockResolvedValue(null)
                });

                await expect(freeBusy('user-id', '2025-01-01', '2025-01-02')).rejects.toThrow('User not found');
            });

            it('should return empty calendar object if no items to query', async () => {
                (UserModel.findOne as any).mockReturnValue({
                    exec: vi.fn().mockResolvedValue({
                        google_tokens: { access_token: 'token' },
                        pull_calendars: [] // Empty
                    })
                });

                const res = await freeBusy('user-id', '2025-01-01', '2025-01-02');
                // @ts-ignore
                expect(res).toEqual({ data: { calendars: {} } });
            });

            it('should query google freebusy if items exist', async () => {
                (UserModel.findOne as any).mockReturnValue({
                    exec: vi.fn().mockResolvedValue({
                        google_tokens: { access_token: 'token' },
                        pull_calendars: ['cal-id-1']
                    })
                });

                await freeBusy('user-id', '2025-01-01', '2025-01-02');

                const queryMock = google.calendar({ version: 'v3' }).freebusy.query;
                expect(queryMock).toHaveBeenCalled();
            });
        });
    });
});
