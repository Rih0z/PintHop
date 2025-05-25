---
# ドキュメント情報
プロジェクト: PintHop
ファイル名: project-structure.md
ファイルパス: Document/jp/project-structure.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-19

# 更新履歴
- 2025-04-19 Koki Riho 初版作成
- 2025-05-24 AI Assistant BreweryMapコンポーネントを追加
- 2025-05-24 AI Assistant Mapページとルーティング設定を追加
- 2025-05-24 AI Assistant 認証APIファイル追加
- 2025-05-24 AI Assistant プレゼンスAPIファイル追加
- 2025-05-24 AI Assistant チェックインAPIファイル追加
- 2025-05-24 Koki Riho Timelineページとプレゼンス関連コンポーネント追加
- 2025-05-25 Codex BreweryCardコンポーネント追加
- 2025-05-25 Codex AuthContextコンポーネントと認証サービス追加
- 2025-05-26 Codex useGeolocationフック追加
- 2025-05-27 Koki Riho and Codex PresenceContextとusePresenceフック追加

# 説明
PintHopアプリケーションのプロジェクト構造を定義するドキュメント。ディレクトリ構成、ファイル構造、および各コンポーネントの関係性を詳細に説明します。
---

# PintHop プロジェクト構造定義書

## 1. 概要

本文書はPintHopアプリケーションのプロジェクト構造を定義するものです。PintHopは「次の一杯を見つける」個人体験と「自然に友達とつながる」社会体験を同等に重視した、クラフトビール体験向上プラットフォームです。

## 2. ディレクトリ構造

PintHopプロジェクトは以下のトップレベルディレクトリ構造で構成されます：

```
PintHop/
├── Document/            # プロジェクト関連ドキュメント
│   └── jp/              # 日本語ドキュメント
├── Prompts/             # AI開発支援プロンプト
├── frontend/            # フロントエンドアプリケーション
└── backend/             # バックエンドアプリケーション
    └── scripts/         # 運用自動化スクリプト
```

### Document/jp ディレクトリ
主要ドキュメントを格納します。例:

```
Document/jp/
├── architecture.md          # システムアーキテクチャ概要
├── Code-rule.md             # コーディング規則
├── api-document.md          # API仕様書
├── database-schema.md       # データベーススキーマ
└── ...
```

## 3. フロントエンドの構造

フロントエンドは React 18, TypeScript 5.0, Tailwind CSS 3.0 で構築され、以下の構造を持ちます：

