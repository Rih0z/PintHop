/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/router.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * アプリケーションルーティング設定
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MapPage from './pages/Map';

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/map" replace />} />
      <Route path="/map" element={<MapPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
