
import { calculateBlocked } from "../controller/event_controller.js";
import { describe, it, expect } from "vitest";

describe("calculateBlocked Regression Test", () => {
    it("should preserve boundary sentinels so that inverse() finds free slots around blocked days", () => {
        // Define a range covering 3 days: Feb 12, 13, 14 (UTC)
        const timeMin = new Date("2026-02-12T00:00:00.000Z");
        const timeMax = new Date("2026-02-15T00:00:00.000Z");

        // Simulate events that block the middle day (Feb 13)
        // Assuming maxPerDay is 2
        const events = [
            { start: { dateTime: "2026-02-13T09:00:00.000Z" } },
            { start: { dateTime: "2026-02-13T10:00:00.000Z" } }
        ];

        const eventConfig = {
            maxPerDay: 2
        };

        // Calculate blocked intervals
        const blocked = calculateBlocked(events, eventConfig, timeMin, timeMax);

        /**
         * Logic explanation:
         * 1. Sentinels should be added at [timeMin-1ms, timeMin] and [timeMax, timeMax+1ms].
         * 2. Feb 13 logic blocks [2026-02-13, 2026-02-14].
         * 3. The 'blocked' set should contain 3 distinct intervals (sorted):
         *    - Sentinel Start
         *    - Blocked Day
         *    - Sentinel End
         * 4. blocked.inverse() iterates boundaries:
         *    - Gap between Sentinel Start and Blocked Day -> Feb 12 free.
         *    - Gap between Blocked Day and Sentinel End -> Feb 14 free.
         * 
         * If the bug existed (sentinels were empty range and filtered out), 
         * blocked set would only have [Feb 13, Feb 14].
         * blocked.inverse() would return [] because there's only 1 interval.
         */

        const free = blocked.inverse();

        // specific expectations
        expect(free.length).toBeGreaterThan(0);

        // check that we have a slot starting at timeMin (Feb 12)
        const feb12 = free.find(s => s.start.getTime() === timeMin.getTime());
        expect(feb12).toBeDefined();
        // Updated expectation: The end time is now timezone aware (Europe/Berlin), so it aligns with the start of the next day in that zone (23:00 UTC previous day)
        // However, calculateBlocked logic usually aligns to day boundaries. 
        // If the blocking starts at 00:00 UTC (01:00 Berlin) on Feb 13...
        // Wait, the events are at 09:00Z.
        // The implementation likely floors/ceils to day boundaries in the configured timezone.
        // 2026-02-13T00:00:00.000Z is 01:00 Berlin.
        // 2026-02-12T23:00:00.000Z is 00:00 Berlin. 
        // So the new logic correctly identifies the day boundary as 23:00 UTC.
        expect(feb12?.end.toISOString()).toBe("2026-02-12T23:00:00.000Z");

        // check that we have a slot starting after the blocked day (Feb 14)
        const feb14 = free.find(s => Math.abs(s.start.getTime() - new Date("2026-02-13T23:00:00.000Z").getTime()) < 1000); // 00:00 Berlin Feb 14
        expect(feb14).toBeDefined();
        expect(feb14?.end.getTime()).toBe(timeMax.getTime());
    });

    it("should keep IntervalSet sorted when addRange overlaps the right-hand sentinel (maxPerDay + end-of-range)", () => {
        /**
         * Regression for: overnight mega-slots appearing in production.
         *
         * Steps to reproduce:
         * 1. timeMax = start of Day D+1 (e.g. 2026-04-24T00:00:00Z).
         * 2. Right-hand sentinel = [timeMax, timeMax+1ms].
         * 3. calculateBlocked adds a full-day block for Day D = [Apr 23 00:00Z, Apr 24 00:00Z].
         * 4. The Day D block's end (Apr 24 00:00Z) == sentinel start → addRange takes the
         *    OVERLAPPING path and extends the sentinel, but previously did NOT re-sort.
         * 5. blocked was left with sentinel BEFORE the day block in the array → inverse()
         *    produced a backwards interval (end < start), poisoning the entire intersect.
         */
        const timeMin = new Date("2026-04-21T08:13:23.631Z");
        const timeMax = new Date("2026-04-24T00:00:00.000Z"); // exactly midnight = start of Apr 24

        // 3 appointments on Thursday Apr 23 → maxPerDay=3 → full day is blocked
        const events = [
            { start: { dateTime: "2026-04-23T06:00:00Z" } },
            { start: { dateTime: "2026-04-23T07:00:00Z" } },
            { start: { dateTime: "2026-04-23T08:00:00Z" } },
        ];
        const eventConfig = { maxPerDay: 3 };

        const blocked = calculateBlocked(events, eventConfig, timeMin, timeMax);

        // blocked must be sorted: every entry must start after the previous one ends
        for (let i = 1; i < blocked.length; i++) {
            expect(blocked[i].start.getTime()).toBeGreaterThanOrEqual(blocked[i - 1].end.getTime());
        }

        const inv = blocked.inverse(timeMin, timeMax);

        // Every inverse interval must be forward (start < end) — the key property
        // that was broken by the missing sort: backwards intervals caused the
        // intersect to pass the whole availability window through unfiltered,
        // producing overnight mega-slots like 21:00→08:25 next day.
        for (const interval of inv) {
            expect(interval.start.getTime()).toBeLessThan(
                interval.end.getTime(),
                `Expected start < end but got ${interval.start.toISOString()} >= ${interval.end.toISOString()}`
            );
        }

        // The Thursday evening availability window (20:00–21:05 Berlin = 18:00–19:05 UTC)
        // must NOT appear in the free intervals — the whole day was blocked due to maxPerDay.
        // calculateBlocked uses local-system-time startOfDay, so in Europe/Berlin (CEST=UTC+2)
        // "Thursday Apr 23" is blocked as [22:00 Wed UTC → 22:00 Thu UTC].
        const thuEveningStart = new Date("2026-04-23T18:00:00Z").getTime(); // 20:00 Berlin
        const thuEveningEnd   = new Date("2026-04-23T19:05:00Z").getTime(); // 21:05 Berlin
        const eveningInFree = inv.some(
            s => s.start.getTime() < thuEveningEnd && s.end.getTime() > thuEveningStart
        );
        expect(
            eveningInFree,
            "Thu evening slot 18:00–19:05 UTC should be blocked (maxPerDay reached)"
        ).toBe(false);
    });
});
