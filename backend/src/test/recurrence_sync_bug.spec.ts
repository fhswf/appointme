import { describe, expect, it, vi, beforeEach } from 'vitest';
import { syncAppointment } from '../services/sync_service.js';

// Hoist the mock function so it can be used in vi.mock
const { insertGoogleEventMock } = vi.hoisted(() => {
    return { insertGoogleEventMock: vi.fn().mockResolvedValue({ data: { id: 'google_event_id' } }) };
});

const mockAppointment = (overrides = {}) => ({
    _id: 'appointment_123',
    user: 'user_123',
    event: 'event_123',
    start: new Date(),
    end: new Date(),
    status: 'pending',
    isRecurring: true,
    recurrenceIndex: 0,
    seriesId: 'series_123',
    save: vi.fn(),
    toJSON: () => ({}),
    ...overrides
});

vi.mock('../models/Appointment.js', () => ({
    AppointmentModel: {
        findById: vi.fn().mockImplementation((id) => {
            if (id === 'appointment_123') return { exec: vi.fn().mockResolvedValue(mockAppointment()) };
            if (id === 'appointment_secondary') return {
                exec: vi.fn().mockResolvedValue(mockAppointment({
                    _id: 'appointment_secondary',
                    recurrenceIndex: 1
                }))
            };
            return { exec: vi.fn().mockResolvedValue(null) };
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

    it('should sync the primary appointment (index 0)', async () => {
        await syncAppointment('appointment_123');
        expect(insertGoogleEventMock).toHaveBeenCalled();
    });

    it('should NOT sync a secondary appointment (index > 0) to avoid duplicates', async () => {
        // This test simulates the race condition where `reconcileAppointments` picks up 
        // a secondary appointment (index 1) which is still 'pending'.
        // Currently, without the fix, this WILL call insertGoogleEvent.
        // We want it to NOT call insertGoogleEvent.

        await syncAppointment('appointment_secondary');

        // With the bug, this expect would fail if we asserted .not.toHaveBeenCalled()
        // But for reproduction, we want to demonstrate it IS called (or we write the test asserting correct behavior and see it fail)
        // Let's write the test asserting the CORRECT behavior.
        expect(insertGoogleEventMock).not.toHaveBeenCalled();
    });
});
