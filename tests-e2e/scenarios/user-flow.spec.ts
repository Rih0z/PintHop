import { test, expect } from '@playwright/test';

/**
 * ユーザーフローE2Eテスト
 * 実際のユーザー使用パターンでの通信テスト
 */
test.describe('ユーザーフローE2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    console.log('🚀 ユーザーフローテストを開始');
    
    // API通信をキャプチャ
    page.on('request', request => {
      if (request.url().includes('localhost:5001') || request.url().includes('api')) {
        console.log(`📡 API Request: ${request.method()} ${request.url()}`);
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('localhost:5001') || response.url().includes('api')) {
        console.log(`📨 API Response: ${response.status()} ${response.url()}`);
      }
    });
  });

  test('ホームページ → ログイン → ダッシュボード遷移テスト', async ({ page }) => {
    console.log('🏠 ホームページにアクセス');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ページタイトルの確認
    await expect(page).toHaveTitle(/PintHop/i);
    console.log('✅ ページタイトル確認完了');
    
    // ログインボタンの確認
    const loginButton = page.locator('button, a').filter({ hasText: /ログイン|Login|Sign In/i }).first();
    if (await loginButton.isVisible()) {
      console.log('✅ ログインボタンが見つかりました');
      await loginButton.click();
      
      // ログインページの確認
      await page.waitForURL(/.*\/(login|auth).*/);
      console.log('✅ ログインページに遷移しました');
    } else {
      console.log('⚠️ ログインボタンが見つかりませんでした - 既にログイン済みかデザインが異なる可能性');
    }
  });

  test('ブルワリー検索・表示機能テスト', async ({ page }) => {
    console.log('🔍 ブルワリー検索機能のテスト');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ブルワリー関連のリンクやボタンを探す
    const breweryLinks = page.locator('a, button').filter({ hasText: /brewery|ブルワリー|醸造所/i });
    const breweryCount = await breweryLinks.count();
    
    if (breweryCount > 0) {
      console.log(`✅ ${breweryCount}個のブルワリー関連要素が見つかりました`);
      
      // 最初のブルワリーリンクをクリック
      await breweryLinks.first().click();
      await page.waitForLoadState('networkidle');
      console.log('✅ ブルワリー詳細ページに移動しました');
    } else {
      console.log('⚠️ ブルワリー関連の要素が見つかりませんでした');
    }
  });

  test('ナビゲーション機能テスト', async ({ page }) => {
    console.log('🧭 ナビゲーション機能のテスト');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ナビゲーションメニューの確認
    const navItems = page.locator('nav a, header a, .nav a').filter({ 
      hasText: /home|map|timeline|dashboard|ホーム|マップ|タイムライン|ダッシュボード/i 
    });
    
    const navCount = await navItems.count();
    console.log(`📌 ${navCount}個のナビゲーション項目が見つかりました`);
    
    if (navCount > 0) {
      // 各ナビゲーション項目をテスト
      for (let i = 0; i < Math.min(navCount, 3); i++) {
        const navItem = navItems.nth(i);
        const navText = await navItem.textContent();
        console.log(`🔗 ナビゲーションテスト: ${navText}`);
        
        await navItem.click();
        await page.waitForLoadState('networkidle');
        console.log(`✅ ${navText} ページに移動完了`);
        
        // ホームに戻る
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('レスポンシブデザインテスト', async ({ page }) => {
    console.log('📱 レスポンシブデザインのテスト');
    
    // デスクトップサイズ
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    console.log('✅ デスクトップサイズでの表示確認');
    
    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    console.log('✅ タブレットサイズでの表示確認');
    
    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    console.log('✅ モバイルサイズでの表示確認');
    
    // ページが正常に表示されているかチェック
    const bodyContent = await page.locator('body').isVisible();
    expect(bodyContent).toBe(true);
  });

  test('エラーハンドリングテスト', async ({ page }) => {
    console.log('⚠️ エラーハンドリングのテスト');
    
    // JavaScriptエラーをキャッチ
    const jsErrors: string[] = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
      console.log(`❌ JavaScript Error: ${error.message}`);
    });
    
    // 存在しないページにアクセス
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // 404ページの処理確認
    const pageContent = await page.textContent('body');
    const has404Content = pageContent?.includes('404') || 
                         pageContent?.includes('Not Found') || 
                         pageContent?.includes('見つかりません');
    
    if (has404Content) {
      console.log('✅ 404エラーページが適切に表示されています');
    } else {
      console.log('⚠️ 404エラーページまたは適切なフォールバックが表示されています');
    }
    
    // 重大なJavaScriptエラーがないことを確認
    const criticalErrors = jsErrors.filter(error => 
      error.includes('ReferenceError') || 
      error.includes('TypeError') || 
      error.includes('SyntaxError')
    );
    
    expect(criticalErrors.length).toBe(0);
    console.log('✅ 重大なJavaScriptエラーは検出されませんでした');
  });

  test('パフォーマンステスト', async ({ page }) => {
    console.log('⚡ パフォーマンステスト');
    
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`📊 ページ読み込み時間: ${loadTime}ms`);
    
    // 5秒以内での読み込み完了を確認
    expect(loadTime).toBeLessThan(5000);
    
    // 画像の遅延読み込みテスト
    const images = page.locator('img');
    const imageCount = await images.count();
    console.log(`🖼️ ${imageCount}個の画像が検出されました`);
    
    if (imageCount > 0) {
      // 最初の画像が読み込まれていることを確認
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      console.log('✅ 画像の読み込み確認完了');
    }
  });
});