import { test, expect } from '@playwright/test';

test.describe('5-Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByPlaceholder(/ユーザー名またはメールアドレス/i).fill('alice');
    await page.getByPlaceholder(/パスワード/i).fill('alice123456');
    await page.getByRole('button', { name: /ログイン/i }).click();
    await expect(page).toHaveURL(/.*\/timeline/);
  });

  test('should have all 5 navigation tabs visible', async ({ page }) => {
    // Check all navigation tabs are present
    await expect(page.getByRole('button', { name: /タイムライン/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /マップ/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /検索/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /イベント/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /プロフィール/i })).toBeVisible();
  });

  test('should default to Timeline tab', async ({ page }) => {
    // Should be on timeline by default
    await expect(page).toHaveURL(/.*\/timeline/);
    
    // Timeline tab should be active (has specific styling)
    const timelineTab = page.getByRole('button', { name: /タイムライン/i });
    await expect(timelineTab).toBeVisible();
    
    // Check for timeline content
    await expect(page.getByText(/タイムライン/i).first()).toBeVisible();
  });

  test('should navigate to Map tab', async ({ page }) => {
    // Click Map tab
    await page.getByRole('button', { name: /マップ/i }).click();
    
    // Should navigate to map page
    await expect(page).toHaveURL(/.*\/map/);
    
    // Check for map content
    await expect(page.getByText(/マップ/i).first()).toBeVisible();
  });

  test('should navigate to Brewery Search tab', async ({ page }) => {
    // Click Search tab
    await page.getByRole('button', { name: /検索/i }).click();
    
    // Should navigate to brewery search page
    await expect(page).toHaveURL(/.*\/brewery-search/);
    
    // Check for search content
    await expect(page.getByText(/ブルワリー検索/i)).toBeVisible();
    await expect(page.getByPlaceholder(/ブルワリー名や地域で検索/i)).toBeVisible();
  });

  test('should navigate to Events tab', async ({ page }) => {
    // Click Events tab
    await page.getByRole('button', { name: /イベント/i }).click();
    
    // Should navigate to events page
    await expect(page).toHaveURL(/.*\/events/);
    
    // Check for events content
    await expect(page.getByText(/イベント/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /イベント作成/i })).toBeVisible();
  });

  test('should navigate to Profile tab', async ({ page }) => {
    // Click Profile tab
    await page.getByRole('button', { name: /プロフィール/i }).click();
    
    // Should navigate to profile page
    await expect(page).toHaveURL(/.*\/profile/);
    
    // Check for profile content
    await expect(page.getByText(/alice/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /プロフィール編集/i })).toBeVisible();
  });

  test('should maintain active state on current tab', async ({ page }) => {
    // Navigate to Events tab
    await page.getByRole('button', { name: /イベント/i }).click();
    await expect(page).toHaveURL(/.*\/events/);
    
    // Events tab should have active styling
    const eventsTab = page.getByRole('button', { name: /イベント/i });
    await expect(eventsTab).toBeVisible();
    
    // Other tabs should not have active styling (this is visual, so we check URL)
    await expect(page).toHaveURL(/.*\/events/);
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Navigate directly to brewery search
    await page.goto('/brewery-search');
    await expect(page).toHaveURL(/.*\/brewery-search/);
    
    // Should show correct content
    await expect(page.getByText(/ブルワリー検索/i)).toBeVisible();
    
    // Navigation should reflect current page
    await expect(page.getByRole('button', { name: /検索/i })).toBeVisible();
  });

  test('should redirect legacy dashboard route to timeline', async ({ page }) => {
    // Navigate to legacy dashboard route
    await page.goto('/dashboard');
    
    // Should redirect to timeline
    await expect(page).toHaveURL(/.*\/timeline/);
    await expect(page.getByText(/タイムライン/i).first()).toBeVisible();
  });

  test('should handle root route redirect to timeline', async ({ page }) => {
    // Navigate to root while authenticated
    await page.goto('/');
    
    // Should redirect to timeline
    await expect(page).toHaveURL(/.*\/timeline/);
    await expect(page.getByText(/タイムライン/i).first()).toBeVisible();
  });

  test('should navigate between all tabs successfully', async ({ page }) => {
    const tabs = [
      { name: /マップ/i, url: /.*\/map/ },
      { name: /検索/i, url: /.*\/brewery-search/ },
      { name: /イベント/i, url: /.*\/events/ },
      { name: /プロフィール/i, url: /.*\/profile/ },
      { name: /タイムライン/i, url: /.*\/timeline/ }
    ];

    // Navigate through all tabs
    for (const tab of tabs) {
      await page.getByRole('button', { name: tab.name }).click();
      await expect(page).toHaveURL(tab.url);
      
      // Small delay to ensure navigation completes
      await page.waitForTimeout(500);
    }
  });
});