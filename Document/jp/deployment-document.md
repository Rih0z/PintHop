----
# ドキュメント情報
プロジェクト: PintHop
ファイル名: deployment-document.md
ファイルパス: Document/jp/deployment-document.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-20

# 更新履歴
- 2025-04-20 Koki Riho 初版作成

# 説明
PintHopアプリケーションのフロントエンドとバックエンドのデプロイ手順を詳細に記述したドキュメント。Netlify（フロントエンド）とrihobeer.com（バックエンド）へのデプロイプロセス、環境設定、監視方法を網羅しています。
----

# PintHop デプロイメント手順書

## 1. 概要

本手順書はPintHopアプリケーションのデプロイプロセスを詳細に説明しています。

- **フロントエンド**: Netlifyにデプロイ
- **バックエンド**: rihobeer.comサーバーにデプロイ

デプロイは大きく分けて以下のフェーズで構成されています：

1. デプロイ準備
2. フロントエンドデプロイ
3. バックエンドデプロイ
4. 動作確認とモニタリング設定
5. 障害対応

## 2. デプロイ準備

### 2.1 前提条件

- GitHubアカウントと適切な権限
- Netlifyアカウントと適切な権限
- rihobeer.comサーバーへのSSHアクセス権限
- 必要な環境変数とシークレット
- デプロイ前チェックリストの完了

### 2.2 デプロイ前チェックリスト

デプロイ前に以下のチェックリストを確認してください：