```
frontend/
├── public/              # 静的ファイル
│   ├── index.html       # メインHTMLファイル
│   ├── favicon.ico      # サイトアイコン
│   └── assets/          # 画像等の静的アセット
│
├── src/                 # ソースコード
│   ├── components/      # 再利用可能なUIコンポーネント
│   │   ├── common/      # 共通コンポーネント
│   │   ├── layout/      # レイアウト関連コンポーネント
│   │   ├── map/         # マップ関連コンポーネント
│   │   │   └── BreweryMap.tsx    # ブルワリーマップ表示
│   │   ├── brewery/     # ブルワリー関連コンポーネント
│   │   │   ├── BreweryDetails.tsx    # ブルワリー詳細表示
│   │   │   ├── BreweryRatings.tsx    # レビューサイト評価表示
│   │   │   └── BreweryCard.tsx       # ブルワリーカード表示
│   │   ├── beer/        # ビール関連コンポーネント
│   │   ├── user/        # ユーザー関連コンポーネント
│   │   └── presence/    # プレゼンス関連コンポーネント
│   │       └── FriendsPresenceList.tsx # 友達プレゼンス表示
│   │
│   ├── context/         # Reactコンテキスト
│   │   ├── AuthContext.tsx     # 認証コンテキスト
│   │   ├── PresenceContext.tsx # プレゼンスコンテキスト
│   │   └── UIContext.tsx       # UI状態コンテキスト
│   │
│   ├── hooks/           # カスタムフック
│   │   ├── useAuth.ts         # 認証フック
│   │   ├── usePresence.ts     # プレゼンス関連フック
│   │   ├── useFriendsPresence.ts # 友達プレゼンス取得フック
│   │   ├── useBreweries.ts    # ブルワリーデータフック
│   │   └── useGeolocation.ts  # 位置情報フック
│   │
│   ├── pages/           # 画面コンポーネント
│   │   ├── Timeline.tsx      # タイムライン画面
│   │   ├── Map.tsx           # マップ画面
│   │   ├── BrewerySearch.tsx # ブルワリー検索画面
│   │   ├── Profile.tsx       # プロフィール画面
│   │   ├── BreweryDetail.tsx # ブルワリー詳細画面
│   │   ├── Auth.tsx          # 認証画面
│   │   └── Events.tsx        # イベント画面（将来実装）
│   │
│   ├── services/        # APIやサービス連携
│   │   ├── api.ts           # APIクライアント
│   │   ├── auth.ts          # 認証サービス
│   │   ├── breweries.ts     # ブルワリーサービス
│   │   ├── presence.ts      # プレゼンスサービス
│   │   └── websocket.ts     # WebSocket接続
│   │
│   ├── types/           # TypeScript型定義
│   │   ├── models.ts        # データモデル型
│   │   ├── api.ts           # API関連型
│   │   ├── presence.ts      # プレゼンス型定義
│   │   └── common.ts        # 共通型
│   │
│   ├── utils/           # ユーティリティ関数
│   │   ├── formatters.ts    # フォーマット関数
│   │   ├── validators.ts    # バリデーション関数
│   │   ├── storage.ts       # ローカルストレージ管理
│   │   └── mapUtils.ts      # マップ関連ユーティリティ
│   │
│   ├── styles/          # グローバルスタイル
│   │   └── tailwind.css     # Tailwind CSSエントリーポイント
│   │
│   ├── App.tsx          # アプリケーションルートコンポーネント
│   ├── index.tsx        # エントリーポイント
│   └── router.tsx       # ルーティング設定
│
├── .env.example         # 環境変数サンプル
├── .gitignore           # Gitの除外ファイル設定
├── package.json         # 依存関係定義
├── tsconfig.json        # TypeScript設定
├── tailwind.config.js   # Tailwind CSS設定
└── README.md            # フロントエンドREADME
```

## 4. バックエンドの構造

バックエンドは Node.js 18.x, Express 4.x, MongoDB 7.0 で構築され、以下の構造を持ちます：

