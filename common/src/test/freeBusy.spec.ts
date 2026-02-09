import { Day, IntervalSet, Slot, Slots, TimeRange } from "../types"
import { expect, test, describe } from 'vitest';


describe('Test for issue with freeBusy', () => {
    test('intersection', () => {
        let r1 = new IntervalSet(new Date("2021-05-25T12:43:00.000Z"), new Date("2021-05-27T12:43:00.000Z"))
        let r2 = new IntervalSet([
            { "start": new Date("2021-05-25T12:43:00.000Z"), "end": new Date("2021-05-26T11:00:00.000Z") },
            { "start": new Date("2021-05-26T13:30:00.000Z"), "end": new Date("2021-05-26T15:00:00.000Z") },
            { "start": new Date("2021-05-26T16:00:00.000Z"), "end": new Date("2021-05-26T16:30:00.000Z") },
            { "start": new Date("2021-05-26T17:00:00.000Z"), "end": new Date("2021-05-27T12:43:00.000Z") }])

        r1 = r1.intersect(r2)
        expect(r1.length).toEqual(4);
    })
    test('constructor with strings', () => {
        let r1 = new IntervalSet("2021-05-25T12:43:00.000Z", "2021-05-27T12:43:00.000Z")
        let r2 = new IntervalSet([
            { "start": "2021-05-25T12:43:00.000Z", "end": "2021-05-26T11:00:00.000Z" },
            { "start": "2021-05-26T13:30:00.000Z", "end": "2021-05-26T15:00:00.000Z" },
            { "start": "2021-05-26T16:00:00.000Z", "end": "2021-05-26T16:30:00.000Z" },
            { "start": "2021-05-26T17:00:00.000Z", "end": "2021-05-27T12:43:00.000Z" }])

        r1 = r1.intersect(r2)
        console.log(r1)
        expect(r1.length).toEqual(4);
    })
})

