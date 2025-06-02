# Cloudflare Pages Deployment Guide

## PintHop Frontend Deployment Instructions

### 1. 自動設定（推奨）

#### GitHub Integration
1. Cloudflare Pages ダッシュボードを開く
2. "Create a project" をクリック
3. "Connect to Git" を選択
4. GitHubアカウントを接続
5. `PintHop` リポジトリを選択

#### Build Settings
- **Framework preset**: `Create React App`
- **Build command**: `cd frontend && npm ci && npm run build`
- **Build output directory**: `frontend/build`
- **Node.js version**: `18`

#### Environment Variables
```
NODE_VERSION=18
REACT_APP_API_URL=https://api.pinthop.com
```

### 2. 手動デプロイ（代替方法）

#### 前提条件
```bash
npm install -g wrangler
wrangler login
```

#### デプロイ手順
```bash
# 1. プロジェクトルートで
cd /Users/kokiriho/Documents/Projects/PintHop/PintHop

# 2. フロントエンドをビルド
cd frontend
npm ci
npm run build

# 3. Cloudflare Pagesにデプロイ
npx wrangler pages deploy build --project-name pinthop-frontend

# または、初回デプロイの場合
npx wrangler pages project create pinthop-frontend
npx wrangler pages deploy build --project-name pinthop-frontend
```

### 3. 設定ファイル (.cloudflare-pages.toml)

プロジェクトルートに既に作成済み：
- ビルドコマンド: `cd frontend && npm ci && npm run build`
- 出力ディレクトリ: `frontend/build`
- SPA リダイレクト設定: `/* -> /index.html`
- セキュリティヘッダー設定済み

### 4. カスタムドメイン設定

#### DNS設定 (optional)
```
Type: CNAME
Name: pinthop
Target: pinthop-frontend.pages.dev
```

### 5. Environment Variables (必須)

Cloudflare Pages ダッシュボードで設定：
```
REACT_APP_API_URL=https://api.pinthop.com
NODE_VERSION=18
```

### 6. トラブルシューティング

#### タイムアウト対策
1. **ブラウザを変更**: Chrome/Firefox/Safari を試す
2. **VPN/プロキシを無効化**
3. **キャッシュクリア**: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)
4. **手動デプロイ**: 上記のWranglerコマンドを使用
5. **段階的設定**: リポジトリ接続 → ビルド設定 → 環境変数を個別に設定

#### よくある問題
- **Build fails**: Node.js version を18に設定
- **SPA routing error**: Redirects設定を確認 (`/* -> /index.html`)
- **API calls fail**: REACT_APP_API_URL 環境変数を確認

### 7. デプロイ後の確認

1. **URL**: https://pinthop-frontend.pages.dev
2. **ビルド状況**: Cloudflare Pages ダッシュボード
3. **ログ確認**: デプロイメントログでエラーチェック

### 8. 継続的デプロイメント

GitHubプッシュ時の自動デプロイが有効化されます：
- `main` ブランチ → Production
- その他のブランチ → Preview