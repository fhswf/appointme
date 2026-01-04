import { Day } from './types.js';

export const DEFAULT_AVAILABILITY = {
    [Day.SUNDAY]: {
        type: Array,
        default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.MONDAY]: {
        type: Array,
        default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.TUESDAY]: {
        type: Array,
        default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.WEDNESDAY]: {
        type: Array,
        default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.THURSDAY]: {
        type: Array,
        default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.FRIDAY]: {
        type: Array,
        default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.SATURDAY]: {
        type: Array,
        default: [{ start: "8:00", end: "17:00" }],
    },
};
