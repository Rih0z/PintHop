/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/controllers/authController.ts
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * 認証APIコントローラー
 */

import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../../models/User';
import { AppError, ErrorCodes } from '../../utils/AppError';
import { env } from '../../config/env';

const JWT_SECRET = env.JWT_SECRET;
const ACCESS_EXPIRES_IN = env.JWT_EXPIRES_IN;
const REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN;

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { sub: userId }, 
    JWT_SECRET, 
    { expiresIn: ACCESS_EXPIRES_IN as any }
  );
  const refreshToken = jwt.sign(
    { sub: userId }, 
    JWT_SECRET, 
    { expiresIn: REFRESH_EXPIRES_IN as any }
  );
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Username, email and password are required');
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError(409, ErrorCodes.VALIDATION_ERROR, 'User already exists with this email');
    }
    
    const user = new User({ username, email, password });
    await user.save();
    const tokens = generateTokens(user.id);
    
    res.status(201).json({ 
      status: 'success',
      data: { user, tokens }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Email and password are required');
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password');
    }
    
    const valid = await user.comparePassword(password);
    if (!valid) {
      throw new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password');
    }
    
    const tokens = generateTokens(user.id);
    
    res.json({ 
      status: 'success',
      data: { user, tokens }
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Refresh token is required');
    }
    
    const payload = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;
    const tokens = generateTokens(payload.sub as string);
    
    res.json({ 
      status: 'success',
      data: tokens 
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, ErrorCodes.TOKEN_EXPIRED, 'Invalid or expired refresh token'));
    } else {
      next(err);
    }
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.json({ 
    status: 'success',
    message: 'Logged out successfully' 
  });
};
