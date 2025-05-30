# Cloudflare Deployment Guide

## Prerequisites

1. Cloudflareアカウント
2. Wrangler CLI: `npm install -g wrangler`
3. Node.js 18以上

## Backend (Cloudflare Workers) デプロイ

### 1. 初期設定

```bash
# Wranglerにログイン
wrangler login

# バックエンドディレクトリに移動
cd backend

# 依存関係をインストール
npm install
```

### 2. 環境変数の設定

Cloudflareダッシュボードで以下の環境変数を設定：

- `MONGODB_URI`: MongoDB Atlas接続文字列
- `JWT_SECRET`: ランダムな秘密鍵
- `CORS_ORIGIN`: フロントエンドのURL (例: https://pinthop.pages.dev)

```bash
# または、CLIで設定
wrangler secret put MONGODB_URI
wrangler secret put JWT_SECRET
wrangler secret put CORS_ORIGIN
```

### 3. デプロイ

```bash
# ビルド
npm run build:worker

# デプロイ
npm run deploy
```

## Frontend (Cloudflare Pages) デプロイ

### 1. ビルド

```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存関係をインストール
npm install

# プロダクションビルド
npm run build
```

### 2. Cloudflare Pagesでデプロイ

#### Option A: Wrangler CLIを使用

```bash
# Pagesプロジェクトを作成
wrangler pages project create pinthop

# デプロイ
wrangler pages deploy build --project-name=pinthop
```

#### Option B: GitHubと連携

1. GitHubにコードをプッシュ
2. Cloudflareダッシュボードで新しいPagesプロジェクトを作成
3. GitHubリポジトリと連携
4. ビルド設定：
   - Build command: `npm run build`
   - Build output directory: `build`
   - Root directory: `frontend`

### 3. 環境変数

Cloudflare Pagesダッシュボードで設定：
- `REACT_APP_API_URL`: Workers APIのURL
- `REACT_APP_SOCKET_URL`: WebSocket URL

## カスタムドメイン設定

### Backend (Workers)
1. Cloudflareダッシュボード → Workers → ルート
2. `api.pinthop.com/*` を追加

### Frontend (Pages)
1. Cloudflareダッシュボード → Pages → カスタムドメイン
2. `pinthop.com` と `www.pinthop.com` を追加

## セキュリティチェックリスト

- [ ] `.env`ファイルがgitignoreに含まれている
- [ ] APIキーがハードコードされていない
- [ ] CORS設定が適切
- [ ] 認証が必要なエンドポイントが保護されている
- [ ] HTTPSが強制されている

## トラブルシューティング

### MongoDB接続エラー
- MongoDB AtlasでIPホワイトリストに`0.0.0.0/0`を追加（開発時のみ）
- 本番環境では特定のCloudflare IPを許可

### CORS エラー
- `wrangler.toml`のCORS設定を確認
- Cloudflareダッシュボードで環境変数を確認

### ビルドエラー
- Node.jsバージョンを確認（18以上）
- `node_modules`を削除して再インストール

## 監視とログ

- Cloudflareダッシュボード → Workers → ログ
- リアルタイムログ: `wrangler tail`