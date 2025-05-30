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
import { env } from './config/env';
import logger from './utils/logger';
import { initializeSocketServer } from './socket';

// ポート設定
const PORT = env.PORT;

// サーバーの作成
const server = http.createServer(app);

// Socket.IOサーバーの初期化
const io = initializeSocketServer(server);

// MongoDBへの接続
const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
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
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`CORS Origin: ${env.CORS_ORIGIN}`);
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
