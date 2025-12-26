import axios from "axios";
import ICAL from 'ical.js';
import { Event, IntervalSet } from "common";
import { Views, View } from 'react-big-calendar';

export interface Calendar {
    id: string;
    label: string;
    color: string;
    checked: boolean;
    type: 'google' | 'caldav';
    accountId?: string;
    originalId?: string;
}

export const getTimeRangeForView = (view: View, date: Date): { timeMin: Date, timeMax: Date } => {
    const now = new Date(date);
    let timeMin: Date, timeMax: Date;

    if (view === Views.MONTH) {
        timeMin = new Date(now.getFullYear(), now.getMonth(), 1);
        timeMax = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (view === Views.WEEK) {
        const day = now.getDay();
        timeMin = new Date(now);
        timeMin.setDate(now.getDate() - day);
        timeMin.setHours(0, 0, 0, 0);
        timeMax = new Date(timeMin);
        timeMax.setDate(timeMin.getDate() + 6);
        timeMax.setHours(23, 59, 59);
    } else {
        timeMin = new Date(now);
        timeMin.setHours(0, 0, 0, 0);
        timeMax = new Date(now);
        timeMax.setHours(23, 59, 59);
    }
    return { timeMin, timeMax };
};

export const parseICalEvent = (evt: any, calendarId: string, calendarColor: string) => {
    let parsedEvent = evt;
    if (evt.format === 'ical') {
        try {
            const jcal = ICAL.parse(evt.data);
            const comp = new ICAL.Component(jcal);
            const vevent = comp.getFirstSubcomponent('vevent');
            if (vevent) {
                const dtstart = vevent.getFirstPropertyValue('dtstart');
                const dtend = vevent.getFirstPropertyValue('dtend');
                parsedEvent = {
                    id: evt.id,
                    summary: vevent.getFirstPropertyValue('summary'),
                    start: dtstart ? dtstart.toJSDate() : new Date(),
                    end: dtend ? dtend.toJSDate() : new Date(),
                    description: vevent.getFirstPropertyValue('description'),
                    location: vevent.getFirstPropertyValue('location'),
                };
            }
        } catch (err) {
            console.error("Error parsing iCal data", err);
        }
    }
    return {
        ...parsedEvent,
        calendarId,
        calendarColor
    };
};

export const fetchCalendarEvents = async (calendars: Calendar[], timeMin: Date, timeMax: Date) => {
    const checkedCalendars = calendars.filter(c => c.checked);
    if (checkedCalendars.length === 0) return [];

    const eventPromises = checkedCalendars.map(cal => {
        const url = cal.accountId
            ? `/api/v1/user/me/calendar/${cal.accountId}/${encodeURIComponent(cal.originalId)}/event`
            : `/api/v1/user/me/calendar/${encodeURIComponent(cal.originalId)}/event`;

        return axios.get(url, {
            params: {
                timeMin: timeMin.toISOString(),
                timeMax: timeMax.toISOString()
            }
        }).catch(err => {
            console.error(`Failed to fetch events for calendar ${cal.label}:`, err);
            return { data: [] };
        });
    });

    try {
        const results = await Promise.all(eventPromises);
        return results.flatMap((res, idx) =>
            res.data.map((evt: any) => parseICalEvent(evt, checkedCalendars[idx].id, checkedCalendars[idx].color))
        );
    } catch (err) {
        console.error("Failed to fetch calendar events", err);
        return [];
    }
};

export const calculateAvailabilityEvents = (events: Record<string, Event>, view: View, timeMin: Date, timeMax: Date) => {
    if (Object.keys(events).length === 0 || view === Views.MONTH) return [];

    try {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const availabilitySet = new IntervalSet();

        for (const evt of Object.values(events)) {
            if (evt.isActive && evt.available) {
                const eventAvailability = new IntervalSet(timeMin, timeMax, evt.available, userTimeZone);
                availabilitySet.add(eventAvailability);
            }
        }

        return availabilitySet.map((range, idx) => ({
            id: `avail-${idx}`,
            title: 'Available',
            start: range.start,
            end: range.end,
            resource: { type: 'availability' }
        }));
    } catch (e) {
        console.error("Error calculating availability", e);
        return [];
    }
};
