
import { IntervalSet } from "../types.js";
import { describe, it, expect } from "vitest";

describe("IntervalSet Validation", () => {
    it("should throw RangeError when start equals end in constructor", () => {
        const t = new Date();
        expect(() => {
            new IntervalSet(t, t);
        }).toThrow(RangeError);
    });

    it("should throw RangeError when start is after end in constructor", () => {
        const t1 = new Date();
        const t2 = new Date(t1.getTime() - 1000); // t2 < t1
        expect(() => {
            new IntervalSet(t1, t2);
        }).toThrow(RangeError);
    });

    it("should allow start < end", () => {
        const t1 = new Date();
        const t2 = new Date(t1.getTime() + 1000); // t2 > t1
        const set = new IntervalSet(t1, t2);
        expect(set.length).toBe(1);
    });

    describe("inverse()", () => {
        const start = new Date('2024-01-01T10:00:00Z');
        const end = new Date('2024-01-01T12:00:00Z');
        const midStart = new Date('2024-01-01T10:30:00Z');
        const midEnd = new Date('2024-01-01T11:30:00Z');

        it("should return empty set for inverse of empty set without bounds", () => {
            const set = new IntervalSet();
            const inverted = set.inverse();
            expect(inverted.length).toBe(0);
        });

        it("should return full range for inverse of empty set with bounds", () => {
            const set = new IntervalSet();
            const inverted = set.inverse(start, end);
            expect(inverted.length).toBe(1);
            expect(inverted[0].start).toEqual(start);
            expect(inverted[0].end).toEqual(end);
        });

        it("should include head and tail gaps with bounds", () => {
            const set = new IntervalSet();
            set.push({ start: midStart, end: midEnd }); // 10:30 - 11:30

            const inverted = set.inverse(start, end); // 10:00 - 12:00

            expect(inverted.length).toBe(2);
            // Gap 1: 10:00 - 10:30
            expect(inverted[0].start).toEqual(start);
            expect(inverted[0].end).toEqual(midStart);
            // Gap 2: 11:30 - 12:00
            expect(inverted[1].start).toEqual(midEnd);
            expect(inverted[1].end).toEqual(end);
        });

        it("should only return internal gaps without bounds", () => {
            const set = new IntervalSet();
            set.push({ start: midStart, end: new Date('2024-01-01T10:45:00Z') });
            set.push({ start: new Date('2024-01-01T11:15:00Z'), end: midEnd });

            const inverted = set.inverse();
            expect(inverted.length).toBe(1);
            expect(inverted[0].start).toEqual(new Date('2024-01-01T10:45:00Z'));
            expect(inverted[0].end).toEqual(new Date('2024-01-01T11:15:00Z'));
        });

        it("should handle disjoint bounds (start after last interval)", () => {
            const set = new IntervalSet();
            set.push({ start: midStart, end: midEnd });

            // Bounds strictly after the interval
            const lateStart = new Date('2024-01-01T13:00:00Z');
            const lateEnd = new Date('2024-01-01T14:00:00Z');

            const inverted = set.inverse(lateStart, lateEnd);
            expect(inverted.length).toBeGreaterThan(0);
            expect(inverted[inverted.length - 1].end).toEqual(lateEnd);
        });
    });

    describe("initializeWithSlots (via constructor)", () => {
        const timeZone = "Europe/Berlin";
        const timeMin = new Date("2026-02-18T12:00:00Z"); // Wed
        const timeMax = new Date("2026-02-19T23:00:00Z"); // Thu 23:00 UTC (Next Day)

        it("should handle single digit hours (e.g. '8:00')", () => {
            const slots = {
                [4]: [{ start: "8:00", end: "09:00" }] // Thu
            };
            // initializeWithSlots logic: loop days.
            // Wed (3) -> No slots.
            // Thu (4) -> Slots.
            const set = new IntervalSet(timeMin, timeMax, slots as any, timeZone);
            expect(set.length).toBe(1);
            // 8:00 Berlin -> 07:00 UTC
            expect(set[0].start.toISOString()).toBe("2026-02-19T07:00:00.000Z");
        });

        it("should handle time without minutes (e.g. '8')", () => {
            const slots = {
                [4]: [{ start: "8", end: "9" }]
            };
            const set = new IntervalSet(timeMin, timeMax, slots as any, timeZone);
            expect(set.length).toBe(1);
            expect(set[0].start.toISOString()).toBe("2026-02-19T07:00:00.000Z");
        });

        it("should handle '24:00' as next day 00:00", () => {
            const slots = {
                [3]: [{ start: "23:00", end: "24:00" }] // Wed
            };
            const set = new IntervalSet(timeMin, timeMax, slots as any, timeZone);
            expect(set.length).toBe(1);
            // 23:00 Berlin -> 22:00 UTC
            expect(set[0].start.toISOString()).toBe("2026-02-18T22:00:00.000Z");
            // 24:00 Berlin -> 00:00 Thu Berlin -> 23:00 Wed UTC
            expect(set[0].end.toISOString()).toBe("2026-02-18T23:00:00.000Z");
        });

        it("should throw error for invalid time strings", () => {
            const slots = {
                [4]: [{ start: "invalid", end: "10:00" }]
            };
            expect(() => {
                new IntervalSet(timeMin, timeMax, slots as any, timeZone);
            }).toThrow(/Invalid Date generated/);
        });

        it("should throw error for impossible times (e.g. '99:99')", () => {
            const slots = {
                [4]: [{ start: "99:99", end: "10:00" }]
            };
            expect(() => {
                new IntervalSet(timeMin, timeMax, slots as any, timeZone);
            }).toThrow(/Invalid Date generated/);
        });
    });
});

