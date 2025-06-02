import { test } from '@playwright/test';

for (let i = 0; i < 2000; i++) {
  test(`user simulation ${i + 1}`, async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Klik tombol buka modal export
    await page.click('[data-testid="open-export-modal-button"]');

    // Tunggu modal export muncul
    await page.waitForSelector('[data-testid="export-pdf"]', { timeout: 10000 });

    // Klik export PDF
    await page.click('[data-testid="export-pdf"]');

    // Tunggu modal export tertutup
    await page.waitForSelector('[data-testid="export-pdf"]', { state: 'detached', timeout: 10000 });
  });
}
