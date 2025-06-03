import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: process.env.CI ? 2 : undefined, // Atau "max" untuk maksimal jumlah worker
  timeout: 10 * 60 * 1000, // 10 menit dalam ms
  use: {
    headless: true,
  },
});
