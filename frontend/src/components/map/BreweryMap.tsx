/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/map/BreweryMap.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * Leafletを使用してブルワリーマーカーを表示するシンプルな地図コンポーネント
 */

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Brewery } from '../../types/brewery';

interface BreweryMapProps {
  breweries: Brewery[];
}

const BreweryMap: React.FC<BreweryMapProps> = ({ breweries }) => {
  const center: [number, number] = breweries[0]?.location?.coordinates
    ? [breweries[0].location.coordinates[1], breweries[0].location.coordinates[0]]
    : [47.6038, -122.3301];

  return (
    <MapContainer center={center} zoom={12} style={{ height: '400px', width: '100%' }} data-testid="brewery-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {breweries.map((brewery) =>
        brewery.location ? (
          <Marker
            key={brewery.breweryId}
            position={[brewery.location.coordinates[1], brewery.location.coordinates[0]]}
          >
            <Popup>{brewery.name}</Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default BreweryMap;
