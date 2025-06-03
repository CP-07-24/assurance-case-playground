import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false }); // headless false untuk debug
  const page = await browser.newPage();

  await page.goto('http://localhost:5173');

  // Tunggu tombol buka export modal muncul
  await page.waitForSelector('[data-testid="open-export-modal-button"]', { timeout: 10000 });

  // Klik tombol buka modal export
  await page.click('[data-testid="open-export-modal-button"]');

  // Tunggu modal export muncul (bisa pakai salah satu tombol export sebagai indikasi)
  await page.waitForSelector('[data-testid="export-pdf"]', { timeout: 10000 });

  // Klik export PDF
  await page.click('[data-testid="export-pdf"]');

  // Tunggu modal export tertutup (modal hilang)
  await page.waitForSelector('[data-testid="export-pdf"]', { state: 'detached', timeout: 10000 });

  // Bisa tambah cek file result di sistem file jika export menyimpan file

  await browser.close();
})();
