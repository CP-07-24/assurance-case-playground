import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 50, // Atau "max" untuk maksimal jumlah worker
  timeout: 10 * 60 * 1000, // 10 menit dalam ms
  use: {
    headless: true,
  },
});