- [ ] すべての機能テストが成功している
- [ ] セキュリティチェックリストの「デプロイ前セキュリティチェック」セクションが完了している
- [ ] コードレビューが完了している
- [ ] 本番環境用の環境変数が準備されている
- [ ] データベース設定（MongoDB Atlas）が完了している
- [ ] SSL証明書が準備されている（または自動取得の準備ができている）
- [ ] [デプロイ準備用プロンプト](#appendix-a-deployment-preparation-prompt)を使用して最終確認を行う

### 2.3 環境変数の準備

#### フロントエンド環境変数
フロントエンドの環境変数をNetlifyの環境変数設定またはリポジトリの`.env.production`ファイルに設定します：

```
REACT_APP_API_URL=https://api.pinthop.com/api
REACT_APP_WS_URL=wss://api.pinthop.com
REACT_APP_MAPBOX_TOKEN=[Mapboxのアクセストークン]
REACT_APP_ENV=production
```

#### バックエンド環境変数
バックエンドの環境変数を`/var/www/pinthop/.env`ファイルに設定します：

```
PORT=5000
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/pinthop?retryWrites=true&w=majority&ssl=true
JWT_SECRET=[強力な乱数生成シークレット]
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=https://pinthop.com
LOG_LEVEL=error
MAPBOX_TOKEN=[Mapboxのアクセストークン]
```

**注意**: 実際のシークレットやパスワードはこのファイルに直接記載せず、デプロイ時に安全な方法で提供してください。

## 3. フロントエンドデプロイ（Netlify）

### 3.1 Netlifyアカウント設定

1. Netlifyにログインし、チームとプロジェクトが適切に設定されていることを確認します
2. GitHubリポジトリとの連携を確認または設定します
3. ビルド設定が適切に構成されていることを確認します

### 3.2 手動デプロイ（初回設定）

1. Netlifyダッシュボードから「New site from Git」をクリックします
2. GitHubを選択し、PintHopリポジトリを選択します
3. 以下のビルド設定を構成します：
   - ビルドコマンド: `cd frontend && npm ci && npm run build`
   - 公開ディレクトリ: `frontend/build`
4. 環境変数を設定します（前のセクションで準備したもの）
5. 「Deploy site」をクリックしてデプロイを開始します

### 3.3 継続的デプロイ設定

1. リポジトリの`netlify.toml`ファイルが以下の内容で正しく設定されていることを確認します：

```toml
[build]
  base = "frontend/"
  publish = "build/"
  command = "npm ci && npm run build"

[build.environment]
  NODE_VERSION = "18.x"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  REACT_APP_ENV = "production"
  REACT_APP_API_URL = "https://api.pinthop.com/api"
  REACT_APP_WS_URL = "wss://api.pinthop.com"

[context.deploy-preview.environment]
  REACT_APP_ENV = "preview"
  REACT_APP_API_URL = "https://api-staging.pinthop.com/api"
  REACT_APP_WS_URL = "wss://api-staging.pinthop.com"
```

2. GitHubのmainブランチへのプッシュが自動的にデプロイされるように設定します
3. プレビューデプロイの設定を確認します（PRごとのデプロイプレビュー）

### 3.4 カスタムドメイン設定

1. Netlifyダッシュボードの「Domain settings」から「Add custom domain」をクリックします
2. `pinthop.com`ドメインを追加します
3. ドメインプロバイダーのDNS設定を更新して、NetlifyのDNSサーバーを指定します：

```
ns1.netlify.com
ns2.netlify.com
```

4. または、ドメインプロバイダーで以下のCNAMEレコードを設定します：

```
CNAME  www  [your-netlify-subdomain].netlify.app
```

5. SSL証明書の自動発行を有効にします（Let's Encrypt）

### 3.5 フロントエンドデプロイの確認

1. `https://pinthop.com`にアクセスして、サイトが正しく表示されることを確認します
2. アプリケーションの主要機能をテストします（認証、マップ表示など）
3. コンソールエラーがないことを確認します
4. モバイルデバイスでの表示を確認します

## 4. バックエンドデプロイ（rihobeer.com）

### 4.1 サーバー準備

1. rihobeer.comにSSH接続します：

```bash
ssh username@rihobeer.com
```

2. サーバーの更新とセキュリティパッチの適用：

```bash
sudo apt update
sudo apt upgrade -y
```

3. 必要なツールのインストール：

```bash
# Node.jsがインストールされていることを確認
node -v
npm -v

# PM2のインストール（プロセス管理）
sudo npm install -g pm2

# Nginxのインストール（まだの場合）
sudo apt install nginx -y

# Certbotのインストール（Let's Encrypt SSL証明書用）
sudo apt install certbot python3-certbot-nginx -y
```

### 4.2 アプリケーションディレクトリ設定

1. アプリケーションディレクトリを作成し、適切な権限を設定します：

```bash
sudo mkdir -p /var/www/pinthop
sudo chown $USER:$USER /var/www/pinthop
```

2. Gitリポジトリからコードをクローンします：

```bash
cd /var/www/pinthop
git clone https://github.com/yourusername/pinthop.git .
```

3. バックエンドの依存関係をインストールします：

```bash
cd backend
npm ci --production
```

### 4.3 環境変数設定

1. 環境変数ファイルを作成します：

```bash
cp .env.example .env
nano .env
```

2. 環境変数ファイルを編集して、本番環境の設定を行います（前のセクションで準備した内容）

3. 環境変数ファイルのパーミッションを制限して保護します：

```bash
chmod 600 .env
```

### 4.4 PM2を使用したアプリケーション起動

1. PM2でアプリケーションを起動します：

```bash
cd /var/www/pinthop/backend
pm2 start app.js --name "pinthop-api"
```

2. PM2の起動スクリプトを生成し、サーバー再起動時に自動的に起動するよう設定します：

```bash
pm2 startup
# 表示されたコマンドを実行
pm2 save
```

3. アプリケーションのステータスを確認します：

```bash
pm2 status
pm2 logs pinthop-api
```

### 4.5 Nginxリバースプロキシ設定

1. Nginx設定ファイルを作成します：

```bash
sudo nano /etc/nginx/sites-available/pinthop
```

2. 以下の内容を追加します（セキュリティヘッダーを含む）：

```nginx
server {
    listen 80;
    server_name api.pinthop.com;
    server_tokens off;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # セキュリティヘッダー
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self'; img-src 'self' data: https://api.mapbox.com; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://api.mapbox.com wss://api.pinthop.com;" always;
    }

    # 大きなファイルアップロードのための設定
    client_max_body_size 10M;
}
```

3. シンボリックリンクを作成して設定を有効化します：

```bash
sudo ln -s /etc/nginx/sites-available/pinthop /etc/nginx/sites-enabled/
```

4. Nginx設定をテストして、再起動します：

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 4.6 SSL証明書の設定

1. Let's Encryptで証明書を取得します：

```bash
sudo certbot --nginx -d api.pinthop.com
```

2. プロンプトに従って設定を完了します（HTTPSリダイレクトを自動化など）

3. 証明書の自動更新が設定されていることを確認します：

```bash
sudo certbot renew --dry-run
```

### 4.7 バックエンドデプロイの確認

1. API健全性エンドポイントをテストします：

```bash
curl -i https://api.pinthop.com/api/health
```

2. レスポンスが`200 OK`で、JSONデータが`{"status":"UP","time":"..."}`の形式であることを確認します

## 5. 自動化とモニタリング設定

### 5.1 運用スクリプトの設定

1. スクリプトディレクトリを作成します：

```bash
mkdir -p /var/www/pinthop/scripts
mkdir -p /var/log/pinthop
chmod 755 /var/log/pinthop
```

2. バックアップスクリプトを作成します：

```bash
nano /var/www/pinthop/scripts/backup.sh
```

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/var/backups/pinthop
mkdir -p $BACKUP_DIR

# 環境変数のバックアップ
cp /var/www/pinthop/.env $BACKUP_DIR/.env_$TIMESTAMP

# MongoDB Atlasからのバックアップ (月1回のみ、自動バックアップに依存)
if [ $(date +%d) = "01" ]; then
  mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR/db_$TIMESTAMP
fi

# Netlify設定のバックアップ
curl -H "Authorization: Bearer $NETLIFY_TOKEN" https://api.netlify.com/api/v1/sites/$SITE_ID > $BACKUP_DIR/netlify_$TIMESTAMP.json

# 30日以上前のバックアップを削除
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed on $(date)" >> /var/log/pinthop/backups.log
```

3. デプロイスクリプトを作成します：

```bash
nano /var/www/pinthop/scripts/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/pinthop
git pull
cd backend
npm ci --production
pm2 restart pinthop-api

echo "Deployment completed on $(date)" >> /var/log/pinthop/deployment.log
```

4. ログアラートスクリプトを作成します：

```bash
nano /var/www/pinthop/scripts/log-alert.sh
```

```bash
#!/bin/bash
ERRORS=$(grep -i "error\|exception\|fail" /var/log/pinthop/api.log | tail -100)
if [ ! -z "$ERRORS" ]; then
  echo "$ERRORS" | mail -s "PintHop API Error Alert" your-email@example.com
fi
```

5. メンテナンススクリプトを作成します：

```bash
nano /var/www/pinthop/scripts/maintenance.sh
```

```bash
#!/bin/bash

# システム更新
sudo apt update && sudo apt upgrade -y

# Npm依存関係の脆弱性チェック
cd /var/www/pinthop/backend
npm audit

# 使われていないパッケージのクリーンアップ
sudo apt autoremove -y

# MongoDB古いログのクリーンアップ
find /var/log/mongodb -type f -name "*.log.*" -mtime +30 -delete

# Nginxアクセスログ集計（アクセス解析）
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)
grep "$YESTERDAY" /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -nr | head -20 > /var/log/pinthop/popular_endpoints_$YESTERDAY.log

