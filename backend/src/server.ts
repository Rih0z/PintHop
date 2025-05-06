/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/server.ts
 * 
 * 作成者: Koki Riho
 * 作成日: 2025-05-04 00:00:00
 * 
 * 更新履歴:
 * - 2025-05-04 00:00:00 Koki Riho 初期作成
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
