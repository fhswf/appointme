import { CalendarReminderMethod } from "common";

export type CalendarReminderSettings = {
    method: CalendarReminderMethod;
    minutes: number;
};

const DEFAULT_REMINDER: CalendarReminderSettings = {
    method: 'popup',
    minutes: 15
};

export const getCalendarReminderSettings = (user: {
    calendar_reminder_method?: CalendarReminderMethod;
    calendar_reminder_minutes?: number;
}): CalendarReminderSettings => {
    const method = ['popup', 'email', 'none'].includes(user.calendar_reminder_method || '')
        ? user.calendar_reminder_method as CalendarReminderMethod
        : DEFAULT_REMINDER.method;

    const minutes = Number.isInteger(user.calendar_reminder_minutes) &&
        user.calendar_reminder_minutes >= 0 &&
        user.calendar_reminder_minutes <= 40320
        ? user.calendar_reminder_minutes
        : DEFAULT_REMINDER.minutes;

    return { method, minutes };
};

export const googleReminder = (settings: CalendarReminderSettings) => ({
    useDefault: false,
    overrides: settings.method === 'none'
        ? []
        : [{ method: settings.method, minutes: settings.minutes }]
});
