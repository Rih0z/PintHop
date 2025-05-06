---
# ドキュメント情報
プロジェクト: PintHop
ファイル名: setup-guide.md
ファイルパス: Document/jp/setup-guide.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-19

# 更新履歴
- 2025-04-19 Koki Riho 初版作成

# 説明
PintHopアプリケーションの開発環境セットアップ手順を説明するドキュメント。必要な環境構築、リポジトリのクローン、依存関係の設定、およびアプリケーション起動方法について詳細に説明します。
---

# PintHop セットアップ手順書

## 1. 概要

本文書はPintHopアプリケーションの開発環境セットアップ手順を説明するものです。PintHopは「次の一杯を見つける」個人体験と「自然に友達とつながる」社会体験を同等に重視した、クラフトビール体験向上プラットフォームです。

### 1.1 動作環境要件

#### ハードウェア最小要件
- CPU: デュアルコア以上
- メモリ: 4GB以上（8GB以上推奨）
- ストレージ: 10GB以上の空き容量

#### ソフトウェア要件
- OS: Windows 10/11、macOS 11以上、Ubuntu 20.04以上
- Node.js: 18.x
- MongoDB: 7.0 （ローカル開発用）
- Git: 最新版
- エディタ: Visual Studio Code（推奨）

## 2. 事前準備

### 2.1 Node.jsのインストール

