import { test, expect } from '@playwright/test';

/**
 * 最終ログインテスト - 実際のログイン成功を確認
 */
test.describe('最終ログインテスト', () => {
  const PRODUCTION_URL = 'https://d14ab9e4.pinthop-frontend.pages.dev';
  const PRODUCTION_API = 'https://pinthop-api.riho-dare.workers.dev';
  
  test('実際のログイン動作確認', async ({ page }) => {
    console.log('🎯 最終ログインテスト開始');
    console.log(`📍 Frontend: ${PRODUCTION_URL}`);
    console.log(`📍 Backend API: ${PRODUCTION_API}`);
    
    // ログインページへ
    await page.goto(`${PRODUCTION_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // スクリーンショット
    await page.screenshot({ path: 'login-page.png' });
    console.log('📸 ログインページのスクリーンショット保存');
    
    // エラーとAPIコールを監視
    const errors: string[] = [];
    let loginApiCalled = false;
    let loginSuccess = false;
    
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        errors.push(text);
        console.log('❌ Console error:', text);
      } else if (text.includes('Login') || text.includes('API')) {
        console.log('📝 Console:', text);
      }
    });
    
    page.on('response', async response => {
      if (response.url().includes('/auth/login')) {
        loginApiCalled = true;
        console.log(`📨 Login API Response: ${response.status()}`);
        console.log(`   URL: ${response.url()}`);
        console.log(`   Headers:`, response.headers());
        
        if (response.ok()) {
          loginSuccess = true;
          try {
            const data = await response.json();
            console.log('✅ ログイン成功!');
            console.log('   Token:', !!data.token);
            console.log('   User:', data.user);
          } catch (e) {
            console.log('   Response parsing error:', e);
          }
        } else {
          try {
            const error = await response.text();
            console.log('❌ Login error response:', error);
          } catch (e) {
            console.log('   Error response parsing failed');
          }
        }
      }
    });
    
    // テストアカウントでログイン
    const testAccount = {
      username: 'testuser1234',
      password: 'Test123!@#'
    };
    
    console.log(`📝 ログイン情報入力: ${testAccount.username}`);
    
    const usernameInput = page.locator('input[type="text"], input[type="email"], input[name*="username"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await usernameInput.fill(testAccount.username);
    await passwordInput.fill(testAccount.password);
    
    // フォーム送信
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /ログイン|Login|Sign In|Submit/i }).first();
    
    console.log('🔄 ログインボタンをクリック...');
    await submitButton.click();
    
    // レスポンスを待つ
    await page.waitForTimeout(5000);
    
    // 結果の分析
    console.log('\n📊 テスト結果:');
    console.log(`- ログインAPI呼び出し: ${loginApiCalled ? '✅' : '❌'}`);
    console.log(`- ログイン成功: ${loginSuccess ? '✅' : '❌'}`);
    console.log(`- エラー数: ${errors.length}`);
    
    if (!loginApiCalled) {
      console.log('\n🔍 APIが呼ばれない原因の調査:');
      
      // 現在のURLを確認
      const currentUrl = page.url();
      console.log(`- 現在のURL: ${currentUrl}`);
      
      // エラーメッセージを探す
      const errorElements = await page.locator('.error, .alert, [class*="error"]').all();
      for (const elem of errorElements) {
        const text = await elem.textContent();
        console.log(`- エラー要素: ${text}`);
      }
      
      // フォームの状態を確認
      const formExists = await page.locator('form').count();
      console.log(`- フォーム数: ${formExists}`);
    }
    
    // ログイン成功の場合
    if (loginSuccess) {
      console.log('\n🎉 ログイン成功の確認:');
      
      // URLの変化を確認
      const newUrl = page.url();
      if (newUrl !== `${PRODUCTION_URL}/login`) {
        console.log(`✅ リダイレクト先: ${newUrl}`);
      }
      
      // ローカルストレージの確認
      const token = await page.evaluate(() => {
        return localStorage.getItem('token') || 
               localStorage.getItem('authToken') || 
               localStorage.getItem('access_token');
      });
      
      if (token) {
        console.log('✅ トークンがローカルストレージに保存されています');
      }
      
      // ユーザー情報の表示確認
      const userElements = await page.locator(`text=${testAccount.username}`).count();
      if (userElements > 0) {
        console.log('✅ ユーザー名が画面に表示されています');
      }
    }
    
    // 最終スクリーンショット
    await page.screenshot({ path: 'login-result.png' });
    console.log('📸 結果画面のスクリーンショット保存');
    
    // アサーション
    expect(loginSuccess).toBe(true);
  });
});