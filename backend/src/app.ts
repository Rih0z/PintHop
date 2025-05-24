/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/app.ts
 * 
 * 作成者: Koki Riho
 * 作成日: 2025-05-04 00:00:00
 * 
 * 更新履歴:
 * - 2025-05-04 00:00:00 Koki Riho 初期作成
 *
 * 説明:
 * Express アプリケーションの設定とミドルウェアの初期化
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import breweryRoutes from './api/routes/breweryRoutes';
import authRoutes from './api/routes/authRoutes';

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

// APIルート
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/breweries', breweryRoutes);

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