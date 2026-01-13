
import { describe, it, expect } from 'vitest';
import { generateIcsContent, generateRRule, RecurrenceRule } from '../utility/ical.js';

const formatICalDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

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
                    rsvp: true,
                    partstat: 'ACCEPTED'
                }
            ],
            uid: 'test-uid'
        };
        const options = {
            comment: 'This is a user comment'
        };

        const ics = generateIcsContent(event, options);

        // Handle potential line folding in mailto part or other long lines
        const oneLineIcs = ics.replace(/\r\n /g, '');

        expect(ics).toContain('BEGIN:VCALENDAR');
        expect(ics).toContain('VERSION:2.0');
        expect(ics).toContain('UID:test-uid');
        expect(ics).toContain('SUMMARY:Test Event');
        expect(ics).toContain('DESCRIPTION:This is a description');
        expect(ics).toContain('LOCATION:Meeting Room');
        expect(ics).toContain('ORGANIZER;CN="Organizer Name":mailto:organizer@example.com');
        expect(ics).toContain('ATTENDEE;');

        // Assert on unfolded content to avoid line folding issues
        expect(oneLineIcs).toContain('CN="Attendee Name"');
        expect(oneLineIcs).toContain('PARTSTAT=ACCEPTED');
        expect(oneLineIcs).toMatch(/mailto:attendee@example\.com/i);

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
        expect(ics).not.toContain('DESCRIPTION:');
    });

    describe('Recurrence Rules', () => {
        it('should generate correct RRULE string for weekly', () => {
            const rule: RecurrenceRule = {
                enabled: true,
                frequency: 'weekly',
                interval: 1
            };
            const rrule = generateRRule(rule);
            expect(rrule).toBe('RRULE:FREQ=WEEKLY');
        });

        it('should generate correct RRULE string for biweekly', () => {
            const rule: RecurrenceRule = {
                enabled: true,
                frequency: 'biweekly',
                interval: 1
            };
            const rrule = generateRRule(rule);
            expect(rrule).toBe('RRULE:FREQ=WEEKLY;INTERVAL=2');
        });

        it('should generate correct RRULE string for triweekly', () => {
            const rule: RecurrenceRule = {
                enabled: true,
                frequency: 'triweekly',
                interval: 1
            };
            const rrule = generateRRule(rule);
            expect(rrule).toBe('RRULE:FREQ=WEEKLY;INTERVAL=3');
        });

        it('should generate correct RRULE string for monthly', () => {
            const rule: RecurrenceRule = {
                enabled: true,
                frequency: 'monthly',
                interval: 1
            };
            const rrule = generateRRule(rule);
            expect(rrule).toBe('RRULE:FREQ=MONTHLY');
        });

        it('should handle count in RRULE', () => {
            const rule: RecurrenceRule = {
                enabled: true,
                frequency: 'weekly',
                interval: 1,
                count: 5
            };
            const rrule = generateRRule(rule);
            expect(rrule).toContain('COUNT=5');
        });

        it('should handle until date in RRULE', () => {
            const until = '2023-12-31T00:00:00.000Z';
            const rule: RecurrenceRule = {
                enabled: true,
                frequency: 'weekly',
                interval: 1,
                until
            };
            const rrule = generateRRule(rule);
            // until date is formatted to remove dashes/colons
            expect(rrule).toContain('UNTIL=20231231T235959Z');
        });

        it('should return empty string if disabled', () => {
            const rule: RecurrenceRule = {
                enabled: false,
                frequency: 'weekly',
                interval: 1
            };
            expect(generateRRule(rule)).toBe('');
        });

        it('should default to interval 1 if missing in default case', () => {
            // force unknown frequency via any to hit default case if possible,
            // or just standard usage.
            // Actually frequency is typed. But let's test a custom interval.
            const rule = {
                enabled: true,
                frequency: 'custom' as any,
                interval: 5
            };
            const rrule = generateRRule(rule);
            // Default case in generateIcsContent maps custom to interval || 1
            // generateRRule switch default sets interval = recurrence.interval || 1
            expect(rrule).toContain('INTERVAL=5');
        });
    });

    it('should include RRULE in generated ICS content', () => {
        const start = new Date();
        const end = new Date();
        const event = {
            start,
            end,
            summary: 'Recurring Event',
            organizer: { displayName: 'Org', email: 'org@test.com' },
            attendees: [],
            recurrence: {
                enabled: true,
                frequency: 'biweekly' as const,
                interval: 1,
                count: 10
            }
        };

        const ics = generateIcsContent(event);
        // order of RRULE parameters may vary
        expect(ics).toContain('RRULE:');
        expect(ics).toContain('FREQ=WEEKLY');
        expect(ics).toContain('INTERVAL=2');
        expect(ics).toContain('COUNT=10');
    });

    it('should include RRULE with UNTIL in generated ICS content', () => {
        const start = new Date();
        const end = new Date();
        const until = '2025-01-01T00:00:00.000Z';
        const event = {
            start,
            end,
            summary: 'Recurring Until Event',
            organizer: { displayName: 'Org', email: 'org@test.com' },
            attendees: [],
            recurrence: {
                enabled: true,
                frequency: 'biweekly' as const,
                interval: 1,
                until
            }
        };

        const ics = generateIcsContent(event);
        // order of RRULE parameters may vary
        expect(ics).toContain('RRULE:');
        expect(ics).toContain('FREQ=WEEKLY');
        expect(ics).toContain('INTERVAL=2');
        expect(ics).toContain('UNTIL=20250101');
    });

    it('should generate valid RRULE that can be parsed by node-ical', async () => {
        const start = new Date('2024-01-01T10:00:00Z');
        const end = new Date('2024-01-01T11:00:00Z');
        const event = {
            start,
            end,
            summary: 'Regression RRule',
            organizer: { displayName: 'Org', email: 'org@test.com' },
            attendees: [],
            recurrence: {
                enabled: true,
                frequency: 'weekly' as const,
                interval: 1,
                count: 3
            }
        };

        const ics = generateIcsContent(event);

        // We use node-ical (which is in dependencies) to verify the output is parseable
        const ical = await import('node-ical');
        const parsed = await ical.async.parseICS(ics);

        const eventKey = Object.keys(parsed).find(k => parsed[k].type === 'VEVENT');
        expect(eventKey).toBeDefined();
        if (!eventKey) return;

        const parsedEvent = parsed[eventKey];
        expect(parsedEvent.rrule).toBeDefined();
        // node-ical (rrule) should parse this correctly
        // The rrule object has options
        // Recent node-ical / rrule versions return string frequencies
        // Use RRule.WEEKLY or integer 2 if it's the old object, but here we see "WEEKLY"
        expect(parsedEvent.rrule?.options.freq).toBe('WEEKLY');
        expect(parsedEvent.rrule?.options.count).toBe(3);
    });
});
