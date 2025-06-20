import { test, expect } from '@playwright/test';

/**
 * 本番環境ログイン成功確認テスト
 * 実際にログインが成功するまでテスト
 */
test.describe('ログイン成功確認テスト', () => {
  const PRODUCTION_URL = 'https://6fadaaa2.pinthop-frontend.pages.dev';
  const PRODUCTION_API = 'https://pinthop-api.riho-dare.workers.dev';
  
  // テスト用アカウント情報
  const TEST_ACCOUNTS = [
    { username: 'testuser1234', email: 'testuser1234@example.com', password: 'Test123!@#' },
    { username: 'demouser5678', email: 'demouser5678@example.com', password: 'Demo123!@#' }
  ];

  test('テスト用アカウントの作成とログイン', async ({ page, request }) => {
    console.log('🚀 ログイン成功テスト開始');
    
    for (const account of TEST_ACCOUNTS) {
      console.log(`\n📝 アカウント作成試行: ${account.username}`);
      
      // 1. まずアカウントを作成
      try {
        const registerResponse = await request.post(`${PRODUCTION_API}/api/auth/register`, {
          data: account,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`登録レスポンス: ${registerResponse.status()}`);
        
        if (registerResponse.ok()) {
          console.log('✅ アカウント作成成功');
          const data = await registerResponse.json();
          console.log('トークン受信:', !!data.token);
        } else {
          const error = await registerResponse.text();
          console.log('⚠️ 登録エラー（既存の可能性）:', error);
        }
      } catch (error) {
        console.log('❌ 登録API通信エラー:', error);
      }
      
      // 2. ログインページでUIテスト
      console.log('\n🔐 UIログインテスト開始');
      await page.goto(`${PRODUCTION_URL}/login`);
      await page.waitForLoadState('networkidle');
      
      // コンソールとネットワークを監視
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.log('❌ Console error:', msg.text());
        } else if (msg.type() === 'log' && msg.text().includes('Login')) {
          console.log('📝 Console log:', msg.text());
        }
      });
      
      let loginApiCalled = false;
      let loginSuccess = false;
      
      page.on('response', async response => {
        if (response.url().includes('/auth/login')) {
          loginApiCalled = true;
          console.log(`📨 Login API Response: ${response.status()}`);
          
          if (response.ok()) {
            loginSuccess = true;
            const data = await response.json();
            console.log('✅ ログインレスポンス成功');
            console.log('Token:', !!data.token);
          } else {
            const error = await response.text();
            console.log('❌ ログインレスポンスエラー:', error);
          }
        }
      });
      
      // ログインフォームに入力
      const usernameInput = page.locator('input[type="text"], input[type="email"], input[name*="username"], input[name*="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      
      await usernameInput.fill(account.username);
      await passwordInput.fill(account.password);
      console.log('✅ 認証情報入力完了');
      
      // 送信ボタンをクリック
      const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /ログイン|Login|Sign In|Submit/i }).first();
      await submitButton.click();
      console.log('🔄 ログインボタンクリック');
      
      // レスポンスを待つ
      await page.waitForTimeout(3000);
      
      // 結果の確認
      if (loginSuccess) {
        console.log('🎉 ログイン成功！');
        
        // ダッシュボードへのリダイレクトを確認
        const currentUrl = page.url();
        if (currentUrl.includes('/dashboard') || !currentUrl.includes('/login')) {
          console.log('✅ ダッシュボードにリダイレクトされました');
        }
        
        // ユーザー情報が表示されているか確認
        const userInfo = await page.locator('text=' + account.username).count();
        if (userInfo > 0) {
          console.log('✅ ユーザー情報が表示されています');
        }
        
        return; // 成功したらテスト終了
      } else if (!loginApiCalled) {
        console.log('❌ ログインAPIが呼ばれませんでした');
      }
      
      // エラーメッセージの確認
      const errorMessage = await page.locator('.error, .alert, [class*="error"], [class*="alert"]').textContent().catch(() => null);
      if (errorMessage) {
        console.log('❌ エラーメッセージ:', errorMessage);
      }
    }
    
    // 最終確認
    expect(loginSuccess).toBe(true);
  });

  test('直接APIでのログインテスト', async ({ request }) => {
    console.log('🔍 直接APIログインテスト');
    
    for (const account of TEST_ACCOUNTS) {
      console.log(`\nテスト: ${account.username}`);
      
      try {
        const response = await request.post(`${PRODUCTION_API}/api/auth/login`, {
          data: {
            username: account.username,
            password: account.password
          },
          headers: {
            'Content-Type': 'application/json',
            'Origin': PRODUCTION_URL
          }
        });
        
        console.log(`Response: ${response.status()}`);
        
        if (response.ok()) {
          const data = await response.json();
          console.log('✅ ログイン成功');
          console.log('Token:', data.token?.substring(0, 20) + '...');
          expect(data.token).toBeTruthy();
          return; // 成功
        } else {
          const error = await response.text();
          console.log('❌ ログイン失敗:', error);
        }
      } catch (error) {
        console.log('❌ API通信エラー:', error);
      }
    }
    
    throw new Error('全てのアカウントでログインに失敗しました');
  });

  test('ログイン後の機能確認', async ({ page }) => {
    console.log('🔧 ログイン後の機能確認');
    
    // 最初のテストアカウントでログイン
    const account = TEST_ACCOUNTS[0];
    
    await page.goto(`${PRODUCTION_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // ログイン実行
    const usernameInput = page.locator('input[type="text"], input[type="email"], input[name*="username"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await usernameInput.fill(account.username);
    await passwordInput.fill(account.password);
    
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /ログイン|Login|Sign In|Submit/i }).first();
    await submitButton.click();
    
    // ログイン完了を待つ
    await page.waitForTimeout(3000);
    
    // 認証が必要なAPIへのアクセステスト
    const currentUrl = page.url();
    if (!currentUrl.includes('/login')) {
      console.log('✅ ログインページから遷移しました');
      
      // ナビゲーションメニューの確認
      const navItems = await page.locator('nav a, header a').count();
      console.log(`📊 ナビゲーション項目数: ${navItems}`);
      
      // ログアウトボタンの確認
      const logoutButton = await page.locator('button, a').filter({ hasText: /ログアウト|Logout|Sign Out/i }).count();
      if (logoutButton > 0) {
        console.log('✅ ログアウトボタンが表示されています');
      }
      
      // APIトークンがlocalStorageに保存されているか確認
      const token = await page.evaluate(() => {
        return localStorage.getItem('token') || localStorage.getItem('authToken');
      });
      
      if (token) {
        console.log('✅ 認証トークンが保存されています');
      } else {
        console.log('⚠️ 認証トークンが見つかりません');
      }
    } else {
      console.log('❌ まだログインページにいます');
      throw new Error('ログインに失敗しました');
    }
  });
});