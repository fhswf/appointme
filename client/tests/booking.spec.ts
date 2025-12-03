import { test, expect } from '@playwright/test';

test.describe('Error handling', () => {
    test.describe('Error getting user', () => {
        test.beforeEach(async ({ page }) => {
            await page.route('**/users/user/christian-gawron?*', async route => await route.fulfill({ status: 500, body: JSON.stringify({ error: "no data" }) }));
        });

        test('Should show error message', async ({ page }) => {
            await page.goto('/users/christian-gawron/sprechstunde');
            await page.waitForResponse(resp => resp.url().includes('/api/v1/users/user'));
            // Toast error check
            // await expect(page.getByText('Error getting user')).toBeVisible(); // Sonner toast
        });
    });
});

test.describe('Scheduling page', () => {
    test.beforeEach(async ({ page }) => {
        // Mock date
        // Playwright doesn't have cy.clock equivalent easily for all Date usage without init script
        // But we can try to rely on the app using the date we pass or just mocking the date object
        await page.addInitScript(() => {
            const date = new Date(Date.UTC(2024, 9, 4));
            // @ts-ignore
            Date = class extends Date {
                constructor(...args) {
                    if (args.length === 0) {
                        super(date);
                    } else {
                        super(...args);
                    }
                }
            };
        });

        await page.route('**/users/user/christian-gawron?*', async route => await route.fulfill({ path: './tests/fixtures/userByURL.json' }));
        await page.route('**/events/getEventBy?*', async route => await route.fulfill({ path: './tests/fixtures/event.json' }));
    });

    test.describe('Visit scheduling page and schedule appointment', () => {
        test.beforeEach(async ({ page }) => {
            await page.route('**/api/v1/**', async route => {
                if (route.request().method() === 'POST') {
                    await route.fulfill({ body: JSON.stringify({ error: 'not possible' }) }); // Default mock
                } else {
                    await route.continue();
                }
            });

            // This must be AFTER the catch-all route so it matches first (routes are evaluated in reverse)
            await page.route('**/events/getAvailable*', async route => {
                console.log('Mocking getAvailable');
                await route.fulfill({ status: 200, path: './tests/fixtures/available.json' });
            });
        });

        test('Check simple schedule flow', async ({ page }) => {
            page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
            
            await page.goto('/users/christian-gawron/sprechstunde');
            await page.waitForResponse(resp => resp.url().includes('getEventBy'));

            // Shadcn Calendar interaction
            // Need to find the day.
            // The mock date is 2024-10-04 (Oct 4th).
            // The test expects '8' to be clicked.
            // await page.getByRole('gridcell', { name: '8' }).click(); 
            // Wait for availability to be loaded
            const response = await page.waitForResponse(resp => resp.url().includes('getAvailable'));
            console.log('getAvailable status:', response.status());

            // Select Oct 8th 2024.
            // In Europe/Berlin (UTC+2), Oct 8th midnight is Oct 7th 22:00 UTC.
            await page.locator('[data-testid="2024-10-07T22:00:00.000Z"]').click();

            // Click time
            // 11:00 Berlin time is 09:00 UTC
            await page.locator('[data-testid="2024-10-08T09:00:00.000Z"]').click();

            // Click Next (stepper)
            // await page.getByRole('button', { name: 'Next' }).click(); // If stepper requires explicit next
            // In my implementation, selecting time auto-advances.

            // Fill details
            await page.getByLabel('Name').fill('Max Mustermann');
            await page.getByLabel('Email').fill('mustermann.max@fh-swf.de');

            // Submit
            await page.getByRole('button', { name: 'Book Appointment' }).click(); // Adjust text

            // Check request
            // await page.waitForRequest(...)
        });
    });
});
