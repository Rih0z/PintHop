---
# ドキュメント情報
プロジェクト: PintHop
ファイル名: security-policy.md
ファイルパス: Document/jp/security-policy.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-19

# 更新履歴
- 2025-04-19 Koki Riho 初版作成

# 説明
PintHopアプリケーションのセキュリティポリシーを定義するドキュメント。アプリケーションの設計、開発、運用、および保守におけるセキュリティの原則と指針を提供します。
---

# PintHop セキュリティポリシー

## 1. 概要

本文書はPintHopアプリケーションのセキュリティポリシーを定義するものです。PintHopは「次の一杯を見つける」個人体験と「自然に友達とつながる」社会体験を同等に重視した、クラフトビール体験向上プラットフォームです。

### 1.1 目的

本セキュリティポリシーの目的は、PintHopアプリケーションの設計、開発、運用、および保守におけるセキュリティの原則と指針を確立することにあります。本ポリシーは、ユーザーデータの保護、システムの安全性の確保、プライバシーの保護を実現するための基本的な枠組みを提供します。

### 1.2 適用範囲

本ポリシーは、PintHopアプリケーションの全コンポーネント（フロントエンド、バックエンド、データベース、インフラストラクチャ）に適用され、開発、テスト、ステージング、本番の全環境を対象とします。

### 1.3 基本方針

PintHopのセキュリティは以下の基本方針に基づいています：

1. **セキュリティファーストの設計原則**: セキュリティ要件は、設計段階から考慮し、機能要件と同等以上の優先度で扱われます。
2. **多層防御**: 単一の防御機構に依存せず、複数のセキュリティ層を構築します。
3. **最小権限の原則**: ユーザー、プロセス、システムコンポーネントは、それぞれの機能を実行するために必要最小限の権限のみを持ちます。
4. **デフォルトで安全**: 明示的に設定されていない場合、最も安全な設定をデフォルトとします。
5. **プライバシーバイデザイン**: ユーザーのプライバシーを設計段階から考慮し、データ収集は必要最小限に制限します。

## 2. 責任範囲

### 2.1 開発者の責任

- セキュリティ要件に準拠したコードの開発
- セキュリティレビューへの積極的な参加
- セキュリティの脆弱性や問題の報告
- セキュリティベストプラクティスの遵守
- コードの品質とセキュリティテストの実施

### 2.2 運用者の責任

- システムのセキュリティ監視と管理
- セキュリティパッチの適用
- バックアップの定期的な実施と検証
- インシデント対応計画の実行
- セキュリティログの監視とアラート対応

### 2.3 ユーザーの責任

- 安全なパスワードの使用
- アカウント情報の保護
- 不審な活動の報告
- 利用規約とプライバシーポリシーの遵守
- 他のユーザーのプライバシーと権利の尊重

## 3. ユーザーデータ保護ポリシー

### 3.1 個人情報の定義

PintHopでは、以下の情報を個人情報として定義し、特別な保護の対象とします：

- 氏名、ユーザー名、メールアドレス
- パスワード（ハッシュ化されたもの）
- 位置情報と位置履歴
- 友達関係とソーシャルグラフ
- ビール嗜好と飲用履歴

### 3.2 データ収集原則

- **明示的な同意**: ユーザーデータの収集は、明示的な同意を得た後にのみ行います。
- **目的の限定**: データは特定の明示された目的のためにのみ収集します。
- **最小限の収集**: 必要最小限のデータのみを収集します。
- **透明性**: データ収集の目的と方法を明確に開示します。

### 3.3 位置情報の扱い

- 位置情報はユーザーの明示的な同意を得た場合のみ収集します。
- 詳細な位置情報の履歴は30日間のみ保持します。
- ユーザーはいつでも位置情報の共有を無効にできます。
- プライバシー設定は「friends-only」がデフォルトです。

### 3.4 データ保持ポリシー

- アクティブアカウントのデータは、サービス提供に必要な期間保持します。
- 非アクティブアカウント（最終ログインから12ヶ月以上経過）は、自動的に休止状態になります。
- 削除されたアカウントのデータは、法的義務を除き、30日以内に完全に削除されます。
- バックアップデータは最大30日間保持されます。

### 3.5 ユーザーデータのアクセス権

- ユーザーは自分のデータにアクセス、修正、削除する権利を持ちます。
- ユーザーはデータのエクスポート機能を利用できます。
- データアクセスのリクエストは、身元確認後に処理されます。

## 4. 認証・認可システム

### 4.1 認証システム

#### 4.1.1 JWT実装

- **トークン有効期限**: 
  - アクセストークン: 15分
  - リフレッシュトークン: 7日間
