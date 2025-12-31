import crypto from 'node:crypto';

export interface IcsEventData {
    start: Date;
    end: Date;
    summary: string;
    description?: string;
    location?: string;
    organizer: {
        displayName: string;
        email: string;
    };
    attendees: {
        displayName: string;
        email: string;
        partstat?: string;
        rsvp?: boolean;
    }[];
    uid?: string;
    recurrence?: RecurrenceRule;
}

export type RecurrenceRule = {
    enabled: boolean;
    frequency: 'weekly' | 'biweekly' | 'triweekly' | 'monthly';
    interval: number;
    count?: number;
    until?: string;
};

export interface IcsOptions {
    comment?: string;
}

export const formatICalDate = (d: Date) => d.toISOString().replaceAll(/[-:]/g, '').split('.')[0] + 'Z';

export const generateRRule = (recurrence: RecurrenceRule): string => {
    if (!recurrence.enabled) return '';

    const parts = ['RRULE:FREQ=WEEKLY']; // Default to WEEKLY base frequency

    // Map custom frequencies to WEEKLY with interval
    let interval = recurrence.interval;
    switch (recurrence.frequency) {
        case 'weekly':
            interval = 1;
            break;
        case 'biweekly':
            interval = 2;
            break;
        case 'triweekly':
            interval = 3;
            break;
        case 'monthly':
            parts[0] = 'RRULE:FREQ=MONTHLY';
            interval = 1; // Standard monthly interval
            break;
        default:
            interval = recurrence.interval || 1;
    }

    if (interval > 1) {
        parts.push(`INTERVAL=${interval}`);
    }

    if (recurrence.until) {
        const untilDate = new Date(recurrence.until);
        // Set to end of day UTC for until date
        untilDate.setUTCHours(23, 59, 59, 999);
        parts.push(`UNTIL=${formatICalDate(untilDate)}`);
    } else if (recurrence.count) {
        parts.push(`COUNT=${recurrence.count}`);
    }

    return parts.join(';');
};

export const generateIcsContent = (event: IcsEventData, options?: IcsOptions): string => {
    const uid = event.uid || `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;

    // Ensure description handles newlines for ICS
    const icsDescription = event.description?.replaceAll('\n', String.raw`\n`) || '';
    const icsComment = options?.comment ? options.comment.replaceAll('\n', String.raw`\n`) : '';

    let attendeesContent = '';
    if (event.attendees && event.attendees.length > 0) {
        attendeesContent = event.attendees.map(a => {
            const partstat = a.partstat || 'NEEDS-ACTION';
            const rsvp = a.rsvp === undefined ? 'TRUE' : String(a.rsvp).toUpperCase();
            return `ATTENDEE;CN=${a.displayName};PARTSTAT=${partstat};RSVP=${rsvp}:mailto:${a.email}`;
        }).join('\n');
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BookMe//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatICalDate(new Date())}
DTSTART:${formatICalDate(event.start)}
DTEND:${formatICalDate(event.end)}
${event.recurrence ? generateRRule(event.recurrence) : ''}
SUMMARY:${event.summary}
DESCRIPTION:${icsDescription}
${icsComment ? `COMMENT:${icsComment}\n` : ''}LOCATION:${event.location || ''}
ORGANIZER;CN=${event.organizer.displayName}:mailto:${event.organizer.email}
${attendeesContent}
END:VEVENT
END:VCALENDAR`;

    return icsContent;
};
