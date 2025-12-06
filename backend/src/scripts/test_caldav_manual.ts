
import { DAVClient } from 'tsdav';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables from .env file
dotenv.config();

async function main() {
    const serverUrl = process.env.CALDAV_SERVER_URL;
    const username = process.env.CALDAV_USERNAME;
    const password = process.env.CALDAV_PASSWORD;

    if (!serverUrl || !username || !password) {
        console.error('Error: Missing credentials.');
        console.error('Please set CALDAV_SERVER_URL, CALDAV_USERNAME, and CALDAV_PASSWORD in your .env file or environment.');
        process.exit(1);
    }

    console.log('Configuration:');
    console.log(`- Server URL: ${serverUrl}`);
    console.log(`- Username: ${username}`);

    let client = new DAVClient({
        serverUrl,
        credentials: { username, password },
        authMethod: 'Basic',
        defaultAccountType: 'caldav',
        fetchOptions: {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Thunderbird/143.0'
            }
        }
    });

    try {
        console.log('\nLogging in...');
        try {
            await client.login();
        } catch (loginError: any) {
            if (loginError.message && loginError.message.includes('cannot find homeUrl')) {
                console.warn('Initial login failed (cannot find homeUrl). Retrying with manual account configuration...');
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

                // Manually set auth headers as we skipped login() which sets them
                const authString = `${username}:${password}`;
                const encodedAuth = typeof Buffer !== 'undefined'
                    ? Buffer.from(authString).toString('base64')
                    : btoa(authString);

                // @ts-ignore
                client.authHeaders = {
                    Authorization: `Basic ${encodedAuth}`
                };

                // IMPORTANT: tsdav's createObject spreads fetchOptions AFTER headers, 
                // causing fetchOptions.headers to overwrite the auth headers.
                // We must ensure Authorization is also in fetchOptions.headers.
                if (!client.fetchOptions) client.fetchOptions = {};
                if (!client.fetchOptions.headers) client.fetchOptions.headers = {};
                // @ts-ignore
                client.fetchOptions.headers.Authorization = `Basic ${encodedAuth}`;
            } else {
                throw loginError;
            }
        }
        console.log('Login successful.');

        console.log('\nFetching calendars...');
        const calendars = await client.fetchCalendars();
        console.log(`Found ${calendars.length} calendar(s).`);

        if (calendars.length === 0) {
            console.warn('No calendars found. Exiting.');
            return;
        }

        const targetCalendarName = process.env.CALDAV_CALENDAR_NAME || 'Sprechstunde';
        let targetCalendar = calendars.find(c => c.displayName && c.displayName.includes(targetCalendarName));

        if (!targetCalendar) {
            console.log(`Calendar matching "${targetCalendarName}" not found. Available calendars:`);
            calendars.forEach(c => console.log(`- ${c.displayName} (${c.url})`));

            // Fallback to first if explicit name wasn't found - or maybe we should fail? 
            // Logic: If user specifically asked for it, we should probably warn.
            // But for now let's just default to the first one but default search to 'Sprechstunde'.
            console.warn(`\nWarning: Specific calendar "${targetCalendarName}" not found. Falling back to first available.`);
            targetCalendar = calendars[0];
        }

        console.log(`Selected calendar: "${targetCalendar.displayName}" (${targetCalendar.url})`);

        // @ts-ignore
        console.log('Debug - Auth Headers:', client.authHeaders);
        // @ts-ignore
        console.log('Debug - Fetch Options:', client.fetchOptions);

        // Create a test event
        const uid = randomUUID();
        const now = new Date();
        const start = new Date(now.getTime() + 3600000); // Start in 1 hour
        const end = new Date(start.getTime() + 1800000); // Lasts 30 mins

        // Simple helper to format date to iCal string (UTC)
        const formatICalDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        const summary = `Test Event ${uid.substring(0, 8)}`;
        const description = 'This event was created by the manual CalDAV test script.';

        const iCalString = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//BookMe Manual Test//EN',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${formatICalDate(now)}`,
            `DTSTART:${formatICalDate(start)}`,
            `DTEND:${formatICalDate(end)}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${description}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        console.log(`\nCreating event "${summary}"...`);

        // WORKAROUND: tsdav bug where fetchOptions.headers overwrites auth headers in createObject
        // We pass Auth explicitly in fetchOptions for this call only.
        // Also must re-include User-Agent as this overrides defaults.
        // @ts-ignore
        const authHeader = client.authHeaders?.Authorization || client.authHeaders?.authorization;
        const creationFetchOptions = {
            headers: {
                ...(client.fetchOptions.headers || {}),
                ...(authHeader ? { Authorization: authHeader } : {})
            }
        };

        const createdEvent = await client.createCalendarObject({
            calendar: targetCalendar,
            filename: `${uid}.ics`,
            iCalString,
            headersToExclude: ['If-None-Match'],
            fetchOptions: creationFetchOptions
        });

        if (createdEvent.ok) {
            console.log('Event created successfully.');
        } else {
            console.error('Failed to create event:', createdEvent.status, createdEvent.statusText);
            // Continue to list events anyway to see if maybe it partially worked or to see pre-existing state
        }

        // Wait a small delay to ensure server consistency
        console.log('Waiting 2 seconds before validation...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // List events
        console.log('\nListing events in the calendar (Time range: -24h to +48h)...');
        const searchStart = new Date(now.getTime() - 24 * 3600000).toISOString();
        const searchEnd = new Date(now.getTime() + 48 * 3600000).toISOString();

        const objects = await client.fetchCalendarObjects({
            calendar: targetCalendar,
            timeRange: { start: searchStart, end: searchEnd }
        });

        console.log(`Found ${objects.length} object(s).`);

        let foundMyEvent = false;
        for (const obj of objects) {
            // Check if this is our event
            // Note: obj.data might be the iCal string or obj.url might contain the filename
            const isMatch = obj.url.includes(uid) || (obj.data && obj.data.includes(uid));

            console.log(`- [${isMatch ? 'MATCH' : ' '}] ${obj.url}`);
            if (isMatch) {
                foundMyEvent = true;
            }
        }

        if (foundMyEvent) {
            console.log('\nSUCCESS: Created event was found in the calendar listing.');
        } else {
            console.error('\nFAILURE: Created event was NOT found in the calendar listing (time range search).');

            // Fallback: Try listing ALL events to see if time range was the issue
            console.log('\nFallback: Fetching ALL events in calendar (no time range)...');
            try {
                const allObjects = await client.fetchCalendarObjects({
                    calendar: targetCalendar
                });
                console.log(`Found ${allObjects.length} object(s) in total.`);

                const matchInAll = allObjects.find(obj =>
                    obj.url.includes(uid) || (obj.data && obj.data.includes(uid))
                );

                if (matchInAll) {
                    console.log('\nSUCCESS: Created event was found in global listing! (Time range query might be the issue)');
                    // @ts-ignore
                    console.log(`Event URL: ${matchInAll.url}`);
                } else {
                    console.error('\nFAILURE: Created event was NOT found even in global listing.');
                }
            } catch (err) {
                console.error('Fallback listing failed:', err);
            }

            // Raw REPORT Fetch for debugging listing
            console.log('\n--- Debugging Listing with raw REPORT ---');
            const collectionUrl = targetCalendar.url;
            console.log(`Attempting raw REPORT to: ${collectionUrl}`);

            const authStringRaw = `${username}:${password}`;
            const encodedAuthRaw = typeof Buffer !== 'undefined'
                ? Buffer.from(authStringRaw).toString('base64')
                : btoa(authStringRaw);

            const reportBody = `
<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
    <d:prop>
        <d:getetag />
        <c:calendar-data />
    </d:prop>
    <c:filter>
        <c:comp-filter name="VCALENDAR">
            <c:comp-filter name="VEVENT">
                <!-- No time-range filter for debugging to catch everything -->
            </c:comp-filter>
        </c:comp-filter>
    </c:filter>
</c:calendar-query>
`.trim();

            try {
                const res = await fetch(collectionUrl, {
                    method: 'REPORT',
                    headers: {
                        'Authorization': `Basic ${encodedAuthRaw}`,
                        'Content-Type': 'application/xml; charset=utf-8',
                        'Depth': '1',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Thunderbird/143.0'
                    },
                    body: reportBody
                });

                console.log(`Raw REPORT status: ${res.status} ${res.statusText}`);
                const text = await res.text();
                // Truncate if too long but show beginning to see structure
                console.log('Response body (snippet):', text.substring(0, 2000));
            } catch (err) {
                console.error('Raw REPORT failed:', err);
            }
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
