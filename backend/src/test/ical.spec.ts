
import { describe, it, expect } from 'vitest';
import { generateIcsContent, formatICalDate } from '../utility/ical.js';

describe('ICS Generation', () => {
    it('should generate valid ICS content with comment', () => {
        const start = new Date('2023-12-08T10:00:00.000Z');
        const end = new Date('2023-12-08T11:00:00.000Z');
        const event = {
            start,
            end,
            summary: 'Test Event',
            description: 'This is a description',
            location: 'Meeting Room',
            organizer: {
                displayName: 'Organizer Name',
                email: 'organizer@example.com'
            },
            attendees: [
                {
                    displayName: 'Attendee Name',
                    email: 'attendee@example.com',
                    rsvp: true
                }
            ],
            uid: 'test-uid'
        };
        const options = {
            comment: 'This is a user comment'
        };

        const ics = generateIcsContent(event, options);

        expect(ics).toContain('BEGIN:VCALENDAR');
        expect(ics).toContain('VERSION:2.0');
        expect(ics).toContain('UID:test-uid');
        expect(ics).toContain('SUMMARY:Test Event');
        expect(ics).toContain('DESCRIPTION:This is a description');
        expect(ics).toContain('COMMENT:This is a user comment');
        expect(ics).toContain('LOCATION:Meeting Room');
        expect(ics).toContain('ORGANIZER;CN=Organizer Name:mailto:organizer@example.com');
        expect(ics).toContain('ATTENDEE;CN=Attendee Name;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:attendee@example.com');
        expect(ics).toContain(`DTSTART:${formatICalDate(start)}`);
        expect(ics).toContain(`DTEND:${formatICalDate(end)}`);
    });

    it('should handle multiline description and comment', () => {
        const start = new Date();
        const end = new Date();
        const event = {
            start,
            end,
            summary: 'Multiline Test',
            description: 'Line 1\nLine 2',
            organizer: { displayName: 'Org', email: 'org@test.com' },
            attendees: []
        };
        const options = {
            comment: 'Comment 1\nComment 2'
        };

        const ics = generateIcsContent(event, options);

        expect(ics).toContain('DESCRIPTION:Line 1\\nLine 2');
        expect(ics).toContain('COMMENT:Comment 1\\nComment 2');
    });

    it('should match optional fields when missing', () => {
        const start = new Date();
        const end = new Date();
        const event = {
            start,
            end,
            summary: 'Minimal Event',
            organizer: { displayName: 'Org', email: 'org@test.com' },
            attendees: []
        };

        const ics = generateIcsContent(event);

        expect(ics).toContain('SUMMARY:Minimal Event');
        expect(ics).not.toContain('COMMENT:');
        expect(ics).toContain('DESCRIPTION:'); // Should be empty
    });
});
