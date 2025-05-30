# PintHop ローカル起動ガイド

## 前提条件

- Node.js 18.x 以上
- MongoDB 7.0 以上（またはDocker）
- npm または yarn

## セットアップ手順

### 1. 依存関係のインストール

```bash
# プロジェクトルートで
npm install
npm run setup
```

### 2. 環境変数の設定

#### バックエンド設定
```bash
cd backend
cp .env.example .env
```

`.env`ファイルを編集：
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pinthop
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

#### フロントエンド設定
```bash
cd ../frontend
cp .env.example .env.local
```

`.env.local`ファイルを編集：
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

**注意**: Mapboxトークンは[Mapbox](https://www.mapbox.com/)で無料アカウントを作成して取得してください。

### 3. MongoDBの起動

#### オプション1: ローカルMongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# または直接起動
mongod --dbpath /usr/local/var/mongodb
```

#### オプション2: Docker
```bash
docker run -d -p 27017:27017 --name pinthop-mongo mongo:7.0
```

### 4. データベースのシード

```bash
cd backend
npm run seed
```

### 5. アプリケーションの起動

#### 個別起動
```bash
# Terminal 1 - バックエンド
cd backend
npm run dev

# Terminal 2 - フロントエンド
cd frontend
npm start
```

#### 同時起動（推奨）
```bash
# プロジェクトルートから
npm run dev
```

### 6. アクセス

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000/api/v1

## 利用可能な機能

### 1. 認証機能
- ユーザー登録: `/register`
- ログイン: `/login`
- ログアウト

### 2. ブルワリーマップ
- `/map` - ブルワリーの位置を地図上に表示
- マーカークリックで詳細表示
- チェックイン機能

### 3. タイムライン
- `/timeline` - 友達のプレゼンス一覧
- リアルタイム更新（Socket.IO）

### 4. プレゼンス機能
- 現在地の共有
- ブルワリーでのチェックイン
- リアルタイムで他のユーザーに表示

## テストアカウント

シード実行後、以下のテストアカウントが利用可能：
```
Email: test@example.com
Password: password123
```

## トラブルシューティング

### MongoDBに接続できない
```bash
# MongoDB が起動しているか確認
ps aux | grep mongod

# ポートが使用されているか確認
lsof -i :27017
```

### CORSエラーが発生する
- バックエンドの`.env`で`CORS_ORIGIN`が正しく設定されているか確認
- フロントエンドの`REACT_APP_API_URL`が正しいか確認

### 地図が表示されない
- Mapboxトークンが正しく設定されているか確認
- ブラウザのコンソールでエラーを確認

### Socket.IOが接続できない
- バックエンドが起動しているか確認
- `REACT_APP_WS_URL`が正しく設定されているか確認

## Docker Composeを使った起動（オプション）

```bash
# すべてのサービスを起動
docker-compose up

# バックグラウンドで起動
docker-compose up -d

# ログを確認
docker-compose logs -f

# 停止
docker-compose down
```

## 開発に役立つコマンド

```bash
# テスト実行
npm run test:all

# リント実行
npm run lint

# ビルド
npm run build

# ログ確認（バックエンド）
cd backend
npm run dev | npx pino-pretty
```