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
import { OptimizedBreweryCard, BreweryListItem } from '../components/brewery/OptimizedBreweryCard';
import { BeerGlassLoader, EmptyBeerGlass } from '../components/common/LoadingStates';
import { BeerTapButton, BeerFAB } from '../components/common/AnimatedCard';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../styles/design-system';

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
  description?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
  };
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  tags?: string[];
  currentVisitors?: number;
  photos?: string[];
  currentTaps?: number;
  specialtyStyles?: Array<{ style: string; rating: number }>;
  ratings?: {
    untappd?: { score: number };
    rateBeer?: { score: number };
    beerAdvocate?: { score: number };
  };
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
  const [showList, setShowList] = useState(false);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <BeerGlassLoader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <motion.div 
        className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{t('nav.map')}</h1>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-amber-500 text-sm font-medium"
              >
                {breweries.length} breweries
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-80px)]">
        {/* Brewery List Sidebar */}
        <AnimatePresence>
          {showList && (
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 z-20 overflow-hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              <div className="p-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">Breweries ({breweries.length})</h2>
                  <button
                    onClick={() => setShowList(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto h-full pb-20">
                <div className="p-4 space-y-3">
                  {breweries.length === 0 ? (
                    <EmptyBeerGlass message="No breweries found" />
                  ) : (
                    breweries.map((brewery) => (
                      <BreweryListItem
                        key={brewery.id}
                        brewery={{
                          ...brewery,
                          currentVisitors: getVisitorCount(brewery.id)
                        }}
                        onClick={() => {
                          setSelectedBrewery(brewery);
                          setShowList(false);
                        }}
                        selected={selectedBrewery?.id === brewery.id}
                      />
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                      <p className="text-sm text-gray-600">
                        {brewery.address?.street && `${brewery.address.street}, `}
                        {brewery.address?.city}, {brewery.address?.state}
                      </p>
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

        {/* Brewery Details Panel with Animation */}
        <AnimatePresence>
          {selectedBrewery && (
            <motion.div 
              className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-10"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-500/20 p-6">
                <button
                  onClick={() => setSelectedBrewery(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <h2 className="text-xl font-bold text-white mb-2">{selectedBrewery.name}</h2>
                <p className="text-gray-400 mb-4">
                  {selectedBrewery.address?.street || ''}
                  {selectedBrewery.address?.city && selectedBrewery.address?.state && 
                    `, ${selectedBrewery.address.city}, ${selectedBrewery.address.state}`}
                </p>
                
                {/* Current visitors with animation */}
                {getVisitorCount(selectedBrewery.id) > 0 && (
                  <motion.div 
                    className="mb-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-amber-400 font-medium">
                      {getVisitorCount(selectedBrewery.id)} {t('map.friendsHere')}
                    </p>
                  </motion.div>
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
                
                <BeerTapButton
                  onClick={() => handleCheckIn(selectedBrewery)}
                  disabled={checkingIn}
                  variant="primary"
                  size="lg"
                >
                  {checkingIn ? t('checkin.checkingIn') : t('checkin.checkIn')}
                </BeerTapButton>
              </div>
            )}
            
                {/* Brewery links */}
                <div className="mt-4 flex gap-4">
                  {selectedBrewery.website && (
                    <a 
                      href={selectedBrewery.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                    >
                      {t('common.website')} →
                    </a>
                  )}
                  {selectedBrewery.phone && (
                    <a 
                      href={`tel:${selectedBrewery.phone}`}
                      className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                    >
                      {t('common.call')} {selectedBrewery.phone}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Floating Action Button */}
        {!showList && (
          <BeerFAB
            onClick={() => setShowList(true)}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          />
        )}
      </div>
    </div>
  );
};

export default MapPage;