- **トークンローテーション**: リフレッシュトークン使用時に新規発行
- **JWTペイロード最小化**: 必要最小限の情報のみ格納

```javascript
// JWTペイロード例
{
  "sub": "user_id",
  "iat": 1650000000,
  "exp": 1650000900, // 15分後
  "scope": "user"
}
```

#### 4.1.2 パスワード管理

- **ハッシュアルゴリズム**: bcrypt（コスト係数14以上）
- **パスワード強度ポリシー**: 
  - 最低8文字
  - 英大文字、英小文字、数字、特殊文字を各1文字以上含む
- **アカウントロックアウト**: 5回連続失敗で10分間ロック

#### 4.1.3 多要素認証

フェーズ2以降に実装予定の多要素認証は以下の方法を検討：

- メール確認コード
- SMS確認コード
- 認証アプリ（TOTP）

### 4.2 認可システム

#### 4.2.1 ロールベースアクセス制御

- **ユーザーロール**: 
  - 一般ユーザー: 基本的なアプリ機能の利用
  - 認証済みユーザー: ビール専門家としての追加権限
  - 管理者: システム管理機能へのアクセス

#### 4.2.2 リソースアクセス制御

- ユーザーは自分のデータに対してのみ完全なアクセス権を持ちます。
- 友達のデータへのアクセスはプライバシー設定に基づいて制限されます。
- 公開データ（ブルワリー情報など）は全ユーザーがアクセス可能です。

## 5. 入力検証とサニタイゼーション

### 5.1 サーバーサイド検証

- すべてのAPIエンドポイントで入力検証を実施します。
- Express-validatorを使用して型、長さ、範囲などを検証します。
- MongoDBインジェクション対策として型チェックを実施します。
- NoSQLインジェクション対策として$whereオペレータを制限します。

```javascript
// 入力検証の例
const validateUserInput = [
  check('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];
```

### 5.2 フロントエンド検証

- React-hook-formを使用したフォーム入力検証を実施します。
- DOMPurifyを使用してユーザー生成コンテンツをサニタイズします。
- XSS攻撃対策としてReactのエスケープ機能を活用します。

### 5.3 ファイルアップロード処理

- ファイルタイプ、サイズ、コンテンツの検証を実施します。
- アップロードされたファイルは元のファイル名を使用せず、安全な名前に変更します。
- 画像ファイルはメタデータを除去し、リサイズと最適化を行います。
- アップロードされたファイルは専用のストレージサービスに保存し、アプリケーションサーバーとは分離します。

## 6. APIセキュリティ

### 6.1 レート制限

- Express-rate-limitを使用してAPIリクエスト数を制限します。
- 認証エンドポイント: 10リクエスト/5分（IPベース）
- 一般エンドポイント: 100リクエスト/分（認証ユーザーベース）

```javascript
// レート制限の実装例
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5分
  max: 10, // IPアドレスごとに10リクエスト
  message: { error: 'Too many login attempts, please try again later' }
});

app.use('/api/v1/auth', authLimiter);
```

### 6.2 CORS設定

- 許可オリジンを明示的に設定します。
- クレデンシャル付きリクエストの許可を最小限に抑えます。

```javascript
// CORS設定例
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://pinthop.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24時間
};

app.use(cors(corsOptions));
```

### 6.3 セキュリティヘッダー

- Helmet.jsを使用して適切なセキュリティヘッダーを設定します。
- Content-Security-Policy (CSP)を適切に設定します。

```javascript
// Helmet.js設定例
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://api.mapbox.com"],
      connectSrc: ["'self'", "https://api.mapbox.com", "wss://api.pinthop.com"]
    }
  })
);
```

## 7. インフラセキュリティ

### 7.1 サーバーセキュリティ

#### 7.1.1 ファイアウォール設定

- UFWを使用して不要なポートをブロックします。
- 必要最小限のポートのみを開放します：SSH（22）、HTTP（80）、HTTPS（443）。

```bash
# UFW設定例
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

#### 7.1.2 SSH強化

- root直接ログインを無効化します。
- パスワード認証を無効化し、公開鍵認証のみを許可します。
- SSHポートの変更を検討します。

```bash
# SSH設定例 (/etc/ssh/sshd_config)
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

#### 7.1.3 自動更新

- セキュリティアップデートの自動適用を設定します。
- 重要なシステムパッケージは手動でテスト後に更新します。

