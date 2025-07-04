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

const API_URL = process.env.REACT_APP_API_URL || 'https://pinthop-api.riho-dare.workers.dev';

export const login = async (username: string, password: string) => {
  console.log('API_URL:', API_URL);
  console.log('Login request to:', `${API_URL}/api/auth/login`);
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, { username, password }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
};

export const register = async (data: { username: string; email: string; password: string }) => {
  const res = await axios.post(`${API_URL}/api/auth/register`, data);
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

export const checkAvailability = async (username?: string, email?: string) => {
  const params = new URLSearchParams();
  if (username) params.append('username', username);
  if (email) params.append('email', email);
  
  const res = await axios.get(`${API_URL}/api/auth/check-availability?${params}`);
  return res.data.data;
};
