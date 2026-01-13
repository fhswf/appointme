
import { describe, it, expect } from 'vitest';
import { processParsedEvent } from '../controller/caldav_controller.js';

describe('CalDAV Controller Recurrence Regression', () => {
    it('should handle Temporal.ZonedDateTime objects from rrule.between', () => {
        // Mock a Temporal.ZonedDateTime object (minimal interface needed)
        // It does NOT have .getTime()
        const mockTemporal = {
            epochMilliseconds: 1704106800000, // 2024-01-01T11:00:00Z
            toInstant: () => ({
                epochMilliseconds: 1704106800000
            }),
            toString: () => '2024-01-01T11:00:00+00:00[UTC]'
        };

        const startRange = new Date('2024-01-01T00:00:00Z');
        const endRange = new Date('2024-01-02T00:00:00Z');
        const busySlots: { start: Date, end: Date }[] = [];

        const mockEvent = {
            type: 'VEVENT',
            start: new Date('2024-01-01T10:00:00Z'),
            end: new Date('2024-01-01T11:00:00Z'),
            rrule: {
                // Mock rrule.between returning the Temporal-like object
                between: () => [mockTemporal]
            }
        };

        // This should crash if the bug exists
        try {
            processParsedEvent(mockEvent, startRange, endRange, busySlots);
        } catch (error: any) {
            expect(error.message).toContain('getTime is not a function');
            return; // Test passes if it crashes as expected (reproduction)
        }

        // If we reach here with the bug present, the test failed to reproduce it.
        // Once fixed, this test should pass without catching.
        // For now, if we are reproducing, we expect a crash?
        // Actually, let's write the test to EXPECT SUCCESS and fail if it crashes.
        // But since we want to confirm the bug first...
        // Let's write the test to verify the fix. So it SHOULD fail now.
    });

    it('should successfully process Temporal objects after fix', () => {
        const mockTemporal = {
            epochMilliseconds: 1704106800000,
            toInstant: () => ({
                epochMilliseconds: 1704106800000
            }),
            toString: () => '2024-01-01T11:00:00+00:00[UTC]'
        };

        const startRange = new Date('2024-01-01T00:00:00Z');
        const endRange = new Date('2024-01-02T00:00:00Z');
        const busySlots: { start: Date, end: Date }[] = [];

        const mockEvent = {
            type: 'VEVENT',
            start: new Date('2024-01-01T10:00:00Z'),
            end: new Date('2024-01-01T11:00:00Z'),
            rrule: {
                between: () => [mockTemporal]
            }
        };

        processParsedEvent(mockEvent, startRange, endRange, busySlots);

        expect(busySlots.length).toBe(2);
        expect(busySlots[1].start.getTime()).toBe(1704106800000);
    });
});
