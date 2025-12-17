
import { test, expect } from '@playwright/test';

test.describe('Legal Pages', () => {

    test('should render Impressum section on Legal page', async ({ page }) => {
        await page.goto('/legal#impressum');
        // Default locale is likely English, so expect 'Imprint'
        await expect(page.getByRole('heading', { name: /Imprint|Impressum/ })).toBeVisible();
    });

    test('should render Privacy Policy section on Legal page', async ({ page }) => {
        await page.goto('/legal#privacy');
        // Default locale is likely English, so expect 'Privacy Policy'
        await expect(page.getByRole('heading', { name: /Privacy Policy|Datenschutzhinweise/ })).toBeVisible();
    });

    test('should navigate from Landing page footer', async ({ page }) => {
        await page.goto('/landing');

        // Check Legal link
        const legalLink = page.getByRole('link', { name: /Legal|Rechtliches/ });
        await expect(legalLink).toBeVisible();

        // Navigate to Legal page
        await legalLink.click();
        await expect(page).toHaveURL(/.*\/legal/);
        await expect(page.getByRole('heading', { name: /Imprint|Impressum/ })).toBeVisible();
    });
});