echo "Maintenance completed on $(date)" >> /var/log/pinthop/maintenance.log
```

6. スクリプトに実行権限を付与します：

```bash
chmod +x /var/www/pinthop/scripts/*.sh
```

### 5.2 クーロンジョブの設定

1. クーロンジョブを編集します：

```bash
crontab -e
```

2. 以下のようにジョブを設定します：

```
# バックアップ - 毎日午前3時に実行
0 3 * * * /var/www/pinthop/scripts/backup.sh >> /var/log/pinthop/backups.log 2>&1

# エラーログアラート - 1時間ごとに実行
0 * * * * /var/www/pinthop/scripts/log-alert.sh

# メンテナンス - 毎週日曜日の午前2時に実行
0 2 * * 0 /var/www/pinthop/scripts/maintenance.sh >> /var/log/pinthop/maintenance.log 2>&1

# ログローテーション - 毎日午前1時に実行
0 1 * * * find /var/log/pinthop -type f -name "*.log" -size +100M | xargs gzip
```

### 5.3 アップタイム監視設定

1. UptimeRobotアカウントにログインします
2. 新しいモニターを追加します：
   - モニタータイプ: HTTPS
   - フレンドリー名: PintHop API
   - URL: https://api.pinthop.com/api/health
   - モニタリング間隔: 5分
   - 通知設定: メールアラート設定

3. フロントエンド用の監視も追加します：
   - モニタータイプ: HTTPS
   - フレンドリー名: PintHop Frontend
   - URL: https://pinthop.com
   - モニタリング間隔: 5分
   - 通知設定: メールアラート設定

### 5.4 ログ監視とローテーション

1. ログローテーション設定ファイルを作成します：

```bash
sudo nano /etc/logrotate.d/pinthopapi
```

2. 以下の内容を追加します：

```
/var/log/pinthop/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
}
```

3. 設定をテストします：

```bash
sudo logrotate -d /etc/logrotate.d/pinthopapi
```

## 6. 継続的インテグレーション/デプロイ設定

### 6.1 GitHub Actions設定

1. リポジトリに`.github/workflows/deploy.yml`ファイルを作成します：

```yaml
name: Deploy Application

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          cd ../backend
          npm ci
      - name: Run tests
        run: |
          cd frontend
          npm test
          cd ../backend
          npm test
  
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Netlify build
        run: |
          curl -X POST -d {} ${{ secrets.NETLIFY_BUILD_HOOK }}
  
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to backend
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/pinthop
            git pull
            cd backend
            npm ci --production
            pm2 restart pinthop-api
```

2. GitHubリポジトリの「Settings」>「Secrets」>「Actions」で以下のシークレットを設定します：
   - `NETLIFY_BUILD_HOOK`: Netlifyのビルドフック URL
   - `SSH_HOST`: rihobeer.comのIPアドレスまたはドメイン
   - `SSH_USERNAME`: SSHユーザー名
   - `SSH_PRIVATE_KEY`: SSH秘密鍵（改行を含む全体）

### 6.2 Webhook設定（オプション）

1. GitHubのWebhookを使用して、直接デプロイを行う場合は、バックエンドサーバーにWebhookエンドポイントを設定します：

```bash
nano /var/www/pinthop/scripts/webhook.js
```

2. 以下の内容を追加します：

```javascript
const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

const SECRET = 'your-github-webhook-secret';
const PORT = 9000;

http.createServer((req, res) => {
  req.on('data', chunk => {
    const signature = req.headers['x-hub-signature'];
    const hmac = crypto.createHmac('sha1', SECRET);
    const digest = 'sha1=' + hmac.update(chunk).digest('hex');
    
    if (signature === digest) {
      const payload = JSON.parse(chunk);
      if (payload.ref === 'refs/heads/main') {
        exec('/var/www/pinthop/scripts/deploy.sh', (error, stdout, stderr) => {
          if (error) console.error(`exec error: ${error}`);
        });
      }
    }
  });
  
  res.end('OK');
}).listen(PORT);
```

3. PM2を使用してWebhookサーバーを起動します：

```bash
cd /var/www/pinthop/scripts
pm2 start webhook.js --name "pinthop-webhook"
pm2 save
```

4. GitHubリポジトリの「Settings」>「Webhooks」で新しいWebhookを追加します：
   - Payload URL: `http://api.pinthop.com:9000`
   - Content type: `application/json`
   - Secret: `your-github-webhook-secret`
   - イベント: `Just the push event`

## 7. デプロイ後の検証

### 7.1 フロントエンド検証

1. ブラウザでWebサイト（https://pinthop.com）にアクセスし、正常に読み込まれることを確認します
2. 以下の機能をテストします：
   - ユーザー登録とログイン
   - マップ表示と位置情報表示
   - ブルワリー検索と詳細表示
   - プレゼンス機能（該当フェーズの場合）
3. モバイルデバイスでの表示と機能を確認します
4. コンソールにエラーがないことを確認します

### 7.2 バックエンド検証

1. APIエンドポイントが正常に動作することを確認します：

```bash
curl -i https://api.pinthop.com/api/health
curl -i https://api.pinthop.com/api/breweries
```

2. WebSocket接続が正常に動作することを確認します（該当フェーズの場合）
3. ログファイルにエラーがないことを確認します：

```bash
tail -100 /var/log/pinthop/api.log
```

### 7.3 パフォーマンス検証

1. Lighthouse（Chrome DevTools）を使用してWebサイトのパフォーマンスをテストします
2. APIエンドポイントのレスポンスタイムを確認します：

```bash
time curl -s https://api.pinthop.com/api/breweries > /dev/null
```

## 8. ロールバック手順

### 8.1 フロントエンドロールバック

1. Netlifyダッシュボードの「Deploys」タブにアクセスします
2. 以前の安定したデプロイを見つけて、「Publish deploy」をクリックします

### 8.2 バックエンドロールバック

1. 以前のGitリビジョンにロールバックします：

```bash
cd /var/www/pinthop
git log --oneline # コミット履歴を確認
git checkout [以前の安定したコミットID]
cd backend
npm ci --production
pm2 restart pinthop-api
```

2. 環境変数に問題がある場合は、バックアップから復元します：

```bash
cp /var/backups/pinthop/.env_[日付] /var/www/pinthop/.env
pm2 restart pinthop-api
```

## 9. 障害対応手順

### 9.1 フロントエンドの問題

1. Netlifyのデプロイログを確認して問題を特定します
2. 一般的な問題とその解決方法：
   - ビルドエラー: パッケージの互換性問題を確認、`package-lock.json`を更新
   - アセット読み込みエラー: パスとURLを確認、環境変数の設定を確認
   - APIアクセスエラー: CORSの設定を確認、APIエンドポイントの可用性を確認

### 9.2 バックエンドの問題

1. PM2とNginxのログを確認して問題を特定します：

```bash
pm2 logs pinthop-api
sudo tail -100 /var/log/nginx/error.log
```

2. 一般的な問題とその解決方法：
   - 接続エラー: ファイアウォール設定とネットワーク接続を確認
   - MongoDB接続エラー: MongoDB Atlasのステータスと認証情報を確認
   - メモリ不足: サーバーリソースを確認し、必要に応じてスケールアップ

```bash
# メモリ使用状況確認
free -m
# ディスク使用状況確認
df -h
```

3. サービスの再起動：

```bash
pm2 restart pinthop-api
sudo systemctl restart nginx
```

### 9.3 SSL証明書の問題

1. SSL証明書の有効期限とステータスを確認します：

```bash
sudo certbot certificates
```

2. 証明書の更新が必要な場合は、手動で更新します：

```bash
sudo certbot renew
```

3. Nginxの再起動：

```bash
sudo systemctl restart nginx
```

## 10. 定期的なメンテナンス手順

### 10.1 週次メンテナンス

1. ログファイルの確認とクリーンアップ
2. バックアップの成功確認
3. パフォーマンスメトリクスの確認

### 10.2 月次メンテナンス

1. セキュリティアップデートの適用
2. 依存関係の更新と脆弱性スキャン
3. SSL証明書の有効期限確認
4. バックアップからの復元テスト（テスト環境で）

### 10.3 四半期メンテナンス

1. サードパーティサービスの設定レビュー
2. 不要なデータのクリーンアップ
3. パフォーマンス最適化
4. セキュリティポリシーとプラクティスのレビュー

## Appendix A: デプロイ準備用プロンプト

デプロイ前の最終確認に使用するプロンプトテンプレート：

```
以下のことを確認してください：

1. デプロイするバージョンとブランチを確認
   a. フロントエンドのビルドが成功することを確認
   b. バックエンドのテストが成功することを確認

2. 環境変数の設定
   a. フロントエンド環境変数が本番用に設定されている
   b. バックエンド環境変数が本番用に設定されている
   c. 機密情報が安全に保護されている

3. データベース設定
   a. MongoDB Atlas接続文字列が本番用に設定されている
   b. 必要なインデックスが作成されている
   c. バックアップが設定されている

4. 監視とアラート
   a. ヘルスチェックエンドポイントが実装されている
   b. UptimeRobotの監視が設定されている
   c. エラーアラートが設定されている

5. ロールバック計画
   a. 以前の安定バージョンが特定されている
   b. 環境変数のバックアップがある
   c. データのロールバック方法が確認されている
```

## Appendix B: 環境別URI設定

| 環境 | フロントエンドURI | バックエンドURI | WebSocket URI |
|------|-------------------|-----------------|---------------|
| 開発 | http://localhost:3000 | http://localhost:5000/api | ws://localhost:5000 |
| テスト | https://test.pinthop.com | https://api-test.pinthop.com/api | wss://api-test.pinthop.com |
| ステージング | https://staging.pinthop.com | https://api-staging.pinthop.com/api | wss://api-staging.pinthop.com |
| 本番 | https://pinthop.com | https://api.pinthop.com/api | wss://api.pinthop.com |

## Appendix C: トラブルシューティングチェックリスト

| 症状 | 確認事項 | 解決策 |
|------|----------|--------|
| フロントエンドが表示されない | Netlifyデプロイステータス<br>ブラウザコンソールエラー | ビルドログを確認<br>最新のデプロイにロールバック |
| APIが応答しない | PM2プロセスステータス<br>Nginxステータス<br>ファイアウォール設定 | `pm2 restart pinthop-api`<br>`sudo systemctl restart nginx`<br>ポート開放確認 |
| データベース接続エラー | MongoDB Atlasステータス<br>ネットワーク接続<br>認証情報 | Atlas管理コンソールで状態確認<br>IP許可リスト確認<br>.envファイルの認証情報確認 |
| SSL証明書エラー | 証明書の有効期限<br>Nginx SSL設定 | `sudo certbot renew`<br>Nginx設定の確認と再起動 |
| パフォーマンス低下 | サーバーリソース使用率<br>データベースクエリ<br>ログ量 | リソース増強<br>インデックス最適化<br>ログローテーション確認 |
