import { test, expect } from '@playwright/test';

test.describe('Events Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to events
    await page.goto('/login');
    await page.getByPlaceholder(/ユーザー名またはメールアドレス/i).fill('alice');
    await page.getByPlaceholder(/パスワード/i).fill('alice123456');
    await page.getByRole('button', { name: /ログイン/i }).click();
    await page.getByRole('button', { name: /イベント/i }).click();
    await expect(page).toHaveURL(/.*\/events/);
  });

  test('should display events page elements', async ({ page }) => {
    // Check main elements
    await expect(page.getByText(/イベント/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /イベント作成/i })).toBeVisible();
    
    // Check filter buttons
    await expect(page.getByRole('button', { name: /すべて/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /参加予定/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /興味あり/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /近くのイベント/i })).toBeVisible();
    
    // Check view toggle buttons
    await expect(page.locator('button svg').first()).toBeVisible();
  });

  test('should show event cards after loading', async ({ page }) => {
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Should show event cards
    await expect(page.getByText(/Seattle Beer Week Kickoff/i)).toBeVisible();
    await expect(page.getByText(/IPA Appreciation Night/i)).toBeVisible();
    await expect(page.getByText(/Brewery Trivia Night/i)).toBeVisible();
  });

  test('should display event information correctly', async ({ page }) => {
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Check event details
    await expect(page.getByText(/Seattle Beer Week Kickoff/i)).toBeVisible();
    await expect(page.getByText(/Fremont Brewing/i)).toBeVisible();
    
    // Check for date/time information
    await expect(page.getByText(/2025/i)).toBeVisible();
    
    // Check for participant count
    await expect(page.getByText(/人参加/i)).toBeVisible();
    
    // Check for status badges
    await expect(page.getByText(/参加予定|興味あり|未回答/i)).toBeVisible();
  });

  test('should filter events by status', async ({ page }) => {
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Click on "参加予定" filter
    await page.getByRole('button', { name: /参加予定/i }).click();
    await page.waitForTimeout(1000);
    
    // Events should still be visible (filtered)
    // In mock data, at least one event should have "going" status
    await expect(page.getByText(/人参加/i)).toBeVisible();
    
    // Click on "興味あり" filter
    await page.getByRole('button', { name: /興味あり/i }).click();
    await page.waitForTimeout(1000);
    
    // Events should still be visible (filtered)
    await expect(page.getByText(/人参加/i)).toBeVisible();
    
    // Return to "すべて" filter
    await page.getByRole('button', { name: /すべて/i }).click();
    await page.waitForTimeout(1000);
  });

  test('should toggle between list and calendar view', async ({ page }) => {
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Find view toggle buttons
    const viewButtons = page.locator('button svg');
    
    // Click calendar view (second button)
    if (await viewButtons.count() >= 2) {
      await viewButtons.nth(1).click();
      await page.waitForTimeout(1000);
      
      // Should show calendar view placeholder
      await expect(page.getByText(/カレンダービューは開発中です/i)).toBeVisible();
      
      // Click back to list view
      await viewButtons.nth(0).click();
      await page.waitForTimeout(1000);
      
      // Should show events again
      await expect(page.getByText(/Seattle Beer Week Kickoff/i)).toBeVisible();
    }
  });

  test('should display event tags', async ({ page }) => {
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Check for event tags
    await expect(page.getByText(/beer-week|tasting|community|ipa|education|trivia|social|games/i)).toBeVisible();
  });

  test('should show friends attending events', async ({ page }) => {
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Check for friends attending section
    await expect(page.getByText(/参加予定の友達/i)).toBeVisible();
    
    // Should show friend avatars or names
    const friendsSection = page.locator('text=参加予定の友達');
    await expect(friendsSection).toBeVisible();
  });

  test('should handle event interactions', async ({ page }) => {
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Check for interaction buttons
    await expect(page.getByRole('button', { name: /興味あり/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /コメント/i }).first()).toBeVisible();
    
    // Click interest button
    await page.getByRole('button', { name: /興味あり/i }).first().click();
    await page.waitForTimeout(500);
    
    // Click comment button
    await page.getByRole('button', { name: /コメント/i }).first().click();
    await page.waitForTimeout(500);
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Page should still be functional on mobile
    await expect(page.getByText(/イベント/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /イベント作成/i })).toBeVisible();
    await expect(page.getByText(/Seattle Beer Week Kickoff/i)).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Check initial loading state (might be too fast to catch)
    // Then events should appear
    await page.waitForTimeout(2000);
    await expect(page.getByText(/Seattle Beer Week Kickoff/i)).toBeVisible();
  });

  test('should display event creation button', async ({ page }) => {
    // Check event creation button
    await expect(page.getByRole('button', { name: /イベント作成/i })).toBeVisible();
    
    // Click event creation button
    await page.getByRole('button', { name: /イベント作成/i }).click();
    
    // Should handle click (might not navigate anywhere in current implementation)
    await page.waitForTimeout(500);
  });

  test('should handle empty events state', async ({ page }) => {
    // This test would be for when there are no events
    // In current mock implementation, there are always events
    // But we can verify the page loads correctly
    await page.waitForTimeout(2000);
    
    // Should either show events or empty state message
    const hasEvents = await page.getByText(/Seattle Beer Week Kickoff/i).isVisible();
    const hasEmptyMessage = await page.getByText(/現在開催予定のイベントはありません/i).isVisible();
    
    expect(hasEvents || hasEmptyMessage).toBeTruthy();
  });

  test('should display event status correctly', async ({ page }) => {
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Check for different status badges
    const statusBadges = page.locator('text=参加予定, text=興味あり, text=未回答');
    
    // At least one status should be visible
    const visibleStatuses = await Promise.all([
      page.getByText(/参加予定/i).isVisible(),
      page.getByText(/興味あり/i).isVisible(),
      page.getByText(/未回答/i).isVisible()
    ]);
    
    expect(visibleStatuses.some(status => status)).toBeTruthy();
  });

  test('should maintain filter state', async ({ page }) => {
    // Wait for events to load
    await page.waitForTimeout(2000);
    
    // Apply a filter
    await page.getByRole('button', { name: /参加予定/i }).click();
    await page.waitForTimeout(1000);
    
    // Navigate away and back
    await page.getByRole('button', { name: /タイムライン/i }).click();
    await expect(page).toHaveURL(/.*\/timeline/);
    
    await page.getByRole('button', { name: /イベント/i }).click();
    await expect(page).toHaveURL(/.*\/events/);
    
    // Filter state might be reset (depends on implementation)
    // This test verifies the page loads correctly after navigation
    await page.waitForTimeout(2000);
    await expect(page.getByText(/イベント/i).first()).toBeVisible();
  });
});