```
backend/
├── src/                 # ソースコード
│   ├── api/             # APIエンドポイント
│   │   ├── routes/        # ルート定義
│   │   │   ├── auth.js      # 認証ルート
│   │   │   ├── users.js     # ユーザールート
│   │   │   ├── breweries.js # ブルワリールート
│   │   │   ├── beers.js     # ビールルート
│   │   │   ├── checkinRoutes.ts # チェックインルート
│   │   │   ├── presenceRoutes.ts # プレゼンスルート
│   │   │   └── events.js    # イベントルート
│   │   │
│   │   ├── controllers/   # コントローラー
│   │   │   ├── auth.js      # 認証コントローラー
│   │   │   ├── users.js     # ユーザーコントローラー
│   │   │   ├── breweries.js # ブルワリーコントローラー
│   │   │   ├── beers.js     # ビールコントローラー
│   │   │   ├── checkinController.ts # チェックインコントローラー
│   │   │   ├── presenceController.ts # プレゼンスコントローラー
│   │   │   └── events.js    # イベントコントローラー
│   │   │
│   │   └── middlewares/   # ミドルウェア
│   │       ├── auth.js      # 認証ミドルウェア
│   │       ├── validation.js # バリデーションミドルウェア
│   │       ├── errorHandler.js # エラーハンドリング
│   │       └── rateLimiter.js # レート制限
│   │
│   ├── models/          # データモデル
│   │   ├── User.js        # ユーザーモデル
│   │   ├── Brewery.js     # ブルワリーモデル
│   │   ├── Beer.js        # ビールモデル
│   │   ├── Checkin.js     # チェックインモデル
│   │   ├── Presence.ts    # プレゼンスモデル
│   │   ├── TapList.js     # タップリストモデル
│   │   ├── Event.js       # イベントモデル
│   │   └── Badge.js       # バッジモデル
│   │
│   ├── services/        # ビジネスロジック
│   │   ├── auth.js        # 認証サービス
│   │   ├── brewery.js     # ブルワリーサービス
│   │   ├── beer.js        # ビールサービス
│   │   ├── presence.js    # プレゼンスサービス
│   │   ├── taplist.js     # タップリストサービス
│   │   ├── notification.js # 通知サービス
│   │   └── badge.js       # バッジサービス
│   │
│   ├── data/            # データ管理
│   │   ├── breweries/     # ブルワリーJSONデータ
│   │   │   ├── seattle.json  # シアトル地域データ
│   │   │   └── portland.json # ポートランド地域データ（将来）
│   │   │
│   │   ├── beerstyles/    # ビアスタイルデータ
│   │   └── seeds/         # シードデータ
│   │
│   ├── utils/           # ユーティリティ関数
│   │   ├── logger.js      # ロギングユーティリティ
│   │   ├── security.js    # セキュリティユーティリティ
│   │   ├── validation.js  # バリデーションユーティリティ
│   │   └── formatter.js   # フォーマットユーティリティ
│   │
│   ├── config/          # 設定ファイル
│   │   ├── db.js          # データベース設定
│   │   ├── auth.js        # 認証設定
│   │   ├── server.js      # サーバー設定
│   │   └── security.js    # セキュリティ設定
│   │
│   ├── socket/          # WebSocketハンドラ
│   │   ├── index.js       # Socket.IO初期化
│   │   ├── presence.js    # プレゼンスイベントハンドラ
│   │   └── notification.js # 通知イベントハンドラ
│   │
│   ├── app.js           # Expressアプリケーション
│   └── server.js        # サーバーエントリーポイント
│
├── scripts/             # 運用自動化スクリプト
│   ├── backup.sh        # バックアップスクリプト
│   ├── deploy.sh        # デプロイスクリプト
│   ├── maintenance.sh   # メンテナンススクリプト
│   └── log-alert.sh     # ログ監視アラートスクリプト
│
├── tests/               # テストコード
│   ├── unit/            # ユニットテスト
│   ├── integration/     # 統合テスト
│   └── fixtures/        # テスト用データ
│   └── breweryRoutes.test.ts # ブルワリールートテスト
│   └── authRoutes.test.ts    # 認証ルートテスト
│   └── presenceRoutes.test.ts # プレゼンスルートテスト
│   └── checkinRoutes.test.ts  # チェックインルートテスト
│
├── .env.example         # 環境変数サンプル
├── .gitignore           # Gitの除外ファイル設定
├── package.json         # 依存関係定義
├── jest.config.js       # テスト設定
└── README.md            # バックエンドREADME
```

## 5. データ管理構造

### 5.1 JSONベースのブルワリーデータ

ブルワリーデータは地域別のJSONファイルで管理され、以下の構造を持ちます：

```json
{
  "region": "seattle",
  "lastUpdated": "2024-04-19T00:00:00Z",
  "breweries": [
    {
      "id": "brewery-001",
      "name": "Example Brewing",
      "address": "123 Beer St, Seattle, WA 98101",
      "location": {
        "type": "Point",
        "coordinates": [-122.332071, 47.606209]
      },
      "businessHours": {
        "monday": { "open": "16:00", "close": "22:00" },
        "tuesday": { "open": "16:00", "close": "22:00" },
        "wednesday": { "open": "16:00", "close": "22:00" },
        "thursday": { "open": "14:00", "close": "22:00" },
        "friday": { "open": "14:00", "close": "23:00" },
        "saturday": { "open": "12:00", "close": "23:00" },
        "sunday": { "open": "12:00", "close": "20:00" }
      },
      "contact": {
        "phone": "+1-206-555-0100",
        "email": "info@examplebrewing.com",
        "website": "https://examplebrewing.com"
      },
      "ratings": {
        "untappd": 4.2,
        "rateBeer": 92,
        "beerAdvocate": 88
      },
      "specialtyStyles": [
        {
          "style": "New England IPA",
          "rating": 4.5,
          "confidence": 0.9
        },
        {
          "style": "Imperial Stout",
          "rating": 4.3,
          "confidence": 0.8
        }
      ],
      "awards": [
        {
          "name": "Great American Beer Festival",
          "year": 2023,
          "category": "Hazy IPA",
          "beerName": "Cloudy Logic",
          "medal": "Silver"
        }
      ],
      "description": "A Seattle favorite known for their hazy IPAs and barrel-aged stouts."
    }
  ]
}
```

