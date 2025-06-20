import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication tokens
    await page.context().clearCookies();
    await page.goto('/');
    // Clear storage after page loads
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    // Reload the page to trigger authentication check without tokens
    await page.reload();
    
    // Wait for potential redirect to complete
    await page.waitForTimeout(2000);
    
    // Check if redirected to login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Verify login page elements
    await expect(page.getByRole('heading', { name: /ログイン/i })).toBeVisible();
    await expect(page.getByPlaceholder(/ユーザー名またはメールアドレス/i)).toBeVisible();
    await expect(page.getByPlaceholder(/パスワード/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /ログイン/i })).toBeVisible();
  });

  test('should show test credentials on login page', async ({ page }) => {
    // Clear storage and go directly to login
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto('/login');
    
    // Check for test credentials display
    await expect(page.getByText(/テスト用アカウント/i)).toBeVisible();
    await expect(page.getByText(/alice/i)).toBeVisible();
    await expect(page.getByText(/realuser2025/i)).toBeVisible();
  });

  test('should login with valid credentials (alice)', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form with alice credentials
    await page.getByPlaceholder(/ユーザー名またはメールアドレス/i).fill('alice');
    await page.getByPlaceholder(/パスワード/i).fill('alice123456');
    
    // Submit form
    await page.getByRole('button', { name: /ログイン/i }).click();
    
    // Should redirect to timeline (default page)
    await expect(page).toHaveURL(/.*\/timeline/);
    
    // Verify we're logged in by checking for navigation
    await expect(page.getByText(/タイムライン/i)).toBeVisible();
  });

  test('should login with valid credentials (realuser2025)', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form with realuser2025 credentials
    await page.getByPlaceholder(/ユーザー名またはメールアドレス/i).fill('realuser2025');
    await page.getByPlaceholder(/パスワード/i).fill('RealTest123!@#');
    
    // Submit form
    await page.getByRole('button', { name: /ログイン/i }).click();
    
    // Should redirect to timeline
    await expect(page).toHaveURL(/.*\/timeline/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form with invalid credentials
    await page.getByPlaceholder(/ユーザー名またはメールアドレス/i).fill('invalid');
    await page.getByPlaceholder(/パスワード/i).fill('invalid');
    
    // Submit form
    await page.getByRole('button', { name: /ログイン/i }).click();
    
    // Should show error message
    await expect(page.getByText(/認証情報が正しくありません|Invalid credentials/i)).toBeVisible();
    
    // Should remain on login page
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    // Click register link
    await page.getByRole('link', { name: /アカウント作成/i }).click();
    
    // Should be on register page
    await expect(page).toHaveURL(/.*\/register/);
    await expect(page.getByRole('heading', { name: /アカウント作成/i })).toBeVisible();
  });

  test('should show register form elements', async ({ page }) => {
    await page.goto('/register');
    
    // Verify register form elements
    await expect(page.getByPlaceholder(/ユーザー名/i)).toBeVisible();
    await expect(page.getByPlaceholder(/メールアドレス/i)).toBeVisible();
    await expect(page.getByPlaceholder(/パスワード/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /アカウント作成/i })).toBeVisible();
    
    // Should have link back to login
    await expect(page.getByRole('link', { name: /ログイン/i })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder(/ユーザー名またはメールアドレス/i).fill('alice');
    await page.getByPlaceholder(/パスワード/i).fill('alice123456');
    await page.getByRole('button', { name: /ログイン/i }).click();
    
    // Navigate to profile
    await page.getByRole('button', { name: /プロフィール/i }).click();
    await expect(page).toHaveURL(/.*\/profile/);
    
    // Go to settings tab
    await page.getByRole('button', { name: /設定/i }).click();
    
    // Click logout
    await page.getByText(/ログアウト/i).click();
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});