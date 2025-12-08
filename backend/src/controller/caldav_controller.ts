import { DAVClient } from 'tsdav';
import { User, CalDavAccount } from "common/src/types";
import { UserModel } from "../models/User.js";
import ical from 'node-ical';
import crypto from 'node:crypto';
import { logger } from '../logging.js';
import { Request, Response } from 'express';
import { encrypt, decrypt } from '../utility/encryption.js';

export const addAccount = async (req: Request, res: Response) => {
    let { serverUrl, username, password, name } = req.body;
    const userId = req['user_id'];

    if (serverUrl.endsWith('/')) {
        serverUrl = serverUrl.slice(0, -1);
    }

    const fetchOptions = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Thunderbird/143.0'
        }
    };

    try {
        const client = new DAVClient({
            serverUrl,
            credentials: { username, password },
            authMethod: 'Basic',
            defaultAccountType: 'caldav',
            fetchOptions
        });
        await client.login();

        await UserModel.updateOne(
            { _id: userId },
            { $push: { caldav_accounts: { serverUrl, username, password: encrypt(password), name } } }
        );
        res.json({ success: true });
    } catch (e) {
        logger.error('Failed to add CalDAV account', e);
        // Retry with homeUrl set to serverUrl if the error suggests it might help, or just try it as a fallback
        try {
            const client = new DAVClient({
                serverUrl,
                credentials: { username, password },
                authMethod: 'Basic',
                defaultAccountType: 'caldav',
                fetchOptions,
                // @ts-ignore
                caldavSettings: {
                    homeUrl: serverUrl
                }
            });
            await client.login();

            await UserModel.updateOne(
                { _id: userId },
                { $push: { caldav_accounts: { serverUrl, username, password: encrypt(password), name } } }
            );
            res.json({ success: true });
        } catch (retryError) {
            logger.error('Retry failed to add CalDAV account', retryError);
            res.status(400).json({ error: 'Failed to connect to CalDAV server' });
        }
    }
};

export const removeAccount = async (req: Request, res: Response) => {
    const userId = req['user_id'];
    const accountId = req.params.id;

    try {
        await UserModel.updateOne(
            { _id: userId },
            { $pull: { caldav_accounts: { _id: accountId } } }
        );
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: 'Failed to remove account: ' + e.message });
    }
};

export const listAccounts = async (req: Request, res: Response) => {
    const userId = req['user_id'];
    try {
        const user = await UserModel.findOne({ _id: userId }, { 'caldav_accounts.password': 0 }).exec();
        res.json(user?.caldav_accounts || []);
    } catch (e) {
        res.status(400).json({ error: 'Failed to list accounts: ' + e.message });
    }
};

const processParsedEvent = (event: any, startRange: Date, endRange: Date, busySlots: { start: Date, end: Date }[]) => {
    if (event.type !== 'VEVENT') return;

    // Handle simple events
    if (event.start && event.end) {
        // Check if it overlaps (server should have filtered, but double check)
        const start = new Date(event.start);
        const end = new Date(event.end);
        if (start < endRange && end > startRange) {
            busySlots.push({ start, end });
        }
    }

    // Handle recurrence if rrule exists
    if (event.rrule) {
        const dates = event.rrule.between(startRange, endRange);
        const duration = (new Date(event.end).getTime()) - (new Date(event.start).getTime());
        for (const date of dates) {
            busySlots.push({ start: date, end: new Date(date.getTime() + duration) });
        }
    }
};

const processCalendarObject = (obj: any, startRange: Date, endRange: Date, busySlots: { start: Date, end: Date }[]) => {
    if (!obj.data) return;

    const parsed = ical.parseICS(obj.data);
    for (const k in parsed) {
        processParsedEvent(parsed[k], startRange, endRange, busySlots);
    }
};

