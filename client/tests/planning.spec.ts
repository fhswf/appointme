import { test, expect } from './fixtures/base';

test.describe('Planning page', () => {
    test.describe('Error getting user', () => {
        test.beforeEach(async ({ page }) => {
            await page.route("**/api/v1/user/christian-gawron", async (route) => {
                await route.fulfill({ status: 500, body: JSON.stringify({ error: "no data" }) });
            });
        });

        test('Should show error message', async ({ page }) => {
            const responsePromise = page.waitForResponse(resp => resp.url().includes('/api/v1/user/christian-gawron'));
            await page.goto('/users/christian-gawron');
            await responsePromise;
            // await expect(page.getByText('Error getting user')).toBeVisible();
        });
    });
});

test.describe('Planning page success', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('**/**', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({ body: JSON.stringify({ error: 'not possible' }) });
            } else {
                await route.continue();
            }
        });

        await page.addInitScript(() => {
            const date = new Date(Date.UTC(2024, 9, 4));
            // @ts-expect-error
            Date = class extends Date {
                constructor(...args: any[]) {
                    if (args.length === 0) {
                        super(date);
                    } else {
                        super(...args);
                    }
                }
            };
        });

        await page.route('**/api/v1/user/christian-gawron', async route => await route.fulfill({ path: './tests/fixtures/userByURL.json' }));
        await page.route('**/event/active/*', async route => await route.fulfill({ path: './tests/fixtures/activeEvents.json' }));
        await page.route("**/api/v1/user/me", async (route) => {
            await route.fulfill({ path: './tests/fixtures/available.json' });
        });
    });

    test.describe('Visit scheduling page and schedule appointment', () => {

        test('Check simple schedule flow', async ({ page }) => {
            await page.goto('/users/christian-gawron');
            await page.waitForResponse(resp => resp.url().includes('/event/'));
        });

        test('Check no active events flow', async ({ page }) => {
            await page.route('**/event/active/*', async route => {
                await new Promise(resolve => setTimeout(resolve, 100));
                await route.fulfill({ body: JSON.stringify([]) });
            });
            await page.goto('/users/christian-gawron');
            await page.waitForResponse(resp => resp.url().includes('/event/'));
            await expect(page.getByRole('heading', { level: 1 })).toHaveText('Schedule an appointment');
            await expect(page.getByText('No public events found.')).toBeVisible();
        });
    });
});
