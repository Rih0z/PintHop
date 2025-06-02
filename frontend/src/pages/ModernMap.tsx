/**
 * Modern Map Page - Mobile-first design
 * Inspired by Netflix/Uber design principles
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ModernCard,
  ModernButton,
  ModernBottomSheet,
  ModernTabs,
  ModernListItem,
  ModernFAB,
  ModernHealthIndicator,
} from '../components/common/ModernComponents';
import { modernColors, modernGradients, modernSpacing } from '../styles/modern-design-system';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Brewery {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  distance: number;
  priceLevel: 1 | 2 | 3 | 4;
  currentVisitors: number;
  photos: string[];
  beersOnTap: number;
  tags: string[];
  isOpen: boolean;
  openUntil?: string;
  address: {
    street: string;
    city: string;
    state: string;
  };
}

const ModernMapPage: React.FC = () => {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [selectedBrewery, setSelectedBrewery] = useState<Brewery | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'open' | 'nearby'>('all');
  const [loading, setLoading] = useState(true);
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockBreweries: Brewery[] = [
      {
        id: '1',
        name: 'Pike Brewing Company',
        description: 'Historic brewery in Pike Place Market',
        latitude: 47.6097,
        longitude: -122.3331,
        rating: 4.3,
        reviewCount: 1250,
        distance: 0.2,
        priceLevel: 3,
        currentVisitors: 12,
        photos: ['https://example.com/pike1.jpg'],
        beersOnTap: 8,
        tags: ['Historic', 'Tourist Spot', 'Food'],
        isOpen: true,
        openUntil: '11:00 PM',
        address: {
          street: '1415 1st Ave',
          city: 'Seattle',
          state: 'WA'
        }
      },
      {
        id: '2',
        name: 'Fremont Brewing',
        description: 'Urban beer garden with award-winning IPAs',
        latitude: 47.6505,
        longitude: -122.3493,
        rating: 4.6,
        reviewCount: 890,
        distance: 1.5,
        priceLevel: 2,
        currentVisitors: 8,
        photos: ['https://example.com/fremont1.jpg'],
        beersOnTap: 12,
        tags: ['Beer Garden', 'Dog Friendly', 'Local Favorite'],
        isOpen: true,
        openUntil: '10:00 PM',
        address: {
          street: '1050 N 34th St',
          city: 'Seattle',
          state: 'WA'
        }
      },
    ];

    setTimeout(() => {
      setBreweries(mockBreweries);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBreweries = breweries.filter(brewery => {
    if (searchQuery && !brewery.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    switch (filterType) {
      case 'open':
        return brewery.isOpen;
      case 'nearby':
        return brewery.distance <= 1.0;
      default:
        return true;
    }
  });

  const handleBrewerySelect = (brewery: Brewery) => {
    setSelectedBrewery(brewery);
    setShowBottomSheet(true);
  };

  const tabs = [
    { id: 'list', label: 'List', icon: '📋' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'filters', label: 'Filter', icon: '🔍' },
  ];

  const getPriceLevelText = (level: number) => {
    return '$'.repeat(level);
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '✨' : '');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm px-4 py-3 safe-area-top"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
          <ModernButton
            variant="ghost"
            size="sm"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          >
            Search
          </ModernButton>
        </div>
        
        {/* Quick stats */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{filteredBreweries.length} breweries</span>
          <span>•</span>
          <span>{filteredBreweries.filter(b => b.isOpen).length} open now</span>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="px-4 bg-white border-b border-gray-100">
        <ModernTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {/* List View */}
          {activeTab === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full overflow-y-auto"
            >
              {loading ? (
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <ModernCard key={i} className="animate-pulse">
                      <div className="flex">
                        <div className="w-20 h-20 bg-gray-300 rounded-lg mr-4"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </ModernCard>
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-3 pb-20">
                  {filteredBreweries.map((brewery, index) => (
                    <motion.div
                      key={brewery.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ModernCard
                        interactive
                        onClick={() => handleBrewerySelect(brewery)}
                        className="p-4"
                      >
                        <div className="flex">
                          {/* Brewery Image */}
                          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl mr-4 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🍺</span>
                          </div>
                          
                          {/* Brewery Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{brewery.name}</h3>
                              <div className="flex items-center gap-1 ml-2">
                                <span className="text-sm font-medium text-gray-900">{brewery.rating}</span>
                                <span className="text-xs">⭐</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                {brewery.distance}km
                              </span>
                              <span className="text-xs text-gray-500">
                                {getPriceLevelText(brewery.priceLevel)}
                              </span>
                              {brewery.isOpen && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                  Open
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate">{brewery.description}</p>
                              {brewery.currentVisitors > 0 && (
                                <div className="flex items-center text-xs text-amber-600 ml-2">
                                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
                                  {brewery.currentVisitors} here
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </ModernCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Map View */}
          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <MapContainer
                center={[47.6062, -122.3321]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {filteredBreweries.map((brewery) => (
                  <Marker
                    key={brewery.id}
                    position={[brewery.latitude, brewery.longitude]}
                    eventHandlers={{
                      click: () => handleBrewerySelect(brewery)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{brewery.name}</h3>
                        <p className="text-sm text-gray-600">{brewery.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm">{renderStars(brewery.rating)}</span>
                          <span className="text-sm text-gray-500">({brewery.reviewCount})</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>
          )}

          {/* Filter View */}
          {activeTab === 'filters' && (
            <motion.div
              key="filters"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto p-4"
            >
              <ModernCard padding="lg">
                <h3 className="text-lg font-semibold mb-4">Filter Options</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: 'all', label: 'All' },
                        { value: 'open', label: 'Open Now' },
                        { value: 'nearby', label: 'Nearby' },
                      ].map((option) => (
                        <ModernButton
                          key={option.value}
                          variant={filterType === option.value ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setFilterType(option.value as any)}
                        >
                          {option.label}
                        </ModernButton>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distance
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </ModernCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sheet */}
      <ModernBottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title={selectedBrewery?.name}
        height="half"
      >
        {selectedBrewery && (
          <div className="space-y-6">
            {/* Hero Image */}
            <div className="h-40 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center">
              <span className="text-6xl">🍺</span>
            </div>
            
            {/* Basic Info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">{selectedBrewery.name}</h2>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{selectedBrewery.rating}</span>
                  <span>⭐</span>
                  <span className="text-sm text-gray-500">({selectedBrewery.reviewCount})</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-3">{selectedBrewery.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{selectedBrewery.distance}km away</span>
                <span>•</span>
                <span>{getPriceLevelText(selectedBrewery.priceLevel)}</span>
                <span>•</span>
                <span className={selectedBrewery.isOpen ? 'text-green-600' : 'text-red-600'}>
                  {selectedBrewery.isOpen ? `Open until ${selectedBrewery.openUntil}` : 'Closed'}
                </span>
              </div>
            </div>
            
            {/* Health Indicators */}
            <div className="space-y-3">
              <ModernHealthIndicator
                label="Current Visitors"
                value={selectedBrewery.currentVisitors}
                unit="people"
                status="moderate"
                icon={<span>👥</span>}
              />
              <ModernHealthIndicator
                label="Beers on Tap"
                value={selectedBrewery.beersOnTap}
                unit="beers"
                status="low"
                icon={<span>🍺</span>}
              />
            </div>
            
            {/* Tags */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {selectedBrewery.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <ModernButton variant="primary" fullWidth>
                Check In
              </ModernButton>
              <ModernButton variant="secondary" fullWidth>
                Directions
              </ModernButton>
            </div>
          </div>
        )}
      </ModernBottomSheet>

      {/* Floating Action Button */}
      <ModernFAB
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        }
        onClick={() => {/* Add new brewery or quick action */}}
      />
    </div>
  );
};

export default ModernMapPage;