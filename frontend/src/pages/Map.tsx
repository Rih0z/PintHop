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
 * - 2025-01-05 全機能実装 - プレゼンス表示、チェックイン機能追加
 *
 * 説明:
 * ブルワリーマップ画面 - リアルタイムプレゼンス表示付き
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const API_URL = process.env.REACT_APP_API_URL || 'https://pinthop-api.riho-dare.workers.dev';

interface Brewery {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  tags?: string[];
  currentVisitors?: number;
}

interface Presence {
  userId: string;
  username: string;
  breweryId: string;
  breweryName: string;
  checkInTime: string;
  estimatedDuration?: number;
  message?: string;
}

const MapPage: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [presenceData, setPresenceData] = useState<Presence[]>([]);
  const [selectedBrewery, setSelectedBrewery] = useState<Brewery | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    estimatedDuration: 60,
    message: '',
    isPublic: true
  });

  // Custom icons
  const breweryIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/931/931949.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const activeBreweryIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/931/931949.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
    className: 'animate-pulse-soft'
  });

  // Fetch breweries
  const fetchBreweries = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/breweries`);
      setBreweries(response.data.breweries);
    } catch (error) {
      console.error('Failed to fetch breweries:', error);
    }
  };

  // Fetch presence data
  const fetchPresence = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_URL}/api/presence`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPresenceData(response.data.presence);
    } catch (error) {
      console.error('Failed to fetch presence:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBreweries(), fetchPresence()]);
      setLoading(false);
    };
    
    loadData();
    
    // Refresh presence every 30 seconds
    const interval = setInterval(fetchPresence, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Handle check-in
  const handleCheckIn = async (brewery: Brewery) => {
    if (!token) {
      alert(t('auth.validation.loginRequired'));
      return;
    }

    setCheckingIn(true);
    try {
      await axios.post(
        `${API_URL}/api/presence`,
        {
          breweryId: brewery.id,
          breweryName: brewery.name,
          estimatedDuration: checkInForm.estimatedDuration,
          message: checkInForm.message,
          isPublic: checkInForm.isPublic
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh presence data
      await fetchPresence();
      
      // Reset form
      setCheckInForm({
        estimatedDuration: 60,
        message: '',
        isPublic: true
      });
      
      alert(t('checkin.success'));
    } catch (error) {
      console.error('Check-in failed:', error);
      alert(t('checkin.failed'));
    } finally {
      setCheckingIn(false);
      setSelectedBrewery(null);
    }
  };

  // Get visitor count for a brewery
  const getVisitorCount = (breweryId: string) => {
    return presenceData.filter(p => p.breweryId === breweryId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{t('nav.map')}</h1>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-80px)]">
        <MapContainer
          center={[47.6062, -122.3321]} // Seattle center
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Brewery markers */}
          {breweries.map((brewery) => {
            const visitorCount = getVisitorCount(brewery.id);
            const hasVisitors = visitorCount > 0;
            
            return (
              <React.Fragment key={brewery.id}>
                {/* Activity radius for breweries with visitors */}
                {hasVisitors && (
                  <Circle
                    center={[brewery.latitude, brewery.longitude]}
                    radius={200}
                    pathOptions={{
                      fillColor: '#ff6b35',
                      fillOpacity: 0.2,
                      color: '#ff6b35',
                      weight: 2
                    }}
                  />
                )}
                
                <Marker
                  position={[brewery.latitude, brewery.longitude]}
                  icon={hasVisitors ? activeBreweryIcon : breweryIcon}
                  eventHandlers={{
                    click: () => setSelectedBrewery(brewery)
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg">{brewery.name}</h3>
                      <p className="text-sm text-gray-600">{brewery.address}</p>
                      {hasVisitors && (
                        <div className="mt-2 text-primary-500 font-medium">
                          {visitorCount} {t('map.peopleHere')}
                        </div>
                      )}
                      {/* Presence list */}
                      {hasVisitors && (
                        <div className="mt-2 space-y-1">
                          {presenceData
                            .filter(p => p.breweryId === brewery.id)
                            .map(p => (
                              <div key={p.userId} className="text-xs">
                                <span className="font-medium">{p.username}</span>
                                {p.message && <span className="text-gray-500"> - {p.message}</span>}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Brewery Details Panel */}
        {selectedBrewery && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-dark-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-dark-700 p-6 z-10">
            <button
              onClick={() => setSelectedBrewery(null)}
              className="absolute top-4 right-4 text-dark-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-white mb-2">{selectedBrewery.name}</h2>
            <p className="text-dark-300 mb-4">{selectedBrewery.address}</p>
            
            {/* Current visitors */}
            {getVisitorCount(selectedBrewery.id) > 0 && (
              <div className="mb-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <p className="text-primary-400 font-medium">
                  {getVisitorCount(selectedBrewery.id)} {t('map.friendsHere')}
                </p>
              </div>
            )}
            
            {/* Check-in form */}
            {user && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">{t('checkin.title')}</h3>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    {t('checkin.estimatedDuration')}
                  </label>
                  <select
                    value={checkInForm.estimatedDuration}
                    onChange={(e) => setCheckInForm({ ...checkInForm, estimatedDuration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                  >
                    <option value={30}>30 {t('common.minutes')}</option>
                    <option value={60}>1 {t('common.hour')}</option>
                    <option value={90}>1.5 {t('common.hours')}</option>
                    <option value={120}>2 {t('common.hours')}</option>
                    <option value={180}>3 {t('common.hours')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    {t('checkin.message')} ({t('common.optional')})
                  </label>
                  <input
                    type="text"
                    value={checkInForm.message}
                    onChange={(e) => setCheckInForm({ ...checkInForm, message: e.target.value })}
                    placeholder={t('checkin.messagePlaceholder')}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={checkInForm.isPublic}
                    onChange={(e) => setCheckInForm({ ...checkInForm, isPublic: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isPublic" className="text-sm text-dark-300">
                    {t('checkin.sharePublicly')}
                  </label>
                </div>
                
                <button
                  onClick={() => handleCheckIn(selectedBrewery)}
                  disabled={checkingIn}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkingIn ? t('checkin.checkingIn') : t('checkin.checkIn')}
                </button>
              </div>
            )}
            
            {/* Brewery links */}
            <div className="mt-4 flex gap-4">
              {selectedBrewery.website && (
                <a 
                  href={selectedBrewery.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  {t('common.website')} →
                </a>
              )}
              {selectedBrewery.phone && (
                <a 
                  href={`tel:${selectedBrewery.phone}`}
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  {t('common.call')} {selectedBrewery.phone}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;