describe('IntervalsSets', () => {
    let date1 = new Date("2020-10-21")
    let date2 = new Date("2020-10-22")
    let date3 = new Date("2020-10-23")
    let date4 = new Date("2020-10-24")
    let date5 = new Date("2020-10-25")
    let date6 = new Date("2020-10-26")
    let date7 = new Date("2020-10-27")
    let date8 = new Date("2020-10-28")

    test('constructor should create slots with length 1', () => {
        let result = new IntervalSet(new Date("2020-10-21"), new Date("2020-10-30"));
        expect(result.length).toEqual(1);
        expect(result[0].start instanceof Date).toBe(true);
        expect(result[0].end instanceof Date).toBe(true);
        expect(result[0].start).toEqual(new Date("2020-10-21"));
        expect(result[0].end).toEqual(new Date("2020-10-30"));
    });
    test('constructor should create slots with length 0', () => {
        expect(() => {
            new IntervalSet(new Date("2020-10-21"), new Date("2020-10-21"));
        }).toThrow(RangeError);
    });
    test('constructor should create slots with length 2', () => {
        let result = new IntervalSet([{ start: date1, end: date2 }, { start: date5, end: date6 }]);
        expect(result.length).toEqual(2);
        expect(result[0].start instanceof Date).toBe(true)
        expect(result[1].start instanceof Date).toBe(true)
    });
    test('constructor should create slots with length 0', () => {
        expect(() => {
            return new IntervalSet(new Date("2020-10-21"), new Date("2020-10-20"));
        }).toThrow();
    });

    test('constructor with 2 dates and 1 slots', () => {
        let slots = {
            0: [{ start: "08:00", end: "12:00" }],
            1: [{ start: "08:00", end: "12:00" }],
            2: [{ start: "08:00", end: "12:00" }],
            3: [{ start: "08:00", end: "12:00" }],
            4: [{ start: "08:00", end: "12:00" }],
            5: [{ start: "08:00", end: "12:00" }],
            6: [{ start: "08:00", end: "12:00" }]
        }
        let result = new IntervalSet(date1, date2, slots);
        expect(result.length).toEqual(1);
        expect(result[0].start.getHours()).toEqual(8);
        expect(result[0].start.getMinutes()).toEqual(0);
        expect(result[0].end.getHours()).toEqual(12);
        expect(result[0].end.getMinutes()).toEqual(0);
    });

    test('equals', () => {
        let r1 = new IntervalSet(new Date("2021-05-25T12:43:00.000Z"), new Date("2021-05-27T12:43:00.000Z"))
        let r2 = new TimeRange(new Date("2021-05-25T12:43:00.000Z"), new Date("2021-05-27T12:43:00.000Z"))


        expect(IntervalSet.equals(r1[0], r2)).toBe(true)
    })

    test('index', () => {
        let result = new IntervalSet(date1, date2);
        expect(result[0].start).toEqual(date1);
        expect(result[0].end).toEqual(date2);
        expect(result[1]).toBeUndefined();
    });
    test('iterator', () => {
        let result = new IntervalSet(new Date("2020-10-21"), new Date("2020-10-22"));
        let sum = 0;
        for (let tr of result) {
            sum += tr.end.valueOf() - tr.start.valueOf()
        }
        expect(sum).toEqual(1000 * 86400);
    });

    test('adding disjunct interval sets', () => {
        const i1 = new IntervalSet(date1, date2);
        const i2 = new IntervalSet(date3, date4);
        const sum = i1.add(i2);
        expect(sum.length).toEqual(2);
        expect(sum[0].start).toEqual(date1);
        expect(sum[0].end).toEqual(date2);
        expect(sum[1].start).toEqual(date3);
        expect(sum[1].end).toEqual(date4);
    });
    test('adding disjunct interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date2 }, { start: date5, end: date6 }]);
        let i2 = new IntervalSet(date3, date4);
        let sum = i1.add(i2);
        expect(sum.length).toEqual(3);
        expect(sum[0].start).toEqual(date1);
        expect(sum[0].end).toEqual(date2);
        expect(sum[1].start).toEqual(date3);
        expect(sum[1].end).toEqual(date4);
        expect(sum[2].start).toEqual(date5);
        expect(sum[2].end).toEqual(date6);
    });

    test('adding overlapping interval sets', () => {
        let i1 = new IntervalSet(date1, date4);
        let i2 = new IntervalSet(date2, date3);
        let sum = i1.add(i2);
        expect(sum.length).toEqual(1);
        expect(sum[0].start).toEqual(date1);
        expect(sum[0].end).toEqual(date4);
    });

    test('adding overlapping interval sets', () => {
        let i1 = new IntervalSet(date2, date3);
        let i2 = new IntervalSet(date1, date4);
        let sum = i1.add(i2);
        expect(sum.length).toEqual(1);
        expect(sum[0].start).toEqual(date1);
        expect(sum[0].end).toEqual(date4);
    });
    test('adding overlapping interval sets', () => {
        let i1 = new IntervalSet(date1, date3);
        let i2 = new IntervalSet(date2, date4);
        let sum = i1.add(i2);
        expect(sum.length).toEqual(1);
        expect(sum[0].start).toEqual(date1);
        expect(sum[0].end).toEqual(date4);
    });
    test('adding overlapping interval sets', () => {
        let i1 = new IntervalSet(date1, date3);
        let i2 = new IntervalSet(date2, date4);
        let sum = i1.add(i2);
        expect(sum.length).toEqual(1);
        expect(sum[0].start).toEqual(date1);
        expect(sum[0].end).toEqual(date4);
    });
    test('adding overlapping interval sets', () => {
        let i1 = new IntervalSet([{ start: date2, end: date3 }, { start: date4, end: date5 }]);
        let i2 = new IntervalSet(date1, date6);
        let sum = i1.add(i2);
        expect(sum.length).toEqual(1);
        expect(sum[0].start).toEqual(date1);
        expect(sum[0].end).toEqual(date6);
    });
    test('adding overlapping interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date3 }, { start: date4, end: date6 }]);
        let i2 = new IntervalSet(date3, date4);
        let sum = i1.add(i2);
        expect(sum.length).toEqual(1);
        expect(sum[0].start).toEqual(date1);
        expect(sum[0].end).toEqual(date6);
    });
    test('adding overlapping interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date2 }, { start: date5, end: date6 }]);
        let i2 = new IntervalSet(date2, date3);
        let sum = i1.add(i2);
        expect(sum.length).toEqual(2);
        expect(sum[0].start).toEqual(date1);
        expect(sum[0].end).toEqual(date3);
        expect(sum[1].start).toEqual(date5);
        expect(sum[1].end).toEqual(date6);
    });
    test('adding overlapping interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date3 }, { start: date5, end: date6 }]);
        let i2 = new IntervalSet(date2, date4);
        let sum = i1.add(i2);
        expect(sum.length).toEqual(2);
        expect(sum[0].start).toEqual(date1);
        expect(sum[0].end).toEqual(date4);
        expect(sum[1].start).toEqual(date5);
        expect(sum[1].end).toEqual(date6);
    });

    test('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date3 }, { start: date5, end: date6 }]);
        let i2 = new IntervalSet([{ start: date2, end: date4 }, { start: date5, end: date6 }]);
        let res = i1.intersect(i2);
        expect(res.length).toEqual(2);
        expect(res[0].start).toEqual(date2);
        expect(res[0].end).toEqual(date3);
        expect(res[1].start).toEqual(date5);
        expect(res[1].end).toEqual(date6);
    });
    test('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date2 }, { start: date5, end: date6 }]);
        let i2 = new IntervalSet([{ start: date3, end: date4 }, { start: date5, end: date6 }]);
        let res = i1.intersect(i2);
        expect(res.length).toEqual(1);
        expect(res[0].start).toEqual(date5);
        expect(res[0].end).toEqual(date6);
    });
    test('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date2, end: date3 }, { start: date4, end: date5 }]);
        let i2 = new IntervalSet([{ start: date1, end: date4 }, { start: date5, end: date6 }]);
        let res = i1.intersect(i2);
        expect(res.length).toEqual(1);
        expect(res[0].start).toEqual(date2);
        expect(res[0].end).toEqual(date3);
    });
    test('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date2, end: date3 }, { start: date4, end: date5 }]);
        let i2 = new IntervalSet([{ start: date1, end: date4 }]);
        let res = i1.intersect(i2);
        expect(res.length).toEqual(1);
        expect(res[0].start).toEqual(date2);
        expect(res[0].end).toEqual(date3);
    });
    test('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date6 }]);
        let i2 = new IntervalSet([{ start: date1, end: date2 }, { start: date3, end: date4 }, { start: date5, end: date6 }]);
        let res = i1.intersect(i2);
        expect(res.length).toEqual(3);
        expect(res[0].start).toEqual(date1);
        expect(res[0].end).toEqual(date2);
        expect(res[1].start).toEqual(date3);
        expect(res[1].end).toEqual(date4);
        expect(res[2].start).toEqual(date5);
        expect(res[2].end).toEqual(date6);
    });
    test('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date8 }]);
        let i2 = new IntervalSet([{ start: date1, end: date2 },
        { start: date3, end: date4 },
        { start: date5, end: date6 },
        { start: date7, end: date8 }]);
        let res = i1.intersect(i2);
        expect(res.length).toEqual(4);
        expect(res[0].start).toEqual(date1);
        expect(res[0].end).toEqual(date2);
        expect(res[1].start).toEqual(date3);
        expect(res[1].end).toEqual(date4);
        expect(res[2].start).toEqual(date5);
        expect(res[2].end).toEqual(date6);
        expect(res[3].start).toEqual(date7);
        expect(res[3].end).toEqual(date8);
    });

    test('invert interval set', () => {
        let i1 = new IntervalSet([{ start: date2, end: date3 }, { start: date4, end: date5 }]);
        let res = i1.inverse();
        expect(res.length).toEqual(1);
        expect(res[0].start).toEqual(date3);
        expect(res[0].end).toEqual(date4);
    });
});

describe('TimeRange', () => {

    test('constructor should create slots with length 1', () => {
        let range = new TimeRange(new Date("2020-10-21"), new Date("2020-10-30"));
        expect(range.start instanceof Date).toBe(true);
        expect(range.end instanceof Date).toBe(true);
    });

    test('constructor should create slots with length 0', () => {
        expect(() => {
            return new TimeRange(new Date("2020-10-21"), new Date("2020-10-20"));
        }).toThrow();
    });
});
