import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    maxFailures: process.env.CI ? 1 : undefined,

    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['playwright-ctrf-json-reporter', {}]
    ],

    use: {
        baseURL: 'http://localhost:5173',
        timezoneId: 'Europe/Berlin',
        trace: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'VITE_COVERAGE=true yarn start -- --port 5173',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
    },
});
