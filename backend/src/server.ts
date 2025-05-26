/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/server.ts
 * 
 * 作成者: Koki Riho
 * 作成日: 2025-05-04 00:00:00
 * 
 * 更新履歴:
 * - 2025-05-04 00:00:00 Koki Riho 初期作成
 * - 2025-05-31 00:00:00 Koki Riho and Codex logger適用
 *
 * 説明:
 * サーバーのエントリーポイント、HTTPサーバーの初期化とデータベース接続
 */

import app from './app';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './utils/logger';

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
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// サーバーの起動
const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  });
};

// プロセスの例外ハンドリング
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// サーバー起動
startServer();
