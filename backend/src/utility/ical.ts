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
}

export interface IcsOptions {
    comment?: string;
}

export const formatICalDate = (d: Date) => d.toISOString().replaceAll(/[-:]/g, '').split('.')[0] + 'Z';

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
SUMMARY:${event.summary}
DESCRIPTION:${icsDescription}
${icsComment ? `COMMENT:${icsComment}\n` : ''}LOCATION:${event.location || ''}
ORGANIZER;CN=${event.organizer.displayName}:mailto:${event.organizer.email}
${attendeesContent}
END:VEVENT
END:VCALENDAR`;

    return icsContent;
};