```bash
# 自動更新設定
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

### 7.2 Webサーバーセキュリティ

#### 7.2.1 Nginxセキュリティ設定

- サーバー情報の非表示化を行います。
- 安全なTLSプロトコルとサイファーを使用します。
- セキュリティヘッダーを適切に設定します。

```nginx
# Nginx設定例
server {
    # 既存設定...
    
    # サーバー情報の非表示
    server_tokens off;
    
    # セキュリティヘッダー
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; img-src 'self' data: https://api.mapbox.com; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://api.mapbox.com wss://api.pinthop.com;" always;
    
    # SSL設定
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
}
```

#### 7.2.2 TLS設定

- 最低でもTLS 1.2以上を使用します。
- 強力な暗号スイートを有効化します。
- Let's Encryptを使用して証明書を自動更新します。
- HSTS (HTTP Strict Transport Security)を有効化します。

### 7.3 コンテナ・仮想化セキュリティ

- コンテナイメージは定期的に更新し、脆弱性スキャンを実施します。
- 最小限のベースイメージを使用し、不要なパッケージを削除します。
- コンテナは非特権ユーザーで実行します。
- ボリュームのマウントポイントを適切に設定し、読み取り専用を活用します。

## 8. データセキュリティ

### 8.1 データベースセキュリティ

- MongoDB接続はSSL/TLS暗号化を使用します。
- データベースの認証情報は環境変数で管理します。
- データベースユーザーには最小限の権限を付与します。
- プロダクションデータベースには直接アクセスせず、管理用のジャンプサーバー経由でアクセスします。

```javascript
// MongoDB接続設定例
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: true,
  retryWrites: true,
  w: 'majority'
});
```

### 8.2 機密データの保護

- パスワードはbcryptを使用してハッシュ化して保存します。
- APIキーやシークレットは環境変数で管理します。
- データベース内の機密情報は暗号化して保存します。
- 支払い情報は直接保存せず、決済プロバイダーを利用します。

### 8.3 バックアップ戦略

- 毎日自動バックアップを実行します。
- バックアップデータは暗号化して保存します。
- 30日分のバックアップを保持します。
- 定期的にバックアップからの復元テストを実施します。

```bash
# バックアップスクリプト例
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/var/backups/pinthop
mkdir -p $BACKUP_DIR

# MongoDB Atlasからのバックアップ
mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR/db_$TIMESTAMP

# 環境変数のバックアップ
cp /var/www/pinthop/.env $BACKUP_DIR/.env_$TIMESTAMP

# バックアップの暗号化
tar -czf $BACKUP_DIR/pinthop_backup_$TIMESTAMP.tar.gz $BACKUP_DIR/db_$TIMESTAMP $BACKUP_DIR/.env_$TIMESTAMP
gpg --symmetric --cipher-algo AES256 $BACKUP_DIR/pinthop_backup_$TIMESTAMP.tar.gz

# 古いバックアップの削除
find $BACKUP_DIR -type f -mtime +30 -delete
```

## 9. 開発セキュリティ

### 9.1 セキュアコーディング規約

- OWASP Top 10やSANS CWE Top 25に対応したコーディング規約を遵守します。
- コードレビューでセキュリティに関するチェックを重点的に行います。
- 安全でないコーディングパターンを検出するための自動化ツールを導入します。

### 9.2 依存関係管理

- すべての依存パッケージのバージョンを明示的に固定します。
- 定期的に依存パッケージの脆弱性スキャンを実施します。
- セキュリティ更新のみのパッチ適用は自動化します。

```javascript
// package.json例
"dependencies": {
  "express": "4.18.2",
  "mongoose": "7.0.3",
  "bcrypt": "5.1.0",
  "jsonwebtoken": "9.0.0",
  "helmet": "6.1.5"
}
```

### 9.3 機密情報の管理

- ソースコードに機密情報を埋め込みません。
- CI/CDパイプラインでの機密情報は安全に管理します。
- 開発環境と本番環境で異なる認証情報を使用します。

```javascript
// 環境変数の使用例
const config = {
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGODB_URI,
  apiKeys: {
    mapbox: process.env.MAPBOX_API_KEY
  }
};
```

## 10. インシデント対応

### 10.1 インシデント分類

#### 10.1.1 低影響インシデント

- 一時的なパフォーマンス低下
- 単発的なエラー報告
- マイナーな機能不具合

#### 10.1.2 中影響インシデント

- サービス部分的停止
- ユーザーデータ一部アクセス不能
- 繰り返し発生するエラー

#### 10.1.3 高影響インシデント

- 完全なサービス停止
- データ損失の可能性
- セキュリティ侵害の可能性

### 10.2 通知とエスカレーション

- 低影響インシデント: 運用担当者に通知
- 中影響インシデント: 開発責任者と運用責任者に通知
- 高影響インシデント: 全チームメンバーと経営層に通知

### 10.3 インシデント対応手順

#### 10.3.1 検知と評価

- インシデントの検知方法（監視アラート、ユーザー報告等）
- 影響範囲と深刻度の評価
- インシデント対応チームの編成

#### 10.3.2 封じ込めと排除

- 影響を最小限に抑えるための初期対応
- 原因の特定と排除
- 攻撃者のアクセス遮断（セキュリティインシデントの場合）

#### 10.3.3 復旧と報告

- システムの復旧手順
- 影響を受けたデータの復旧
- インシデント報告書の作成
- 必要に応じた関係者への通知

#### 10.3.4 再発防止

- 根本原因分析
- 再発防止策の実装
- セキュリティ対策の見直し
- チーム間での知識共有

## 11. セキュリティ監視と監査

### 11.1 セキュリティ監視

- ログ監視：エラーログ、アクセスログ、認証ログの監視
- パフォーマンス監視：リソース使用率、応答時間の監視
- 異常検知：通常と異なるパターンの検出

```bash
# ログ監視スクリプト例
#!/bin/bash
ERRORS=$(grep -i "error\|exception\|fail" /var/log/pinthop/api.log | tail -100)
if [ ! -z "$ERRORS" ]; then
  echo "$ERRORS" | mail -s "PintHop API Error Alert" your-email@example.com
