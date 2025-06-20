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
 * - 2025-06-11 Claude Code UI/UX仕様書に基づく5タブナビゲーション構造に更新
 *
 * 説明:
 * アプリケーションルーティング設定
 * UI/UX仕様書に基づく5タブナビゲーション（Timeline, Map, Brewery Search, Events, Profile）
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MapPage from './pages/Map';
import TimelinePage from './pages/Timeline';
import Dashboard from './pages/Dashboard';
import ModernMapPage from './pages/ModernMap';
import ModernTimelinePage from './pages/ModernTimeline';
import ModernDashboardPage from './pages/ModernDashboard';
import BrewerySearchPage from './pages/BrewerySearch';
import BreweryDetailsPage from './pages/BreweryDetails';
import EventsPage from './pages/Events';
import ProfilePage from './pages/Profile';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { PrivateRoute } from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes - 5-tab navigation structure */}
      <Route path="/" element={<Navigate to="/timeline" replace />} />
      <Route path="/dashboard" element={<Navigate to="/timeline" replace />} />
      
      <Route
        path="/timeline"
        element={
          <PrivateRoute>
            <Layout>
              <ModernTimelinePage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/map"
        element={
          <PrivateRoute>
            <Layout>
              <ModernMapPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/brewery-search"
        element={
          <PrivateRoute>
            <Layout>
              <BrewerySearchPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/brewery/:id"
        element={
          <PrivateRoute>
            <BreweryDetailsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/events"
        element={
          <PrivateRoute>
            <Layout>
              <EventsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </PrivateRoute>
        }
      />
      
      {/* Legacy routes (for comparison and backward compatibility) */}
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
