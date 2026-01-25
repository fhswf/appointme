import { vi, describe, it, expect, beforeEach } from 'vitest';
import { googleCallback, generateAuthUrl, revokeScopes, getCalendarList, events, freeBusy, checkFree, insertGoogleEvent } from '../controller/google_controller';
import { Event } from 'common';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { UserModel } from '../models/User';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn(),
        verify: vi.fn(),
        decode: vi.fn() // Add decode if needed
    }
}));

// Mock crypto
vi.mock('crypto', () => ({
    default: {
        randomBytes: vi.fn().mockReturnValue({ toString: () => 'mock_nonce' })
    }
}));

// Mock dependencies
vi.mock('../models/User', () => ({
    UserModel: {
        findOneAndUpdate: vi.fn().mockResolvedValue({}),
        findOne: vi.fn(),
    }
}));

vi.mock('../controller/caldav_controller', () => ({
    getBusySlots: vi.fn().mockResolvedValue([])
}));

const mockGetToken = vi.fn();
const mockSetCredentials = vi.fn();
const mockOn = vi.fn();
const mockGenerateAuthUrl = vi.fn();

vi.mock('googleapis', () => ({
    google: {
        calendar: vi.fn()
    }
}));

vi.mock('../utility/mailer', () => ({
    sendEmail: vi.fn().mockResolvedValue({})
}));

import { sendEmail } from '../utility/mailer';

vi.mock('google-auth-library', () => {
    return {
        OAuth2Client: vi.fn().mockImplementation(function () {
            return {
                getToken: mockGetToken,
                setCredentials: mockSetCredentials,
                on: mockOn,
                generateAuthUrl: mockGenerateAuthUrl,
                revokeToken: vi.fn().mockResolvedValue(true)
            };
        })
    };
});

// Mock logger
vi.mock('../logging', () => ({
    logger: {
        info: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
        warn: vi.fn()
    }
}));

