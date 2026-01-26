
import { AppointmentModel, AppointmentDocument } from "../models/Appointment.js";
import { UserModel } from "../models/User.js";
import { EventModel } from "../models/Event.js";
import { logger } from "../logging.js";
import { insertGoogleEvent } from "../controller/google_controller.js";
import { createCalDavEvent, findAccountForCalendar } from "../controller/caldav_controller.js";
import { generateIcsContent } from "../utility/ical.js";
import { sendEventInvitation } from "../utility/mailer.js";
import { t, Locale } from "../utility/i18n.js";
import validator from "validator";
import crypto from 'node:crypto';
import { calendar_v3 } from 'googleapis';
import Schema$Event = calendar_v3.Schema$Event;
import { addMinutes } from 'date-fns';

export interface SyncResult {
    calendar: string;
    success: boolean;
    type: 'google' | 'caldav' | 'other';
    event?: any;
    error?: any;
}

export async function syncAppointment(appointmentId: string): Promise<boolean> {
    const appointment = await AppointmentModel.findById(appointmentId).exec();
    if (!appointment) {
        logger.error(`Sync failed: Appointment ${appointmentId} not found`);
        return false;
    }

    if (appointment.status === 'synced') {
        logger.info(`Appointment ${appointmentId} already synced`);
        return true;
    }

    try {
        const user = await UserModel.findById(appointment.user).exec();
        if (!user) throw new Error("User not found");

        const eventDoc = await EventModel.findById(appointment.event).exec();
        if (!eventDoc) throw new Error("Event definition not found");

        const starttime = appointment.start;
        const endtime = appointment.end;
        const userComment = appointment.description || "";
        const attendeeName = appointment.attendeeName;
        const attendeeEmail = appointment.attendeeEmail;

        const eventDescription = String(eventDoc.description);

        // Use Appointment ID as deterministic ID for external systems
        const deterministicId = appointment._id.toString();

        const event: Schema$Event = {
            id: deterministicId, // Set explicit ID for Google
            summary: eventDoc.name + " mit " + attendeeName,
            location: eventDoc.location || appointment.location,
            description: eventDescription,
            start: {
                dateTime: starttime.toISOString(),
                timeZone: "Europe/Berlin",
            },
            end: {
                dateTime: endtime.toISOString(),
                timeZone: "Europe/Berlin",
            },
            organizer: {
                displayName: user.name,
                email: user.email,
                id: user._id as string
            },
            attendees: [
                {
                    displayName: attendeeName,
                    email: attendeeEmail,
                }
            ],
            source: (process.env.BASE_URL?.startsWith('http')) ? {
                title: "Appoint Me",
                url: process.env.BASE_URL,
            } : undefined,
            guestsCanModify: true,
            guestsCanInviteOthers: true,
            extendedProperties: {
                private: {
                    appointme_id: deterministicId
                }
            }
        };

        const targetCalendars = user.push_calendars || [];
        const locale: Locale = 'de';

        const { results, successCount } = await pushEventToCalendars({
            user,
            event,
            userComment,
            targetCalendars,
            locale,
            attendeeName,
            attendeeEmail,
            recurrence: appointment.isRecurring ? eventDoc.recurrence : undefined,
            deterministicId
        });

        if (successCount > 0) {
            const googleResult = results.find(r => r.type === 'google' && r.success);
            const caldavResult = results.find(r => r.type === 'caldav' && r.success);

            appointment.status = 'synced';
            appointment.googleId = googleResult?.event?.id || (googleResult ? deterministicId : undefined);
            appointment.caldavUid = caldavResult?.event?.uid || (caldavResult ? deterministicId : undefined);
            appointment.syncError = undefined;
            appointment.lastSyncAttempt = new Date();

            await appointment.save();

            if (appointment.isRecurring && appointment.seriesId) {
                await AppointmentModel.updateMany(
                    { seriesId: appointment.seriesId },
                    {
                        $set: {
                            status: 'synced',
                            googleId: appointment.googleId,
                            caldavUid: appointment.caldavUid,
                            lastSyncAttempt: new Date()
                        }
                    }
                );
            }

            return true;
        } else {
            const errors = results.map(r => r.error).join('; ');
            appointment.status = 'failed';
            appointment.syncError = errors;
            appointment.lastSyncAttempt = new Date();
            await appointment.save();
            return false;
        }

    } catch (err) {
        logger.error(`Sync failed for appointment ${appointmentId}`, err);
        appointment.status = 'failed';
        appointment.syncError = err instanceof Error ? err.message : String(err);
        appointment.lastSyncAttempt = new Date();
        await appointment.save();
        return false;
    }
}

