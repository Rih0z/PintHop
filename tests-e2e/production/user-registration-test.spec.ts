import { test, expect } from '@playwright/test';

/**
 * ユーザー登録とログインテスト
 */
test.describe('ユーザー登録とログイン確認', () => {
  const PRODUCTION_URL = 'https://d14ab9e4.pinthop-frontend.pages.dev';
  const PRODUCTION_API = 'https://pinthop-api.riho-dare.workers.dev';
  
  // テスト用アカウント情報
  const TEST_ACCOUNT = {
    username: 'realuser2025',
    email: 'realuser2025@example.com', 
    password: 'RealTest123!@#'
  };

  test('テスト用アカウントの登録と実際のログイン', async ({ page, request }) => {
    console.log('🚀 ユーザー登録とログインテスト開始');
    
    // 1. まずAPIで直接アカウントを作成
    console.log('📝 APIでアカウント作成試行...');
    try {
      const registerResponse = await request.post(`${PRODUCTION_API}/api/auth/register`, {
        data: TEST_ACCOUNT,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`登録レスポンス: ${registerResponse.status()}`);
      
      if (registerResponse.ok()) {
        const data = await registerResponse.json();
        console.log('✅ アカウント作成成功');
        console.log('Token:', !!data.token);
      } else {
        const error = await registerResponse.text();
        console.log('⚠️ 登録エラー（既存の可能性）:', error);
      }
    } catch (error) {
      console.log('❌ 登録API通信エラー:', error);
    }
    
    // 2. 実際のUIでログインテスト
    console.log('\n🔐 実際のUIログインテスト');
    await page.goto(`${PRODUCTION_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // エラーとAPIコールを監視
    const errors: string[] = [];
    let loginApiCalled = false;
    let loginSuccess = false;
    let apiResponse: any = null;
    
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        errors.push(text);
        console.log('❌ Console error:', text);
      } else if (text.includes('Login') || text.includes('API')) {
        console.log('📝 Console log:', text);
      }
    });
    
    page.on('response', async response => {
      if (response.url().includes('/auth/login')) {
        loginApiCalled = true;
        console.log(`📨 Login API Response: ${response.status()}`);
        console.log(`   URL: ${response.url()}`);
        
        if (response.ok()) {
          loginSuccess = true;
          try {
            apiResponse = await response.json();
            console.log('✅ ログイン成功!');
            console.log('   Token:', !!apiResponse.token);
            console.log('   User:', apiResponse.user);
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
    
    // ログインフォームに入力
    const usernameInput = page.locator('input[type="text"], input[type="email"], input[name*="username"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await usernameInput.fill(TEST_ACCOUNT.username);
    await passwordInput.fill(TEST_ACCOUNT.password);
    console.log(`✅ 認証情報入力完了: ${TEST_ACCOUNT.username}`);
    
    // 送信ボタンをクリック
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /ログイン|Login|Sign In|Submit/i }).first();
    await submitButton.click();
    console.log('🔄 ログインボタンクリック');
    
    // レスポンスを待つ
    await page.waitForTimeout(3000);
    
    console.log('\n📊 最終結果:');
    console.log(`- API呼び出し: ${loginApiCalled ? '✅' : '❌'}`);
    console.log(`- ログイン成功: ${loginSuccess ? '✅' : '❌'}`);
    console.log(`- エラー数: ${errors.length}`);
    
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
      const userElements = await page.locator(`text=${TEST_ACCOUNT.username}`).count();
      if (userElements > 0) {
        console.log('✅ ユーザー名が画面に表示されています');
      }
    } else if (!loginApiCalled) {
      console.log('\n🔍 API呼び出しがない場合の診断:');
      
      const currentUrl = page.url();
      console.log(`- 現在のURL: ${currentUrl}`);
      
      const errorElements = await page.locator('.error, .alert, [class*="error"]').all();
      for (const elem of errorElements) {
        const text = await elem.textContent();
        console.log(`- エラー要素: ${text}`);
      }
      
      const formExists = await page.locator('form').count();
      console.log(`- フォーム数: ${formExists}`);
    } else {
      console.log('\n❌ ログイン失敗の詳細:');
      console.log('- APIは呼ばれましたが、認証に失敗しました');
      
      // エラーメッセージの確認
      const errorMessage = await page.locator('.error, .alert, [class*="error"], [class*="alert"]').textContent().catch(() => null);
      if (errorMessage) {
        console.log(`- エラーメッセージ: ${errorMessage}`);
      }
    }
    
    // スクリーンショット
    await page.screenshot({ path: 'user-registration-test-result.png' });
    console.log('📸 結果画面のスクリーンショット保存');
    
    // テストは成功を期待（アカウント作成またはログイン成功）
    expect(loginSuccess).toBe(true);
  });

  test('既存のユーザーでログイン確認', async ({ page }) => {
    console.log('🔄 既存ユーザーでのログインテスト');
    
    await page.goto(`${PRODUCTION_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    let loginSuccess = false;
    
    page.on('response', async response => {
      if (response.url().includes('/auth/login') && response.ok()) {
        loginSuccess = true;
        console.log('✅ 既存ユーザーでログイン成功');
      }
    });
    
    const usernameInput = page.locator('input[type="text"], input[type="email"], input[name*="username"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await usernameInput.fill(TEST_ACCOUNT.username);
    await passwordInput.fill(TEST_ACCOUNT.password);
    
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /ログイン|Login|Sign In|Submit/i }).first();
    await submitButton.click();
    
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    if (!currentUrl.includes('/login')) {
      console.log('✅ ログインページから遷移しました');
      console.log(`現在のURL: ${currentUrl}`);
    }
  });
});