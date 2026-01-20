import { describe, it, expect } from 'vitest';
import { DEFAULT_AVAILABILITY } from './constants.js';
import { Day } from './types.js';

describe('DEFAULT_AVAILABILITY', () => {
    it('should be defined', () => {
        expect(DEFAULT_AVAILABILITY).toBeDefined();
    });

    it('should have entries for all days of the week', () => {
        const days = [
            Day.SUNDAY,
            Day.MONDAY,
            Day.TUESDAY,
            Day.WEDNESDAY,
            Day.THURSDAY,
            Day.FRIDAY,
            Day.SATURDAY
        ];

        days.forEach(day => {
            expect(DEFAULT_AVAILABILITY).toHaveProperty(day);
            expect(DEFAULT_AVAILABILITY[day]).toEqual({
                type: Array,
                default: [{ start: "8:00", end: "17:00" }],
            });
        });
    });
});
