import { test, expect } from './fixtures/base';

test.describe('CalDAV Integration', () => {
    test.beforeEach(async ({ page }) => {
        // Mock user
        await page.route('**/user/user', async route => {
            if (route.request().method() === 'PUT') {
                await route.fulfill({ status: 200 });
            } else {
                await route.fulfill({ path: './tests/fixtures/user.json' });
            }
        });
        // Mock events
        await page.route('**/event', async route => await route.fulfill({ path: './tests/fixtures/events.json' }));
        await page.route('**/csrf-token', async route => await route.fulfill({ body: JSON.stringify({ csrfToken: "mock-token" }) }));

        // Mock Google integration routes to avoid 404s
        await page.route('**/google/calendarList', async route => await route.fulfill({ body: '[]' }));
        await page.route('**/google/generateUrl', async route => await route.fulfill({ body: JSON.stringify({ url: 'http://mock-auth-url' }) }));

        // Mock CalDAV routes
        await page.route('**/caldav/account', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 200,
                    body: JSON.stringify({
                        source: 'caldav',
                        account: { user: 'testuser', server: 'http://caldav.server' },
                        calendars: [{ name: 'Test Cal', url: 'http://caldav.server/cal' }]
                    })
                });
            } else if (route.request().method() === 'DELETE') {
                await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
            } else {
                // GET
                await route.fulfill({ body: JSON.stringify([{ user: 'testuser', server: 'http://caldav.server' }]) });
            }
        });

        await page.route('**/caldav/calendar', async route => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify([{ name: 'Work Calendar', url: 'http://caldav.server/work', ctag: '123' }])
            });
        });

        await page.goto('/app');
        await page.waitForResponse(resp => resp.url().includes('/user/user'));
    });

    test('Add CalDAV account', async ({ page }) => {
        await page.getByTestId('profile-menu').click();
        await page.getByTestId('calendar-button').click();
        await expect(page).toHaveURL(/\/integration/);

        // Open Dialog
        await page.getByTestId('add-caldav-button').click();

        // Fill form
        await page.getByLabel('Server URL').fill('http://caldav.server');
        await page.getByLabel('User').fill('testuser');
        await page.getByLabel('Password').fill('password');
        await page.getByLabel('Name', { exact: true }).fill('My CalDAV');

        // Submit
        const addAccountPromise = page.waitForResponse(resp => resp.url().includes('/caldav/account') && resp.request().method() === 'POST');
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await addAccountPromise;

        // Check if account appears
        // Assuming the list updates or we navigate back
        // For now just verifying the request was made
    });
});