const fetchAndProcessAccountCalendars = async (
    account: any,
    pullCalendars: Set<string>,
    timeRange: { start: string, end: string },
    dateRange: { start: Date, end: Date },
    busySlots: { start: Date, end: Date }[]
) => {
    try {
        const client = new DAVClient({
            serverUrl: account.serverUrl,
            credentials: {
                username: account.username,
                password: decrypt(account.password),
            },
            authMethod: 'Basic',
            defaultAccountType: 'caldav',
            fetchOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Thunderbird/143.0'
                }
            }
        });

        await client.login();
        const calendars = await client.fetchCalendars();

        // Filter calendars based on user selection
        const selectedCalendars = calendars.filter(cal => pullCalendars.has(cal.url));

        for (const calendar of selectedCalendars) {
            const objects = await client.fetchCalendarObjects({
                calendar,
                timeRange
            });

            for (const obj of objects) {
                processCalendarObject(obj, dateRange.start, dateRange.end, busySlots);
            }
        }
    } catch (e) {
        // logger is imported in the file scope
        logger.error('CalDAV error for account %s: %o', account.name, e);
    }
};

export const getBusySlots = async (user_id: string, timeMin: string, timeMax: string): Promise<{ start: Date, end: Date }[]> => {
    const user = await UserModel.findOne({ _id: user_id }).exec();
    if (!user || !user.caldav_accounts) return [];

    const busySlots: { start: Date, end: Date }[] = [];
    const startRange = new Date(timeMin);
    const endRange = new Date(timeMax);
    const pullCalendars = new Set(user.pull_calendars || []);

    for (const account of user.caldav_accounts) {
        await fetchAndProcessAccountCalendars(
            account,
            pullCalendars,
            { start: timeMin, end: timeMax },
            { start: startRange, end: endRange },
            busySlots
        );
    }
    return busySlots;
}

export const listCalendars = async (req: Request, res: Response) => {
    const userId = req['user_id'];
    const accountId = req.params.id;

    try {
        const user = await UserModel.findOne({ _id: userId }).exec();
        const account = user?.caldav_accounts?.find(acc => (acc as any)._id.toString() === accountId);

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const client = new DAVClient({
            serverUrl: account.serverUrl,
            credentials: {
                username: account.username,
                password: decrypt(account.password),
            },
            authMethod: 'Basic',
            defaultAccountType: 'caldav',
            fetchOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Thunderbird/143.0'
                }
            }
        });

        await client.login();
        const calendars = await client.fetchCalendars();

        const mappedCalendars = calendars.map(cal => ({
            id: cal.url,
            summary: cal.displayName || cal.url
        }));

        res.json(mappedCalendars);
    } catch (e) {
        logger.error('Failed to list calendars for account %s', accountId, e);
        res.status(400).json({ error: 'Failed to list calendars' });
    }
};

const formatICalDate = (d: Date) => d.toISOString().replaceAll(/[-:]/g, '').split('.')[0] + 'Z';

export const findAccountForCalendar = (user: User, calendarUrl: string): CalDavAccount | undefined => {
    return user.caldav_accounts.find(acc => {
        if (calendarUrl.startsWith(acc.serverUrl)) {
            return true;
        }
        try {
            const serverUrlObj = new URL(acc.serverUrl);
            if (calendarUrl.startsWith(serverUrlObj.pathname)) {
                return true;
            }
            // Check if they share the same origin
            const pushUrlObj = new URL(calendarUrl);
            if (pushUrlObj.origin === serverUrlObj.origin) {
                return true;
            }
        } catch (e) {
            logger.warn(`Error parsing URL during account matching: ${e}. serverUrl: ${acc.serverUrl}, push_calendar: ${calendarUrl}`);
        }
        return false;
    });
};