describe('google_controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should save tokens with dot notation when googleCallback is called', async () => {
        const req = {
            query: {
                code: 'auth_code',
                state: 'signed_state_token'
            },
            cookies: {
                'google_auth_state': 'mock_nonce'
            }
        } as unknown as Request;

        const res = {
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            clearCookie: vi.fn()
        } as unknown as Response;

        // Mock JWT verification success
        (jwt.verify as any).mockImplementation((token, secret, cb) => {
            cb(null, { id: 'user_id', nonce: 'mock_nonce' });
        });

        mockGetToken.mockResolvedValue({
            tokens: {
                access_token: 'new_access_token',
                // No refresh token
                expiry_date: 123456789
            }
        });

        await googleCallback(req, res);

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(jwt.verify).toHaveBeenCalledWith('signed_state_token', process.env.JWT_SECRET, expect.any(Function));

        expect(res.clearCookie).toHaveBeenCalledWith('google_auth_state');

        expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: { $eq: 'user_id' } },
            {
                $set: {
                    'google_tokens.access_token': 'new_access_token',
                    'google_tokens.expiry_date': 123456789
                }
            },
            { new: true }
        );
    });

    it('should reject callback with invalid state signature', async () => {
        const req = {
            query: {
                code: 'auth_code',
                state: 'invalid_token'
            },
            cookies: {
                'google_auth_state': 'mock_nonce'
            }
        } as unknown as Request;

        const res = {
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        (jwt.verify as any).mockImplementation((token, secret, cb) => {
            cb(new Error('Invalid signature'), null);
        });

        await googleCallback(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Invalid state parameter" }));
    });

    it('should reject callback with mismatched nonce', async () => {
        const req = {
            query: {
                code: 'auth_code',
                state: 'signed_state_token'
            },
            cookies: {
                'google_auth_state': 'wrong_nonce'
            }
        } as unknown as Request;

        const res = {
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        (jwt.verify as any).mockImplementation((token, secret, cb) => {
            cb(null, { id: 'user_id', nonce: 'mock_nonce' });
        });

        await googleCallback(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Invalid state parameter" }));
    });

    it('should create a new OAuth2Client instance', async () => {
        const req = {
            query: {
                code: 'auth_code',
                state: 'signed_state_token'
            },
            cookies: {
                'google_auth_state': 'mock_nonce'
            }
        } as unknown as Request;

        const res = {
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            clearCookie: vi.fn()
        } as unknown as Response;

        (jwt.verify as any).mockImplementation((token, secret, cb) => {
            cb(null, { id: 'user_id', nonce: 'mock_nonce' });
        });

        mockGetToken.mockResolvedValue({ tokens: {} });

        await googleCallback(req, res);

        expect(OAuth2Client).toHaveBeenCalledWith(expect.objectContaining({
            redirectUri: expect.stringMatching(/.*\/api\/v1\/google\/oauthcallback/)
        }));
    });

    it('should generate auth url', () => {
        const req = {
            'user_id': 'user_id'
        } as unknown as Request;

        const res = {
            json: vi.fn(),
            cookie: vi.fn()
        } as unknown as Response;

        mockGenerateAuthUrl.mockReturnValue('http://auth.url');
        (jwt.sign as any).mockReturnValue('signed_state_token');

        generateAuthUrl(req, res);

        expect(jwt.sign).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'user_id', nonce: 'mock_nonce' }),
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        expect(res.cookie).toHaveBeenCalledWith('google_auth_state', 'mock_nonce', {
            httpOnly: true,
            secure: true,
            maxAge: 600000
        });

        expect(mockGenerateAuthUrl).toHaveBeenCalledWith({
            access_type: "offline",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/calendar.calendars.readonly",
                "https://www.googleapis.com/auth/calendar.events",
                "https://www.googleapis.com/auth/calendar.readonly",
            ],
            state: 'signed_state_token',
        });
        expect(res.json).toHaveBeenCalledWith({ url: 'http://auth.url' });
    });

    it('should revoke scopes when token is valid', async () => {
        const req = {
            'user_id': 'user_id'
        } as unknown as Request;

        const res = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        } as unknown as Response;

        const mockUser = {
            google_tokens: {
                access_token: 'access_token',
                expiry_date: Date.now() + 10000
            }
        };

        // @ts-ignore
        UserModel.findOne.mockReturnValue({
            exec: vi.fn().mockResolvedValue(mockUser)
        });

        await revokeScopes(req, res);

        // Wait for promises
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(UserModel.findOne).toHaveBeenCalledWith({ _id: { $eq: 'user_id' } });
        expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: { $eq: 'user_id' } },
            { $unset: { google_tokens: "" } }
        );
        expect(res.json).toHaveBeenCalledWith({ msg: "ok" });
    });

    it('should result tokens without revoking if expired', async () => {
        const req = {
            'user_id': 'user_id'
        } as unknown as Request;

        const res = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        } as unknown as Response;

        const mockUser = {
            google_tokens: {
                access_token: 'access_token',
                expiry_date: Date.now() - 10000
            }
        };

        // @ts-ignore
        UserModel.findOne.mockReturnValue({
            exec: vi.fn().mockResolvedValue(mockUser)
        });

        await revokeScopes(req, res);

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: { $eq: 'user_id' } },
            { $unset: { google_tokens: "" } }
        );
        expect(res.json).toHaveBeenCalledWith({ msg: "ok" });
    });

    it('should get calendar list', async () => {
        const req = {
            'user_id': 'user_id'
        } as unknown as Request;

        const res = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        } as unknown as Response;

        const mockUser = {
            google_tokens: {
                access_token: 'access_token',
                expiry_date: Date.now() + 10000
            }
        };

        // @ts-ignore
        UserModel.findOne.mockReturnValue({
            exec: vi.fn().mockResolvedValue(mockUser)
        });

        const mockList = vi.fn().mockResolvedValue({ items: [] });
        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({
            // @ts-ignore
            calendarList: {
                list: mockList
            }
        });

        getCalendarList(req, res);

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(mockList).toHaveBeenCalled();
        // @ts-ignore
        expect(res.json).toHaveBeenCalledWith({ items: [] });
    });

    it('should get events', async () => {
        const mockUser = {
            google_tokens: {
                access_token: 'access_token'
            },
            push_calendar: 'primary'
        };

        // @ts-ignore
        UserModel.findOne.mockReturnValue({
            exec: vi.fn().mockResolvedValue(mockUser)
        });

        const mockEventsList = vi.fn().mockResolvedValue({
            data: {
                items: [{ id: '1', summary: 'test' }]
            }
        });

        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({
            // @ts-ignore
            events: {
                list: mockEventsList
            }
        });

        const result = await events('user_id', '2023-01-01', '2023-01-02');

        expect(result).toEqual([{ id: '1', summary: 'test' }]);
        expect(mockEventsList).toHaveBeenCalledWith({
            calendarId: 'primary',
            timeMin: '2023-01-01',
            timeMax: '2023-01-02',
            singleEvents: true
        });
    });

    it('should handle error in events list', async () => {
        // @ts-ignore
        UserModel.findOne.mockReturnValue({
            exec: vi.fn().mockResolvedValue({
                google_tokens: { access_token: 'token' },
                push_calendar: 'primary'
            })
        });

        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({
            // @ts-ignore
            events: {
                list: vi.fn().mockRejectedValue(new Error('API Error'))
            }
        });

        const result = await events('user_id', '2023-01-01', '2023-01-02');
        expect(result).toEqual([]);
    });

    it('should return empty list from events if user has no google tokens', async () => {
        // @ts-ignore
        UserModel.findOne.mockReturnValue({
            exec: vi.fn().mockResolvedValue({
                google_tokens: undefined
            })
        });

        const mockList = vi.fn();
        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({
            // @ts-ignore
            events: { list: mockList }
        });

        const result = await events('user_id', '2023-01-01', '2023-01-02');
        expect(result).toEqual([]);
        expect(mockList).not.toHaveBeenCalled();
    });

    it('should check free busy', async () => {
        const mockUser = {
            google_tokens: {
                access_token: 'access_token'
            },
            pull_calendars: ['cal1']
        };

        // @ts-ignore
        UserModel.findOne.mockReturnValue({
            exec: vi.fn().mockResolvedValue(mockUser)
        });

        const mockFreeBusyQuery = vi.fn().mockResolvedValue({
            data: {
                calendars: {
                    cal1: { busy: [] }
                }
            }
        });

        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({
            // @ts-ignore
            freebusy: {
                query: mockFreeBusyQuery
            }
        });

        const result = await freeBusy('user_id', '2023-01-01', '2023-01-02');

        expect(mockFreeBusyQuery).toHaveBeenCalledWith({
            requestBody: {
                timeMin: '2023-01-01',
                timeMax: '2023-01-02',
                items: [{ id: 'cal1' }]
            }
        });
    });

    it('should checkFree', async () => {
        const event = {
            available: {
                0: [], // Sunday
                1: [{ start: '09:00', end: '17:00' }], // Monday
                2: [{ start: '09:00', end: '17:00' }],
                3: [{ start: '09:00', end: '17:00' }],
                4: [{ start: '09:00', end: '17:00' }],
                5: [{ start: '09:00', end: '17:00' }],
                6: []  // Saturday
            },
            bufferbefore: 0,
            bufferafter: 0
        } as unknown as Event;

        const mockUser = {
            google_tokens: {
                access_token: 'access_token'
            },
            pull_calendars: []
        };

        // @ts-ignore
        UserModel.findOne.mockReturnValue({
            exec: vi.fn().mockResolvedValue(mockUser)
        });

        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({
            // @ts-ignore
            freebusy: {
                query: vi.fn().mockResolvedValue({ data: { calendars: {} } })
            }
        });

        // We are checking a full day, should be free
        const result = await checkFree(event, 'user_id', new Date('2023-01-01T09:00:00Z'), new Date('2023-01-01T10:00:00Z'));

        expect(result).toBeDefined();
    });

    it('should checkFree with CalDAV slots', async () => {
        const event = {
            available: { 1: [{ start: '09:00', end: '17:00' }] }, // Monday
            bufferbefore: 0,
            bufferafter: 0
        } as unknown as Event;

        // @ts-ignore
        UserModel.findOne.mockReturnValue({
            exec: vi.fn().mockResolvedValue({ google_tokens: { access_token: 'token' }, pull_calendars: [] })
        });

        // Mock CalDAV busy slots
        const { getBusySlots } = await import('../controller/caldav_controller');
        // @ts-ignore
        vi.mocked(getBusySlots).mockResolvedValue([
            { start: new Date('2023-01-02T10:00:00Z'), end: new Date('2023-01-02T11:00:00Z') }
        ]);

        // Mock Google freeBusy return empty
        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({
            // @ts-ignore
            freebusy: {
                query: vi.fn().mockResolvedValue({ data: { calendars: {} } })
            }
        });

        // Checking Monday 2023-01-02
        const result = await checkFree(event, 'user_id', new Date('2023-01-02T09:00:00Z'), new Date('2023-01-02T12:00:00Z'));
        // 9-12 range. 10-11 is busy.
        // Should return false because requested interval (9-12) is not fully free.
        expect(result).toBe(false);
    });

    it('should checkFree handling Google freeBusy error', async () => {
        const event = { available: {}, bufferbefore: 0, bufferafter: 0 } as unknown as Event;

        // @ts-ignore
        UserModel.findOne.mockReturnValue({
            exec: vi.fn().mockResolvedValue({ google_tokens: { access_token: 'token' }, pull_calendars: [] })
        });

        // Google throws
        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({
            // @ts-ignore
            freebusy: {
                query: vi.fn().mockRejectedValue(new Error('Google Error'))
            }
        });

        const result = await checkFree(event, 'user_id', new Date('2023-01-01'), new Date('2023-01-02'));
        // If google fails, it logs error and returns null for googleRes.
        // Then it proceeds with other logic.
        expect(result).toBe(false); // Since no slots available defined in event (empty)
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

            const insertMock = vi.fn().mockResolvedValue({});
            // @ts-ignore
            vi.mocked(google.calendar).mockReturnValue({
                // @ts-ignore
                events: {
                    insert: insertMock
                }
            });

            // @ts-ignore
            await insertGoogleEvent(user, { summary: 'test' });

            // Verify google.calendar().events.insert called
            expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
                calendarId: 'primary',
                requestBody: { summary: 'test' }
            }));
        });
    });

    describe('freeBusy errors', () => {
        it('should return null/empty if user not found', async () => {
            (UserModel.findOne as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue(null)
            });

            await expect(freeBusy('user-id', '2025-01-01', '2025-01-02')).rejects.toThrow('User not found');
        });

        it('should return empty calendars from freeBusy if user has no google tokens', async () => {
            // @ts-ignore
            UserModel.findOne.mockReturnValue({
                exec: vi.fn().mockResolvedValue({
                    google_tokens: undefined
                })
            });

            const mockQuery = vi.fn();
            // @ts-ignore
            vi.mocked(google.calendar).mockReturnValue({
                // @ts-ignore
                freebusy: { query: mockQuery }
            });

            const result = await freeBusy('user_id', '2023-01-01', '2023-01-02');
            expect(result).toEqual({ data: { calendars: {} } });
            expect(mockQuery).not.toHaveBeenCalled();
        });

        it('should retry on invalid_grant if token has changed', async () => {
            const userId = 'user_retry_test';

            // Mock UserModel.findOne to return different tokens on sequential calls
            const userOldToken = {
                _id: userId,
                google_tokens: { access_token: 'old_token', refresh_token: 'old_refresh' },
                pull_calendars: ['cal1']
            };
            const userNewToken = {
                _id: userId,
                google_tokens: { access_token: 'new_token', refresh_token: 'new_refresh' },
                pull_calendars: ['cal1']
            };

            const execMock = vi.fn()
                .mockResolvedValueOnce(userOldToken) // First call
                .mockResolvedValueOnce(userNewToken); // Second call (retry)

            // @ts-ignore
            UserModel.findOne.mockReturnValue({ exec: execMock });

            // Mock Google API to fail first, then succeed
            const mockQuery = vi.fn()
                .mockRejectedValueOnce({
                    code: 400,
                    message: "invalid_grant",
                    response: { data: { error: "invalid_grant" } }
                })
                .mockResolvedValueOnce({
                    data: { calendars: { cal1: { busy: [] } } }
                });

            // @ts-ignore
            vi.mocked(google.calendar).mockReturnValue({
                // @ts-ignore
                freebusy: { query: mockQuery }
            });

            const result = await freeBusy(userId, '2025-01-01', '2025-01-02');

            // Verify result matches the success response
            expect(result).toEqual({ data: { calendars: { cal1: { busy: [] } } } });

            // Verify retry logic
            expect(execMock).toHaveBeenCalledTimes(2); // Initial fetch + Retry fetch
            expect(mockQuery).toHaveBeenCalledTimes(2); // Initial attempt + Retry attempt

            // Verify second call used new credentials
            // (We can check if setCredentials was called with new tokens)
            // The OAuth2Client mock in this file captures setCredentials in mockSetCredentials
            // We expect it to be called with old_token, then new_token.
            // Note: createOAuthClient is called inside freeBusy.
        });
        it('should invalidate tokens on invalid_grant if token has NOT changed', async () => {
            const userId = 'user_abort_retry_test';

            // Mock UserModel.findOne to return SAME tokens
            const userToken = {
                _id: userId,
                email: userId + '@example.com',
                google_tokens: { access_token: 'token', refresh_token: 'refresh' },
                pull_calendars: ['cal1']
            };

            const execMock = vi.fn()
                .mockResolvedValueOnce(userToken) // First call
                .mockResolvedValueOnce(userToken); // Second call (check for update)

            // @ts-ignore
            UserModel.findOne.mockReturnValue({ exec: execMock });

            const mockQuery = vi.fn()
                .mockRejectedValue({
                    code: 400,
                    message: "invalid_grant",
                    response: { data: { error: "invalid_grant" } }
                });

            // @ts-ignore
            vi.mocked(google.calendar).mockReturnValue({
                // @ts-ignore
                freebusy: { query: mockQuery }
            });

            // Expect it to throw the error eventually
            await expect(freeBusy(userId, '2025-01-01', '2025-01-02')).rejects.toThrow();

            // Verify deleteTokens called (via UserModel.findOneAndUpdate)
            expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: { $eq: userId } },
                { $unset: { google_tokens: "" } }
            );

            // Verify email notification sent
            expect(sendEmail).toHaveBeenCalledWith(
                userId + '@example.com', // Assuming freshUser has this email
                expect.stringContaining('Calendar Connection Failed'),
                expect.any(String)
            );
        });
    });
});
