
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { checkFree, insertGoogleEvent, verifyEvent } from '../controller/google_controller';
import { Event } from 'common';
import { google } from 'googleapis';
import { UserModel } from '../models/User';

// Mock dependencies
vi.mock('../models/User', () => ({
    UserModel: {
        findOne: vi.fn(),
        findById: vi.fn(),
        findOneAndUpdate: vi.fn().mockResolvedValue({})
    }
}));

vi.mock('../controller/caldav_controller', () => ({
    getBusySlots: vi.fn().mockResolvedValue([])
}));

vi.mock('../utility/mailer', () => ({
    sendEmail: vi.fn().mockResolvedValue({})
}));

vi.mock('../logging', () => ({
    logger: {
        info: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
        warn: vi.fn()
    }
}));

const mockGetToken = vi.fn();
const mockSetCredentials = vi.fn();
const mockOn = vi.fn();
const mockGenerateAuthUrl = vi.fn();

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

vi.mock('googleapis', () => ({
    google: {
        calendar: vi.fn()
    }
}));


describe('google_controller edges', () => {
    const USER = { _id: 'user_id', google_tokens: { access_token: 'token' } };
    const EVENT = { available: {} };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('insertGoogleEvent should throw error if no access token', async () => {
        const userNoToken = { ...USER, google_tokens: null };
        await expect(insertGoogleEvent(userNoToken as any, {} as any)).rejects.toThrow("No Google account connected");
    });

    it('checkFree should handle users without default availability', async () => {
        const userMock = { ...USER, defaultAvailable: null };
        (UserModel.findOne as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(userMock) });
        // checkFree calls findById for Default mode
        (UserModel.findById as any).mockReturnValue({ select: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(userMock) });

        const event = { ...EVENT, availabilityMode: 'default' };

        // Time range
        const t1 = new Date("2026-02-20T10:00:00Z");
        const t2 = new Date("2026-02-20T11:00:00Z");

        // We assume fetchFreeBusyData returns empty if no Google or CalDav
        // If google_tokens present, it calls freeBusy.
        // freeBusy needs mocking if we want to isolate checkFree logic regarding availableSlots
        // But here we rely on mocked googleapis returning something or just failing?
        // fetchFreeBusyData > freeBusy > mock google
        const listMock = vi.fn().mockResolvedValue({ data: { calendars: {} } });
        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({ freebusy: { query: listMock } } as any);

        const res = await checkFree(event as any, "user_id", t1, t2);
        expect(res).toBe(false);
    });

    it('verifyEvent should return false if 404', async () => {
        const user = { ...USER };
        const getMock = vi.fn().mockRejectedValue({ code: 404 });

        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({
            events: { get: getMock }
        } as any);

        const res = await verifyEvent(user as any, "eventId");
        expect(res).toBe(false);
    });

    it('verifyEvent should return false if no tokens', async () => {
        const user = { ...USER, google_tokens: null };
        const res = await verifyEvent(user as any, "eventId");
        expect(res).toBe(false);
    });

    it('verifyEvent should return false if invalid_grant', async () => {
        const user = { ...USER };
        const getMock = vi.fn().mockRejectedValue({ message: 'invalid_grant' });

        // @ts-ignore
        vi.mocked(google.calendar).mockReturnValue({
            events: { get: getMock }
        } as any);

        const res = await verifyEvent(user as any, "eventId");
        expect(res).toBe(false);
    });
});
