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
import Dashboard from './pages/Dashboard';
import ModernMapPage from './pages/ModernMap';
import ModernTimelinePage from './pages/ModernTimeline';
import ModernDashboardPage from './pages/ModernDashboard';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { PrivateRoute } from './components/auth/PrivateRoute';

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes - Modern design */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <ModernDashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/timeline"
        element={
          <PrivateRoute>
            <ModernTimelinePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/map"
        element={
          <PrivateRoute>
            <ModernMapPage />
          </PrivateRoute>
        }
      />
      
      {/* Legacy routes (for comparison) */}
      <Route
        path="/legacy/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/legacy/timeline"
        element={
          <PrivateRoute>
            <TimelinePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/legacy/map"
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
