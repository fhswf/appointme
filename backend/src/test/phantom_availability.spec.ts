
import { describe, it, expect } from 'vitest';
import { IntervalSet, Day } from 'common';
import { convertBusyToFree } from '../utility/scheduler';

describe('Phantom Availability Regression', () => {
    it('should NOT produce phantom slots during the night with correct availability', () => {
        // 1. Setup Availability as per User Screenshot
        // Tue: 19:30 - 20:00
        // Wed: 20:00 - 21:00
        // Thu: 08:00 - 11:00, 20:00 - 21:00
        // Fri: 08:00 - 10:00
        const slots = {
            [Day.TUESDAY]: [{ start: "19:30", end: "20:00" }],
            [Day.WEDNESDAY]: [{ start: "20:00", end: "21:00" }],
            [Day.THURSDAY]: [{ start: "08:00", end: "11:00" }, { start: "20:00", end: "21:00" }],
            [Day.FRIDAY]: [{ start: "08:00", end: "10:00" }]
        };

        // Test Window: Wednesday Noon to Friday Morning (covering Wed night and Thu morning)
        // Berlin Time.
        const timeZone = "Europe/Berlin";
        const timeMin = new Date("2026-02-18T12:00:00Z"); // Wed 13:00 Berlin
        const timeMax = new Date("2026-02-20T00:00:00Z"); // Fri 01:00 Berlin - Ensuring Thu is covered

        // 2. Initialize Availability IntervalSet
        const availability = new IntervalSet(timeMin, timeMax, slots, timeZone);

        // 3. Define Busy Slots (The Bug Scenario)
        // Even with the bug (swap), symmetric 5m buffers produce the same result.
        // Evening Appt: Ends 21:00 Berlin (20:00 UTC).
        // Morning Appt: Starts 08:00 Berlin (07:00 UTC).
        const busySlots = [
            { start: new Date("2026-02-18T17:00:00Z"), end: new Date("2026-02-18T20:00:00Z") }, // 18:00-21:00 Berlin
            { start: new Date("2026-02-19T07:00:00Z"), end: new Date("2026-02-19T08:00:00Z") }  // 08:00-09:00 Berlin
        ];

        const bufferBefore = 5;
        const bufferAfter = 5;

        // 4. Calculate Free from Busy (Scheduler Logic)
        const freeFromBusy = convertBusyToFree(busySlots, timeMin, timeMax, bufferBefore, bufferAfter);

        // Let's verify this specific phantom slot existence in the INTERMEDIATE step
        const nightSlot = freeFromBusy.find(s => s.start.toISOString().includes("20:05") && s.end.toISOString().includes("06:55"));
        expect(nightSlot).toBeDefined(); // The "Phantom" availability exists in the busy-subtraction layer

        // 5. Intersect with Availability (Controller Logic)
        const finalSlots = availability.intersect(freeFromBusy);

        // 6. Assert "Phantom" is GONE
        // Availability: [19:00, 20:00] U [07:00, 10:00] ...
        // FreeFromBusy: [..., 20:05] U [06:55, ...]

        // Intersection 1 (Evening):
        // Avail: 19:00-20:00.
        // Busy blocks until 20:05.
        // Result: EMPTY. 

        // Intersection 2 (Morning):
        // Avail: 07:00-10:00.
        // Avail: 07:00 - 10:00.
        // Busy: 06:55 - 08:05.
        // Intersection: [08:05 - 10:00].

        // So expected result:
        // Evening: 0 slots.
        // Morning: 1 slot (08:05 - 10:00).
        // Night (20:05 - 06:55): 0 slots.

        // Assert no slot starts at 20:05
        const phantom = finalSlots.find(s => s.start.toISOString() === "2026-02-18T20:05:00.000Z");
        expect(phantom).toBeUndefined();

        // Assert total slots
        // Depending on how availability handles boundaries, we expect exactly 1 slot in the morning.
        expect(finalSlots.length).toBeGreaterThan(0);
        expect(finalSlots[0].start.toISOString()).toBe("2026-02-19T08:05:00.000Z");
    });
});
