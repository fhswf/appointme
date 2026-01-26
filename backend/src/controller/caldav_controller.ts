import { createConfiguredDAVClient } from '../utility/dav_client.js';
import { User, CalDavAccount } from "common";
import { UserModel } from "../models/User.js";
import ical from 'node-ical';
import crypto from 'node:crypto';
import { logger } from '../logging.js';
import { Request, Response } from 'express';
import { encrypt, decrypt } from '../utility/encryption.js';
import { generateIcsContent } from '../utility/ical.js';

export const addAccount = async (req: Request, res: Response) => {
    let { serverUrl, username, password, name, email } = req.body;
    const userId = req['user_id'];

    if (serverUrl.endsWith('/')) {
        serverUrl = serverUrl.slice(0, -1);
    }

    const fetchOptions = {
        headers: {}
    };

    try {
        const client = createConfiguredDAVClient({
            serverUrl,
            credentials: { username, password },
            authMethod: 'Basic',
            defaultAccountType: 'caldav',
            fetchOptions
        });
        await client.login();

        await UserModel.updateOne(
            { _id: userId },
            { $push: { caldav_accounts: { serverUrl, username, password: encrypt(password), name, email } } }
        );
        res.json({ success: true });
    } catch (e: any) {
        logger.warn(`Standard CalDAV discovery failed for ${serverUrl}: ${e.message}. Attempting direct calendar access...`);

        // Fallback: Try to treat serverUrl as the direct calendar URL
        try {
            // Manually construct client for direct access
            const client = createConfiguredDAVClient({
                serverUrl,
                credentials: { username, password },
                authMethod: 'Basic',
                defaultAccountType: 'caldav',
                fetchOptions
            });

            // Manually inject account details to bypass discovery
            // @ts-ignore
            client.account = {
                serverUrl,
                credentials: { username, password },
                accountType: 'caldav',
                rootUrl: serverUrl,
                principalUrl: serverUrl,
                homeUrl: serverUrl
            };

            // Build Auth Header manually
            const authString = `${username}:${password}`;
            const encodedAuth = typeof Buffer == 'undefined'
                ? btoa(authString) : Buffer.from(authString).toString('base64');

            // @ts-ignore
            client.authHeaders = {
                Authorization: `Basic ${encodedAuth}`
            };

            // Inject into fetchOptions.headers just in case (tsdav quirk)
            // @ts-ignore
            if (!client.fetchOptions) client.fetchOptions = {};
            // @ts-ignore
            if (!client.fetchOptions.headers) client.fetchOptions.headers = {};
            // @ts-ignore
            client.fetchOptions.headers.Authorization = `Basic ${encodedAuth}`;

            // Verify by trying to fetch objects (light verification)
            // We use the serverUrl as the calendar URL
            await client.fetchCalendarObjects({
                calendar: {
                    url: serverUrl,
                    displayName: name,
                    resourcetype: 'calendar'
                }
            });

            logger.info(`Direct calendar access successful for ${serverUrl}`);

            // Save the account
            await UserModel.updateOne(
                { _id: userId },
                { $push: { caldav_accounts: { serverUrl, username, password: encrypt(password), name, email } } }
            );
            res.json({ success: true });

        } catch (retryError) {
            logger.error('Retry with direct access failed', retryError);
            res.status(400).json({ error: 'Failed to connect to CalDAV server (Discovery and Direct Access failed)' });
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

const getDateMilliseconds = (date: any): number => {
    if (date instanceof Date) {
        return date.getTime();
    }
    if (typeof date.getTime === 'function') {
        return date.getTime();
    }
    if (typeof date.epochMilliseconds === 'number') {
        return date.epochMilliseconds;
    }
    if (typeof date.toInstant === 'function') {
        return date.toInstant().epochMilliseconds;
    }
    return new Date(date.toString()).getTime();
};

const processRecurringEvent = (event: any, startRange: Date, endRange: Date, busySlots: { start: Date, end: Date }[]) => {
    const dates = event.rrule.between(startRange, endRange);
    const duration = (new Date(event.end).getTime()) - (new Date(event.start).getTime());

    for (const date of dates) {
        const startTime = getDateMilliseconds(date);
        busySlots.push({ start: new Date(startTime), end: new Date(startTime + duration) });
    }
};

export const processParsedEvent = (event: any, startRange: Date, endRange: Date, busySlots: { start: Date, end: Date }[]) => {
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
        processRecurringEvent(event, startRange, endRange, busySlots);
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
        const client = createConfiguredDAVClient({
            serverUrl: account.serverUrl,
            credentials: {
                username: account.username,
                password: decrypt(account.password),
            },
            authMethod: 'Basic',
            defaultAccountType: 'caldav',
            fetchOptions: {
                headers: {}
            }
        });

        await client.login();
        const calendars = await client.fetchCalendars();

        // Fallback: Check if the account's serverUrl serves as a calendar itself but wasn't discovered
        const normalizedServerUrl = account.serverUrl.replace(/\/$/, '');
        const foundDirect = calendars.find(c => c.url.replace(/\/$/, '') === normalizedServerUrl);

        if (!foundDirect) {
            // Check if this direct URL is in the pull list (or if we should just verify it exists)
            // For safety, we can just add it. The filter below will remove it if the user hasn't selected it.
            calendars.push({
                url: account.serverUrl,
                displayName: account.name || 'Direct Calendar',
                resourcetype: 'calendar',
                currentUserPrivilegeSet: [] // Dummy
            } as any);
        }

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
    if (!user?.caldav_accounts) return [];

    const busySlots: { start: Date, end: Date }[] = [];
    const startRange = new Date(timeMin);
    const endRange = new Date(timeMax);
    const pullCalendars = new Set<string>(user.pull_calendars || []);

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

    let account;
    try {
        const user = await UserModel.findOne({ _id: userId }).exec();
        account = user?.caldav_accounts?.find(acc => acc._id.toString() === accountId);

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const client = createConfiguredDAVClient({
            serverUrl: account.serverUrl,
            credentials: {
                username: account.username,
                password: decrypt(account.password),
            },
            authMethod: 'Basic',
            defaultAccountType: 'caldav',
            fetchOptions: {
                headers: {}
            }
        });

        await client.login();
        const calendars = await client.fetchCalendars();

        // Check if the account's serverUrl is present in the discovered calendars
        // We normalize by removing trailing slash for comparison
        const normalizedServerUrl = account.serverUrl.replace(/\/$/, '');
        const foundDirect = calendars.find(c => c.url.replace(/\/$/, '') === normalizedServerUrl);

        if (!foundDirect) {
            // If the specific URL provided by the user isn't in the discovered list, 
            // we assume the user intended to add that specific calendar directly.
            // We append it to the list.
            calendars.push({
                url: account.serverUrl,
                displayName: account.name || 'Direct Calendar',
                resourcetype: 'calendar',
                currentUserPrivilegeSet: [] // Dummy
            } as any);
        }

        const mappedCalendars = calendars.map(cal => ({
            id: cal.url,
            summary: cal.displayName || cal.url
        }));

        res.json(mappedCalendars);
    } catch (e: any) {
        // Actually, better to do this: if fetchCalendars returns empty OR throws, and we have a direct url...
        // But the previous block throws. So we are here.
        if (account) {
            // Simplified fallback: Return the account itself as a calendar
            res.json([{
                id: account.serverUrl,
                summary: account.name || 'Direct Calendar'
            }]);
            return;
        }

        logger.error('Failed to list calendars for account %s', accountId, e);
        res.status(400).json({ error: 'Failed to list calendars' });
    }
};

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
            logger.warn(`Error parsing URL during account matching: ${e}. serverUrl: ${acc.serverUrl}, calendarUrl: ${calendarUrl}`);
        }
        return false;
    });
};

