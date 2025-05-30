# PintHopフェーズ0（マイクロMVP）実装計画書

## ドキュメント情報
プロジェクト: PintHop
ファイル名: phase0-implementation-plan.md
ファイルパス: Document/jp/phase0-implementation-plan.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-21
最終更新: 2025-04-27

## 更新履歴
- 2025-04-21 Koki Riho 初版作成
- 2025-04-27 Koki Riho フェーズ0の開発環境構築部分の参照をSetup/Phase0.mdに更新

## 説明
PintHopアプリケーションのフェーズ0（マイクロMVP）実装計画を定義するドキュメント。8週間で実装するリアルタイム存在共有とシアトル限定ブルワリーマップの最小限実装の詳細を説明します。

----

# 1. 概要

フェーズ0（マイクロMVP）では、PintHopの核心機能である「リアルタイム存在共有」と「偶然の出会い」の基盤となる要素を最小限の機能セットで実装します。このフェーズでは、シアトル地域限定のブルワリーマップとリアルタイムプレゼンス共有の基本機能に焦点を当て、8週間での完成を目指します。

※ ビール発見・評価機能はNextPint（https://github.com/Rih0z/NextPint）で提供

## 1.1 重要な成果物

- 基本的なユーザー認証システム
- シアトル地域のブルワリーデータベース（JSONベース）
- 5タブ構造の基本UI
- Leaflet.jsを使用したマップ表示
- 友達接続の基本機能
- 位置情報共有のシンプルな実装
- プライバシー設定の基本機能

## 1.2 実装スケジュール

- **Week 1-2**: 開発環境構築とドキュメント整備（詳細手順はDocument/jp/Setup/Phase0.mdを参照）
- **Week 3-4**: ブルワリーマップの基本実装
- **Week 5-6**: リアルタイム存在共有の基盤実装
- **Week 7-8**: 機能統合とリリース準備

---

# 2. 開発環境とプロジェクト構造

## 2.1 開発環境設定

### 2.1.1 フロントエンド
```bash
# プロジェクト作成
npx create-react-app frontend --template typescript

# 必要なパッケージのインストール
cd frontend
npm install react-router-dom axios leaflet react-leaflet tailwindcss jwt-decode

# Tailwind CSS設定
npx tailwindcss init -p
```

### 2.1.2 バックエンド
```bash
# プロジェクト作成
mkdir backend
cd backend
npm init -y

# 必要なパッケージのインストール
npm install express mongoose dotenv cors helmet jsonwebtoken bcrypt express-validator morgan
npm install nodemon ts-node typescript --save-dev

# TypeScript設定
npx tsc --init
```

## 2.2 プロジェクト構造

### 2.2.1 フロントエンド構造
```
frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── brewery/
│   │   │   ├── BreweryCard.tsx
│   │   │   └── BreweryList.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── Footer.tsx
│   │   ├── map/
│   │   │   ├── BreweryMap.tsx
│   │   │   └── PresenceMarker.tsx
│   │   ├── presence/
│   │   │   ├── FriendList.tsx
│   │   │   └── PresenceStatus.tsx
│   │   └── settings/
│   │       └── PrivacySettings.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── PresenceContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBreweries.ts
│   │   └── usePresence.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── MapPage.tsx
│   │   ├── BreweryPage.tsx
│   │   ├── EventPage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── brewery.ts
│   │   └── presence.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── brewery.types.ts
│   │   └── presence.types.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── locationUtils.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── router.tsx
├── .env
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### 2.2.2 バックエンド構造
```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── brewery.controller.ts
│   │   └── presence.controller.ts
│   ├── data/
│   │   └── breweries.json
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── brewery.model.ts
│   │   └── presence.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── brewery.routes.ts
│   │   ├── presence.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── brewery.service.ts
│   │   └── presence.service.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── brewery.types.ts
│   │   └── presence.types.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── tokens.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

---

# 3. 機能実装計画

## 3.1 認証システム（基本）

### 3.1.1 実装機能
- メールとパスワードによる基本的なユーザー登録
- ログイン/ログアウト機能
- JWTトークンによる認証
- セキュアなパスワード保存（bcryptによるハッシュ化）
- 簡易的なユーザープロフィール

### 3.1.2 エンドポイント
| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| POST    | /api/auth/register | ユーザー登録 |
| POST    | /api/auth/login    | ログイン |
| GET     | /api/auth/profile  | プロフィール取得 |
| PUT     | /api/auth/profile  | プロフィール更新 |

