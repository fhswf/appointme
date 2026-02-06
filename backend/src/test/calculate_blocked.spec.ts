
import { calculateBlocked } from "../controller/event_controller.js";
import { IntervalSet } from "common";
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
        expect(feb12?.end.toISOString()).toBe("2026-02-13T00:00:00.000Z");

        // check that we have a slot starting after the blocked day (Feb 14)
        const feb14 = free.find(s => s.start.toISOString() === "2026-02-14T00:00:00.000Z");
        expect(feb14).toBeDefined();
        expect(feb14?.end.getTime()).toBe(timeMax.getTime());
    });
});
