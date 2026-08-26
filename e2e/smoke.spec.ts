import { test, expect } from '@playwright/test';

test('app loads and navigates correctly', async ({ page }) => {
  // Check Home page
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('अगाध (Agaadh)');

  // Open Drawer and navigate to Explorer
  await page.getByRole('button', { name: /Open navigation menu/i }).click();
  await page.getByRole('link', { name: 'Explorer' }).click();
  await expect(page.locator('h1')).toHaveText('Explorer');

  // Navigate to Analysis
  await page.goto('/analysis');
  await expect(page.locator('h1')).toHaveText('Analysis');
});
