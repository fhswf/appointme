import { describe, expect, it, vi, beforeEach } from 'vitest';
import { syncAppointment } from '../services/sync_service.js';

// Hoist the mock function so it can be used in vi.mock
const { insertGoogleEventMock } = vi.hoisted(() => {
    return { insertGoogleEventMock: vi.fn().mockResolvedValue({ data: { id: 'google_event_id' } }) };
});

vi.mock('../models/Appointment.js', () => ({
    AppointmentModel: {
        findById: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue({
                _id: 'appointment_123',
                user: 'user_123',
                event: 'event_123',
                start: new Date(),
                end: new Date(),
                status: 'pending',
                isRecurring: true,
                seriesId: 'series_123',
                save: vi.fn(),
                toJSON: () => ({})
            })
        }),
        updateMany: vi.fn().mockResolvedValue({})
    }
}));

vi.mock('../models/User.js', () => ({
    UserModel: {
        findById: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue({
                _id: 'user_123',
                email: 'test@example.com',
                push_calendars: ['primary']
            })
        })
    }
}));

vi.mock('../models/Event.js', () => ({
    EventModel: {
        findById: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue({
                _id: 'event_123',
                name: 'Recurring Event',
                description: 'Description',
                recurrence: {
                    enabled: true,
                    frequency: 'WEEKLY'
                }
            })
        })
    }
}));

vi.mock('../controller/google_controller.js', () => ({
    insertGoogleEvent: insertGoogleEventMock
}));

vi.mock('../controller/caldav_controller.js', () => ({
    createCalDavEvent: vi.fn(),
    findAccountForCalendar: vi.fn()
}));

vi.mock('../utility/ical.js', () => ({
    generateIcsContent: vi.fn()
}));

vi.mock('../utility/mailer.js', () => ({
    sendEventInvitation: vi.fn()
}));

describe('Recurrence Sync Bug Reproduction', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should pass recurrence object to insertGoogleEvent for recurring appointments', async () => {
        await syncAppointment('appointment_123');

        expect(insertGoogleEventMock).toHaveBeenCalled();
        const callArgs = insertGoogleEventMock.mock.calls[0];
        // user, event, calendarUrl, recurrence
        const recurrenceArg = callArgs[3];

        console.log('Passed recurrence arg:', recurrenceArg);

        const expectedRecurrence = {
            enabled: true,
            frequency: 'WEEKLY'
        };

        expect(recurrenceArg).toEqual(expectedRecurrence);
    });
});
