import { DAVClient } from 'tsdav';
import { User } from "common/src/types";
import { UserModel } from "../models/User.js";
import ical from 'node-ical';
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
        res.status(400).json({ error: 'Failed to remove account' });
    }
};

export const listAccounts = async (req: Request, res: Response) => {
    const userId = req['user_id'];
    try {
        const user = await UserModel.findOne({ _id: userId }, { 'caldav_accounts.password': 0 }).exec();
        res.json(user?.caldav_accounts || []);
    } catch (e) {
        res.status(400).json({ error: 'Failed to list accounts' });
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
                    timeRange: { start: timeMin, end: timeMax }
                });

                for (const obj of objects) {
                    if (obj.data) {
                        const parsed = ical.parseICS(obj.data);
                        for (const k in parsed) {
                            const event = parsed[k];
                            if (event.type === 'VEVENT') {
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
                            }
                        }
                    }
                }
            }
        } catch (e) {
            logger.error('CalDAV error for user %s account %s: %o', user_id, account.name, e);
        }
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
