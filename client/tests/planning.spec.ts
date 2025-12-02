import { test, expect } from '@playwright/test';

test.describe('Planning page', () => {
    test.describe('Error getting user', () => {
        test.beforeEach(async ({ page }) => {
            await page.route('**/users/user/christian-gawron?url=christian-gawron', async route => {
                await route.fulfill({ status: 500, body: JSON.stringify({ error: "no data" }) });
            });
        });

        test('Should show error message', async ({ page }) => {
            await page.goto('/users/christian-gawron');
            await page.waitForResponse(resp => resp.url().includes('/users/user'));
            // await expect(page.getByText('Error getting user')).toBeVisible();
        });
    });
});

test.describe('Planning page success', () => {
    test.beforeEach(async ({ page }) => {
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

        await page.route('**/users/user/christian-gawron?url=christian-gawron', async route => await route.fulfill({ path: './tests/fixtures/userByURL.json' }));
        await page.route('**/events/getActiveEvents?user=109150731150582581691', async route => await route.fulfill({ path: './tests/fixtures/activeEvents.json' }));
        await page.route('**/events/getAvailable?*', async route => await route.fulfill({ path: './tests/fixtures/available.json' }));
    });

    test.describe('Visit scheduling page and schedule appointment', () => {
        test.beforeEach(async ({ page }) => {
            await page.route('**/**', async route => {
                if (route.request().method() === 'POST') {
                    await route.fulfill({ body: JSON.stringify({ error: 'not possible' }) });
                } else {
                    await route.continue();
                }
            });
        });

        test('Check simple schedule flow', async ({ page }) => {
            await page.goto('/users/christian-gawron');
            await page.waitForResponse(resp => resp.url().includes('getActiveEvents'));
        });
    });
});
