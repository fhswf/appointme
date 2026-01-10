import ical, { ICalEventRepeatingFreq } from 'ical-generator';

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
        parts.push(`UNTIL=${untilDate.toISOString().replaceAll(/[-:]/g, '').split('.')[0] + 'Z'}`);
    } else if (recurrence.count) {
        parts.push(`COUNT=${recurrence.count}`);
    }

    return parts.join(';');
};

export const generateIcsContent = (event: IcsEventData, options?: IcsOptions): string => {
    const calendar = ical({
        prodId: '//AppointMe//EN',
    });

    const icsEvent = calendar.createEvent({
        id: event.uid, // ical-generator uses 'id' for UID
        start: event.start,
        end: event.end,
        summary: event.summary,
        description: event.description || undefined,
        location: event.location,
        organizer: {
            name: event.organizer.displayName,
            email: event.organizer.email
        }
    });

    if (options?.comment) {
        // COMMENT property is not directly supported by ical-generator ICalEvent
        // and X- properties must start with X-.
        // Since logic elsewhere appends comment to description, we can skip explicit COMMENT field
        // to maintain cleaner code and library compatibility.
        // If X-COMMENT is desired: icsEvent.x('X-COMMENT', options.comment);
    }

    // Attendees
    if (event.attendees) {
        event.attendees.forEach(a => {
            icsEvent.createAttendee({
                name: a.displayName,
                email: a.email,
                rsvp: a.rsvp,
                // partstat mapping: ical-generator uses ICalAttendeeStatus
                // we pass the string directly, assuming it matches or library handles it loosely.
                // ical-generator types might be strict.
                // 'NEEDS-ACTION' is standard.
                status: a.partstat as any
            });
        });
    }

    // Recurrence
    if (event.recurrence && event.recurrence.enabled) {
        const { frequency, interval, count, until } = event.recurrence;
        let freq: ICalEventRepeatingFreq;
        let actualInterval = interval || 1;

        if (frequency === 'monthly') {
            freq = ICalEventRepeatingFreq.MONTHLY;
            actualInterval = 1;
        } else {
            freq = ICalEventRepeatingFreq.WEEKLY;
            if (frequency === 'biweekly') actualInterval = 2;
            if (frequency === 'triweekly') actualInterval = 3;
            if (frequency === 'weekly') {
                actualInterval = interval || 1;
            }
        }

        icsEvent.repeating({
            freq,
            interval: actualInterval,
            count,
            until: until ? new Date(until) : undefined
        });
    }

    return calendar.toString();
};
