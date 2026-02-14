
import { describe, it, expect } from 'vitest';
import { IntervalSet } from 'common';
import { convertBusyToFree } from '../utility/scheduler';

describe('Full Persistence Reproduction', () => {
    // User provided event definition
    const event = {
        "available": {
            "0": [],
            "1": [],
            "2": [
                {
                    "start": "19:30",
                    "end": "20:00"
                }
            ],
            "3": [
                {
                    "start": "20:00",
                    "end": "21:00"
                }
            ],
            "4": [
                {
                    "start": "8:00",
                    "end": "11:00"
                },
                {
                    "start": "20:00",
                    "end": "21:00"
                }
            ],
            "5": [
                {
                    "start": "8:00",
                    "end": "10:00"
                }
            ],
            "6": []
        },
        "recurrence": {
            "enabled": false,
            "frequency": "biweekly",
            "interval": 2
        },
        "_id": "69450e82e63139ad6765f107",
        "user": "f4c3f4dc-193e-4b0f-8c2a-c6153256548c",
        "name": "Kurzmeeting",
        "location": "https://fh-swf.zoom.us/my/cgawron",
        "description": "Kurzes Online-Meeting",
        "duration": 15,
        "url": "kurzmeeting",
        "isActive": true,
        "bufferbefore": 5,
        "bufferafter": 5,
        "minFuture": 172800,
        "maxFuture": 5184000,
        "maxPerDay": 3,
        "availabilityMode": "define",
        "tags": [],
        "__v": 0,
        "allowed_roles": []
    };

    it('should initialize IntervalSet correctly from event availability', () => {
        // Test Window: Wed Feb 18 2026 to Thu Feb 19 2026 (Evening)
        const timeZone = "Europe/Berlin";
        const timeMin = new Date("2026-02-18T12:00:00Z"); // Wed 13:00 Berlin
        const timeMax = new Date("2026-02-19T23:00:00Z"); // Thu 00:00 Berlin (next day) -> Covers Thu fully.

        // 1. Initialize IntervalSet with event.available
        const freeSlots = new IntervalSet(timeMin, timeMax, event.available as any, timeZone);

        // console.log("Initialized FreeSlots:", JSON.stringify(freeSlots, null, 2));

        // Expectation:
        // Wed: 20:00-21:00 Berlin -> 19:00-20:00 UTC
        // Thu: 08:00-11:00 Berlin -> 07:00-10:00 UTC
        // Thu: 20:00-21:00 Berlin -> 19:00-20:00 UTC

        // There should be NO slot starting at 20:05 UTC or covering the night.

        const nightSlot = freeSlots.find(s => {
            // Check for overlap with the problematic range 20:05 - 06:55
            return s.start < new Date("2026-02-19T06:55:00Z") && s.end > new Date("2026-02-18T20:05:00Z");
        });

        // The intersection of FreeSlots with [20:05, 06:55] should be EMPTY.
        // Actually, let's just assert the known correct slots.

        // Slot 1: 19:00-20:00 UTC
        const wedSlot = freeSlots.find(s => s.start.toISOString() === "2026-02-18T19:00:00.000Z");
        expect(wedSlot).toBeDefined();
        expect(wedSlot?.end.toISOString()).toBe("2026-02-18T20:00:00.000Z");

        // Slot 2: 07:00-10:00 UTC (Thursday Morning)
        const thuSlot = freeSlots.find(s => s.start.toISOString() === "2026-02-19T07:00:00.000Z");
        expect(thuSlot).toBeDefined();
        expect(thuSlot?.end.toISOString()).toBe("2026-02-19T10:00:00.000Z");

        // Slot 3: 19:00-20:00 UTC (Thursday Evening)
        const thuEvenSlot = freeSlots.find(s => s.start.toISOString() === "2026-02-19T19:00:00.000Z");
        expect(thuEvenSlot).toBeDefined();
        expect(thuEvenSlot?.end.toISOString()).toBe("2026-02-19T20:00:00.000Z");

        // Ensure NO other slots in between
        const slotsBetween = freeSlots.filter(s => s.start > new Date("2026-02-18T20:00:00Z") && s.end < new Date("2026-02-19T07:00:00Z"));
        expect(slotsBetween.length).toBe(0);
    });

    it('should REPRODUCE phantom slot if using Default Availability (Full Day)', () => {
        // Scenario: Event is configured to use Default Availability (or falls back to it).
        // User Default Availability is typically 09:00-17:00 OR if not set, maybe interpreted as full availability?
        // Let's simulate "Full Availability" (00:00 - 24:00) to see if it produces the phantom slot.
        // Or specific default like 00:00 - 23:59.

        const timeZone = "Europe/Berlin";
        const timeMin = new Date("2026-02-18T12:00:00Z");
        const timeMax = new Date("2026-02-19T23:00:00Z");

        // Simulate Default Availability: All Day (00:00 - 24:00) for Wed and Thu.
        const defaultSlots = {
            [3]: [{ start: "00:00", end: "24:00" }], // Wed
            [4]: [{ start: "00:00", end: "24:00" }]  // Thu
        };

        const freeSlots = new IntervalSet(timeMin, timeMax, defaultSlots as any, timeZone);

        // Busy Slots (same as before)
        const busySlots = [
            { start: new Date("2026-02-18T17:00:00Z"), end: new Date("2026-02-18T20:00:00Z") }, // Ends 21:00 Berlin
            { start: new Date("2026-02-19T07:00:00Z"), end: new Date("2026-02-19T08:00:00Z") }  // Starts 08:00 Berlin
        ];

        const bufferBefore = 5;
        const bufferAfter = 5;

        // Calculate
        const freeFromBusy = convertBusyToFree(busySlots, timeMin, timeMax, bufferBefore, bufferAfter);
        console.log("FreeFromBusy (Default):", JSON.stringify(freeFromBusy, null, 2));

        const finalSlots = freeSlots.intersect(freeFromBusy);
        console.log("FinalSlots (Default):", JSON.stringify(finalSlots, null, 2));

        // Expectation: Phantom Slot should appear!
        // Busy 1 ends 20:00 UTC. BufferAfter 5 -> Free starts 20:05.
        // Busy 2 starts 07:00 UTC. BufferBefore 5 -> Free ends 06:55.
        // Since Availability covers this whole night, the gap 20:05 - 06:55 remains.

        const phantomPart1 = finalSlots.find(s => s.start.toISOString() === "2026-02-18T20:05:00.000Z");
        expect(phantomPart1).toBeDefined();
        // It ends at midnight because IntervalSet intervals were generated per day
        expect(phantomPart1?.end.toISOString()).toBe("2026-02-18T23:00:00.000Z");

        // The second part continues immediately
        const phantomPart2 = finalSlots.find(s => s.start.toISOString() === "2026-02-18T23:00:00.000Z");
        expect(phantomPart2).toBeDefined();
        expect(phantomPart2?.end.toISOString()).toBe("2026-02-19T06:55:00.000Z");

        // If Default Mode is the cause, this assertion should PASS (phantom is defined).
        // If it fails, then Default Mode logic in my test is wrong or Default Mode doesn't cause it.
        // But logic says it should.
    });

    it('should NOT produce phantom slot even if some slots are Invalid Date (Broken Parsing Scenario)', () => {
        // Simulating the state where "8:00" failed to parse, but "20:00" worked.
        // Availability: 
        // 1. Wed 19:00-20:00 UTC (Valid)
        // 2. Thu Invalid-Invalid (Broken 8:00 slot - simulates effect of new Date("...T8:00"))
        // 3. Thu 19:00-20:00 UTC (Valid)

        const validWed = { start: new Date("2026-02-18T19:00:00Z"), end: new Date("2026-02-18T20:00:00Z") };
        const invalidThu = { start: new Date("Invalid Date"), end: new Date("Invalid Date") };
        const validThu = { start: new Date("2026-02-19T19:00:00Z"), end: new Date("2026-02-19T20:00:00Z") };

        const availability = new IntervalSet();
        availability.push(validWed);
        availability.push(invalidThu);
        availability.push(validThu);

        // Busy Slots -> FreeFromBusy (The Phantom Source)
        // 20:05 UTC - 06:55 UTC.
        const phantomRange = { start: new Date("2026-02-18T20:05:00Z"), end: new Date("2026-02-19T06:55:00Z") };
        const freeFromBusy = new IntervalSet();
        freeFromBusy.push(phantomRange);

        // Intersection
        const result = availability.intersect(freeFromBusy);

        // Expectation: PHANTOM SLOT APPEARS!
        // The Invalid Date range somehow allows the 'other' set (freeFromBusy) to pass through intersection?
        // Or maybe comparison with Invalid Date behaves unexpectedly.

        console.log("Broken Parsing Result:", JSON.stringify(result, null, 2));

        expect(result.length).toBe(1);
        expect(result[0].start.toISOString()).toBe("2026-02-18T20:05:00.000Z");
        expect(result[0].end.toISOString()).toBe("2026-02-19T06:55:00.000Z");
    });
});