fi
```

### 11.2 セキュリティ監査

- 四半期ごとの内部セキュリティレビュー
- 年1回の外部セキュリティ監査
- 脆弱性スキャンの定期実行

### 11.3 コンプライアンス

- データプライバシー関連法規の遵守（GDPR等）
- 業界標準のセキュリティベストプラクティスの遵守
- PCI DSSコンプライアンス（決済機能実装時）

## 12. セキュリティ更新とパッチ管理

### 12.1 パッチ適用ポリシー

- 重大なセキュリティ脆弱性のパッチは24時間以内に適用
- 中程度の脆弱性のパッチは1週間以内に適用
- 低程度の脆弱性のパッチは通常の開発サイクル内で適用

### 12.2 テストと展開プロセス

- すべてのパッチはテスト環境で検証後に適用
- 重要なインフラコンポーネントのパッチはメンテナンスウィンドウで適用
- パッチ適用後のロールバック計画の準備

### 12.3 依存関係更新

- 週次の依存関係脆弱性スキャン
- 月次の依存関係更新レビュー
- Renovatebotによる自動更新提案の活用

```json
// renovate.json
{
  "extends": [
    "config:base"
  ],
  "packageRules": [
    {
      "updateTypes": ["minor", "patch"],
      "automerge": true
    }
  ],
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security"]
  }
}
```

## 13. 教育とトレーニング

### 13.1 開発者トレーニング

- セキュアコーディングのベストプラクティス
- 一般的なセキュリティ脆弱性とその対策
- 定期的なセキュリティワークショップ

### 13.2 運用者トレーニング

- システム監視とインシデント対応
- バックアップと復旧手順
- セキュリティツールの使用方法

### 13.3 ユーザー教育

- 安全なパスワード管理の推奨
- プライバシー設定の説明
- セキュリティ上の懸念事項の報告方法

## 14. セキュリティ強化ロードマップ

### 14.1 フェーズ1までに実装

- 基本的な認証システム
- HTTPS完全実装
- 基本的な入力検証
- エラーログ監視

### 14.2 フェーズ2までに実装

- レート制限
- Helmet.jsによるセキュリティヘッダー
- 自動バックアップシステム
- 基本的な監視システム

### 14.3 フェーズ3までに実装

- 多要素認証オプション
- ユーザー権限管理の強化
- 完全な自動化監視システム
- 定期的な脆弱性スキャン

### 14.4 フェーズ4以降で実装

- 高度なデータ暗号化
- セキュリティインシデント自動検出
- APIゲートウェイの検討
- セキュリティ監査の実施

## 15. 連絡先と報告手順

### 15.1 セキュリティインシデント報告

セキュリティに関する問題やインシデントは以下の連絡先に報告してください：

- メール: security@pinthop.com
- 緊急連絡先: +1-XXX-XXX-XXXX

### 15.2 脆弱性報告プログラム

PintHopは責任ある脆弱性報告を奨励しています。脆弱性を発見した場合は、以下の手順で報告をお願いします：

1. security@pinthop.comに詳細を送信
2. 脆弱性の説明と再現手順を含める
3. PintHopチームが72時間以内に応答
4. 修正完了後、報告者に通知

---

本セキュリティポリシーは定期的に見直され、必要に応じて更新されます。

最終更新日: 2025-04-19
