/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/router.tsx
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 * - 2025-05-24 00:00:00 Koki Riho タイムラインルート追加
 *
 * 説明:
 * アプリケーションルーティング設定
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MapPage from './pages/Map';
import TimelinePage from './pages/Timeline';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { PrivateRoute } from './components/auth/PrivateRoute';

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={<Navigate to="/timeline" replace />} />
      <Route
        path="/timeline"
        element={
          <PrivateRoute>
            <TimelinePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/map"
        element={
          <PrivateRoute>
            <MapPage />
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
);

export default AppRouter;
