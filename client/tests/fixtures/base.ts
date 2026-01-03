import { test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const test = base.extend({
    page: async ({ page }, use) => {
        // Mock config.js for all tests to ensure valid env vars
        await page.route('**/config.js', route => route.fulfill({
            status: 200,
            contentType: 'application/javascript',
            body: `window.ENV = {
                REACT_APP_API_URL: '/api/v1',
                REACT_APP_CLIENT_ID: 'test-client-id',
                REACT_APP_BASE_PATH: '/',
                REACT_APP_URL: 'http://localhost:5173'
            };`
        }));

        await use(page);
        const coverage = await page.evaluate(() => (window as any).__coverage__);
        if (coverage) {
            const coveragePath = path.join(process.cwd(), '.coverage-e2e');
            if (!fs.existsSync(coveragePath)) {
                fs.mkdirSync(coveragePath, { recursive: true });
            }
            fs.writeFileSync(
                path.join(coveragePath, `coverage-${Date.now()}.json`),
                JSON.stringify(coverage)
            );
        }
    },
});

export { expect } from '@playwright/test';
