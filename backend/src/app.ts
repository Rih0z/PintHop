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
import { env } from './config/env';
import { AppError } from './utils/AppError';
import breweryRoutes from './api/routes/breweryRoutes';
import authRoutes from './api/routes/authRoutes';
import presenceRoutes from './api/routes/presenceRoutes';
import checkinRoutes from './api/routes/checkinRoutes';

// アプリケーションの初期化
const app: Express = express();

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// シンプルなCORS設定
const corsOptions = {
  origin: env.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Helmetの設定を調整
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// APIルート
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/breweries', breweryRoutes);
app.use('/api/v1/presence', presenceRoutes);
app.use('/api/v1/checkins', checkinRoutes);

// ヘルスチェックエンドポイント
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404ハンドラー
app.use((req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: 'Not found' });
});

// エラーハンドラー
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  // AppErrorインスタンスの場合
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message
    });
  }

  // 予期しないエラーの場合
  console.error('ERROR 💥', err);
  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_ERROR',
    message: env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  });
});

export default app;
