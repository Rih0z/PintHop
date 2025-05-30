/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Map.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 * - 2025-05-26 Koki Riho OpenStreetMap対応追加
 *
 * 説明:
 * ブルワリーマップ画面
 */

import React, { useState } from 'react';
import BreweryMap from '../components/map/BreweryMap';
import { BreweryMapOSM } from '../components/map/BreweryMapOSM';
import { useBreweries } from '../hooks/useBreweries';
import { Brewery } from '../types/brewery';

const MapPage: React.FC = () => {
  const { breweries, loading } = useBreweries();
  const [selectedBrewery, setSelectedBrewery] = useState<Brewery | null>(null);
  
  // Mapboxトークンの有無をチェック
  const hasMapboxToken = process.env.REACT_APP_MAPBOX_TOKEN && 
                        process.env.REACT_APP_MAPBOX_TOKEN !== 'your_mapbox_token_here';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Brewery Map</h1>
      
      {!hasMapboxToken && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Using OpenStreetMap (no Mapbox token required). 
            For enhanced map features, you can add a free Mapbox token to your .env.local file.
          </p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        {hasMapboxToken ? (
          <BreweryMap breweries={breweries} />
        ) : (
          <BreweryMapOSM onBreweryClick={setSelectedBrewery} />
        )}
      </div>
      
      {selectedBrewery && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">{selectedBrewery.name}</h2>
          {selectedBrewery.breweryType && (
            <p className="text-gray-600 mb-1 capitalize">{selectedBrewery.breweryType}</p>
          )}
          {selectedBrewery.address?.formattedAddress && (
            <p className="text-gray-700">{selectedBrewery.address.formattedAddress}</p>
          )}
          {selectedBrewery.address && (
            <p className="text-gray-700 mb-4">{selectedBrewery.address.city}, {selectedBrewery.address.state}</p>
          )}
          
          <div className="flex gap-4">
            {selectedBrewery.websiteUrl && (
              <a 
                href={selectedBrewery.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Visit Website →
              </a>
            )}
            {selectedBrewery.phone && (
              <a 
                href={`tel:${selectedBrewery.phone}`}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Call {selectedBrewery.phone}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;