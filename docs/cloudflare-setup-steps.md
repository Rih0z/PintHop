# Cloudflare ウェブサイトでの準備手順

## 🚀 必要な準備作業

### 1. Cloudflare アカウント作成・ログイン
- [cloudflare.com](https://cloudflare.com) でアカウント作成
- ダッシュボードにログイン

### 2. Workers & Pages の設定

#### Backend (Workers) の準備
1. **Workers & Pages** セクションに移動
2. **Workers** タブを選択
3. **Create application** をクリック
4. **Create Worker** を選択
5. Worker名を入力（例：`pinthop-api`）
6. **Deploy** をクリック

#### Frontend (Pages) の準備
1. **Workers & Pages** セクションに移動
2. **Pages** タブを選択
3. **Create application** をクリック
4. **Connect to Git** を選択
5. GitHubアカウントを連携
6. PintHopリポジトリを選択
7. 設定：
   - **Project name**: `pinthop`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
   - **Root directory**: `frontend`

### 3. 環境変数の設定

#### Workers の環境変数
1. Workers ダッシュボードで作成したWorkerを選択
2. **Settings** → **Variables** に移動
3. 以下を追加：

```
MONGODB_URI = "mongodb+srv://username:password@cluster.mongodb.net/pinthop"
JWT_SECRET = "your-super-secret-jwt-key-at-least-32-characters"
CORS_ORIGIN = "https://pinthop.pages.dev"
```

#### Pages の環境変数
1. Pages ダッシュボードで作成したプロジェクトを選択
2. **Settings** → **Environment variables** に移動
3. **Production** タブで以下を追加：

```
REACT_APP_API_URL = "https://pinthop-api.your-subdomain.workers.dev"
REACT_APP_SOCKET_URL = "wss://pinthop-api.your-subdomain.workers.dev"
```

### 4. ドメイン設定（オプション）

#### カスタムドメインを使用する場合
1. **Workers** → **Triggers** → **Custom Domains**
2. `api.yourdomain.com` を追加
3. **Pages** → **Custom domains**
4. `yourdomain.com` を追加

### 5. API トークンの取得（GitHub Actions用）

1. **My Profile** → **API Tokens**
2. **Create Token** をクリック
3. **Custom token** を選択
4. 権限を設定：
   - **Zone:Zone:Read**
   - **Zone:Page Rules:Edit**
   - **Account:Cloudflare Workers:Edit**
   - **Account:Account Settings:Read**
5. **Continue to summary** → **Create Token**
6. トークンをコピーしてGitHubのSecretsに保存

### 6. GitHub Secrets の設定

GitHubリポジトリで以下のSecretsを設定：

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** で以下を追加：

```
CLOUDFLARE_API_TOKEN = "your-api-token-from-step-5"
CLOUDFLARE_ACCOUNT_ID = "your-account-id-from-cloudflare-dashboard"
REACT_APP_API_URL = "https://pinthop-api.your-subdomain.workers.dev"
REACT_APP_SOCKET_URL = "wss://pinthop-api.your-subdomain.workers.dev"
```

### 7. デプロイの確認

#### 手動デプロイ（初回）
```bash
# Backend
cd backend
npm install
wrangler login
npm run deploy

# Frontend は GitHub Actions で自動デプロイ
```

#### 自動デプロイの確認
1. GitHubリポジトリの **Actions** タブを確認
2. mainブランチへのpush時に自動実行される

## 📋 チェックリスト

- [ ] Cloudflareアカウント作成・ログイン完了
- [ ] Workers アプリケーション作成完了
- [ ] Pages プロジェクト作成・GitHub連携完了
- [ ] Workers 環境変数設定完了
- [ ] Pages 環境変数設定完了
- [ ] Cloudflare API トークン取得完了
- [ ] GitHub Secrets 設定完了
- [ ] 初回デプロイ実行完了
- [ ] 自動デプロイ動作確認完了

## 🆘 トラブルシューティング

### よくある問題
1. **MongoDB接続エラー**: MongoDB AtlasでIPホワイトリストに `0.0.0.0/0` を追加
2. **CORS エラー**: Workers の CORS_ORIGIN 設定を確認
3. **ビルドエラー**: GitHub Actions のログを確認
4. **環境変数が反映されない**: Cloudflareダッシュボードで設定を再確認

### サポート
- [Cloudflare Docs](https://developers.cloudflare.com/)
- [Workers Documentation](https://developers.cloudflare.com/workers/)
- [Pages Documentation](https://developers.cloudflare.com/pages/)