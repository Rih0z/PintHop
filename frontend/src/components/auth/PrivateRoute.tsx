/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/auth/PrivateRoute.tsx
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-26
 *
 * 更新履歴:
 * - 2025-05-26 Koki Riho 初期作成
 *
 * 説明:
 * 認証が必要なルートを保護するコンポーネント
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // ローディングスピナーを表示
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // ログインページにリダイレクト（元のパスを記憶）
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};