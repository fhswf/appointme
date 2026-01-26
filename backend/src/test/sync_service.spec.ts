
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import { syncAppointment, pushEventToCalendars } from '../services/sync_service.js';
import { AppointmentModel } from '../models/Appointment.js';
import { UserModel } from '../models/User.js';
import { EventModel } from '../models/Event.js';
import { EVENT } from './EVENT.js';
import { USER } from './USER.js';

vi.mock('../models/Appointment.js', () => ({
    AppointmentModel: {
        findById: vi.fn(),
        updateMany: vi.fn()
    }
}));
vi.mock('../models/User.js', () => ({
    UserModel: {
        findById: vi.fn()
    }
}));
vi.mock('../models/Event.js', () => ({
    EventModel: {
        findById: vi.fn()
    }
}));
vi.mock('../logging.js', () => ({
    logger: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn()
    }
}));
vi.mock('../controller/google_controller.js', () => ({
    insertGoogleEvent: vi.fn()
}));
vi.mock('../controller/caldav_controller.js', () => ({
    createCalDavEvent: vi.fn(),
    findAccountForCalendar: vi.fn()
}));
vi.mock('../utility/mailer.js', () => ({
    sendEventInvitation: vi.fn().mockResolvedValue(true)
}));

describe('Sync Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('syncAppointment', () => {
        it('should return false if appointment not found', async () => {
            (AppointmentModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });
            const result = await syncAppointment('missing_id');
            expect(result).toBe(false);
        });

        it('should return true if appointment already synced', async () => {
            (AppointmentModel.findById as any).mockReturnValue({
                exec: vi.fn().mockResolvedValue({ status: 'synced', _id: '123' })
            });
            const result = await syncAppointment('123');
            expect(result).toBe(true);
        });

        it('should sync to google successfully', async () => {
            const mockApp = {
                _id: 'app_123',
                status: 'pending',
                user: 'user_123',
                event: 'event_123',
                start: new Date(),
                end: new Date(),
                attendeeName: 'Test',
                attendeeEmail: 'test@test.com',
                save: vi.fn().mockResolvedValue(true),
                isRecurring: false
            };
            (AppointmentModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(mockApp) });

            (UserModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...USER, push_calendars: ['primary'] }) });
            (EventModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...EVENT }) });

            const { insertGoogleEvent } = await import('../controller/google_controller.js');
            (insertGoogleEvent as any).mockResolvedValue({ data: { id: 'g_123' } });

            const result = await syncAppointment('app_123');

            expect(result).toBe(true);
            expect(mockApp.status).toBe('synced');
            expect(mockApp.googleId).toBe('g_123');
            expect(mockApp.save).toHaveBeenCalled();
        });

        it('should handle push error', async () => {
            const mockApp = {
                _id: 'app_123',
                status: 'pending',
                user: 'user_123',
                event: 'event_123',
                start: new Date(),
                end: new Date(),
                attendeeName: 'Test',
                attendeeEmail: 'test@test.com',
                save: vi.fn().mockResolvedValue(true)
            };
            (AppointmentModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(mockApp) });
            (UserModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...USER, push_calendars: ['primary'] }) });
            (EventModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(EVENT) });

            const { insertGoogleEvent } = await import('../controller/google_controller.js');
            (insertGoogleEvent as any).mockRejectedValue(new Error("Google Error"));

            const result = await syncAppointment('app_123');

            expect(result).toBe(false);
            expect(mockApp.status).toBe('failed');
            expect(mockApp.save).toHaveBeenCalled();
        });
    });
});
