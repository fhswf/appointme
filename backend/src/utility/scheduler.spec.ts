import { describe, it, expect } from 'vitest';
import { convertBusyToFree } from './scheduler';
import { addMinutes } from 'date-fns';

describe('scheduler utility', () => {
    describe('convertBusyToFree', () => {
        it('should return full interval when no busy slots', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots: any[] = [];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            expect(result.length).toBe(1);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(timeMax);
        });

        it('should handle single busy slot in the middle', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T12:00:00Z'), end: new Date('2025-01-01T13:00:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            expect(result.length).toBe(2);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(new Date('2025-01-01T12:00:00Z'));
            expect(result[1].start).toEqual(new Date('2025-01-01T13:00:00Z'));
            expect(result[1].end).toEqual(timeMax);
        });

        it('should handle busy slot at the start', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T09:00:00Z'), end: new Date('2025-01-01T10:00:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            expect(result.length).toBe(1);
            expect(result[0].start).toEqual(new Date('2025-01-01T10:00:00Z'));
            expect(result[0].end).toEqual(timeMax);
        });

        it('should handle busy slot at the end', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T16:00:00Z'), end: new Date('2025-01-01T17:00:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            expect(result.length).toBe(1);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(new Date('2025-01-01T16:00:00Z'));
        });

        it('should handle multiple busy slots', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T10:00:00Z'), end: new Date('2025-01-01T11:00:00Z') },
                { start: new Date('2025-01-01T13:00:00Z'), end: new Date('2025-01-01T14:00:00Z') },
                { start: new Date('2025-01-01T15:00:00Z'), end: new Date('2025-01-01T16:00:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            expect(result.length).toBe(4);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(new Date('2025-01-01T10:00:00Z'));
            expect(result[1].start).toEqual(new Date('2025-01-01T11:00:00Z'));
            expect(result[1].end).toEqual(new Date('2025-01-01T13:00:00Z'));
            expect(result[2].start).toEqual(new Date('2025-01-01T14:00:00Z'));
            expect(result[2].end).toEqual(new Date('2025-01-01T15:00:00Z'));
            expect(result[3].start).toEqual(new Date('2025-01-01T16:00:00Z'));
            expect(result[3].end).toEqual(timeMax);
        });

        it('should apply buffer before busy slot', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T12:00:00Z'), end: new Date('2025-01-01T13:00:00Z') }
            ];
            const bufferBefore = 15; // 15 minutes

            const result = convertBusyToFree(busySlots, timeMin, timeMax, bufferBefore, 0);

            expect(result.length).toBe(2);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(addMinutes(new Date('2025-01-01T12:00:00Z'), -15));
            expect(result[1].start).toEqual(new Date('2025-01-01T13:00:00Z'));
            expect(result[1].end).toEqual(timeMax);
        });

        it('should apply buffer after busy slot', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T12:00:00Z'), end: new Date('2025-01-01T13:00:00Z') }
            ];
            const bufferAfter = 30; // 30 minutes

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, bufferAfter);

            expect(result.length).toBe(2);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(new Date('2025-01-01T12:00:00Z'));
            expect(result[1].start).toEqual(addMinutes(new Date('2025-01-01T13:00:00Z'), 30));
            expect(result[1].end).toEqual(timeMax);
        });

        it('should apply both buffers', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T12:00:00Z'), end: new Date('2025-01-01T13:00:00Z') }
            ];
            const bufferBefore = 15;
            const bufferAfter = 15;

            const result = convertBusyToFree(busySlots, timeMin, timeMax, bufferBefore, bufferAfter);

            expect(result.length).toBe(2);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(addMinutes(new Date('2025-01-01T12:00:00Z'), -15));
            expect(result[1].start).toEqual(addMinutes(new Date('2025-01-01T13:00:00Z'), 15));
            expect(result[1].end).toEqual(timeMax);
        });

        it('should handle overlapping busy slots', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T10:00:00Z'), end: new Date('2025-01-01T12:00:00Z') },
                { start: new Date('2025-01-01T11:00:00Z'), end: new Date('2025-01-01T13:00:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            expect(result.length).toBe(2);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(new Date('2025-01-01T10:00:00Z'));
            expect(result[1].start).toEqual(new Date('2025-01-01T13:00:00Z'));
            expect(result[1].end).toEqual(timeMax);
        });

        it('should handle adjacent busy slots', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T10:00:00Z'), end: new Date('2025-01-01T12:00:00Z') },
                { start: new Date('2025-01-01T12:00:00Z'), end: new Date('2025-01-01T14:00:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            expect(result.length).toBe(2);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(new Date('2025-01-01T10:00:00Z'));
            expect(result[1].start).toEqual(new Date('2025-01-01T14:00:00Z'));
            expect(result[1].end).toEqual(timeMax);
        });

        it('should handle busy slot covering entire period', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T08:00:00Z'), end: new Date('2025-01-01T18:00:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            expect(result.length).toBe(0);
        });

        it('should handle string dates in busy slots', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: '2025-01-01T12:00:00Z', end: '2025-01-01T13:00:00Z' }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            expect(result.length).toBe(2);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(new Date('2025-01-01T12:00:00Z'));
            expect(result[1].start).toEqual(new Date('2025-01-01T13:00:00Z'));
            expect(result[1].end).toEqual(timeMax);
        });

        it('should handle busy slot before time range', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T07:00:00Z'), end: new Date('2025-01-01T08:00:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            expect(result.length).toBe(1);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(timeMax);
        });

        it('should handle busy slot after time range', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const busySlots = [
                { start: new Date('2025-01-01T18:00:00Z'), end: new Date('2025-01-01T19:00:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, 0, 0);

            // Busy slot is after timeMax, so should return full interval
            // However, the function updates current to busy.end if busy.end > current
            // So the free interval ends at busy.end (18:00) instead of timeMax (17:00)
            expect(result.length).toBe(1);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(new Date('2025-01-01T18:00:00Z'));
        });
        it('should offer slot at timeMin even with buffer if preceding busy slot ends enough before', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const bufferbefore = 5;
            // Busy slot ending at 08:55. With 5m buffer BEFORE, it starts 5m earlier.
            // Start: 08:00 -> 07:55. End: 08:55 -> 08:55.
            // Free time starts at 08:55, which is before timeMin (09:00).
            // So full range should be available.
            const busySlots = [
                { start: new Date('2025-01-01T08:00:00Z'), end: new Date('2025-01-01T08:55:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, bufferbefore, 0);

            expect(result.length).toBe(1);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(timeMax);
        });

        it('should NOT shift slot if preceding busy slot ends early enough (bufferBefore affects start)', () => {
            const timeMin = new Date('2025-01-01T09:00:00Z');
            const timeMax = new Date('2025-01-01T17:00:00Z');
            const bufferbefore = 5;
            // Busy slot ends at 09:00. BufferBefore affects START.
            // Busy: 08:00-09:00 -> 07:55-09:00.
            // Free starts at 09:00.
            const busySlots = [
                { start: new Date('2025-01-01T08:00:00Z'), end: new Date('2025-01-01T09:00:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, bufferbefore, 0);

            expect(result.length).toBe(1);
            expect(result[0].start).toEqual(timeMin); // 09:00
            expect(result[0].end).toEqual(timeMax);
        });

        it('should offer 19:30 if busy slot ends at 19:30 and bufferbefore is 5 (affects start)', () => {
            const timeMin = new Date('2025-12-23T19:30:00Z');
            const timeMax = new Date('2025-12-23T20:30:00Z');
            const bufferbefore = 5;
            // Busy slot ending exactly when window starts.
            // BufferBefore affects START. End remains 19:30.
            const busySlots = [
                { start: new Date('2025-12-23T19:00:00Z'), end: new Date('2025-12-23T19:30:00Z') }
            ];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, bufferbefore, 0);

            expect(result.length).toBe(1);
            expect(result[0].start).toEqual(timeMin); // 19:30, not 19:35
            expect(result[0].end).toEqual(timeMax);
        });

        it('should offer 19:30 even with 5m buffer if no busy slots interfere', () => {
            const timeMin = new Date('2025-12-23T19:30:00Z');
            const timeMax = new Date('2025-12-23T20:30:00Z');
            const bufferbefore = 5;
            const busySlots: any[] = [];

            const result = convertBusyToFree(busySlots, timeMin, timeMax, bufferbefore, 0);

            expect(result.length).toBe(1);
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(timeMax);
        });

        it('REGRESSION: should correctly handle asymmetric buffers (night gap scenario)', () => {
            // Scenario: Evening appointment ends at 20:00. Morning appointment starts at 08:00.
            // Config: bufferBefore = 30m (need prep for morning), bufferAfter = 0m (no cleanup for evening).
            const timeMin = new Date('2026-02-18T18:00:00Z');
            const timeMax = new Date('2026-02-19T10:00:00Z');

            const busySlots = [
                { start: new Date('2026-02-18T19:00:00Z'), end: new Date('2026-02-18T20:00:00Z') }, // Evening event
                { start: new Date('2026-02-19T08:00:00Z'), end: new Date('2026-02-19T09:00:00Z') }  // Morning event
            ];

            const bufferBefore = 30;
            const bufferAfter = 0;

            const result = convertBusyToFree(busySlots, timeMin, timeMax, bufferBefore, bufferAfter);

            // Expectation with CORRECT logic:
            // 1. Free Interval after Evening Event:
            //    Starts at Evening End + bufferAfter (20:00 + 0) = 20:00.
            //    Ends at Morning Start - bufferBefore (08:00 - 30) = 07:30.
            //
            // (If buggy, it would have started at 20:30 and ended at 08:00)

            expect(result.length).toBe(3);
            // 1. Start -> Evening Start (18:00 -> 18:30 due to bufferBefore of Evening Event? No, bufferBefore of Evening applied to start)
            // Wait, logic:
            // First loop (Evening):
            // _start = BusyStart (19:00) - bufferBefore (30) = 18:30.
            // Free 1: timeMin (18:00) -> 18:30.

            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(new Date('2026-02-18T18:30:00Z'));

            // NextAvailable = BusyEnd (20:00) + bufferAfter (0) = 20:00.
            // Current = 20:00.

            // Second loop (Morning):
            // _start = BusyStart (08:00) - bufferBefore (30) = 07:30.
            // Free 2: 20:00 -> 07:30.

            expect(result[1].start).toEqual(new Date('2026-02-18T20:00:00Z'));
            expect(result[1].end).toEqual(new Date('2026-02-19T07:30:00Z'));

            // NextAvailable = BusyEnd (09:00) + bufferAfter (0) = 09:00.
            // Current = 09:00.
            // Free 3: 09:00 -> timeMax (10:00).

            expect(result[2].start).toEqual(new Date('2026-02-19T09:00:00Z'));
            expect(result[2].end).toEqual(timeMax);
        });

        it('should handle symmetric 5m buffers (User Scenario)', () => {
            // Scenario: Evening appointment ends at 20:00. Morning appointment starts at 08:00.
            // Config: bufferBefore = 5m, bufferAfter = 5m.
            const timeMin = new Date('2026-02-18T18:00:00Z');
            const timeMax = new Date('2026-02-19T10:00:00Z');

            const busySlots = [
                { start: new Date('2026-02-18T19:00:00Z'), end: new Date('2026-02-18T20:00:00Z') }, // Evening event
                { start: new Date('2026-02-19T08:00:00Z'), end: new Date('2026-02-19T09:00:00Z') }  // Morning event
            ];

            const bufferBefore = 5;
            const bufferAfter = 5;

            const result = convertBusyToFree(busySlots, timeMin, timeMax, bufferBefore, bufferAfter);

            // Expectation:
            // Evening End (20:00) + bufferAfter (5) = 20:05.
            // Morning Start (08:00) - bufferBefore (5) = 07:55.

            // Note: Since bufferBefore == bufferAfter, the swap bug would have produced the SAME result here.

            expect(result.length).toBe(3);

            // 1. Start -> Evening Start - bufferBefore (5) = 18:55
            expect(result[0].start).toEqual(timeMin);
            expect(result[0].end).toEqual(new Date('2026-02-18T18:55:00Z'));

            // 2. Evening End + bufferAfter (5) -> Morning Start - bufferBefore (5)
            expect(result[1].start).toEqual(new Date('2026-02-18T20:05:00Z'));
            expect(result[1].end).toEqual(new Date('2026-02-19T07:55:00Z'));

            // 3. Morning End + bufferAfter (5) -> End
            expect(result[2].start).toEqual(new Date('2026-02-19T09:05:00Z'));
            expect(result[2].end).toEqual(timeMax);
        });
    });
});
