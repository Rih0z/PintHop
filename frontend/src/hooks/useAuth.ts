/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/hooks/useAuth.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-25 00:00:00
 *
 * 更新履歴:
 * - 2025-05-25 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * 認証コンテキストを利用するカスタムフック
 */

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
