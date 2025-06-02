# AGENTS.md - PintHop Project

## プロジェクト概要

PintHopは「次の一杯を見つける」個人体験と「自然に友達とつながる」社会体験を同等に重視した、クラフトビール体験向上プラットフォームです。

## エージェント動作指針

### 第1優先: ドキュメント整合性の維持

1. **ドキュメント間の整合性確認**
   - 変更を加える前に、関連するすべてのドキュメントを確認すること
   - 矛盾や不整合を発見した場合は、修正提案を行うこと
   - 更新日時と更新者情報を必ず記録すること

2. **ドキュメント更新ルール**
   - コード実装時は必ず関連ドキュメントを更新すること
   - 更新履歴セクションに変更内容を記録すること
   - ファイルパスや構造の変更は全ドキュメントに反映すること

### コーディング規則

`Document/jp/Code-rule.md`に従って実装すること。主要な規則：

1. **ファイルヘッダー**: すべてのソースファイルに規定のヘッダーを含める
2. **命名規則**: 
   - クラス/型名: PascalCase
   - 変数/関数名: camelCase  
   - 定数: UPPER_SNAKE_CASE
3. **エラー処理**: 具体的な例外タイプでキャッチし、適切なリカバリーを実装
4. **セキュリティ**: 入力検証、認証・認可、SQL/NoSQL注入対策を徹底

### 実装手順

1. **ドキュメント確認**
   - 実装前に関連ドキュメントを読み込む
   - 仕様の不明点は明確化する

2. **コード実装**
   - ドキュメントの仕様に従って実装
   - コメントを適切に記述
   - エラーハンドリングを実装

3. **テストコード作成**
   - ユニットテストを必ず作成
   - テストカバレッジ80%以上を目標
   - 境界値テストを含める

4. **ドキュメント更新**
   - 実装したファイルパスを追記
   - APIやスキーマの変更を反映
   - 更新履歴を記録

5. **引き継ぎ準備**
   - READMEに実行手順を記載
   - 環境構築手順を明記
   - 既知の問題や注意点を文書化

## プロジェクト構造

### ドキュメント構造

```
PintHop/
├── Document/
│   ├── Design/                        # デザイン資料
│   │   └── prototypes/
│   ├── en/                           # 英語ドキュメント
│   │   ├── README.md
│   │   ├── specification.md
│   │   └── strategy.md
│   └── jp/                           # 日本語ドキュメント
│       ├── Code-rule.md
│       ├── api-document.md
│       ├── database-schema.md
│       ├── deployment-document.md
│       ├── documents-consistency-analysis.md
│       ├── git-workflow.md
│       ├── implementation-plan.md
│       ├── implementation-status.md
│       ├── incident-response.md
│       ├── phase0-implementation-plan.md
│       ├── project-structure.md
│       ├── security-checklist.md
│       ├── security-policy.md
│       ├── setup-guide.md
│       ├── specification.md
│       ├── sprint-plan.md
│       ├── strategy.md
│       ├── test-plan.md
│       └── ui-ux-flow.md
├── Prompts/                          # AI開発支援プロンプト
├── frontend/                         # フロントエンドアプリケーション
├── backend/                          # バックエンドアプリケーション
└── AGENTS.md                         # 本ファイル
```


### 実装予定構造（Document/jp/project-structure.mdより）