### 3.1.3 データモデル
```typescript
// ユーザーモデル（簡易版）
interface User {
  _id: string;
  username: string;
  email: string;
  password: string; // ハッシュ化
  name?: string;
  profilePicture?: string;
  friends: string[]; // ユーザーID配列
  privacySettings: {
    locationSharing: 'everyone' | 'friends' | 'none';
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 3.2 ブルワリーマップ

### 3.2.1 実装機能
- シアトル地域のブルワリーデータをJSONファイルで管理
- Leaflet.jsを使用したマップ表示
- ブルワリーの位置表示
- ブルワリー情報カード表示
- 基本的な検索・フィルター機能

### 3.2.2 エンドポイント
| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| GET     | /api/breweries | ブルワリー一覧取得 |
| GET     | /api/breweries/:id | ブルワリー詳細取得 |
| GET     | /api/breweries/search | ブルワリー検索 |

### 3.2.3 データモデル
```typescript
// ブルワリーモデル（簡易版）
interface Brewery {
  _id: string;
  name: string;
  slug: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  contact: {
    phone?: string;
    website?: string;
  };
  businessHours?: {
    [day: string]: { open: string; close: string };
  };
  description?: string;
  images?: {
    logo?: string;
  };
  ratings?: {
    untappd?: number;
    googleReviews?: number;
    averageRating?: number;
  };
  specialtyStyles?: string[];
  flags?: {
    hasTaproom: boolean;
    hasFood: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2.4 初期データ
- シアトル地域の主要ブルワリー30件を含むJSONファイルを作成
- 各ブルワリーの基本情報、位置情報、営業時間を含める
- Untappdなどの外部レビューサイトの評価情報を統合

## 3.3 リアルタイムプレゼンス共有

### 3.3.1 実装機能
- 友達追加・承認の基本機能
- 現在位置（ブルワリー）の共有
- プレゼンス表示（オンライン、オフライン、特定ブルワリーに滞在中）
- プライバシー設定（位置情報共有の制御）

### 3.3.2 エンドポイント
| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| POST    | /api/friends/request | 友達リクエスト送信 |
| PUT     | /api/friends/accept/:id | 友達リクエスト承認 |
| GET     | /api/friends | 友達一覧取得 |
| POST    | /api/presence/update | プレゼンス更新 |
| GET     | /api/presence/friends | 友達のプレゼンス取得 |

### 3.3.3 データモデル
```typescript
// プレゼンスモデル
interface Presence {
  user: string; // ユーザーID
  breweryId?: string; // 滞在中のブルワリーID
  status: 'online' | 'offline' | 'at_brewery';
  lastUpdated: Date;
  visible: boolean; // プライバシー設定に基づく
}

// 友達リクエストモデル
interface FriendRequest {
  sender: string; // ユーザーID
  receiver: string; // ユーザーID
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}
```

---

# 4. UI/UX設計

## 4.1 5タブ基本構造

### 4.1.1 タブ構成
1. **タイムライン** - 友達の活動、近くのイベント（簡易版）
2. **マップ** - ブルワリー地図と友達のプレゼンス表示
3. **ブルワリー検索** - ブルワリーリストと簡易検索
4. **イベント** - 基本的なイベント表示（静的データ、フェーズ0では最小限）
5. **プロフィール** - ユーザープロフィールと設定

### 4.1.2 画面遷移フロー
1. 未認証ユーザー: ログイン/登録画面 → メイン画面
2. 認証済みユーザー: メイン画面（5タブ）→ 詳細画面

## 4.2 主要画面設計

### 4.2.1 認証画面
- ログインフォーム（メール、パスワード）
- 登録フォーム（ユーザー名、メール、パスワード）
- ソーシャルログインボタン（UI表示のみ、機能なし）

### 4.2.2 マップ画面
- Leaflet.jsベースのマップ
- ブルワリーマーカー（クリックで詳細表示）
- 友達の位置マーカー（プライバシー設定に基づく）
- 簡易フィルターパネル

### 4.2.3 ブルワリー詳細画面
- 基本情報（名前、住所、営業時間）
- 現在の混雑状況表示
- 滞在中の友達表示
- 「訪問中」ボタン（プレゼンス更新）

### 4.2.4 プロフィール画面
- ユーザー情報表示/編集
- プライバシー設定
- 友達管理（一覧、リクエスト）
- ログアウトボタン

## 4.3 UI設計の原則

### 4.3.1 デザイン言語
- Tailwind CSSによるモバイルファーストデザイン
- シンプルで直感的なインターフェース
- ブルワリー/クラフトビールの雰囲気を反映した配色
  - プライマリカラー: アンバー系(#F59E0B)
  - セカンダリカラー: 濃い茶色(#78350F)
  - アクセントカラー: ホップグリーン(#10B981)

### 4.3.2 レスポンシブ設計
- モバイル優先の設計（主要ターゲットはスマートフォン利用者）
- タブレット・デスクトップ表示にも対応
- タッチインターフェース最適化

---

# 5. セキュリティ対策

## 5.1 認証セキュリティ

### 5.1.1 JWT実装
- アクセストークン有効期限: 15分
- リフレッシュトークン有効期限: 7日間
- JWTペイロード最小化（ユーザーID、ロールのみ）
- HTTP Onlyクッキーでのトークン保存

### 5.1.2 パスワード管理
- bcryptによるハッシュ化（コスト係数14）
- パスワード強度ポリシー（最低8文字、英数字混在）

## 5.2 API保護

### 5.2.1 入力検証
- すべてのユーザー入力に対するバリデーション
- express-validatorによる検証ミドルウェア

### 5.2.2 レート制限
- 認証エンドポイント: 10req/5min（IPベース）
- 一般エンドポイント: 100req/min（認証ユーザーベース）

### 5.2.3 セキュリティヘッダー
- Helmet.jsによる基本セキュリティヘッダー設定
- CORS設定（フロントエンドドメインのみ許可）

## 5.3 位置情報のプライバシー保護

### 5.3.1 デフォルト設定
- 位置情報共有: friendsのみ（デフォルト）
- 詳細な位置履歴は保存しない（現在位置のみ）

### 5.3.2 ユーザーコントロール
- 位置情報共有の簡易切り替え
- 友達ごとの表示設定（フェーズ1で実装予定、フェーズ0ではすべての友達に共有）

---

# 6. テスト計画

## 6.1 単体テスト

### 6.1.1 テスト対象
- 認証ロジック
- データモデル
- APIエンドポイント
- ユーティリティ関数

### 6.1.2 テストツール
- Jest: テストフレームワーク
- Supertest: APIテスト

## 6.2 統合テスト

### 6.2.1 テスト対象
- 認証フロー
- マップ表示とデータ連携
- プレゼンス更新と表示

### 6.2.2 テスト環境
- テスト用MongoDBインスタンス
- モック位置情報

## 6.3 手動テスト

### 6.3.1 テスト項目
- ユーザー登録・ログインフロー
- 地図操作・ブルワリー表示
- 友達リクエスト・承認
- プレゼンス更新と表示
- レスポンシブデザイン確認

### 6.3.2 デバイステスト
- iPhone・Android実機テスト
- デスクトップブラウザテスト
- タブレット表示テスト

---

# 7. デプロイ計画

## 7.1 ステージング環境

### 7.1.1 フロントエンド
- Netlify（開発ブランチ連携）
- サブドメイン: staging.pinthop.netlify.app

### 7.1.2 バックエンド
- rihobeer.comの開発環境
- エンドポイント: api-dev.rihobeer.com/pinthop

### 7.1.3 データベース
- MongoDB Atlas開発クラスター
- 開発用環境変数設定

## 7.2 本番環境

### 7.2.1 フロントエンド
- Netlify（mainブランチ連携）
- ドメイン: app.pinthop.com（予定）

### 7.2.2 バックエンド
- rihobeer.comの本番環境
- エンドポイント: api.rihobeer.com/pinthop

### 7.2.3 データベース
- MongoDB Atlas本番クラスター
- 本番用環境変数設定

## 7.3 CI/CD設定

### 7.3.1 GitHub Actions
- プルリクエスト時にテスト実行
- mainブランチマージ時に自動デプロイ
- セキュリティスキャン実行

### 7.3.2 デプロイ前チェックリスト
- 全テスト合格
- セキュリティチェック合格
- パフォーマンス基準達成

---

# 8. フェーズ0評価基準

## 8.1 成功基準

### 8.1.1 機能基準
- ユーザーが登録・ログインできる
- シアトル地域のブルワリーがマップに表示される
- 友達リクエスト送信・承認ができる
- 現在位置（ブルワリー）を共有できる
- 友達の位置が地図上に表示される

### 8.1.2 技術基準
- APIレスポンスタイム: 500ms以内
- フロントエンドロード時間: 2秒以内
- 99%のアップタイム
- セキュリティチェックリストの完全適合

### 8.1.3 UX基準
- モバイルでのスムーズな操作
- 直感的なナビゲーション
- エラーメッセージの明瞭さ
- 初期ユーザーフィードバックの収集

## 8.2 次フェーズへの移行条件

- フェーズ0の全機能が正常に動作している
- 重大なバグが存在しない
- セキュリティ要件を満たしている
- パフォーマンス基準を達成している
- 初期ユーザーからのフィードバックが収集されている

---

# 9. リスクと軽減策

## 9.1 技術リスク

### 9.1.1 リアルタイム機能の複雑さ
- **リスク**: リアルタイムプレゼンス共有の実装が複雑化
- **軽減策**: 定期的ポーリングベースの最小実装からスタート、後のフェーズでWebSocketに移行

### 9.1.2 モバイル位置情報の制限
- **リスク**: ブラウザの位置情報APIの制限や許可の問題
- **軽減策**: マニュアルチェックイン機能を優先実装、GPS位置は補助的に

## 9.2 スケジュールリスク

### 9.2.1 時間制約
- **リスク**: 8週間での完了が困難
- **軽減策**: 最小機能セットの明確な定義、機能のプライオリタイゼーション

### 9.2.2 機能スコープの拡大
- **リスク**: 開発中の機能追加要求
- **軽減策**: フェーズ0の機能を明確に文書化し、追加機能はフェーズ1以降に延期

## 9.3 ユーザー採用リスク

### 9.3.1 初期ユーザー獲得
- **リスク**: 初期ユーザーの獲得が困難
- **軽減策**: シアトル地域のクラフトビールコミュニティへの直接アプローチ、友達招待機能の優先実装

### 9.3.2 ユーザー体験の不満
- **リスク**: 初期MVPの機能制限によるユーザー不満
- **軽減策**: 期待値の明確な設定、フィードバック収集の仕組み、次のフェーズの機能プレビュー

---

# 10. 実装作業ブレークダウン

## 10.1 Week 1-2: 環境構築とドキュメント整備

開発環境構築とドキュメント整備のステップは、Document/jp/Setup/Phase0.mdに詳細が記載されています。このステップでは以下の作業を行います：

- プロジェクトリポジトリの作成
- 開発環境構築
- 基本的なプロジェクト構造の実装
- 最重要ドキュメントの整備
- セキュリティポリシーの確立

## 10.2 Week 3-4: ブルワリーマップ基盤

- ブルワリーデータ構造の定義
- JSONデータの初期作成（シアトル地域30件）
- マップ表示の基本実装
- ブルワリーデータAPI実装
- ブルワリーカード表示の実装

## 10.3 Week 5-6: リアルタイム存在共有基盤

- ユーザー認証機能の実装
- 友達接続の基本機能実装
- 位置情報共有の基本機能実装
- プライバシー設定の実装
- プレゼンス表示UIの実装

## 10.4 Week 7-8: 統合とリリース準備

- 機能統合と結合テスト
- パフォーマンス最適化
- セキュリティチェック
- デプロイパイプライン構築
- ステージング環境でのテスト
- 本番環境へのリリース準備
- フィードバック収集の仕組み構築

---

# 11. 次フェーズ準備

## 11.1 フェーズ1への接続

フェーズ0のマイクロMVP完了後、フェーズ1では以下の拡張機能に取り組みます：

- コアデータモデルの強化とリレーショナル機能の拡張
- 認証システムのセキュリティ強化
- タイムラインタブの機能拡充
- ルート作成機能の基本実装
- ブルワリー情報の詳細化
- ユーザープロフィールの拡張

## 11.2 データ移行計画

- JSONベースのブルワリーデータからMongoDBへの完全移行
- ユーザーデータの継続性確保
- バージョン互換性の維持

## 11.3 早期フィードバック対応

- フェーズ0での初期ユーザーからのフィードバック収集方法
- 優先度の高い改善点の特定と対応計画
- フェーズ1での実装に反映するフィードバックの選定基準

---

# 12. まとめ

フェーズ0（マイクロMVP）では、PintHopの核心的な価値提案である「偶然の出会い」と「自然に友達とつながる」コミュニティ体験の基盤機能を最小限の形で実装します。8週間のタイムラインで、シアトル地域限定のブルワリーマップとリアルタイムプレゼンス共有の基本機能を提供し、初期ユーザーからのフィードバックを収集します。

セキュリティとプライバシーを重視しながらも、使いやすさと基本的な価値提供を優先する設計とし、フェーズ1以降での機能拡張に備えた堅固な基盤を構築します。
