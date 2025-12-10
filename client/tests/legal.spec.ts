
import { test, expect } from '@playwright/test';

test.describe('Legal Pages', () => {

    test('should render Impressum page', async ({ page }) => {
        await page.goto('/impressum');
        await expect(page.getByRole('heading', { name: 'Impressum' })).toBeVisible();
    });

    test('should render Privacy Policy page', async ({ page }) => {
        await page.goto('/privacy');
        await expect(page.getByRole('heading', { name: 'Datenschutzhinweise' })).toBeVisible();
        await expect(page.getByText('Diese Anwendung speichert und verarbeitet folgende personenbezogene Daten')).toBeVisible();
    });

    test('should navigate from Landing page footer', async ({ page }) => {
        await page.goto('/landing');

        // Check Impressum link
        const impressumLink = page.getByRole('link', { name: 'Impressum' });
        await expect(impressumLink).toBeVisible();

        // Check Privacy link
        const privacyLink = page.getByRole('link', { name: 'Datenschutzhinweise' });
        await expect(privacyLink).toBeVisible();

        // Navigate to Impressum
        await impressumLink.click();
        await expect(page).toHaveURL(/.*\/impressum/);

        // Go back and navigate to Privacy
        await page.goto('/landing');
        await page.getByRole('link', { name: 'Datenschutzhinweise' }).click();
        await expect(page).toHaveURL(/.*\/privacy/);
    });
});
