import { Day, IntervalSet, Slots } from "../src/types"
import { describe, it } from "mocha"
import { expect } from "chai"


describe('Slots', () => {
    let date1 = new Date("2021-05-17")
    let date2 = new Date("2021-05-20")
    let date3 = new Date("2021-06-01")
    let slots: Slots = {
        [Day.SUNDAY]: [],
        [Day.MONDAY]: [{ start: '10:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
        [Day.TUESDAY]: [],
        [Day.WEDNESDAY]: [],
        [Day.THURSDAY]: [],
        [Day.FRIDAY]: [],
        [Day.SATURDAY]: [],
    }

    it('constructor should create slots with length 2', () => {
        let result = new IntervalSet(date1, date2, slots);
        expect(result.length).to.equal(2);
        expect(result[0].start instanceof Date).to.be.true;
    });
    it('constructor should create slots with length 2', () => {
        let result = new IntervalSet(date1, date3, slots);
        expect(result.length).to.equal(6);
        expect(result[0].start instanceof Date).to.be.true;
    });
    it('constructor should handle timezones', () => {
        let result = new IntervalSet(new Date("2021-05-19T00:00:00.000Z"), new Date("2021-05-26T16:00:00.000Z"), slots, "Europe/Berlin");
        expect(result.length).to.equal(2);
        //console.log('result: %o, %o', result, result[0].start)
        expect(result[0].start.getTime()).to.equal(new Date("2021-05-24T08:00:00.000Z").getTime());
    });
    it('constructor should handle timezones', () => {
        let result = new IntervalSet(new Date("2021-05-19T00:00:00.000Z"), new Date("2021-05-26T16:00:00.000Z"), slots, "Africa/Abidjan");
        expect(result.length).to.equal(2);
        //console.log('result: %o, %o', result, result[0].start)
        expect(result[0].start.getTime()).to.equal(new Date("2021-05-24T10:00:00.000Z").getTime());
    });

})


describe('Test for issue with freeBusy', () => {
    it('intersection', () => {
        let r1 = new IntervalSet(new Date("2021-05-25T12:43:00.000Z"), new Date("2021-05-27T12:43:00.000Z"))
        let r2 = new IntervalSet([
            { "start": new Date("2021-05-25T12:43:00.000Z"), "end": new Date("2021-05-26T11:00:00.000Z") },
            { "start": new Date("2021-05-26T13:30:00.000Z"), "end": new Date("2021-05-26T15:00:00.000Z") },
            { "start": new Date("2021-05-26T16:00:00.000Z"), "end": new Date("2021-05-26T16:30:00.000Z") },
            { "start": new Date("2021-05-26T17:00:00.000Z"), "end": new Date("2021-05-27T12:43:00.000Z") }])

        r1 = r1.intersect(r2)
        expect(r1.length).to.equal(4);
    })
    it('constructor with strings', () => {
        let r1 = new IntervalSet("2021-05-25T12:43:00.000Z", "2021-05-27T12:43:00.000Z")
        let r2 = new IntervalSet([
            { "start": "2021-05-25T12:43:00.000Z", "end": "2021-05-26T11:00:00.000Z" },
            { "start": "2021-05-26T13:30:00.000Z", "end": "2021-05-26T15:00:00.000Z" },
            { "start": "2021-05-26T16:00:00.000Z", "end": "2021-05-26T16:30:00.000Z" },
            { "start": "2021-05-26T17:00:00.000Z", "end": "2021-05-27T12:43:00.000Z" }])

        r1 = r1.intersect(r2)
        console.log(r1)
        expect(r1.length).to.equal(4);
    })
})

describe('TimeIntervals', () => {
    let date1 = new Date("2020-10-21")
    let date2 = new Date("2020-10-22")
    let date3 = new Date("2020-10-23")
    let date4 = new Date("2020-10-24")
    let date5 = new Date("2020-10-25")
    let date6 = new Date("2020-10-26")
    let date7 = new Date("2020-10-27")
    let date8 = new Date("2020-10-28")

    it('constructor should create slots with length 1', () => {
        let result = new IntervalSet(new Date("2020-10-21"), new Date("2020-10-30"));
        expect(result.length).to.equal(1);
        expect(result[0].start instanceof Date).to.be.true;
    });
    it('constructor should create slots with length 0', () => {
        let result = new IntervalSet(new Date("2020-10-21"), new Date("2020-10-21"));
        expect(result.length).to.equal(0);
    });
    it('constructor should create slots with length 2', () => {
        let result = new IntervalSet([{ start: date1, end: date2 }, { start: date5, end: date6 }]);
        expect(result.length).to.equal(2);
        expect(result[0].start instanceof Date).to.be.true
        expect(result[1].start instanceof Date).to.be.true
    });
    it('constructor should create slots with length 0', () => {
        expect(() => {
            return new IntervalSet(new Date("2020-10-21"), new Date("2020-10-20"));
        }).to.throw();
    });


    it('index', () => {
        let result = new IntervalSet(date1, date2);
        expect(result[0].start).to.equal(date1);
        expect(result[0].end).to.equal(date2);
        expect(result[1]).to.be.undefined;
    });
    it('iterator', () => {
        let result = new IntervalSet(new Date("2020-10-21"), new Date("2020-10-22"));
        let sum = 0;
        for (let tr of result) {
            sum += tr.end.valueOf() - tr.start.valueOf()
        }
        expect(sum).to.equal(1000 * 86400);
    });

    it('adding disjunct interval sets', () => {
        const i1 = new IntervalSet(date1, date2);
        const i2 = new IntervalSet(date3, date4);
        const sum = i1.add(i2);
        expect(sum.length).to.equal(2);
        expect(sum[0].start).to.equal(date1);
        expect(sum[0].end).to.equal(date2);
        expect(sum[1].start).to.equal(date3);
        expect(sum[1].end).to.equal(date4);
    });
    it('adding disjunct interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date2 }, { start: date5, end: date6 }]);
        let i2 = new IntervalSet(date3, date4);
        let sum = i1.add(i2);
        expect(sum.length).to.equal(3);
        expect(sum[0].start).to.equal(date1);
        expect(sum[0].end).to.equal(date2);
        expect(sum[1].start).to.equal(date3);
        expect(sum[1].end).to.equal(date4);
        expect(sum[2].start).to.equal(date5);
        expect(sum[2].end).to.equal(date6);
    });

    it('adding overlapping interval sets', () => {
        let i1 = new IntervalSet(date1, date4);
        let i2 = new IntervalSet(date2, date3);
        let sum = i1.add(i2);
        expect(sum.length).to.equal(1);
        expect(sum[0].start).to.equal(date1);
        expect(sum[0].end).to.equal(date4);
    });

    it('adding overlapping interval sets', () => {
        let i1 = new IntervalSet(date2, date3);
        let i2 = new IntervalSet(date1, date4);
        let sum = i1.add(i2);
        expect(sum.length).to.equal(1);
        expect(sum[0].start).to.equal(date1);
        expect(sum[0].end).to.equal(date4);
    });
    it('adding overlapping interval sets', () => {
        let i1 = new IntervalSet(date1, date3);
        let i2 = new IntervalSet(date2, date4);
        let sum = i1.add(i2);
        expect(sum.length).to.equal(1);
        expect(sum[0].start).to.equal(date1);
        expect(sum[0].end).to.equal(date4);
    });
    it('adding overlapping interval sets', () => {
        let i1 = new IntervalSet(date1, date3);
        let i2 = new IntervalSet(date2, date4);
        let sum = i1.add(i2);
        expect(sum.length).to.equal(1);
        expect(sum[0].start).to.equal(date1);
        expect(sum[0].end).to.equal(date4);
    });
    it('adding overlapping interval sets', () => {
        let i1 = new IntervalSet([{ start: date2, end: date3 }, { start: date4, end: date5 }]);
        let i2 = new IntervalSet(date1, date6);
        let sum = i1.add(i2);
        expect(sum.length).to.equal(1);
        expect(sum[0].start).to.equal(date1);
        expect(sum[0].end).to.equal(date6);
    });
    it('adding overlapping interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date3 }, { start: date4, end: date6 }]);
        let i2 = new IntervalSet(date3, date4);
        let sum = i1.add(i2);
        expect(sum.length).to.equal(1);
        expect(sum[0].start).to.equal(date1);
        expect(sum[0].end).to.equal(date6);
    });
    it('adding overlapping interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date2 }, { start: date5, end: date6 }]);
        let i2 = new IntervalSet(date2, date3);
        let sum = i1.add(i2);
        expect(sum.length).to.equal(2);
        expect(sum[0].start).to.equal(date1);
        expect(sum[0].end).to.equal(date3);
        expect(sum[1].start).to.equal(date5);
        expect(sum[1].end).to.equal(date6);
    });
    it('adding overlapping interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date3 }, { start: date5, end: date6 }]);
        let i2 = new IntervalSet(date2, date4);
        let sum = i1.add(i2);
        expect(sum.length).to.equal(2);
        expect(sum[0].start).to.equal(date1);
        expect(sum[0].end).to.equal(date4);
        expect(sum[1].start).to.equal(date5);
        expect(sum[1].end).to.equal(date6);
    });

    it('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date3 }, { start: date5, end: date6 }]);
        let i2 = new IntervalSet([{ start: date2, end: date4 }, { start: date5, end: date6 }]);
        let res = i1.intersect(i2);
        expect(res.length).to.equal(2);
        expect(res[0].start).to.equal(date2);
        expect(res[0].end).to.equal(date3);
        expect(res[1].start).to.equal(date5);
        expect(res[1].end).to.equal(date6);
    });
    it('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date2 }, { start: date5, end: date6 }]);
        let i2 = new IntervalSet([{ start: date3, end: date4 }, { start: date5, end: date6 }]);
        let res = i1.intersect(i2);
        expect(res.length).to.equal(1);
        expect(res[0].start).to.equal(date5);
        expect(res[0].end).to.equal(date6);
    });
    it('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date2, end: date3 }, { start: date4, end: date5 }]);
        let i2 = new IntervalSet([{ start: date1, end: date4 }, { start: date5, end: date6 }]);
        let res = i1.intersect(i2);
        expect(res.length).to.equal(1);
        expect(res[0].start).to.equal(date2);
        expect(res[0].end).to.equal(date3);
    });
    it('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date2, end: date3 }, { start: date4, end: date5 }]);
        let i2 = new IntervalSet([{ start: date1, end: date4 }]);
        let res = i1.intersect(i2);
        expect(res.length).to.equal(1);
        expect(res[0].start).to.equal(date2);
        expect(res[0].end).to.equal(date3);
    });
    it('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date6 }]);
        let i2 = new IntervalSet([{ start: date1, end: date2 }, { start: date3, end: date4 }, { start: date5, end: date6 }]);
        let res = i1.intersect(i2);
        expect(res.length).to.equal(3);
        expect(res[0].start).to.equal(date1);
        expect(res[0].end).to.equal(date2);
        expect(res[1].start).to.equal(date3);
        expect(res[1].end).to.equal(date4);
        expect(res[2].start).to.equal(date5);
        expect(res[2].end).to.equal(date6);
    });
    it('intersect interval sets', () => {
        let i1 = new IntervalSet([{ start: date1, end: date8 }]);
        let i2 = new IntervalSet([{ start: date1, end: date2 },
        { start: date3, end: date4 },
        { start: date5, end: date6 },
        { start: date7, end: date8 }]);
        let res = i1.intersect(i2);
        expect(res.length).to.equal(4);
        expect(res[0].start).to.equal(date1);
        expect(res[0].end).to.equal(date2);
        expect(res[1].start).to.equal(date3);
        expect(res[1].end).to.equal(date4);
        expect(res[2].start).to.equal(date5);
        expect(res[2].end).to.equal(date6);
        expect(res[3].start).to.equal(date7);
        expect(res[3].end).to.equal(date8);
    });

    it('invert interval set', () => {
        let i1 = new IntervalSet([{ start: date2, end: date3 }, { start: date4, end: date5 }]);
        let res = i1.inverse();
        expect(res.length).to.equal(1);
        expect(res[0].start).to.equal(date3);
        expect(res[0].end).to.equal(date4);
    });
});