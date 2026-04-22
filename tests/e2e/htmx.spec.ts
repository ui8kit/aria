import { test, expect } from '@playwright/test'

test('htmx example loads', async ({ page }) => {
  await page.goto('/examples/htmx/')
  await expect(page.locator('text=Combobox')).toBeVisible()
})

