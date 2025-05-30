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

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../services/auth';
import axios from 'axios';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user && !!token;

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const data = response.data || response;
      setUser(data.user);
      setToken(data.tokens.accessToken);
      setRefreshToken(data.tokens.refreshToken);
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      setError(null);
      
      // Axiosのデフォルトヘッダーを設定
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.tokens.accessToken}`;
    } catch (err: any) {
      console.error('Login failed', err);
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authApi.register(username, email, password);
      const data = response.data || response;
      setUser(data.user);
      setToken(data.tokens.accessToken);
      setRefreshToken(data.tokens.refreshToken);
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      setError(null);
      
      // Axiosのデフォルトヘッダーを設定
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.tokens.accessToken}`;
    } catch (err: any) {
      console.error('Register failed', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  };
  
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      const response = await authApi.refresh(refreshToken);
      const data = response.data || response;
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    } catch (err) {
      console.error('Token refresh failed', err);
      logout();
    }
  };
  
  // 初期化とトークン検証
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (storedToken) {
        // トークンをAxiosのデフォルトヘッダーに設定
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // TODO: トークンの有効性を確認し、ユーザー情報を取得
        // 現時点では簡易的にトークンの存在のみチェック
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      refreshToken,
      error, 
      loading, 
      isAuthenticated,
      login, 
      register, 
      logout,
      refreshAccessToken 
    }}>
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
