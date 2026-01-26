import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createCalDavEvent } from '../controller/caldav_controller';
import { createConfiguredDAVClient } from '../utility/dav_client';
import { User } from 'common';

// Mock dependencies
vi.mock('../utility/dav_client');
vi.mock('../utility/ical');
vi.mock('../models/User');

describe('CalDAV UID Duplication Fix', () => {
    const mockUser: User = {
        _id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        caldav_accounts: [
            {
                _id: 'acc1',
                serverUrl: 'https://caldav.example.com',
                username: 'user',
                password: 'enc_password',
                name: 'Test CalDAV',
                email: 'user@example.com'
            }
        ],
        push_calendars: []
    } as any;

    const mockEventDetails = {
        start: { dateTime: '2023-01-01T10:00:00Z' },
        end: { dateTime: '2023-01-01T11:00:00Z' },
        summary: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        organizer: { displayName: 'Organizer', email: 'org@example.com' },
        attendees: []
    };

    const mockClient = {
        login: vi.fn(),
        fetchCalendars: vi.fn().mockResolvedValue([
            { url: 'https://caldav.example.com/cal1', displayName: 'Calendar 1' }
        ]),
        createCalendarObject: vi.fn().mockResolvedValue({ ok: true, status: 201, statusText: 'Created' }),
        fetchCalendarObjects: vi.fn().mockResolvedValue([])
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (createConfiguredDAVClient as any).mockReturnValue(mockClient);
    });

    it('should use provided uid when calling createCalDavEvent', async () => {
        const uid = 'deterministic-uid-123';
        const calendarUrl = 'https://caldav.example.com/cal1';

        await createCalDavEvent(mockUser, mockEventDetails, '', calendarUrl, undefined, uid);

        expect(mockClient.createCalendarObject).toHaveBeenCalledWith(expect.objectContaining({
            filename: `${uid}.ics`
        }));

        // Check if the generated ICS content contains the UID (mocked or checked indirectly)
        // Since we mocked generateIcsContent we can't check the string content easily here without deeper mocking,
        // but filename is a strong indicator.
    });

    it('should generate a random uid when no uid is provided', async () => {
        const calendarUrl = 'https://caldav.example.com/cal1';

        await createCalDavEvent(mockUser, mockEventDetails, '', calendarUrl);

        expect(mockClient.createCalendarObject).toHaveBeenCalled();
        const callArgs = (mockClient.createCalendarObject as any).mock.calls[0][0];
        expect(callArgs.filename).toMatch(/.*\.ics$/);
        expect(callArgs.filename).not.toContain('deterministic-uid');
    });
});
