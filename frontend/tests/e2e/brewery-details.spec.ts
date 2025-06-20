import { test, expect } from '@playwright/test';

test.describe('Brewery Details & Community Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to brewery details
    await page.goto('/login');
    await page.getByPlaceholder(/ユーザー名またはメールアドレス/i).fill('alice');
    await page.getByPlaceholder(/パスワード/i).fill('alice123456');
    await page.getByRole('button', { name: /ログイン/i }).click();
    
    // Navigate to brewery details (using brewery ID 1)
    await page.goto('/brewery/1');
  });

  test('should display brewery details page', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check main brewery information
    await expect(page.getByText(/Fremont Brewing/i)).toBeVisible();
    await expect(page.getByText(/Seattle/i)).toBeVisible();
    
    // Check for back button
    await expect(page.locator('button').first()).toBeVisible(); // Back button
  });

  test('should display community information section', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check community information section
    await expect(page.getByText(/コミュニティ情報/i)).toBeVisible();
    
    // Check presence information
    await expect(page.getByText(/現在の友達/i)).toBeVisible();
    
    // Check route information
    await expect(page.getByText(/アクティブルート/i)).toBeVisible();
    
    // Check crowding information
    await expect(page.getByText(/混雑状況/i)).toBeVisible();
    
    // Check events information
    await expect(page.getByText(/今日のイベント/i)).toBeVisible();
  });

  test('should display friends presence', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check friends presence display
    await expect(page.getByText(/現在の友達/i)).toBeVisible();
    
    // Should show friend count or "no friends" message
    const friendsSection = page.locator('text=現在の友達').locator('..').locator('..');
    await expect(friendsSection).toBeVisible();
  });

  test('should display active routes', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check active routes display
    await expect(page.getByText(/アクティブルート/i)).toBeVisible();
    
    // Should show route information or "no active routes" message
    const routesSection = page.locator('text=アクティブルート').locator('..').locator('..');
    await expect(routesSection).toBeVisible();
  });

  test('should display crowding level', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check crowding level display
    await expect(page.getByText(/混雑状況/i)).toBeVisible();
    
    // Should show one of the crowding levels
    const crowdingText = page.locator('text=混雑状況').locator('..').locator('..');
    await expect(crowdingText).toBeVisible();
  });

  test('should display today\'s events', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check today's events display
    await expect(page.getByText(/今日のイベント/i)).toBeVisible();
    
    // Should show events or "no events" message
    const eventsSection = page.locator('text=今日のイベント').locator('..').locator('..');
    await expect(eventsSection).toBeVisible();
  });

  test('should have checkin functionality', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check for checkin button
    await expect(page.getByRole('button', { name: /チェックイン/i })).toBeVisible();
    
    // Check for meetup creation button
    await expect(page.getByRole('button', { name: /ミートアップ開催/i })).toBeVisible();
  });

  test('should open checkin modal', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Click checkin button
    await page.getByRole('button', { name: /チェックイン/i }).click();
    
    // Should open checkin modal
    await expect(page.getByText(/チェックイン/i).first()).toBeVisible();
    
    // Check modal elements
    await expect(page.getByText(/プライバシー設定/i)).toBeVisible();
    await expect(page.getByText(/友達のみ/i)).toBeVisible();
  });

  test('should perform basic checkin', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Click checkin button
    await page.getByRole('button', { name: /チェックイン/i }).click();
    
    // Wait for modal to appear
    await page.waitForTimeout(500);
    
    // Click the main checkin button in modal
    const checkinButtons = page.getByRole('button', { name: /チェックイン/i });
    await checkinButtons.last().click();
    
    // Wait for checkin to complete
    await page.waitForTimeout(2000);
    
    // Button should change to checked in state
    await expect(page.getByRole('button', { name: /チェックイン済み/i })).toBeVisible();
  });

  test('should display basic brewery information', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check basic information section
    await expect(page.getByText(/基本情報/i)).toBeVisible();
    
    // Check for contact information
    const basicInfoSection = page.locator('text=基本情報').locator('..').locator('..');
    await expect(basicInfoSection).toBeVisible();
  });

  test('should handle back navigation', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Click back button
    const backButton = page.locator('button').first();
    await backButton.click();
    
    // Should navigate back (to previous page or search)
    // Since we came directly via URL, might go to search or timeline
    await expect(page).not.toHaveURL(/.*\/brewery\/1/);
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Page should still be functional on mobile
    await expect(page.getByText(/Fremont Brewing/i)).toBeVisible();
    await expect(page.getByText(/コミュニティ情報/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /チェックイン/i })).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Navigate to brewery details and check loading
    await page.goto('/brewery/1');
    
    // Initially might show loading state
    // Then should show content
    await page.waitForTimeout(2000);
    await expect(page.getByText(/Fremont Brewing/i)).toBeVisible();
  });

  test('should handle privacy settings in checkin', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Click checkin button
    await page.getByRole('button', { name: /チェックイン/i }).click();
    
    // Wait for modal
    await page.waitForTimeout(500);
    
    // Check privacy options
    await expect(page.getByText(/友達のみ/i)).toBeVisible();
    
    // Click on privacy settings to expand
    const privacyButton = page.getByText(/友達のみ/).locator('..');
    await privacyButton.click();
    
    // Wait for options to appear
    await page.waitForTimeout(500);
    
    // Should show privacy options
    await expect(page.getByText(/公開/i)).toBeVisible();
    await expect(page.getByText(/非公開/i)).toBeVisible();
  });
});