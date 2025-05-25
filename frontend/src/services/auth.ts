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

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/v1/auth/login`, { email, password });
  return res.data;
};

export const register = async (username: string, email: string, password: string) => {
  const res = await axios.post(`${API_URL}/v1/auth/register`, { username, email, password });
  return res.data;
};

export const refresh = async (refreshToken: string) => {
  const res = await axios.post(`${API_URL}/v1/auth/refresh`, { refreshToken });
  return res.data;
};

export const logout = async () => {
  const res = await axios.post(`${API_URL}/v1/auth/logout`);
  return res.data;
};
