import { test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const test = base.extend({
    page: async ({ page }, use) => {
        await use(page);
        const coverage = await page.evaluate(() => (window as any).__coverage__);
        if (coverage) {
            const coveragePath = path.join(process.cwd(), '.nyc_output');
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
