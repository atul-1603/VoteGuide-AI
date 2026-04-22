import { test, expect } from '@playwright/test';

test('has title and can navigate', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/VoteGuide/);

  // Click the Timeline link.
  await page.getByRole('link', { name: 'Timeline' }).first().click();

  // Expects page to have a heading with the name of Timeline.
  await expect(page.getByRole('heading', { name: 'Election Timeline' })).toBeVisible();
});
