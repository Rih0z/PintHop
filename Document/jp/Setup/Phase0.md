# PintHop 開発環境セットアップガイド (MacBook Air向け)

## ドキュメント情報
プロジェクト: PintHop
ファイル名: Phase0.md
ファイルパス: Document/jp/Setup/Phase0.md
作成者: Koki Riho
作成日: 2025-05-04 13:53:00
最終更新: 2025-05-04 13:53:00

## 更新履歴
- 2025-04-22 Koki Riho 初期作成
- 2025-04-27 Koki Riho ドキュメント名をPhase1からPhase0に変更し、整合性を確保
- 2025-05-04 Koki Riho 開発環境構築時の問題点と解決策を追加

## 説明
このドキュメントはPintHopプロジェクトのフェーズ0（マイクロMVP）における最初のステップ（Week 1-2）の開発環境構築手順を詳細に記載しています。phase0-implementation-plan.mdで示されている全体計画の最初の2週間（環境構築フェーズ）の具体的な手順を提供します。

## 1. 前提条件と準備

### 1.1 必要なツール
setup-guide.mdに基づき、以下のツールをインストールします：
- Node.js 18.x
- npm 10.x
- Git
- MongoDB 7.0 (ローカル開発用)
- Visual Studio Code (推奨エディタ)

各ツールのインストール手順は、setup-guide.mdの「2. 事前準備」セクションに詳細が記載されています。

### 1.2 アカウント準備
以下のアカウントを用意します：
- GitHub アカウント - リポジトリ管理用
- MongoDB Atlas アカウント - クラウドデータベース用
- Netlify アカウント - フロントエンドのホスティング用
- Mapbox アカウント - 地図表示機能用

## 2. 開発環境のセットアップ

### 2.1 Homebrewのインストールと設定

```bash
# Homebrewのインストール
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Homebrewのパスを設定（Apple Silicon Macの場合）
eval "$(/opt/homebrew/bin/brew shellenv)"

# パスを永続化するために.zshrcに追加
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc

# Homebrewが正しく動作するか確認
brew doctor
```

**注意**: Homebrewをインストールした後、`brew`コマンドが認識されない場合は、上記の`eval`コマンドを実行してパスを設定する必要があります。Intel Macの場合は`/usr/local/bin/brew`を使用してください。

### 2.2 Node.jsのインストール

```bash
# Node.js 18.xのインストール
brew install node@18

# PATHを設定（Apple Silicon Macの場合）
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# バージョン確認
node -v  # 18.x.x と表示されるはず
npm -v   # npm のバージョンを確認
```

### 2.3 Gitのインストールと確認

```bash
# Gitのインストール（通常はMacに最初から入っています）
brew install git

# バージョン確認
git --version
```

## 3. GitHubリポジトリの作成と基本構造設定

### 3.1 リポジトリのクローン

既存のリポジトリを使用する場合：

```bash
# リポジトリをクローン
git clone https://github.com/Rih0z/PintHop.git
cd PintHop
```

### 3.2 新規リポジトリを作成する場合

```bash
# リポジトリ作成（新規の場合）
mkdir -p PintHop/{Document/jp,Prompts,frontend,backend/scripts,config}
cd PintHop
git init

# 基本ファイルの作成
curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore
echo "# PintHop\nクラフトビール体験向上プラットフォーム" > README.md
echo "MIT License" > LICENSE
```

## 4. フロントエンド開発環境セットアップ

### 4.1 React + TypeScript プロジェクト作成

```bash
# frontendディレクトリに移動
cd frontend

# create-react-app で TypeScript テンプレートを使用してプロジェクト作成
npx create-react-app . --template typescript
```

### 4.2 互換性のある安定バージョンのパッケージをインストール

```bash
# React関連パッケージの互換性のある安定バージョン
npm install react@18.2.0 react-dom@18.2.0 react-scripts@5.0.1

# React周辺エコシステムパッケージ
npm install react-router-dom@6.14.2 react-leaflet@4.2.1

# CSS関連パッケージ
npm install tailwindcss@3.3.3 postcss@8.4.31 autoprefixer@10.4.15

# APIとユーティリティパッケージ
npm install axios@1.4.0 jwt-decode@3.1.2 leaflet@1.9.4

# 型定義パッケージ（開発依存）
npm install --save-dev @types/react@18.2.21 @types/react-dom@18.2.7 @types/leaflet@1.9.3 @types/jest@29.5.4 @types/node@20.5.7 @types/react-router-dom@5.3.3
```

**注意**: 最新バージョン（`@latest`指定）ではなく、具体的なバージョン番号を指定することで、互換性の問題を回避します。

### 4.3 Tailwind CSS の設定

