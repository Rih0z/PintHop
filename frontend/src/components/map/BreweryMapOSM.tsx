/**
 * OpenStreetMapを使用したブルワリーマップ（Mapboxトークン不要）
 */

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Brewery } from '../../types/brewery';
import { useBreweries } from '../../hooks/useBreweries';
import 'leaflet/dist/leaflet.css';

// Leafletのデフォルトアイコンの問題を修正
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface BreweryMapOSMProps {
  onBreweryClick?: (brewery: Brewery) => void;
}

export const BreweryMapOSM: React.FC<BreweryMapOSMProps> = ({ onBreweryClick }) => {
  const { breweries, loading } = useBreweries();
  const [center] = useState<[number, number]>([47.6062, -122.3321]); // Seattle

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="h-96 w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {breweries.map((brewery) => {
        if (!brewery.location?.coordinates) return null;
        const [lng, lat] = brewery.location.coordinates;
        
        return (
          <Marker
            key={brewery._id}
            position={[lat, lng]}
            eventHandlers={{
              click: () => onBreweryClick?.(brewery)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{brewery.name}</h3>
                {brewery.breweryType && (
                  <p className="text-sm text-gray-600">{brewery.breweryType}</p>
                )}
                {brewery.address?.formattedAddress && (
                  <p className="text-sm">{brewery.address.formattedAddress}</p>
                )}
                {brewery.address && (
                  <p className="text-sm">{brewery.address.city}, {brewery.address.state}</p>
                )}
                <button
                  className="mt-2 bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700"
                  onClick={() => console.log('Check in at', brewery.name)}
                >
                  Check in here
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};