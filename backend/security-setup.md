# セキュリティ設定ガイド

## 🔒 セキュリティ強化の実装内容

### 1. JWT実装の改善
- ✅ Honoの公式JWT実装（`hono/jwt`）を使用
- ✅ 適切な署名と検証機能
- ✅ トークン有効期限の設定（exp, iat, nbf）
- ✅ トークン検証時の有効期限チェック

### 2. CORS設定の厳格化
- ✅ 許可するオリジンを明示的に指定
- ✅ Cloudflare Pagesのドメインとローカル開発環境のみ許可
- ✅ ワイルドカード（`*`）を排除

### 3. セキュリティヘッダーの追加
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Strict-Transport-Security`（HSTS）
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`

### 4. 環境変数によるシークレット管理
- ✅ ハードコードされたパスワードを環境変数に移動
- ✅ JWT_SECRETを環境変数から取得
- ✅ テストユーザー情報も環境変数で管理可能

### 5. エラーハンドリングの改善
- ✅ 本番環境でのエラー詳細の隠蔽
- ✅ 開発環境のみ詳細なエラーメッセージ表示

### 6. 入力検証の追加
- ✅ メールアドレスの形式検証
- ✅ パスワードの最小長チェック（8文字以上）
- ✅ 必須フィールドの検証

### 7. デバッグログの削除
- ✅ コンソールへのパスワード出力を削除
- ✅ API URLのデバッグログを削除

## 🚀 デプロイ手順

### 1. Cloudflare Workersのシークレット設定

```bash
# JWT秘密鍵の設定（必ず変更してください）
wrangler secret put JWT_SECRET

# MongoDB接続文字列の設定
wrangler secret put MONGODB_URI

# テストユーザーの設定（オプション）
wrangler secret put TEST_USER_1_USERNAME
wrangler secret put TEST_USER_1_PASSWORD
wrangler secret put TEST_USER_1_EMAIL
# ... 他のテストユーザーも同様
```

### 2. worker-secure.tsをデプロイ

```bash
cd backend
wrangler deploy
```

### 3. 既存のworker.tsを置き換え

```bash
# バックアップを作成
cp src/worker.ts src/worker.ts.backup

# セキュアバージョンに置き換え
cp src/worker-secure.ts src/worker.ts

# デプロイ
wrangler deploy
```

## ⚠️ 重要な注意事項

1. **JWT_SECRETの変更**
   - 必ず強力なランダム文字列に変更してください
   - 最低32文字以上を推奨
   - 例: `openssl rand -base64 32`

2. **テストユーザーのパスワード**
   - 本番環境では必ず変更してください
   - 環境変数で管理するか、別の認証システムを使用

3. **CORS設定**
   - 本番ドメインが変更された場合は更新が必要
   - 必要に応じて環境変数から読み込むように変更可能

4. **HTTPS必須**
   - Cloudflare Workersは自動的にHTTPSを使用
   - ローカル開発環境でもHTTPSの使用を推奨

## 📋 セキュリティチェックリスト

- [ ] JWT_SECRETを強力なランダム文字列に変更
- [ ] テストユーザーのパスワードを変更
- [ ] CORS設定で本番ドメインを確認
- [ ] MongoDB接続文字列を設定
- [ ] すべての環境変数をCloudflareに設定
- [ ] デプロイ後の動作確認
- [ ] 不要なデバッグログが削除されているか確認

## 🔍 今後の改善提案

1. **レート制限の実装**
   - ブルートフォース攻撃の防止
   - Cloudflare Rate Limitingの活用

2. **2要素認証（2FA）**
   - TOTP（Time-based One-Time Password）の実装
   - SMS/Email認証の追加

3. **パスワードポリシーの強化**
   - 複雑性要件（大文字、小文字、数字、記号）
   - パスワード履歴の管理
   - 定期的な変更要求

4. **監査ログ**
   - ログイン試行の記録
   - 不正アクセスの検知
   - セキュリティイベントの通知

5. **データ暗号化**
   - 保存時の暗号化（Encryption at Rest）
   - 通信時の暗号化（Encryption in Transit）

6. **OWASP準拠**
   - OWASP Top 10への対応
   - セキュリティベストプラクティスの実装