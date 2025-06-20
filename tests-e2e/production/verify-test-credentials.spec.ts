import { test, expect } from '@playwright/test';

/**
 * 修正されたテストクレデンシャルの確認
 */
test.describe('テストクレデンシャル動作確認', () => {
  const PRODUCTION_URL = 'https://fc573c6a.pinthop-frontend.pages.dev';
  
  // 修正されたテストアカウント（UIに表示されているもの）
  const VALID_ACCOUNTS = [
    { username: 'alice', password: 'alice123456' },
    { username: 'realuser2025', password: 'RealTest123!@#' }
  ];

  test('修正されたテストクレデンシャルでのログイン確認', async ({ page }) => {
    console.log('🎯 修正されたテストクレデンシャルの確認');
    
    for (const account of VALID_ACCOUNTS) {
      console.log(`\n🔐 ${account.username} でログインテスト`);
      
      await page.goto(`${PRODUCTION_URL}/login`);
      await page.waitForLoadState('networkidle');
      
      let loginSuccess = false;
      
      page.on('response', async response => {
        if (response.url().includes('/auth/login') && response.ok()) {
          loginSuccess = true;
          const data = await response.json();
          console.log(`✅ ${account.username} ログイン成功`);
          console.log(`ユーザー: ${data.user?.username}`);
        }
      });
      
      // ログインフォームに入力
      const usernameInput = page.locator('input[type="text"], input[type="email"], input[name*="username"], input[name*="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      
      await usernameInput.fill(account.username);
      await passwordInput.fill(account.password);
      
      // 送信ボタンをクリック
      const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /ログイン|Login|Sign In|Submit/i }).first();
      await submitButton.click();
      
      // レスポンスを待つ
      await page.waitForTimeout(3000);
      
      console.log(`結果: ${loginSuccess ? '✅ 成功' : '❌ 失敗'}`);
      
      if (loginSuccess) {
        // ダッシュボードに移動していることを確認
        const currentUrl = page.url();
        if (currentUrl.includes('/dashboard')) {
          console.log('✅ ダッシュボードに正常にリダイレクトされました');
        }
        
        // ログアウト（次のテストのため）
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
      }
      
      expect(loginSuccess).toBe(true);
    }
    
    console.log('\n🎉 すべてのテストアカウントで正常にログインできました');
  });

  test('UIにテストクレデンシャルが正しく表示されているか確認', async ({ page }) => {
    console.log('🔍 UIのテストクレデンシャル表示確認');
    
    await page.goto(`${PRODUCTION_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Test Credentials セクションを確認
    const testCredentialsSection = page.locator('text=Test Credentials').locator('..');
    expect(await testCredentialsSection.isVisible()).toBe(true);
    
    // alice アカウントの表示確認
    const aliceUsername = page.locator('text=alice');
    const alicePassword = page.locator('text=alice123456');
    expect(await aliceUsername.isVisible()).toBe(true);
    expect(await alicePassword.isVisible()).toBe(true);
    console.log('✅ alice アカウントが正しく表示されています');
    
    // realuser2025 アカウントの表示確認
    const realUserUsername = page.locator('text=realuser2025');
    const realUserPassword = page.locator('text=RealTest123!@#');
    expect(await realUserUsername.isVisible()).toBe(true);
    expect(await realUserPassword.isVisible()).toBe(true);
    console.log('✅ realuser2025 アカウントが正しく表示されています');
    
    // 古い testuser アカウントが表示されていないことを確認
    const oldTestUser = page.locator('text=testuser');
    const oldTestPassword = page.locator('text=test123456');
    expect(await oldTestUser.isVisible()).toBe(false);
    expect(await oldTestPassword.isVisible()).toBe(false);
    console.log('✅ 古い testuser アカウントは表示されていません');
    
    console.log('🎉 UIのテストクレデンシャル表示が正しく更新されています');
  });
});