export const createCalDavEvent = async (user: User, eventDetails: any, userComment?: string, targetCalendarUrl?: string, recurrence?: any, uid?: string): Promise<any> => {
    const calendarUrl = targetCalendarUrl;
    if (!calendarUrl) {
        throw new Error('Target calendar URL is required');
    }
    // Find the account that owns the calendar URL
    const account = findAccountForCalendar(user, calendarUrl);

    if (!account) {
        logger.error('CalDav account not found for calendar: %s', calendarUrl);
        throw new Error('CalDav account not found for calendar');
    }
    logger.info('Found CalDAV account for push calendar: %s', account.name);

    const client = createConfiguredDAVClient({
        serverUrl: account.serverUrl,
        credentials: {
            username: account.username,
            password: decrypt(account.password),
        },
        authMethod: 'Basic',
        defaultAccountType: 'caldav',
        fetchOptions: {
            headers: {}
        }
    });

    await client.login();

    // We need to fetch calendars to get the full calendar object for the target calendar URL
    // Optimization: We could cache this or construct a minimal object if tsdav allows
    const calendars = await client.fetchCalendars();
    logger.debug('Fetched %d calendars', calendars.length);
    let targetCalendar = calendars.find(c => c.url === calendarUrl);

    if (!targetCalendar) {
        // Fallback: Check if this is a direct calendar URL
        const normalizedServerUrl = account.serverUrl.replace(/\/$/, '');
        const normalizedCalendarId = calendarUrl.replace(/\/$/, '');

        if (normalizedCalendarId === normalizedServerUrl) {
            targetCalendar = {
                url: account.serverUrl,
                displayName: account.name || 'Direct Calendar',
                resourcetype: 'calendar',
                currentUserPrivilegeSet: [] // Dummy
            } as any;
        } else {
            logger.error('Target calendar not found: %s', calendarUrl);
            throw new Error('Target calendar not found');
        }
    }
    logger.info('Found target calendar: %s', targetCalendar.url);

    const eventData = {
        start: eventDetails.start.dateTime,
        end: eventDetails.end.dateTime,
        summary: eventDetails.summary,
        description: eventDetails.description + (userComment ? `\n\nComment:\n${userComment}` : ''),
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

    let eventUid = uid;
    if (!eventUid) {
        const randomStr = crypto.randomBytes(8).toString('hex');
        eventUid = `${Date.now()}-${randomStr}`;
    }

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

    const icsContent = generateIcsContent({
        uid: eventUid,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        organizer: {
            displayName: eventData.organizer.cn,
            email: account.email || eventData.organizer.mailto
        },
        attendees: eventData.attendees.map(a => ({
            displayName: a.cn,
            email: a.mailto,
            partstat: a.partstat,
            rsvp: a.rsvp
        })),
        recurrence: recurrence
    }, { comment: userComment });

    const createdEvent = await client.createCalendarObject({
        calendar: targetCalendar,
        filename: `${eventUid}.ics`,
        iCalString: icsContent,
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
                return obj.data.includes(`UID:${eventUid}`);
            }
            return false;
        });

        if (found) {
            logger.info('Successfully verified event creation on server. UID: %s', eventUid);
        } else {
            logger.warn('Event created but not found on server verification. UID: %s', eventUid);
        }
    } catch (verifyError) {
        logger.error('Error verifying event creation: %o', verifyError);
    }

    return { response: createdEvent, uid: eventUid };
};
