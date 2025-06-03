import { test, expect } from '@playwright/test';

test('Simulasi user dan hitung statistik response time export PDF', async ({ page }) => {
  const totalUsers = 1;
  const responseTimes: number[] = [];
  let failedRequests = 0;

  for (let i = 0; i < totalUsers; i++) {
    try {
      await page.goto('http://localhost:5173');

      await page.click('[data-testid="open-export-modal-button"]');
      await page.waitForSelector('[data-testid="export-pdf"]', { timeout: 10000 });

      const start = Date.now();

      await page.click('[data-testid="export-pdf"]');
      await page.waitForSelector('[data-testid="export-pdf"]', {
        state: 'detached',
        timeout: 10000,
      });

      const end = Date.now();
      const time = end - start;
      responseTimes.push(time);

      console.log(`✅ User ${i + 1} → 🕒 Response Time: ${time} ms`);
    } catch (error) {
      failedRequests++;
      console.error(`❌ User ${i + 1} → Failed: ${error}`);
    }
  }

  if (responseTimes.length > 0) {
    const totalTime = responseTimes.reduce((sum, time) => sum + time, 0);
    const avgTime = totalTime / responseTimes.length;
    const minTime = Math.min(...responseTimes);
    const maxTime = Math.max(...responseTimes);
    const errorRate = (failedRequests / totalUsers) * 100;

    console.log(`\n📊 Total Users: ${totalUsers}`);
    console.log(`✅ Successful: ${totalUsers - failedRequests}`);
    console.log(`❌ Failed: ${failedRequests}`);
    console.log(`⚠️ Error Rate: ${errorRate.toFixed(2)}%`);

    console.log(`📈 Min Response Time: ${minTime} ms`);
    console.log(`📉 Max Response Time: ${maxTime} ms`);
    console.log(`📊 Average Response Time: ${avgTime.toFixed(2)} ms`);
  } else {
    console.log('❌ Semua request gagal, tidak ada data waktu respons.');
  }
});
