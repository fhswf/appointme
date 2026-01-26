
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

    it('should sync to caldav successfully', async () => {
        const mockApp = {
            _id: 'app_caldav',
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
        (UserModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...USER, push_calendars: ['http://caldav.example.com'] }) });
        (EventModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...EVENT }) });

        const { createCalDavEvent } = await import('../controller/caldav_controller.js');
        (createCalDavEvent as any).mockResolvedValue({ uid: 'caldav_uid_123' });

        (UserModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...USER, push_calendars: ['http://caldav.example.com'], send_invitation_email: true }) });
        const { sendEventInvitation } = await import('../utility/mailer.js');

        const result = await syncAppointment('app_caldav');

        expect(result).toBe(true);
        expect(createCalDavEvent).toHaveBeenCalled();
        expect(sendEventInvitation).toHaveBeenCalled();
        expect(mockApp.status).toBe('synced');
        expect(mockApp.caldavUid).toBe('app_caldav');
    });

    it('should sync to both google and caldav', async () => {
        const mockApp = {
            _id: 'app_mixed',
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
        (UserModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...USER, push_calendars: ['primary', 'http://caldav.example.com'] }) });
        (EventModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...EVENT }) });

        const { insertGoogleEvent } = await import('../controller/google_controller.js');
        (insertGoogleEvent as any).mockResolvedValue({ data: { id: 'g_mixed_123' } });

        const { createCalDavEvent } = await import('../controller/caldav_controller.js');
        (createCalDavEvent as any).mockResolvedValue({ uid: 'caldav_mixed_123' });

        const result = await syncAppointment('app_mixed');

        expect(result).toBe(true);
        expect(mockApp.googleId).toBe('g_mixed_123');
        expect(mockApp.caldavUid).toBe('app_mixed');
    });

    it('should handle google duplicate event as success (idempotent)', async () => {
        const mockApp = {
            _id: 'app_dup',
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
        // Mock error with code 409
        const error409 = new Error('Duplicate');
        (error409 as any).code = 409;
        (insertGoogleEvent as any).mockRejectedValue(error409);

        const result = await syncAppointment('app_dup');

        expect(result).toBe(true);
        expect(mockApp.status).toBe('synced');
        // Should fallback to deterministic ID if not returned
        expect(mockApp.googleId).toBe('app_dup');
    });

    it('should update series if recurring', async () => {
        const mockApp = {
            _id: 'app_series_1',
            status: 'pending',
            user: 'user_123',
            event: 'event_123',
            start: new Date(),
            end: new Date(),
            attendeeName: 'Test',
            attendeeEmail: 'test@test.com',
            save: vi.fn().mockResolvedValue(true),
            isRecurring: true,
            seriesId: 'series_abc'
        };
        (AppointmentModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(mockApp) });
        (UserModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...USER, push_calendars: ['primary'] }) });
        (EventModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...EVENT }) });

        const { insertGoogleEvent } = await import('../controller/google_controller.js');
        (insertGoogleEvent as any).mockResolvedValue({ data: { id: 'g_series_123' } });

        await syncAppointment('app_series_1');

        expect(AppointmentModel.updateMany).toHaveBeenCalledWith(
            { seriesId: 'series_abc' },
            expect.objectContaining({
                $set: expect.objectContaining({
                    status: 'synced',
                    googleId: 'g_series_123'
                })
            })
        );
    });

    it('should default to primary calendar sync if targetCalendars is empty but handle potential error', async () => {
        // In pushEventToCalendars: if (targetCalendars.length === 0) -> processGoogleBooking(..., 'primary', ...)
        // This happens if user has no push_calendars defined but we want to sync default?
        // Actually currently syncService reads user.push_calendars || [].
        // If user.push_calendars is empty, it does:
        // const { results, successCount } = await pushEventToCalendars({ ... targetCalendars: [] ... })
        // Inside pushEventToCalendars: if (targetCalendars.length === 0) it TRIES 'primary'.

        const mockApp = {
            _id: 'app_empty_cal',
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
        // FORCE empty push_calendars
        (UserModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...USER, push_calendars: [] }) });
        (EventModel.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...EVENT }) });

        const { insertGoogleEvent } = await import('../controller/google_controller.js');
        (insertGoogleEvent as any).mockResolvedValue({ data: { id: 'g_def' } });

        const result = await syncAppointment('app_empty_cal');
        expect(result).toBe(true);
        expect(insertGoogleEvent).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), 'primary', undefined);
    });

});
