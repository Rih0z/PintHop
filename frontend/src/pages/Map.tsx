/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Map.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * ブルワリーマップ画面
 */

import React from 'react';
import BreweryMap from '../components/map/BreweryMap';
import { useBreweries } from '../hooks/useBreweries';

const MapPage: React.FC = () => {
  const { breweries, loading } = useBreweries();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <BreweryMap breweries={breweries} />;
};

export default MapPage;