export async function pushEventToCalendars(params: {
    user: any;
    event: Schema$Event;
    userComment: string;
    targetCalendars: string[];
    locale: Locale;
    attendeeName: string;
    attendeeEmail: string;
    recurrence?: any;
    deterministicId?: string;
}) {
    const { user, event, userComment, targetCalendars, locale, attendeeName, attendeeEmail, recurrence, deterministicId } = params;
    const results: SyncResult[] = [];
    let successCount = 0;

    if (targetCalendars.length === 0) {
        try {
            const res = await processGoogleBooking(user, userComment, event, 'primary', recurrence);
            successCount++;
            results.push({ calendar: 'primary', success: true, type: 'google', event: res.event });
        } catch (err) {
            results.push({ calendar: 'primary', success: false, type: 'google', error: err });
        }
        return { results, successCount };
    }

    for (const calendar of targetCalendars) {
        try {
            if (calendar.startsWith('http') || calendar.startsWith('/')) {
                const res = await processCalDavBooking({
                    user,
                    event,
                    userComment,
                    calendarUrl: calendar,
                    locale,
                    attendeeName,
                    attendeeEmail,
                    sendInvitation: user.send_invitation_email,
                    recurrence,
                    deterministicId
                });
                successCount++;
                results.push({ calendar, success: true, type: 'caldav', event: res.event });
            } else {
                const res = await processGoogleBooking(user, userComment, event, calendar, recurrence);
                successCount++;
                results.push({ calendar, success: true, type: 'google', event: res.event });
            }
        } catch (err) {
            logger.error(`Failed to push to calendar ${calendar}:`, err);
            results.push({ calendar, success: false, type: 'other', error: err });
        }
    }
    return { results, successCount };
}

async function processCalDavBooking(
    params: {
        user: any;
        event: Schema$Event;
        userComment: string;
        calendarUrl: string;
        locale: Locale;
        attendeeName: string;
        attendeeEmail: string;
        sendInvitation: boolean;
        recurrence?: any;
        deterministicId?: string;
    }
) {
    const { user, event, userComment, calendarUrl, locale, attendeeName, attendeeEmail, sendInvitation, recurrence, deterministicId } = params;

    // Logic extracted from event_controller.ts
    const calDavAccount = findAccountForCalendar(user, calendarUrl);
    if (calDavAccount) {
        if (validator.isEmail(calDavAccount.username)) {
            event.organizer = event.organizer || {};
            event.organizer.email = calDavAccount.username;
        }
    }

    try {
        const evt = await createCalDavEvent(user, event, userComment, calendarUrl, recurrence, deterministicId);

        const uid = deterministicId || evt.uid || `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;

        const icsContent = generateIcsContent({
            uid,
            start: new Date(event.start?.dateTime || ''),
            end: new Date(event.end?.dateTime || ''),
            summary: event.summary || '',
            description: event.description || '',
            location: event.location || '',
            organizer: {
                displayName: event.organizer?.displayName,
                email: event.organizer?.email
            },
            attendees: (event.attendees || []).map(a => ({
                displayName: a.displayName,
                email: a.email,
                partstat: 'NEEDS-ACTION',
                rsvp: true
            }))
        }, { comment: userComment });

        const subject = t(locale, 'invitationSubject', { summary: event.summary });

        const escapedDescription = validator.escape(event.description || '').replaceAll('\n', '<br>');
        const escapedComment = validator.escape(userComment || '').replaceAll('\n', '<br>');

        const timeStr = new Date(event.start?.dateTime || '').toLocaleString(t(locale, 'dateFormat'), { timeZone: 'Europe/Berlin' });

        const html = t(locale, 'invitationBody', {
            attendeeName,
            summary: validator.escape(event.summary || ''),
            description: escapedDescription + (escapedComment ? '<br><br>Kommentar:<br>' + escapedComment : ''),
            time: timeStr
        });

        if (sendInvitation) {
            sendEventInvitation(attendeeEmail, subject, html, icsContent, 'invite.ics')
                .then(() => logger.info('Invitation email sent to %s', attendeeEmail))
                .catch(err => logger.error('Failed to send invitation email', err));
        }

        return { success: true, message: "Event wurde gebucht (CalDav)", event: { ...evt, uid } };
    } catch (error) {
        logger.error('CalDav insert failed', error);
        throw error;
    }
}

async function processGoogleBooking(user: any, userComment: string, event: Schema$Event, calendarUrl: string, recurrence?: any) {
    try {
        const googleEvent = { ...event };
        if (userComment) {
            googleEvent.description = (googleEvent.description || '') + "\n\nKommentar:\n" + userComment;
        }

        const evt = await insertGoogleEvent(user, googleEvent, calendarUrl, recurrence);
        return { success: true, message: "Event wurde gebucht", event: evt.data };
    } catch (error: any) {
        // Handle "Duplicate" error as success
        if (error.code === 409 || error.message?.includes('duplicate')) {
            logger.warn('Google duplicate event detected (idempotent success): %s', event.id);
            return { success: true, message: "Event already exists (Idempotent)", event: event };
        }
        logger.error('Google insert failed: %o', error);
        throw error;
    }
}
