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

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN
  });
  const refreshToken = jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN
  });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = new User({ username, email, password });
    await user.save();
    const tokens = generateTokens(user.id);
    res.status(201).json({ user, tokens });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const tokens = generateTokens(user.id);
    res.json({ user, tokens });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const payload = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;
    const tokens = generateTokens(payload.sub as string);
    res.json(tokens);
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.json({ message: 'Logged out' });
};
