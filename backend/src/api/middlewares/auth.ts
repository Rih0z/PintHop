/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/middlewares/auth.ts
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-26
 *
 * 更新履歴:
 * - 2025-05-26 Koki Riho 初期作成
 *
 * 説明:
 * JWT認証ミドルウェア
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, ErrorCodes } from '../../utils/AppError';
import { env } from '../../config/env';
import User from '../../models/User';

// Requestインターフェースの拡張
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
      };
    }
  }
}

/**
 * JWT認証ミドルウェア
 * Authorizationヘッダーからトークンを取得し、検証する
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'No token provided');
    }

    const token = authHeader.substring(7); // "Bearer " を除去

    // トークンの検証
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    
    if (!decoded.sub) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Invalid token');
    }

    // ユーザー情報を取得
    const user = await User.findById(decoded.sub).select('-password');
    if (!user) {
      throw new AppError(401, ErrorCodes.USER_NOT_FOUND, 'User not found');
    }

    // リクエストオブジェクトにユーザー情報を追加
    req.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(401, ErrorCodes.TOKEN_EXPIRED, 'Token expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, ErrorCodes.UNAUTHORIZED, 'Invalid token'));
    } else {
      next(error);
    }
  }
};

/**
 * オプショナル認証ミドルウェア
 * トークンがある場合のみ検証し、なくてもエラーにしない
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // トークンがない場合はそのまま次へ
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    
    if (decoded.sub) {
      const user = await User.findById(decoded.sub).select('-password');
      if (user) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          username: user.username
        };
      }
    }

    next();
  } catch (error) {
    // トークンが無効でもエラーにしない
    next();
  }
};