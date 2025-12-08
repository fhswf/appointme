/**
 * @module scheduler
 */
import { addMinutes } from 'date-fns';
import { IntervalSet } from 'common';

interface TimeSlot {
    start: string | Date;
    end: string | Date;
}

/**
 * Converts a list of busy slots into a set of free intervals.
 * 
 * @param busySlots List of busy slots (must have start and end properties, compatible with Date constructor)
 * @param timeMin Start of the period to consider
 * @param timeMax End of the period to consider
 * @param bufferBefore Buffer time in minutes to subtract before a busy slot
 * @param bufferAfter Buffer time in minutes to add after a busy slot
 */
export function convertBusyToFree(busySlots: TimeSlot[], timeMin: Date, timeMax: Date, bufferBefore: number, bufferAfter: number): IntervalSet {
    const freeIntervals = new IntervalSet();
    let current = timeMin;

    for (const busy of busySlots) {
        const _start = addMinutes(new Date(busy.start), -bufferBefore);
        const _end = addMinutes(new Date(busy.end), bufferAfter);
        if (current < _start)
            freeIntervals.push({ start: current, end: _start });
        if (_end > current) current = _end;
    }
    if (current < timeMax) {
        freeIntervals.push({ start: current, end: timeMax });
    }
    return freeIntervals;
}
