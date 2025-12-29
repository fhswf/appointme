
import { DAVClient } from 'tsdav';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
    const serverUrl = 'https://gwmail.fh-swf.de/caldav/Y2FsOi8vMzcxLzA/'; // Direct Moodle URL
    const username = process.env.CALDAV_USERNAME;
    const password = process.env.CALDAV_PASSWORD;

    console.log(`\n--- Probing Direct URL with Thunderbird UA: ${serverUrl} ---`);

    const client = new DAVClient({
        serverUrl,
        credentials: { username, password },
        authMethod: 'Basic',
        defaultAccountType: 'caldav',
        fetchOptions: {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Thunderbird/115.3.1'
            }
        }
    });

    try {
        // Manual setup for direct access
        // @ts-ignore
        client.account = {
            serverUrl,
            credentials: { username, password },
            accountType: 'caldav',
            rootUrl: serverUrl,
            principalUrl: serverUrl,
            homeUrl: serverUrl
        };

        const authString = `${username}:${password}`;
        const encodedAuth = typeof Buffer !== 'undefined'
            ? Buffer.from(authString).toString('base64')
            : btoa(authString);

        // @ts-ignore
        client.authHeaders = { Authorization: `Basic ${encodedAuth}` };
        // @ts-ignore
        if (!client.fetchOptions) client.fetchOptions = {};
        // @ts-ignore
        if (!client.fetchOptions.headers) client.fetchOptions.headers = {};
        // @ts-ignore
        client.fetchOptions.headers.Authorization = `Basic ${encodedAuth}`;

        const calendar = {
            url: serverUrl,
            displayName: 'Direct URL Calendar',
            resourcetype: 'calendar',
            currentUserPrivilegeSet: []
        };

        const now = new Date();
        const start = new Date(now.getTime() - 90 * 24 * 3600000).toISOString(); // -90 days
        const end = new Date(now.getTime() + 365 * 24 * 3600000).toISOString();   // +365 days

        console.log(`Fetching objects from ${start} to ${end}...`);

        // @ts-ignore
        const objects = await client.fetchCalendarObjects({
            calendar: calendar,
            timeRange: { start, end }
        });

        console.log(`Found ${objects.length} object(s).`);
        if (objects.length > 0) {
            console.log('Sample URL:', objects[0].url);
            if (objects[0].data) {
                console.log('Snippet:', objects[0].data.substring(0, 100));
            }
        } else {
            console.log('Found 0 objects. Trying raw PROPFIND to check container existence...');
            try {
                const res = await fetch(serverUrl, {
                    method: 'PROPFIND',
                    headers: {
                        'Authorization': `Basic ${encodedAuth}`,
                        'User-Agent': client.fetchOptions.headers['User-Agent'],
                        'Depth': '0',
                        'Content-Type': 'application/xml'
                    },
                    body: `
                        <d:propfind xmlns:d="DAV:">
                            <d:prop>
                                <d:displayname />
                                <d:resourcetype />
                            </d:prop>
                        </d:propfind>
                    `
                });
                console.log(`PROPFIND Status: ${res.status} ${res.statusText}`);
                console.log('PROPFIND Body:', await res.text());
            } catch (e) {
                console.error('PROPFIND failed', e);
            }
        }

    } catch (err: any) {
        console.error('Direct probe failed:', err.message);
    }
}

main();
