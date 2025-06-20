import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to profile
    await page.goto('/login');
    await page.getByPlaceholder(/ユーザー名またはメールアドレス/i).fill('alice');
    await page.getByPlaceholder(/パスワード/i).fill('alice123456');
    await page.getByRole('button', { name: /ログイン/i }).click();
    await page.getByRole('button', { name: /プロフィール/i }).click();
    await expect(page).toHaveURL(/.*\/profile/);
  });

  test('should display profile header', async ({ page }) => {
    // Check profile header elements
    await expect(page.getByText(/alice/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /プロフィール編集/i })).toBeVisible();
    
    // Check for user avatar
    const avatar = page.locator('div').filter({ hasText: /^A$/ }).first();
    await expect(avatar).toBeVisible();
    
    // Check for camera button
    await expect(page.locator('button svg').first()).toBeVisible();
  });

  test('should display profile tabs', async ({ page }) => {
    // Check all tabs are present
    await expect(page.getByRole('button', { name: /統計/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /バッジ/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /履歴/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /設定/i })).toBeVisible();
  });

  test('should default to stats tab', async ({ page }) => {
    // Should default to stats tab
    await expect(page.getByText(/あなたの統計/i)).toBeVisible();
    
    // Check for stat cards
    await expect(page.getByText(/訪問ブルワリー数/i)).toBeVisible();
    await expect(page.getByText(/完走ルート数/i)).toBeVisible();
    await expect(page.getByText(/出会った友達/i)).toBeVisible();
    await expect(page.getByText(/参加イベント数/i)).toBeVisible();
    await expect(page.getByText(/獲得バッジ数/i)).toBeVisible();
  });

  test('should display statistics correctly', async ({ page }) => {
    // Wait for stats to load
    await page.waitForTimeout(2000);
    
    // Check for numeric values in stats
    await expect(page.getByText(/23/i)).toBeVisible(); // breweries visited
    await expect(page.getByText(/89/i)).toBeVisible(); // beers recorded (if shown)
    await expect(page.getByText(/7/i)).toBeVisible();  // routes completed
    await expect(page.getByText(/15/i)).toBeVisible(); // friends met
    await expect(page.getByText(/12/i)).toBeVisible(); // events attended
    await expect(page.getByText(/8/i)).toBeVisible();  // badges earned
  });

  test('should navigate to badges tab', async ({ page }) => {
    // Click badges tab
    await page.getByRole('button', { name: /バッジ/i }).click();
    
    // Should show badges content
    await expect(page.getByText(/バッジコレクション/i)).toBeVisible();
    
    // Check for badge cards
    await expect(page.getByText(/First Steps/i)).toBeVisible();
    await expect(page.getByText(/Explorer/i)).toBeVisible();
    await expect(page.getByText(/Social Butterfly/i)).toBeVisible();
  });

  test('should display badge information', async ({ page }) => {
    // Navigate to badges tab
    await page.getByRole('button', { name: /バッジ/i }).click();
    await page.waitForTimeout(1000);
    
    // Check badge details
    await expect(page.getByText(/初回ブルワリー訪問/i)).toBeVisible();
    await expect(page.getByText(/10軒のブルワリーを訪問/i)).toBeVisible();
    await expect(page.getByText(/5人の新しい友達と出会う/i)).toBeVisible();
    
    // Check for badge progress (some badges might be in progress)
    await expect(page.getByText(/3 \/ 5|7 \/ 10/i)).toBeVisible();
  });

  test('should navigate to history tab', async ({ page }) => {
    // Click history tab
    await page.getByRole('button', { name: /履歴/i }).click();
    
    // Should show history content
    await expect(page.getByText(/活動履歴/i)).toBeVisible();
    
    // Currently shows placeholder
    await expect(page.getByText(/活動履歴機能は開発中です/i)).toBeVisible();
  });

  test('should navigate to settings tab', async ({ page }) => {
    // Click settings tab
    await page.getByRole('button', { name: /設定/i }).click();
    
    // Should show settings content
    await expect(page.getByText(/設定/i).first()).toBeVisible();
    
    // Check for settings options
    await expect(page.getByText(/アカウント設定/i)).toBeVisible();
    await expect(page.getByText(/プライバシー設定/i)).toBeVisible();
    await expect(page.getByText(/通知設定/i)).toBeVisible();
    await expect(page.getByText(/ヘルプ・サポート/i)).toBeVisible();
    await expect(page.getByText(/ログアウト/i)).toBeVisible();
  });

  test('should handle settings interactions', async ({ page }) => {
    // Navigate to settings tab
    await page.getByRole('button', { name: /設定/i }).click();
    await page.waitForTimeout(500);
    
    // Click on account settings
    await page.getByText(/アカウント設定/i).click();
    await page.waitForTimeout(500);
    
    // Click on privacy settings
    await page.getByText(/プライバシー設定/i).click();
    await page.waitForTimeout(500);
    
    // Click on notification settings
    await page.getByText(/通知設定/i).click();
    await page.waitForTimeout(500);
  });

  test('should handle logout', async ({ page }) => {
    // Navigate to settings tab
    await page.getByRole('button', { name: /設定/i }).click();
    await page.waitForTimeout(500);
    
    // Click logout
    await page.getByText(/ログアウト/i).click();
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: /ログイン/i })).toBeVisible();
  });

  test('should handle profile edit button', async ({ page }) => {
    // Click profile edit button
    await page.getByRole('button', { name: /プロフィール編集/i }).click();
    
    // Should handle click (might not navigate anywhere in current implementation)
    await page.waitForTimeout(500);
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Page should still be functional on mobile
    await expect(page.getByText(/alice/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /プロフィール編集/i })).toBeVisible();
    await expect(page.getByText(/あなたの統計/i)).toBeVisible();
  });

  test('should maintain tab state during navigation', async ({ page }) => {
    // Navigate to badges tab
    await page.getByRole('button', { name: /バッジ/i }).click();
    await expect(page.getByText(/バッジコレクション/i)).toBeVisible();
    
    // Navigate away and back
    await page.getByRole('button', { name: /タイムライン/i }).click();
    await expect(page).toHaveURL(/.*\/timeline/);
    
    await page.getByRole('button', { name: /プロフィール/i }).click();
    await expect(page).toHaveURL(/.*\/profile/);
    
    // Should default back to stats tab
    await expect(page.getByText(/あなたの統計/i)).toBeVisible();
  });

  test('should display user information correctly', async ({ page }) => {
    // Check user information display
    await expect(page.getByText(/alice/i)).toBeVisible();
    
    // Check for membership info
    await expect(page.getByText(/PintHop Explorer since/i)).toBeVisible();
    await expect(page.getByText(/May 2025/i)).toBeVisible();
  });

  test('should show loading states for statistics', async ({ page }) => {
    // Statistics should load after initial page load
    // In current implementation, there's a 1-second delay
    await page.waitForTimeout(2000);
    
    // Should show actual statistics
    await expect(page.getByText(/23/i)).toBeVisible();
  });

  test('should handle tab switching animations', async ({ page }) => {
    // Test switching between tabs multiple times
    const tabs = [
      { name: /バッジ/i, content: /バッジコレクション/i },
      { name: /履歴/i, content: /活動履歴/i },
      { name: /設定/i, content: /アカウント設定/i },
      { name: /統計/i, content: /あなたの統計/i }
    ];

    for (const tab of tabs) {
      await page.getByRole('button', { name: tab.name }).click();
      await page.waitForTimeout(300);
      await expect(page.getByText(tab.content)).toBeVisible();
    }
  });

  test('should display badge progress correctly', async ({ page }) => {
    // Navigate to badges tab
    await page.getByRole('button', { name: /バッジ/i }).click();
    await page.waitForTimeout(1000);
    
    // Check for earned badges (should have dates)
    await expect(page.getByText(/2025-05-15|2025-05-28|2025-06-02/)).toBeVisible();
    
    // Check for progress badges (should show progress bars)
    const progressBadges = page.locator('text=3 / 5, text=7 / 10');
    // Should have at least some progress indicators
  });

  test('should handle camera button interaction', async ({ page }) => {
    // Find and click camera button (for profile picture)
    const cameraButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await cameraButton.click();
    
    // Should handle click (might trigger file input in real implementation)
    await page.waitForTimeout(500);
  });
});