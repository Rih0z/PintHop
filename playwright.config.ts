import { defineConfig, devices } from '@playwright/test';

/**
 * PintHop Playwright MCP Configuration
 * フロントエンド・バックエンド間の通信テストを自動化
 */
export default defineConfig({
  // テストディレクトリ
  testDir: './tests-e2e',
  
  // 並列実行設定
  fullyParallel: true,
  
  // CI環境でのテスト失敗時の動作
  forbidOnly: !!process.env.CI,
  
  // CI環境でのリトライ設定
  retries: process.env.CI ? 2 : 0,
  
  // ワーカー数
  workers: process.env.CI ? 1 : undefined,
  
  // レポーター設定
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // 共通設定
  use: {
    // ベースURL
    baseURL: 'http://localhost:3000',
    
    // トレース設定
    trace: 'on-first-retry',
    
    // スクリーンショット設定
    screenshot: 'only-on-failure',
    
    // ビデオ設定
    video: 'retain-on-failure',
    
    // ヘッドレスモード
    headless: true,
    
    // ブラウザの言語設定
    locale: 'ja-JP',
    
    // タイムゾーン設定
    timezoneId: 'Asia/Tokyo',
  },

  // プロジェクト設定（複数ブラウザでのテスト）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // ローカル開発サーバー設定
  webServer: [
    {
      command: 'cd frontend && npm start',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: 'cd backend && PORT=5001 npm run dev',
      port: 5001,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    }
  ]
});