#### フロントエンド構造
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── map/
│   │   ├── brewery/
│   │   ├── beer/
│   │   ├── user/
│   │   └── presence/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── styles/
├── package.json
└── tsconfig.json
```

#### バックエンド構造
```
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middlewares/
│   ├── models/
│   ├── services/
│   ├── data/
│   ├── utils/
│   ├── config/
│   └── socket/
├── scripts/
├── tests/
└── package.json
```

## 実装済みファイル一覧

### ドキュメント（実装済み）
- [x] Document/jp/Code-rule.md
- [x] Document/jp/api-document.md (最終更新: 2025-05-04)
- [x] Document/jp/database-schema.md
- [x] Document/jp/deployment-document.md
- [x] Document/jp/documents-consistency-analysis.md
- [x] Document/jp/git-workflow.md
- [x] Document/jp/implementation-plan.md
- [x] Document/jp/implementation-status.md
- [x] Document/jp/incident-response.md
- [x] Document/jp/phase0-implementation-plan.md
- [x] Document/jp/project-structure.md
- [x] Document/jp/security-checklist.md
- [x] Document/jp/security-policy.md
- [x] Document/jp/setup-guide.md
- [x] Document/jp/specification.md (最終更新: 2025-04-27)
- [x] Document/jp/sprint-plan.md
- [x] Document/jp/strategy.md
- [x] Document/jp/test-plan.md
- [x] Document/jp/ui-ux-flow.md (最終更新: 2025-05-04)
### ソースコード（主要ファイル）

- [x] frontend/package.json
- [x] frontend/tsconfig.json
- [x] frontend/src/index.tsx
- [x] frontend/src/App.tsx
- [x] backend/package.json
- [x] backend/src/server.ts
- [x] backend/src/app.ts
## 技術スタック

### フロントエンド
- React 18
- TypeScript 5.0
- Tailwind CSS 3.0
- Leaflet.js（地図表示）

### バックエンド
- Node.js 18.x
- Express 4.x
- MongoDB 7.0
- Socket.IO（リアルタイム通信）

## API仕様要約

`Document/jp/api-document.md`より主要エンドポイント：

### 認証
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout

### ユーザー
- GET /api/v1/users/me
- PATCH /api/v1/users/me
- GET /api/v1/users/search

### ブルワリー
- GET /api/v1/breweries
- GET /api/v1/breweries/:breweryId
- GET /api/v1/breweries/search

### チェックイン
- POST /api/v1/checkins
- POST /api/v1/checkins/:checkinId/checkout
- GET /api/v1/checkins

## データベーススキーマ要約

`Document/jp/database-schema.md`より主要コレクション：

1. **users**: ユーザー情報、認証、プライバシー設定
2. **breweries**: ブルワリー基本情報、評価、スタイル
3. **beers**: ビール情報、スタイル、評価
4. **checkins**: チェックイン履歴、ビール体験
5. **presences**: リアルタイム位置情報
6. **taplists**: タップリスト写真と情報

## セキュリティ要件

`Document/jp/security-policy.md`より重要事項：

1. **認証**: JWT使用（アクセストークン15分、リフレッシュトークン7日）
2. **パスワード**: bcrypt（コスト係数14以上）
3. **入力検証**: Express-validatorで全エンドポイント検証
4. **レート制限**: 認証10req/5min、一般100req/min

## テスト要件

1. **カバレッジ**: 80%以上を目標
2. **テスト種別**: ユニット、統合、E2E
3. **命名規則**: test_[機能]_[条件]_[期待結果]
4. **実行環境**: Jest（フロントエンド）、Mocha（バックエンド）

## 実装チェックリスト

### フェーズ0（マイクロMVP）実装項目
- [ ] 基本的な認証システム
- [ ] ブルワリーJSONデータ構造
- [ ] シンプルなマップ表示
- [ ] 基本的なプレゼンス機能
- [ ] 5タブUI構造

### ドキュメント更新チェックリスト
- [ ] 実装ファイルをproject-structure.mdに追記
- [ ] API変更をapi-document.mdに反映
- [ ] スキーマ変更をdatabase-schema.mdに反映
- [ ] セキュリティ実装をsecurity-checklist.mdで確認

## 引き継ぎ情報

### 環境構築手順
1. Node.js 18.xをインストール
2. MongoDB 7.0をセットアップ
3. `npm install`で依存関係インストール
4. 環境変数を`.env`に設定
5. `npm run dev`で開発サーバー起動

### 既知の課題
- 基本的なTypeScript実装は完了
- フェーズ0の開発環境構築詳細は`Document/jp/Setup/Phase0.md`参照

### 次のステップ
1. プロジェクト初期化（package.json作成）
2. 基本的なファイル構造の作成
3. 認証システムの実装
4. テスト環境のセットアップ

## 更新履歴

- 2025-05-23 AGENTS.md初版作成

---

**注意**: このファイルは、AIエージェントがプロジェクトを理解し、一貫性のある開発を行うためのガイドです。実装や仕様変更時は必ずこのファイルも更新してください。