tailwind.config.jsファイルを手動で作成します：

```bash
# tailwind.config.jsファイルを作成
touch tailwind.config.js
```

tailwind.config.jsに以下の内容を追加します：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ブルワリー/クラフトビールの雰囲気を反映した配色
        'primary': '#F59E0B', // アンバー系
        'secondary': '#78350F', // 濃い茶色
        'accent': '#10B981', // ホップグリーン
      },
    },
  },
  plugins: [],
}
```

postcss.config.jsファイルも手動で作成します：

```bash
# postcss.config.jsファイルを作成
touch postcss.config.js
```

postcss.config.jsに以下の内容を追加します：

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**注意**: `npx tailwindcss init -p`コマンドが失敗する場合があるため、設定ファイルを手動で作成することを推奨します。

### 4.4 スタイルシートの作成

src/styles/tailwind.css ファイルを作成して以下を追加します：

```bash
# ディレクトリを作成
mkdir -p src/styles

# tailwind.cssファイルを作成
touch src/styles/tailwind.css
```

src/styles/tailwind.cssに以下の内容を追加します：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムスタイル */
@layer components {
  .btn-primary {
    @apply bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary/80;
  }
  .btn-secondary {
    @apply bg-secondary text-white font-bold py-2 px-4 rounded hover:bg-secondary/80;
  }
  .card {
    @apply bg-white rounded-lg shadow-md p-4;
  }
}
```

### 4.5 TailwindCSSをプロジェクトに統合

`src/index.tsx`を編集して、Tailwind CSSのスタイルシートをインポートします：

```bash
# index.tsxを編集
```

src/index.tsxに以下の行を追加（通常は他のインポートの後）：

```javascript
import './styles/tailwind.css';
```

### 4.6 プロジェクト構造の整備

```bash
mkdir -p src/{components/{common,layout,map,brewery,beer,user,presence},context,hooks,pages,services,types,utils}
```

### 4.7 環境変数の設定

```bash
# .env.exampleファイルを作成
cat > .env.example << 'EOL'
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
EOL

# 開発用環境変数
cp .env.example .env.local
```

Mapboxトークンの取得方法はsetup-guide.mdの「3.2 フロントエンドのセットアップ」セクションを参照してください。

## 5. バックエンド開発環境セットアップ

### 5.1 Node.js + Express プロジェクト作成

```bash
# プロジェクトルートディレクトリに戻る
cd ..

# backend ディレクトリに移動
cd backend

# package.json の初期化
npm init -y

# 必要なパッケージのインストール（互換性のある安定バージョン）
npm install express@4.18.2 mongoose@7.4.3 dotenv@16.3.1 cors@2.8.5 helmet@7.0.0 jsonwebtoken@9.0.1 bcrypt@5.1.0 express-validator@7.0.1 morgan@1.10.0
npm install --save-dev nodemon@3.0.1 ts-node@10.9.1 typescript@5.1.6 @types/express@4.17.17 @types/node@20.5.0
```

### 5.2 TypeScript 設定

tsconfig.json を以下のように編集します：

```bash
# TypeScript 設定
npx tsc --init
```

tsconfig.jsonを以下の内容に置き換えます：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

### 5.3 プロジェクト構造の整備

```bash
mkdir -p src/{api/{routes,controllers,middlewares},models,services,data/{breweries,beerstyles,seeds},utils,config,socket}
```

### 5.4 環境変数の設定

```bash
# .env.exampleファイルを作成
cat > .env.example << 'EOL'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pinthop
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
EOL

# 開発用環境変数
cp .env.example .env

# JWT秘密鍵の生成
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
sed -i '' "s/your_secret_key_here/$JWT_SECRET/" .env
```

### 5.5 基本的なサーバー設定

src/app.ts ファイルを作成し、以下の内容を追加します：

```bash
touch src/app.ts
```

src/app.tsに以下のコードを追加：

```typescript
/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/app.ts
 * 
 * 作成者: Koki Riho
 * 作成日: 2025-05-04 13:53:00
 * 
 * 更新履歴:
 * - 2025-05-04 13:53:00 Koki Riho 初期作成
 *
 * 説明:
 * Express アプリケーションの設定とミドルウェアの初期化
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

// アプリケーションの初期化
const app: Express = express();

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// ヘルスチェックエンドポイント
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404ハンドラー
app.use((req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: 'Not found' });
});

// エラーハンドラー
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

export default app;
```

src/server.ts ファイルを作成し、以下の内容を追加します：

```bash
touch src/server.ts
```

src/server.tsに以下のコードを追加：

