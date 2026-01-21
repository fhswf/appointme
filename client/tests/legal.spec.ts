
import { test, expect } from './fixtures/base';

test.describe('Legal Pages', () => {

    test.beforeEach(async ({ page }) => {
        // Mock unauthorized user to prevent redirect from /landing to /
        await page.route('**/user/me', async route => {
            await route.fulfill({
                status: 401,
                body: JSON.stringify({ success: false, message: "Unauthorized" })
            });
        });
    });

    test('should render Privacy Policy section on Legal page by default', async ({ page }) => {
        await page.goto('/legal');
        // Default locale is likely English, so expect 'Privacy Policy'
        await expect(page.getByRole('heading', { name: /Privacy Policy|Datenschutzhinweise/ })).toBeVisible();
    });

    test('should render Impressum section on Legal page', async ({ page }) => {
        await page.goto('/legal#impressum');
        await expect(page.getByRole('heading', { name: /Imprint|Impressum/ })).toBeVisible();
    });

    test('should render Privacy Policy section on Legal page', async ({ page }) => {
        await page.goto('/legal#privacy');
        await expect(page.getByRole('heading', { name: /Privacy Policy|Datenschutzhinweise/ })).toBeVisible();
    });

    test('should navigate from Landing page footer', async ({ page }) => {
        await page.goto('/landing');
        await expect(page).toHaveURL(/.*\/landing/);

        // Check Legal link
        const legalLink = page.getByTestId('footer-legal-link');
        await expect(legalLink).toBeVisible();

        // Navigate to Legal page
        await legalLink.click();
        await expect(page).toHaveURL(/.*\/legal/);
        // Now it should show Privacy Policy by default
        await expect(page.getByRole('heading', { name: /Privacy Policy|Datenschutzhinweise/ })).toBeVisible();
    });
});