export const createCalDavEvent = async (user: User, eventDetails: any): Promise<any> => {
    // Find the account that owns the push_calendar URL
    const account = findAccountForCalendar(user, user.push_calendar);

    if (!account) {
        logger.error('CalDav account not found for push calendar: %s', user.push_calendar);
        throw new Error('CalDav account not found for push calendar');
    }
    logger.info('Found CalDAV account for push calendar: %s', account.name);

    const client = new DAVClient({
        serverUrl: account.serverUrl,
        credentials: {
            username: account.username,
            password: decrypt(account.password),
        },
        authMethod: 'Basic',
        defaultAccountType: 'caldav',
        fetchOptions: {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Thunderbird/143.0'
            }
        }
    });

    await client.login();

    // We need to fetch calendars to get the full calendar object for the push_calendar URL
    // Optimization: We could cache this or construct a minimal object if tsdav allows
    const calendars = await client.fetchCalendars();
    logger.debug('Fetched %d calendars', calendars.length);
    const targetCalendar = calendars.find(c => c.url === user.push_calendar);

    if (!targetCalendar) {
        logger.error('Target calendar not found: %s', user.push_calendar);
        throw new Error('Target calendar not found');
    }
    logger.info('Found target calendar: %s', targetCalendar.url);

    const eventData = {
        start: eventDetails.start.dateTime,
        end: eventDetails.end.dateTime,
        summary: eventDetails.summary,
        description: eventDetails.description,
        location: eventDetails.location,
        organizer: {
            cn: eventDetails.organizer.displayName,
            mailto: eventDetails.organizer.email
        },
        attendees: eventDetails.attendees.map(a => ({
            cn: a.displayName,
            mailto: a.email,
            partstat: 'NEEDS-ACTION',
            rsvp: true
        }))
    };

    const randomStr = crypto.randomBytes(8).toString('hex');
    const uid = `${Date.now()}-${randomStr}`;

    // WORKAROUND: tsdav bug where fetchOptions.headers overwrites auth headers in createObject
    // We pass Auth explicitly in fetchOptions for this call only.
    // Also must re-include User-Agent as this overrides defaults.
    // @ts-ignore
    const authHeader = client.authHeaders?.Authorization || client.authHeaders?.authorization;
    const creationFetchOptions = {
        headers: {
            // @ts-ignore
            ...(client.fetchOptions?.headers),
            ...(authHeader ? { Authorization: authHeader } : {})
        }
    };

    const createdEvent = await client.createCalendarObject({
        calendar: targetCalendar,
        filename: `${uid}.ics`,
        iCalString: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BookMe//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatICalDate(new Date())}
DTSTART:${formatICalDate(new Date(eventData.start))}
DTEND:${formatICalDate(new Date(eventData.end))}
SUMMARY:${eventData.summary}
DESCRIPTION:${eventData.description}
LOCATION:${eventData.location}
ORGANIZER;CN=${eventData.organizer.cn}:mailto:${eventData.organizer.mailto}
${eventData.attendees.map(a => `ATTENDEE;CN=${a.cn};PARTSTAT=${a.partstat};RSVP=${a.rsvp}:mailto:${a.mailto}`).join('\n')}
END:VEVENT
END:VCALENDAR`,
        fetchOptions: creationFetchOptions
    });

    // @ts-ignore
    logger.info('Created CalDAV event status: %s %s', createdEvent.status, createdEvent.statusText);

    // @ts-ignore
    if (!createdEvent.ok) {
        // @ts-ignore
        const errorBody = await createdEvent.text();
        logger.error('Failed to create event on CalDAV server. Status: %s. Body: %s', createdEvent.status, errorBody);
        throw new Error(`Failed to create event: ${createdEvent.status} ${createdEvent.statusText}`);
    }

    // Verify creation
    try {
        // Wait a moment for the server to index the event
        await new Promise(resolve => setTimeout(resolve, 1000));

        const searchStart = new Date(new Date(eventData.start).getTime() - 60000); // -1 minute
        const searchEnd = new Date(new Date(eventData.end).getTime() + 60000);   // +1 minute

        const fetchedObjects = await client.fetchCalendarObjects({
            calendar: targetCalendar,
            timeRange: {
                start: searchStart.toISOString(),
                end: searchEnd.toISOString()
            }
        });

        logger.debug('Verification fetch returned %d objects', fetchedObjects.length);

        const found = fetchedObjects.find(obj => {
            if (obj.data) {
                return obj.data.includes(`UID:${uid}`);
            }
            return false;
        });

        if (found) {
            logger.info('Successfully verified event creation on server. UID: %s', uid);
        } else {
            logger.warn('Event created but not found on server verification. UID: %s', uid);
        }
    } catch (verifyError) {
        logger.error('Error verifying event creation: %o', verifyError);
    }

    return createdEvent;
};