#### Windows
1. [Node.js公式サイト](https://nodejs.org/)から最新のLTS版（18.x）をダウンロード
2. ダウンロードしたインストーラーを実行し、指示に従ってインストール
3. インストール完了後、コマンドプロンプトを開いて確認
```bash
node -v
npm -v
```

#### macOS
Homebrewを使用してインストール:
```bash
brew install node@18
```

または公式サイトからインストーラーをダウンロード:
1. [Node.js公式サイト](https://nodejs.org/)から最新のLTS版（18.x）をダウンロード
2. ダウンロードしたパッケージを実行し、指示に従ってインストール
3. インストール完了後、ターミナルを開いて確認
```bash
node -v
npm -v
```

#### Linux (Ubuntu)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

### 2.2 MongoDB のインストール

#### Windows
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) からインストーラーをダウンロード
2. ダウンロードしたインストーラーを実行
3. 「Complete」インストールを選択
4. 「Install MongoDB as a Service」オプションを選択
5. 「Run service as Network Service user」を選択
6. インストールが完了したら、MongoDBサービスが実行されていることを確認

#### macOS
Homebrewを使用してインストール:
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### Linux (Ubuntu)
```bash
sudo apt-get install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2.3 Git のインストール

#### Windows
1. [Git公式サイト](https://git-scm.com/download/win) からインストーラーをダウンロード
2. ダウンロードしたインストーラーを実行し、デフォルト設定でインストール
3. インストール完了後、コマンドプロンプトを開いて確認
```bash
git --version
```

#### macOS
Homebrewを使用してインストール:
```bash
brew install git
```

または:
1. [Git公式サイト](https://git-scm.com/download/mac) からインストーラーをダウンロード
2. ダウンロードしたパッケージを実行し、指示に従ってインストール

#### Linux (Ubuntu)
```bash
sudo apt-get update
sudo apt-get install git
git --version
```

### 2.4 Visual Studio Code のインストール

1. [Visual Studio Code公式サイト](https://code.visualstudio.com/) からインストーラーをダウンロード
2. ダウンロードしたインストーラーを実行し、指示に従ってインストール
3. 以下の拡張機能のインストールを推奨:
   - ESLint
   - Prettier
   - JavaScript and TypeScript Nightly
   - MongoDB for VS Code
   - Tailwind CSS IntelliSense
   - React Developer Tools
   - GitHub Pull Requests and Issues

## 3. プロジェクトのセットアップ

### 3.1 リポジトリのクローン

```bash
# リポジトリをクローンする
git clone https://github.com/yourusername/pinthop.git

# プロジェクトディレクトリに移動
cd pinthop
```

### 3.2 フロントエンドのセットアップ

```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local
```

`.env.local`ファイルを編集して必要な環境変数を設定します:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

Mapboxトークンを取得するには:
1. [Mapbox公式サイト](https://www.mapbox.com/)でアカウントを作成
2. ダッシュボードから「Access tokens」を選択
3. 新しいトークンを作成または既存のデフォルトトークンをコピー

### 3.3 バックエンドのセットアップ

```bash
# プロジェクトルートディレクトリに戻る
cd ..

# バックエンドディレクトリに移動
cd backend

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
```

`.env`ファイルを編集して必要な環境変数を設定します:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pinthop
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

JWT_SECRETには強力なランダム文字列を設定してください。以下のコマンドで生成できます:

```bash
# ランダムな文字列を生成
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4 データベースの初期化

```bash
# MongoDB が実行中であることを確認
# シードスクリプトを実行してサンプルデータを作成
cd backend
npm run seed
```

シードスクリプトが存在しない場合は、通常の操作でデータベースが自動的に初期化されます。

## 4. 開発サーバーの起動

### 4.1 バックエンドサーバーの起動

```bash
# バックエンドディレクトリで
cd backend
npm run dev
```

バックエンドサーバーは `http://localhost:5000` で実行されます。

### 4.2 フロントエンドサーバーの起動

新しいターミナルを開いて:

```bash
# フロントエンドディレクトリで
cd frontend
npm run start
```

フロントエンドサーバーは `http://localhost:3000` で実行されます。

## 5. プロジェクト構造

プロジェクトは以下の構造になっています:

### 5.1 トップレベルディレクトリ

```
PintHop/
├── Document/            # プロジェクト関連ドキュメント
│   └── jp/              # 日本語ドキュメント
├── Prompts/             # AI開発支援プロンプト
├── frontend/            # フロントエンドアプリケーション
└── backend/             # バックエンドアプリケーション
    └── scripts/         # 運用自動化スクリプト
```

### 5.2 フロントエンドディレクトリ構造

```
frontend/
├── public/              # 静的ファイル
│   ├── index.html       # メインHTMLファイル
│   ├── favicon.ico      # サイトアイコン
│   └── assets/          # 画像等の静的アセット
│
├── src/                 # ソースコード
│   ├── components/      # 再利用可能なUIコンポーネント
│   ├── context/         # Reactコンテキスト
│   ├── hooks/           # カスタムフック
│   ├── pages/           # 画面コンポーネント
│   ├── services/        # APIやサービス連携
│   ├── types/           # TypeScript型定義
│   ├── utils/           # ユーティリティ関数
│   ├── styles/          # グローバルスタイル
│   ├── App.tsx          # アプリケーションルートコンポーネント
│   ├── index.tsx        # エントリーポイント
│   └── router.tsx       # ルーティング設定
```

### 5.3 バックエンドディレクトリ構造

```
backend/
├── src/                 # ソースコード
│   ├── api/             # APIエンドポイント
│   │   ├── routes/        # ルート定義
│   │   ├── controllers/   # コントローラー
│   │   └── middlewares/   # ミドルウェア
│   ├── models/          # データモデル
│   ├── services/        # ビジネスロジック
│   ├── data/            # データ管理
│   ├── utils/           # ユーティリティ関数
│   ├── config/          # 設定ファイル
│   ├── socket/          # WebSocketハンドラ
│   ├── app.js           # Expressアプリケーション
│   └── server.js        # サーバーエントリーポイント
│
├── scripts/             # 運用自動化スクリプト
└── tests/               # テストコード
```

## 6. ブラウザでの動作確認

1. ブラウザを開いて `http://localhost:3000` にアクセス
2. ログイン画面が表示されることを確認
3. 以下のテストユーザーでログインできることを確認:
   - ユーザー名: `test@example.com`
   - パスワード: `password123`
   （シードスクリプトで作成されたテストユーザー）

## 7. VS Code の推奨設定

### 7.1 ワークスペース設定

`.vscode/settings.json` ファイルを作成して以下の設定を追加:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "javascript.preferences.importModuleSpecifier": "relative",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### 7.2 デバッグ設定

`.vscode/launch.json` ファイルを作成して以下の設定を追加:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/backend/src/server.js",
      "restart": true,
      "runtimeExecutable": "nodemon",
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## 8. Git ワークフロー

### 8.1 ブランチ命名規則

- `feature/機能名`: 新機能開発用ブランチ
- `bugfix/バグ名`: バグ修正用ブランチ
- `hotfix/問題名`: 緊急の修正用ブランチ
- `refactor/内容`: リファクタリング用ブランチ
- `docs/内容`: ドキュメント更新用ブランチ

### 8.2 基本的な開発フロー

1. 新しいブランチを作成
```bash
git checkout -b feature/新機能
```

2. 変更を行いコミット
```bash
git add .
git commit -m "機能の説明"
```

3. リモートにプッシュ
```bash
git push origin feature/新機能
```

4. Pull Requestを作成
   - GitHub上でPull Requestを作成
   - コードレビューを依頼
   - レビュー後、問題なければマージ

## 9. トラブルシューティング

### 9.1 Node.js関連の問題

**問題**: パッケージのインストールに失敗する
**解決策**:
```bash
# npmキャッシュをクリア
npm cache clean --force

# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

**問題**: 最新のnpmコマンドが認識されない
**解決策**:
```bash
# npmを最新版に更新
npm install -g npm@latest
```

### 9.2 MongoDB関連の問題

**問題**: MongoDBサービスが起動しない
**解決策**:

**Windows**:
1. サービスアプリを開く (`services.msc`)
2. MongoDB Serverサービスを見つけて右クリック→「開始」
3. それでも解決しない場合:
```bash
# データディレクトリを確認
cd C:\data\db
# もしくはインストール時に指定したパス
```

**macOS / Linux**:
```bash
# ログを確認
cat /var/log/mongodb/mongod.log

# サービスを再起動
sudo systemctl restart mongod
```

**問題**: 接続エラー
**解決策**:
```bash
# MongoDBシェルで接続確認
mongosh

# 別のURIを試す
# .envファイルを編集
MONGODB_URI=mongodb://127.0.0.1:27017/pinthop
```

### 9.3 フロントエンド関連の問題

**問題**: ビルドエラー
**解決策**:
```bash
# 依存関係の矛盾を解決
npm dedupe

# 破損したモジュールを修正
npm rebuild

# TypeScriptの型定義を更新
npm install --save-dev @types/react@latest @types/react-dom@latest
```

**問題**: Mapboxが読み込まれない
**解決策**:
- `.env.local`ファイルでMapboxトークンが正しく設定されているか確認
- ブラウザのコンソールでネットワークエラーがないか確認
- Mapboxアカウントでトークンの制限や使用量を確認

### 9.4 バックエンド関連の問題

**問題**: サーバーが起動しない
**解決策**:
```bash
# ポートが既に使用されていないか確認
# Windows
netstat -ano | findstr :5000

# macOS / Linux
lsof -i :5000

# 使用中のプロセスを終了するか、.envファイルでポートを変更
PORT=5001
```

**問題**: 認証エラー
**解決策**:
- JWTシークレットが正しく設定されているか確認
- トークンの有効期限が適切か確認
- MongoDBへの接続が成功しているか確認

## 10. 参考リソース

### 10.1 公式ドキュメント

- [Node.js ドキュメント](https://nodejs.org/docs/latest-v18.x/api/)
- [React ドキュメント](https://reactjs.org/docs/getting-started.html)
- [TypeScript ドキュメント](https://www.typescriptlang.org/docs/)
- [Express ドキュメント](https://expressjs.com/)
- [MongoDB マニュアル](https://docs.mongodb.com/manual/)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [Mapbox GL JS ドキュメント](https://docs.mapbox.com/mapbox-gl-js/api/)

### 10.2 プロジェクト固有のリソース

- プロジェクト仕様書: `Document/jp/specification.md`
- データベーススキーマ定義書: `Document/jp/database-schema.md`
- API仕様書: `Document/jp/api-document.md`
- デプロイメント手順書: `Document/jp/deployment-document.md`

### 10.3 推奨学習リソース

- [React Hooks 完全ガイド](https://ja.reactjs.org/docs/hooks-intro.html)
- [TypeScript Deep Dive](https://typescript-jp.gitbook.io/deep-dive/)
- [Express.js ベストプラクティス](https://expressjs.com/ja/advanced/best-practice-performance.html)
- [JWT 認証の完全ガイド](https://blog.logrocket.com/jwt-authentication-best-practices/)
- [Tailwind CSS チートシート](https://tailwindcomponents.com/cheatsheet/)

## 11. 連絡先とサポート

問題が解決しない場合や、追加のサポートが必要な場合は、以下の連絡先にお問い合わせください：

- 技術サポート: tech-support@pinthop.com
- バグ報告: bugs@pinthop.com
- 開発チームリーダー: dev-lead@pinthop.com

---

このセットアップ手順書は定期的に更新されます。最新バージョンを参照していることを確認してください。

最終更新日: 2025-04-19
