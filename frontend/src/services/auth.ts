/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/services/auth.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-25 00:00:00
 *
 * 更新履歴:
 * - 2025-05-25 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * 認証API呼び出しを行うサービス
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Debug: Log the API URL being used
console.log('Auth Service - API URL:', API_URL);

export const login = async (username: string, password: string) => {
  const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
  return res.data;
};

export const register = async (username: string, email: string, password: string) => {
  const res = await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
  return res.data;
};

export const refresh = async (refreshToken: string) => {
  const res = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
  return res.data;
};

export const logout = async () => {
  const res = await axios.post(`${API_URL}/api/auth/logout`);
  return res.data;
};
