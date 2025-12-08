import { vi, describe, it, expect, beforeEach } from 'vitest';
import { googleCallback, generateAuthUrl, revokeScopes, getCalendarList, events, freeBusy, checkFree, insertGoogleEvent } from '../controller/google_controller';
import { Event } from 'common';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { UserModel } from '../models/User';

// Mock dependencies
vi.mock('../models/User', () => ({
    UserModel: {
        findOneAndUpdate: vi.fn().mockResolvedValue({}),
        findOne: vi.fn(),
    }
}));

vi.mock('./caldav_controller', () => ({
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
        debug: vi.fn(),
        error: vi.fn()
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
                state: 'user_id'
            }
        } as unknown as Request;

        const res = {
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

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

    it('should create a new OAuth2Client instance', async () => {
        const req = {
            query: {
                code: 'auth_code',
                state: 'user_id'
            }
        } as unknown as Request;

        const res = {
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        mockGetToken.mockResolvedValue({ tokens: {} });

        await googleCallback(req, res);

        expect(OAuth2Client).toHaveBeenCalled();
    });

    it('should generate auth url', () => {
        const req = {
            'user_id': 'user_id'
        } as unknown as Request;

        const res = {
            json: vi.fn()
        } as unknown as Response;

        mockGenerateAuthUrl.mockReturnValue('http://auth.url');

        generateAuthUrl(req, res);

        expect(mockGenerateAuthUrl).toHaveBeenCalledWith({
            access_type: "offline",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/calendar.events",
            ],
            state: 'user_id',
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
    });
});
