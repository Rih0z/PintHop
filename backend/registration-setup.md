# ユーザー登録機能セットアップガイド

## 🚀 実装された機能

### 1. バックエンド API

#### 新しいエンドポイント
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン（ユーザー名またはメール）
- `GET /api/auth/me` - 認証確認
- `GET /api/auth/check-username/:username` - ユーザー名利用可能性チェック
- `GET /api/auth/check-email/:email` - メール利用可能性チェック

#### セキュリティ機能
- **パスワードハッシュ化**: bcryptjs使用（saltRounds: 10）
- **入力検証**: ユーザー名、メール、パスワード強度チェック
- **重複チェック**: ユーザー名とメールの一意性保証
- **JWT認証**: 適切なトークン生成と検証

#### バリデーション
- **ユーザー名**: 3-20文字、英数字とアンダースコアのみ
- **メール**: 標準的なメール形式
- **パスワード**: 8文字以上、文字と数字を含む

### 2. フロントエンド

#### モダンな登録フォーム
- **リアルタイムバリデーション**: 入力中にエラーチェック
- **利用可能性チェック**: ユーザー名とメールの重複確認（500msデバウンス）
- **視覚的フィードバック**: ✓/✗マークでステータス表示
- **モダンデザイン**: Netflix/Uber風ダークテーマ

#### UX機能
- **プログレッシブエラー表示**: フィールドごとの個別エラー
- **ロード状態**: 送信中のスピナー表示
- **無効化ロジック**: エラーがある間はボタン無効

### 3. データストレージ

#### Cloudflare KV使用
- **ユーザーデータ**: `user:{username}` キーで保存
- **メール検索**: `email:{email}` キーでユーザー名参照
- **スキーマレス**: JSON形式で柔軟な拡張が可能

## 📋 デプロイ手順

### 1. KVネームスペースの作成

```bash
cd backend

# KVネームスペースを作成
wrangler kv:namespace create USERS_KV

# プレビュー用も作成
wrangler kv:namespace create USERS_KV --preview
```

### 2. wrangler.tomlの更新

返された KV namespace ID を設定：

```toml
[[kv_namespaces]]
binding = "USERS_KV"
id = "your_actual_kv_namespace_id"
preview_id = "your_actual_preview_kv_namespace_id"
```

### 3. 依存関係のインストール

```bash
npm install bcryptjs @types/bcryptjs
```

### 4. 環境変数の設定

```bash
# JWT秘密鍵（必須）
wrangler secret put JWT_SECRET
# 入力例: your-super-secure-jwt-secret-at-least-32-characters-long
```

### 5. デプロイ

```bash
wrangler deploy
```

## 🧪 テスト手順

### 1. 登録フォームのテスト

1. https://67515bf9.pinthop.pages.dev/register にアクセス
2. 新しいユーザー名、メール、パスワードを入力
3. リアルタイムバリデーションの動作確認
4. 登録ボタンクリックでダッシュボードにリダイレクト

### 2. ログインテスト

1. 登録したユーザー名/メールとパスワードでログイン
2. ダッシュボードへの自動リダイレクト確認

### 3. エラーハンドリングテスト

1. 無効なデータで登録試行
2. 既存ユーザー名/メールで登録試行
3. 適切なエラーメッセージ表示確認

## 🔧 設定ファイルの変更

### 変更されたファイル
- `backend/src/worker-with-registration.ts` - 新しいWorker実装
- `backend/wrangler.toml` - KV設定追加
- `backend/package.json` - bcryptjs依存関係追加
- `frontend/src/pages/Register.tsx` - 登録フォーム実装
- `frontend/src/router.tsx` - ルーティング設定済み

## 📊 データ構造

### ユーザーデータ（KV）

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "$2a$10$hashedpassword...",
  "createdAt": "2025-01-05T12:00:00.000Z",
  "updatedAt": "2025-01-05T12:00:00.000Z"
}
```

### キー構造
- `user:{username}` → ユーザーデータ
- `email:{email}` → ユーザー名（検索用）

## 🔐 セキュリティ考慮事項

1. **パスワード**: bcryptで安全にハッシュ化
2. **JWT**: 適切な有効期限とクレーム設定
3. **入力検証**: フロントエンドとバックエンドで二重チェック
4. **レート制限**: 必要に応じてCloudflare設定で追加
5. **HTTPS**: Cloudflare経由で自動対応

## 🚀 今後の改善案

1. **メール認証**: 登録時のメール確認機能
2. **パスワードリセット**: メール経由のパスワード変更
3. **プロフィール機能**: ユーザー情報の編集
4. **ソーシャルログイン**: Google/Facebook連携
5. **2要素認証**: セキュリティ強化

## 🐛 トラブルシューティング

### KVアクセスエラー
- KV namespace IDが正しく設定されているか確認
- Cloudflare Dashboardでネームスペースが作成されているか確認

### 認証エラー
- JWT_SECRETが設定されているか確認
- トークンの有効期限をチェック

### バリデーションエラー
- フロントエンドとバックエンドの検証ルールが一致しているか確認