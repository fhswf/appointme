
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
});
