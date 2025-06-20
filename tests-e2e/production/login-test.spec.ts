import { test, expect } from '@playwright/test';

/**
 * 本番環境ログイン機能詳細テスト
 * Network Errorの原因を特定し、ログインが成功するまでテスト
 */
test.describe('本番環境ログインテスト', () => {
  const PRODUCTION_URL = 'https://6fadaaa2.pinthop-frontend.pages.dev';
  const PRODUCTION_API = 'https://pinthop-api.riho-dare.workers.dev';
  
  test.beforeAll(async () => {
    console.log('🔐 ログイン機能の詳細テストを開始');
    console.log(`📍 Frontend: ${PRODUCTION_URL}`);
    console.log(`📍 Backend API: ${PRODUCTION_API}`);
  });

  test('ログインページのUI要素確認', async ({ page }) => {
    console.log('📋 ログインページのUI要素を確認');
    
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    
    // ログインボタンをクリック
    const loginButton = page.locator('button, a').filter({ hasText: /ログイン|Login|Sign In/i }).first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.waitForURL(/.*\/(login|auth).*/);
      console.log('✅ ログインページに遷移');
    } else {
      // 直接ログインページへ
      await page.goto(`${PRODUCTION_URL}/login`);
      console.log('📍 直接ログインページにアクセス');
    }
    
    // フォーム要素の確認
    const usernameInput = page.locator('input[type="text"], input[type="email"], input[name*="username"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /ログイン|Login|Sign In|Submit/i }).first();
    
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    console.log('✅ ログインフォーム要素が全て存在');
  });

  test('API直接テスト - ログインエンドポイント', async ({ request }) => {
    console.log('🔍 API直接テスト開始');
    
    const testCredentials = {
      username: 'testuser',
      password: 'Test123!@#'
    };
    
    try {
      // APIエンドポイントの確認
      console.log(`📡 Testing: POST ${PRODUCTION_API}/api/auth/login`);
      
      const response = await request.post(`${PRODUCTION_API}/api/auth/login`, {
        data: testCredentials,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`📨 Response status: ${response.status()}`);
      console.log(`📨 Response headers:`, response.headers());
      
      const responseText = await response.text();
      console.log(`📨 Response body:`, responseText);
      
      if (response.ok()) {
        const data = JSON.parse(responseText);
        console.log('✅ ログインAPI正常応答');
        console.log('🔑 Token received:', !!data.token);
      } else {
        console.log('❌ ログインAPI失敗');
        console.log('Error response:', responseText);
      }
    } catch (error) {
      console.error('❌ API通信エラー:', error);
    }
  });

  test('実際のログインフロー完全テスト', async ({ page }) => {
    console.log('🚀 実際のログインフローテスト');
    
    // ネットワークリクエストを監視
    const apiCalls: any[] = [];
    const errors: string[] = [];
    
    page.on('request', request => {
      if (request.url().includes('/api/') || request.url().includes('auth')) {
        console.log(`📡 Request: ${request.method()} ${request.url()}`);
        console.log(`   Headers:`, request.headers());
        if (request.postData()) {
          console.log(`   Body:`, request.postData());
        }
        apiCalls.push({
          method: request.method(),
          url: request.url(),
          headers: request.headers(),
          body: request.postData()
        });
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/') || response.url().includes('auth')) {
        console.log(`📨 Response: ${response.status()} ${response.url()}`);
        if (!response.ok() && response.status() !== 404) {
          errors.push(`${response.status()} - ${response.url()}`);
        }
      }
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 Console error:', msg.text());
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('❌ Page error:', error.message);
      errors.push(error.message);
    });
    
    // ログインページへ移動
    await page.goto(`${PRODUCTION_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // テスト用の認証情報を入力
    const usernameInput = page.locator('input[type="text"], input[type="email"], input[name*="username"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await usernameInput.fill('testuser');
    await passwordInput.fill('Test123!@#');
    console.log('✅ 認証情報入力完了');
    
    // フォーム送信
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /ログイン|Login|Sign In|Submit/i }).first();
    
    // 送信前にネットワーク待機の準備
    const loginPromise = page.waitForResponse(response => 
      response.url().includes('/auth/login') || response.url().includes('/login')
    , { timeout: 30000 }).catch(() => null);
    
    await submitButton.click();
    console.log('🔄 ログインボタンクリック');
    
    // レスポンスを待つ
    const loginResponse = await loginPromise;
    
    if (loginResponse) {
      console.log(`✅ ログインレスポンス受信: ${loginResponse.status()}`);
      const responseBody = await loginResponse.text();
      console.log('Response body:', responseBody);
    } else {
      console.log('⚠️ ログインレスポンスがタイムアウト');
    }
    
    // エラーメッセージの確認
    await page.waitForTimeout(2000);
    const errorMessage = page.locator('.error, .alert, [class*="error"], [class*="alert"]').first();
    if (await errorMessage.isVisible()) {
      const errorText = await errorMessage.textContent();
      console.log('❌ エラーメッセージ表示:', errorText);
    }
    
    // 結果の分析
    console.log('\n📊 テスト結果分析:');
    console.log(`- API呼び出し数: ${apiCalls.length}`);
    console.log(`- エラー数: ${errors.length}`);
    
    if (apiCalls.length === 0) {
      console.log('❌ APIが呼ばれていません - フロントエンドの設定問題の可能性');
    }
    
    if (errors.length > 0) {
      console.log('❌ エラー詳細:');
      errors.forEach(err => console.log(`  - ${err}`));
    }
    
    // Network Errorの具体的な原因を特定
    const networkErrors = errors.filter(err => 
      err.includes('Network') || 
      err.includes('fetch') || 
      err.includes('CORS') ||
      err.includes('ERR_')
    );
    
    if (networkErrors.length > 0) {
      console.log('\n🔍 Network Error詳細:');
      networkErrors.forEach(err => console.log(`  - ${err}`));
    }
  });

  test('フロントエンドの環境変数確認', async ({ page }) => {
    console.log('🔧 フロントエンドの環境変数を確認');
    
    await page.goto(PRODUCTION_URL);
    
    // コンソールから環境変数を取得
    const apiUrl = await page.evaluate(() => {
      // @ts-ignore
      return window.process?.env?.REACT_APP_API_URL || 'Not found';
    });
    
    console.log('📍 Frontend API URL設定:', apiUrl);
    
    // auth.tsファイルの実際のAPI URLを確認
    const actualApiUrl = await page.evaluate(async () => {
      try {
        // login関数を探す
        // @ts-ignore
        if (window.login) {
          return 'Found login function';
        }
        return 'Login function not found in window';
      } catch (err) {
        return err.message;
      }
    });
    
    console.log('🔍 実際のAPI設定:', actualApiUrl);
  });

  test('CORSとセキュリティヘッダーの確認', async ({ request }) => {
    console.log('🔒 CORS設定の詳細確認');
    
    // プリフライトリクエストのテスト
    const preflightResponse = await request.fetch(`${PRODUCTION_API}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': PRODUCTION_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
      }
    });
    
    console.log('📨 Preflight response:', preflightResponse.status());
    console.log('Headers:', preflightResponse.headers());
    
    const corsHeaders = {
      'access-control-allow-origin': preflightResponse.headers()['access-control-allow-origin'],
      'access-control-allow-methods': preflightResponse.headers()['access-control-allow-methods'],
      'access-control-allow-headers': preflightResponse.headers()['access-control-allow-headers'],
      'access-control-allow-credentials': preflightResponse.headers()['access-control-allow-credentials']
    };
    
    console.log('🔍 CORS Headers:', corsHeaders);
    
    if (corsHeaders['access-control-allow-origin'] !== PRODUCTION_URL && 
        corsHeaders['access-control-allow-origin'] !== '*') {
      console.log('❌ CORS設定が正しくありません');
      console.log(`期待値: ${PRODUCTION_URL}`);
      console.log(`実際: ${corsHeaders['access-control-allow-origin']}`);
    } else {
      console.log('✅ CORS設定正常');
    }
  });
});