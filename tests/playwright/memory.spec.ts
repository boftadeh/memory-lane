import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Memory Creation', () => {
  test('should create a new memory and display it in the list', async ({ page }) => {
    await page.goto('/');

    await page.click('[data-test-id="new-memory-button"]');

    const memoryName = 'Test Memory';
    const memoryDescription = 'This is a test memory created by Playwright';
    const today = new Date().toISOString().split('T')[0];

    await page.fill('[data-test-id="memory-name-input"]', memoryName);
    await page.fill('[data-test-id="memory-description-input"]', memoryDescription);
    await page.fill('[data-test-id="memory-date-input"]', today);

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('input[type="file"]');
    const fileChooser = await fileChooserPromise;
    
    await fileChooser.setFiles(path.join(__dirname, 'fixtures', 'placeholder.jpg'));

    await page.click('[data-test-id="memory-submit-button"]');

    const successToast = page.getByText('Memory created successfully');
    await expect(successToast).toBeVisible();
  });
}); 