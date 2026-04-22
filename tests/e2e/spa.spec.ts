import { test, expect } from '@playwright/test'

test('spa example mount root', async ({ page }) => {
  await page.goto('/examples/spa/')
  await expect(page.locator('[data-spa-root]')).toBeVisible()
})