```typescript
/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/server.ts
 * 
 * 作成者: Koki Riho
 * 作成日: 2025-05-04 13:53:00
 * 
 * 更新履歴:
 * - 2025-05-04 13:53:00 Koki Riho 初期作成
 *
 * 説明:
 * サーバーのエントリーポイント、HTTPサーバーの初期化とデータベース接続
 */

import app from './app';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

// ポート設定
const PORT = process.env.PORT || 5000;

// サーバーの作成
const server = http.createServer(app);

// MongoDBへの接続
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI as string;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// サーバーの起動
const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

// プロセスの例外ハンドリング
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// サーバー起動
startServer();
```

### 5.6 package.json スクリプトの設定

package.json のスクリプトセクションを以下のように設定します：

```json
"scripts": {
  "start": "node dist/server.js",
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc",
  "lint": "eslint . --ext .ts",
  "test": "jest"
}
```

## 6. MongoDB の設定

### 6.1 ローカル環境のMongoDBの起動

```bash
# MongoDBサービスの起動
brew services start mongodb-community

# 起動確認
brew services list
```

### 6.2 MongoDB Atlas の設定（本番環境用）

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) にアクセスしてアカウントを作成
2. 新しいクラスターを作成（無料のM0クラスターで十分）
3. ネットワークアクセスの設定（開発環境からのアクセスを許可）
4. データベースユーザーの作成
5. 接続文字列を取得

### 6.3 .env ファイルの更新

バックエンドの .env ファイルの MONGODB_URI を MongoDB Atlas の接続文字列に更新します（本番環境用）：

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/pinthop?retryWrites=true&w=majority
```

## 7. デプロイ設定の準備

### 7.1 Netlify（フロントエンド）設定

1. [Netlify](https://www.netlify.com/) にアクセスしてアカウントを作成
2. 新しいサイトをGitリポジトリから作成する準備
   - ビルドコマンド: `npm run build`
   - 公開ディレクトリ: `build`
   - 環境変数: 本番用の環境変数を設定

### 7.2 Conohaレンタルサーバー（バックエンド）設定

1. Conohaアカウントで新しいサーバーをセットアップ（Node.js対応のプラン）
2. SSHアクセスを設定
3. 本番環境用の.envファイルを作成
4. プロジェクトのデプロイ手順を準備

## 8. CI/CD 初期設定 (GitHub Actions)

```bash
mkdir -p .github/workflows
```

.github/workflows/ci.yml ファイルを作成し、基本的なCI設定を追加します。

## 9. 開発サーバーの起動と動作確認

### 9.1 バックエンドサーバーの起動

```bash
cd backend
npm run dev
```

バックエンドサーバーは http://localhost:5000 で実行されます。
ヘルスチェックエンドポイント http://localhost:5000/health にアクセスして動作確認します。

### 9.2 フロントエンドサーバーの起動

```bash
cd frontend
npm start
```

フロントエンドサーバーは http://localhost:3000 で実行されます。

## 10. よくある問題とトラブルシューティング

### 10.1 Homebrewパスの問題

Homebrewをインストールした後に`brew`コマンドが認識されない場合は、以下を実行してください：

```bash
# Apple Silicon Macの場合
eval "$(/opt/homebrew/bin/brew shellenv)"

# Intel Macの場合
eval "$(/usr/local/bin/brew shellenv)"
```

### 10.2 パッケージのバージョン互換性の問題

パッケージのバージョン互換性の問題が発生した場合は、以下のような安定バージョンを使用することを推奨します：

```bash
# 安定バージョンの指定例
npm install tailwindcss@3.3.3 postcss@8.4.31 autoprefixer@10.4.15
npm install react@18.2.0 react-dom@18.2.0
```

特に、互換性を重視する場合は、`@latest`ではなく具体的なバージョン番号を指定してください。

### 10.3 Tailwind CSS初期化コマンドの失敗

`npx tailwindcss init -p`コマンドが失敗する場合は、以下のファイルを手動で作成してください：

1. tailwind.config.js
2. postcss.config.js

手動で作成する方法は、上記の4.3セクションを参照してください。

## 11. 次のステップ

環境構築が完了したら、フェーズ0の次のマイルストーンに進みます：

1. シアトル限定ブルワリーマップ基盤（Week 3-4）
   - JSONベースのブルワリーデータ構築
   - マップ表示の基本実装
   - レビューサイト評価の統合表示

2. リアルタイム存在共有の基盤（Week 5-6）
   - 友達接続の基本機能
   - 位置情報共有の基本機能
   - 基本的なプライバシー設定

3. 統合・テスト・リリース（Week 7-8）
   - 機能統合と結合テスト
   - マイクロMVPのリリース
   - 初期ユーザーフィードバック収集