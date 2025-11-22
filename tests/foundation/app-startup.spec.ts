import { test, expect } from '@playwright/test';

test.describe('App startup - HookHunt', () => {
  test('renders the framework host and HookHunt intro screen', async ({ page }) => {
    // Go to base URL from playwright.config
    await page.goto('/');

    // Wait for the framework host root to be present
    const host = page.locator('[data-framework-host]');
    await expect(host).toBeVisible({ timeout: 30000 });

    // The router container should mount
    const router = page.locator('[data-framework-router]');
    await expect(router).toBeVisible();

  // The HookHunt intro screen root should be present
  const intro = page.locator('[data-testid="hookhunt-intro"]');
  await expect(intro).toBeVisible();

  // Optionally ensure some main content exists inside the router (screen mounted)
  // We check for any button presence in the main area
  const anyButton = page.locator('[data-framework-router] button');
  await expect(anyButton.first()).toBeVisible();

    // Optional: verify no error overlay is visible
    const errorOverlay = page.locator('#vite-error-overlay');
    await expect(errorOverlay).toHaveCount(0);
  });
});
