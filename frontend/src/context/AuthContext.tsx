/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/context/AuthContext.tsx
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-25 00:00:00
 *
 * 更新履歴:
 * - 2025-05-25 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * 認証状態を管理するReactコンテキスト
 */

import React, { createContext, useContext, useState } from 'react';
import * as authApi from '../services/auth';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      setToken(data.tokens.accessToken);
      localStorage.setItem('token', data.tokens.accessToken);
      setError(null);
    } catch (err) {
      console.error('Login failed', err);
      setError('Authentication failed');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await authApi.register(username, email, password);
      setUser(data.user);
      setToken(data.tokens.accessToken);
      localStorage.setItem('token', data.tokens.accessToken);
      setError(null);
    } catch (err) {
      console.error('Register failed', err);
      setError('Authentication failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

export default AuthContext;
