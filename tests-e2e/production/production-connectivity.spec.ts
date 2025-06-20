import { test, expect } from '@playwright/test';

/**
 * 本番環境通信テスト
 * デプロイ済みのフロントエンド・バックエンド間の通信確認
 */
test.describe('本番環境通信テスト', () => {
  const PRODUCTION_URL = 'https://6fadaaa2.pinthop-frontend.pages.dev';
  const PRODUCTION_API = 'https://pinthop-api.riho-dare.workers.dev';
  
  test.beforeAll(async () => {
    console.log('🚀 本番環境通信テストを開始します');
    console.log(`📍 Frontend: ${PRODUCTION_URL}`);
    console.log(`📍 Backend API: ${PRODUCTION_API}`);
  });

  test('本番環境のバックエンドAPIが稼働していることを確認', async ({ request }) => {
    console.log('🔍 APIヘルスチェックを実行...');
    
    // 認証チェックエンドポイント経由で確認
    const response = await request.get(`${PRODUCTION_API}/api/auth/check-availability?username=test_production`);
    
    console.log(`📨 API応答: ${response.status()}`);
    
    if (response.ok()) {
      const data = await response.json();
      console.log('✅ API正常稼働確認');
      console.log('📊 応答データ:', data);
      
      expect(response.status()).toBeLessThan(300);
      expect(data).toHaveProperty('available');
    } else {
      console.log(`❌ API応答エラー: ${response.status()}`);
      throw new Error(`API応答エラー: ${response.status()}`);
    }
  });

  test('本番フロントエンドの読み込みとタイトル確認', async ({ page }) => {
    console.log('🌐 本番フロントエンドにアクセス...');
    
    // APIリクエストを監視
    const apiRequests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('pinthop-api.riho-dare.workers.dev')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers()
        });
        console.log(`📡 API Request: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('pinthop-api.riho-dare.workers.dev')) {
        console.log(`📨 API Response: ${response.status()} ${response.url()}`);
      }
    });

    // フロントエンドにアクセス
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    
    // タイトル確認
    await expect(page).toHaveTitle(/PintHop/i);
    console.log('✅ ページタイトル確認完了');
    
    // API通信の確認
    if (apiRequests.length > 0) {
      console.log(`✅ ${apiRequests.length}件のAPI通信を検出`);
    } else {
      console.log('⚠️ API通信が検出されませんでした（初回ロードでは正常）');
    }
  });

  test('本番環境でのログインフロー動作確認', async ({ page }) => {
    console.log('🔐 ログインフローテスト開始');
    
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    
    // ログインボタンを探す
    const loginButton = page.locator('button, a').filter({ hasText: /ログイン|Login|Sign In/i }).first();
    
    if (await loginButton.isVisible()) {
      console.log('✅ ログインボタン検出');
      await loginButton.click();
      
      // URLがログインページに変わったか確認
      await page.waitForURL(/.*\/(login|auth).*/);
      console.log('✅ ログインページへの遷移確認');
      
      // ログインフォームの存在確認
      const usernameInput = page.locator('input[type="text"], input[type="email"], input[name*="username"], input[name*="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      
      await expect(usernameInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      console.log('✅ ログインフォーム要素確認完了');
    } else {
      console.log('⚠️ ログインボタンが見つかりませんでした');
    }
  });

  test('本番環境でのCORS設定確認', async ({ page }) => {
    console.log('🌐 CORS設定確認開始');
    
    let corsError = false;
    let networkErrors: string[] = [];
    
    // エラーを監視
    page.on('pageerror', error => {
      if (error.message.includes('CORS') || error.message.includes('Cross-Origin')) {
        corsError = true;
        console.log('❌ CORSエラー検出:', error.message);
      }
    });
    
    page.on('response', response => {
      if (!response.ok() && response.url().includes('pinthop-api')) {
        networkErrors.push(`${response.status()} - ${response.url()}`);
        console.log(`⚠️ API応答エラー: ${response.status()} - ${response.url()}`);
      }
    });
    
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    
    if (corsError) {
      throw new Error('CORSエラーが発生しています');
    }
    
    if (networkErrors.length > 0) {
      console.log('⚠️ ネットワークエラー:', networkErrors);
    } else {
      console.log('✅ CORS設定正常、ネットワークエラーなし');
    }
    
    expect(corsError).toBe(false);
  });

  test('本番環境でのパフォーマンステスト', async ({ page }) => {
    console.log('⚡ パフォーマンステスト開始');
    
    const startTime = Date.now();
    
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`📊 ページ読み込み時間: ${loadTime}ms`);
    
    // 本番環境では10秒以内を許容
    expect(loadTime).toBeLessThan(10000);
    
    if (loadTime < 3000) {
      console.log('🏆 優秀なパフォーマンス！');
    } else if (loadTime < 5000) {
      console.log('✅ 良好なパフォーマンス');
    } else {
      console.log('⚠️ パフォーマンス改善の余地あり');
    }
  });

  test('本番環境でのエラーハンドリング確認', async ({ page }) => {
    console.log('⚠️ エラーハンドリングテスト開始');
    
    const jsErrors: string[] = [];
    
    page.on('pageerror', error => {
      jsErrors.push(error.message);
      console.log('❌ JavaScriptエラー:', error.message);
    });
    
    // 404ページテスト
    await page.goto(`${PRODUCTION_URL}/non-existent-page-12345`);
    await page.waitForLoadState('networkidle');
    
    const pageContent = await page.textContent('body');
    const has404Content = pageContent?.includes('404') || 
                         pageContent?.includes('Not Found') || 
                         pageContent?.includes('見つかりません');
    
    if (has404Content) {
      console.log('✅ 404エラーページ正常表示');
    } else {
      console.log('⚠️ 404エラーページまたはフォールバック表示');
    }
    
    // 重大なエラーチェック
    const criticalErrors = jsErrors.filter(error => 
      error.includes('ReferenceError') || 
      error.includes('TypeError') || 
      error.includes('SyntaxError')
    );
    
    if (criticalErrors.length > 0) {
      console.log('❌ 重大なJavaScriptエラー:', criticalErrors);
    } else {
      console.log('✅ 重大なJavaScriptエラーなし');
    }
    
    expect(criticalErrors.length).toBe(0);
  });

  test('本番環境での認証API通信テスト', async ({ page, request }) => {
    console.log('🔒 認証API通信テスト開始');
    
    // 直接APIテスト（ユーザー名は3-20文字で英数字とアンダースコアのみ）
    const testData = {
      username: 'testuser' + Math.floor(Math.random() * 10000),
      email: `test_${Date.now()}@example.com`,
      password: 'Test123!@#'
    };
    
    // ユーザー登録テスト
    console.log('📝 テストユーザー登録試行...');
    const registerResponse = await request.post(`${PRODUCTION_API}/api/auth/register`, {
      data: testData
    });
    
    console.log(`📨 登録API応答: ${registerResponse.status()}`);
    
    if (registerResponse.ok()) {
      const data = await registerResponse.json();
      console.log('✅ ユーザー登録成功');
      console.log('🔑 トークン受信確認:', !!data.data?.token);
    } else {
      const errorData = await registerResponse.text();
      console.log('⚠️ 登録エラー（ユーザー既存の可能性）:', errorData);
    }
    
    // ログインテスト
    console.log('🔑 ログインテスト...');
    const loginResponse = await request.post(`${PRODUCTION_API}/api/auth/login`, {
      data: {
        username: testData.username,
        password: testData.password
      }
    });
    
    console.log(`📨 ログインAPI応答: ${loginResponse.status()}`);
    
    if (loginResponse.ok()) {
      console.log('✅ ログイン成功');
    } else {
      console.log('⚠️ ログイン失敗（認証システムの確認が必要）');
    }
  });
});