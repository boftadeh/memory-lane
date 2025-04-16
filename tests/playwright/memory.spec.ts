import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Memory Creation', () => {
  test('should create a new memory with multiple tags and display it in the list', async ({ page }) => {
    await page.goto('/');

    await page.click('[data-test-id="new-memory-button"]');

    const memoryName = 'Test Memory';
    const memoryDescription = 'This is a test memory created by Playwright';
    const today = new Date().toISOString().split('T')[0];

    await page.fill('[data-test-id="memory-name-input"]', memoryName);
    await page.fill('[data-test-id="memory-description-input"]', memoryDescription);
    await page.fill('[data-test-id="memory-date-input"]', today);
    
    await page.locator('.fieldset-label:has-text("Tags") select').selectOption('cooking');
    await page.waitForTimeout(500);
    await page.locator('.fieldset-label:has-text("Tags") select').selectOption('traveling');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('input[type="file"]');
    const fileChooser = await fileChooserPromise;
    
    await fileChooser.setFiles(path.join(__dirname, 'fixtures', 'placeholder.jpg'));

    await page.click('[data-test-id="memory-submit-button"]');

    const successToast = page.getByText('Memory created successfully');
    await expect(successToast).toBeVisible();
    
    await expect(page.getByRole('heading', { name: memoryName })).toBeVisible();
    
    await expect(page.locator('.badge', { hasText: 'cooking' })).toBeVisible();
    await expect(page.locator('.badge', { hasText: 'traveling' })).toBeVisible();
  });
});

test.describe('Memory Editing', () => {
  test('should edit an existing memory', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-test-id="new-memory-button"]');

    const originalName = 'Memory to Edit';
    const originalDescription = 'This memory will be edited';
    const today = new Date().toISOString().split('T')[0];

    await page.fill('[data-test-id="memory-name-input"]', originalName);
    await page.fill('[data-test-id="memory-description-input"]', originalDescription);
    await page.fill('[data-test-id="memory-date-input"]', today);
    
    await page.locator('.fieldset-label:has-text("Tags") select').selectOption('cooking');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('input[type="file"]');
    const fileChooser = await fileChooserPromise;
    
    await fileChooser.setFiles(path.join(__dirname, 'fixtures', 'placeholder.jpg'));
    await page.click('[data-test-id="memory-submit-button"]');
    
    await expect(page.getByText('Memory created successfully')).toBeVisible();
    
    const memoryCardId = `memory-card-${originalName.toLowerCase().replace(/\s+/g, '-')}`;
    const memoryCard = page.locator(`[data-test-id="${memoryCardId}"]`);
    
    await memoryCard.locator('.btn-circle').click();

    await page.locator('.dropdown-content:visible button[role="menuitem"]')
      .filter({ hasText: /^Edit$/ })
      .click();
    
    const updatedName = 'Updated Memory';
    const updatedDescription = 'This memory has been updated';
    
    await page.fill('[data-test-id="memory-name-input"]', updatedName);
    await page.fill('[data-test-id="memory-description-input"]', updatedDescription);
    
    await page.locator('.badge:has-text("cooking") .h-4').click();
    await page.locator('.fieldset-label:has-text("Tags") select').selectOption('outdoors');
    
    await page.click('[data-test-id="memory-submit-button"]');
    
    await expect(page.getByText('Memory updated successfully')).toBeVisible();
    
    await expect(page.getByRole('heading', { name: updatedName })).toBeVisible();
    await expect(page.getByText(updatedDescription)).toBeVisible();
    
    const updatedMemoryCardId = `memory-card-${updatedName.toLowerCase().replace(/\s+/g, '-')}`;
    const updatedMemoryCard = page.locator(`[data-test-id="${updatedMemoryCardId}"]`);
    await expect(updatedMemoryCard.locator('.badge', { hasText: 'outdoors' })).toBeVisible();
    
    const cookingTagsOnUpdatedCard = await updatedMemoryCard.locator('.badge', { hasText: 'cooking' }).count();
    expect(cookingTagsOnUpdatedCard).toBe(0);
  });
});

test.describe('Memory Deletion', () => {
  test('should delete an existing memory', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-test-id="new-memory-button"]');

    const memoryToDelete = 'Memory to Delete';
    const description = 'This memory will be deleted';
    const today = new Date().toISOString().split('T')[0];

    await page.fill('[data-test-id="memory-name-input"]', memoryToDelete);
    await page.fill('[data-test-id="memory-description-input"]', description);
    await page.fill('[data-test-id="memory-date-input"]', today);

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('input[type="file"]');
    const fileChooser = await fileChooserPromise;
    
    await fileChooser.setFiles(path.join(__dirname, 'fixtures', 'placeholder.jpg'));
    await page.click('[data-test-id="memory-submit-button"]');
    
    await expect(page.getByText('Memory created successfully')).toBeVisible();
    
    await expect(page.getByRole('heading', { name: memoryToDelete })).toBeVisible();
    
    const memoryCardId = `memory-card-${memoryToDelete.toLowerCase().replace(/\s+/g, '-')}`;
    const memoryCard = page.locator(`[data-test-id="${memoryCardId}"]`);
    
    await memoryCard.locator('.btn-circle').click();
    
    await page.locator('.dropdown-content:visible button[role="menuitem"]')
      .filter({ hasText: /^Delete$/ })
      .click();
    
    await page.getByRole('button', { name: 'Delete Memory' }).click();
    
    await expect(page.getByText('Memory deleted successfully')).toBeVisible();
    
    const deletedMemoryCount = await page.getByRole('heading', { name: memoryToDelete }).count();
    expect(deletedMemoryCount).toBe(0);
  });
}); 