### 5.2 設定ファイル

#### フロントエンド環境変数（.env）

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

#### バックエンド環境変数（.env）

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pinthop
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

## 6. デプロイ構造

### 6.1 フロントエンド（Netlify）

Netlifyを使用したフロントエンドのデプロイは以下のように構成されます：

```
netlify.toml
├── [build]
│   ├── command = "cd frontend && npm ci && npm run build"
│   └── publish = "frontend/build"
├── [build.environment]
│   └── NODE_VERSION = "18"
└── [[redirects]]
    ├── from = "/*"
    ├── to = "/index.html"
    ├── status = 200
```

### 6.2 バックエンド（rihobeer.com）

バックエンドはrihobeer.comサーバーにデプロイされ、以下の構成となります：

- `/var/www/pinthop` - アプリケーションディレクトリ
- PM2によるプロセス管理
- NginxによるリバースプロキシとHTTPS終端

```nginx
# /etc/nginx/sites-available/pinthop
server {
    listen 80;
    server_name api.pinthop.com;
    server_tokens off;
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name api.pinthop.com;
    server_tokens off;
    
    ssl_certificate /etc/letsencrypt/live/api.pinthop.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.pinthop.com/privkey.pem;
    
    # セキュリティヘッダー設定
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; img-src 'self' data: https://api.mapbox.com; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://api.mapbox.com wss://api.pinthop.com;" always;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 7. 運用監視構造

### 7.1 ログ管理

```
/var/log/pinthop/
├── api.log             # APIログ
├── error.log           # エラーログ
├── access.log          # アクセスログ
├── maintenance.log     # メンテナンスログ
└── backups.log         # バックアップログ
```

### 7.2 モニタリングとアラート

- PM2によるプロセス監視
- カスタムスクリプトによるログ監視と異常検出
- UptimeRobotによる外部からのヘルスチェック

## 8. リソース配置

### 8.1 静的アセット

フロントエンドの静的アセットは以下の構造で管理されます：

```
frontend/public/assets/
├── images/           # 画像ファイル
│   ├── logos/        # ロゴ画像
│   ├── icons/        # アイコン画像
│   └── backgrounds/  # 背景画像
├── fonts/            # フォントファイル
└── data/             # 静的データファイル
    └── constants.json  # 定数データ
```

### 8.2 サードパーティリソース

以下のサードパーティリソースを使用します：

- Mapbox（地図表示）
- MongoDB Atlas（データベースホスティング）
- Netlify（フロントエンドホスティング）
- Let's Encrypt（SSL証明書）

## 9. 開発フローとツール

### 9.1 開発環境構成

開発には以下のツールを使用します：

- Node.js 18.x
- npm 10.x
- VS Code（推奨エディタ）
- MongoDB 7.0（ローカル開発用）
- Git

### 9.2 ワークフロー

開発は以下のフローで行われます：

1. 機能ブランチの作成（`feature/機能名`）
2. ローカル開発・テスト
3. プルリクエスト作成
4. コードレビュー
5. テスト環境での検証
6. マージと本番デプロイ

## 10. 将来拡張

将来の拡張性を考慮して、以下の構造が拡張可能なように設計されています：

- 地域別JSONデータの追加
- AI機能追加のためのサービス層
- モバイルアプリ対応のためのAPIエンドポイント
- イベント管理機能追加のためのモデルとAPI

以上のプロジェクト構造は、実装計画に基づいて段階的に構築・拡張されます。
