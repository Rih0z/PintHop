/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/brewery/BreweryDetails.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * ブルワリーの詳細情報を表示するコンポーネント
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brewery } from '../../types/brewery';
import BreweryRatings from './BreweryRatings';
import { AnimatedCard, AnimatedBeerRating, BeerTapButton } from '../common/AnimatedCard';
import { BeerFlavorChart, IBUMeter } from '../beer/BeerFlavorChart';
import { TaplistSkeleton, EmptyBeerGlass } from '../common/LoadingStates';
import { colors } from '../../styles/design-system';

interface BreweryDetailsProps {
  brewery: Brewery;
  onCheckIn?: () => void;
}

interface BeerOnTap {
  id: string;
  name: string;
  style: string;
  abv: number;
  ibu?: number;
  description?: string;
  flavorProfile?: {
    hoppy: number;
    malty: number;
    bitter: number;
    sweet: number;
    citrus: number;
    roasted: number;
    fruity: number;
    spicy: number;
  };
}

const BreweryDetails: React.FC<BreweryDetailsProps> = ({ brewery, onCheckIn }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'beers' | 'photos'>('overview');
  const [selectedBeer, setSelectedBeer] = useState<BeerOnTap | null>(null);
  
  // Mock beer data - in real app, fetch from API
  const beersOnTap: BeerOnTap[] = [
    {
      id: '1',
      name: 'Hop Hazard IPA',
      style: 'IPA',
      abv: 6.8,
      ibu: 65,
      description: 'A hazardously hoppy IPA with citrus and pine notes',
      flavorProfile: {
        hoppy: 9,
        malty: 3,
        bitter: 7,
        sweet: 2,
        citrus: 8,
        roasted: 1,
        fruity: 6,
        spicy: 2
      }
    },
    {
      id: '2',
      name: 'Dark Roast Stout',
      style: 'Stout',
      abv: 7.2,
      ibu: 35,
      description: 'Rich, roasted coffee and chocolate notes',
      flavorProfile: {
        hoppy: 2,
        malty: 8,
        bitter: 5,
        sweet: 6,
        citrus: 1,
        roasted: 9,
        fruity: 2,
        spicy: 3
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Hero Section */}
      <motion.div 
        className="relative h-96 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {brewery.photos?.[0] ? (
          <img 
            src={brewery.photos[0]} 
            alt={brewery.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Brewery Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {brewery.name}
          </motion.h1>
          
          {brewery.address && (
            <motion.p 
              className="text-lg text-gray-300 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {brewery.address.street && `${brewery.address.street}, `}
              {brewery.address.city}, {brewery.address.state}
            </motion.p>
          )}
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <BreweryRatings ratings={brewery.ratings} />
            {onCheckIn && (
              <BeerTapButton onClick={onCheckIn} variant="primary" size="lg">
                Check In Here
              </BeerTapButton>
            )}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <BeerTapButton
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'primary' : 'ghost'}
          >
            Overview
          </BeerTapButton>
          <BeerTapButton
            onClick={() => setActiveTab('beers')}
            variant={activeTab === 'beers' ? 'primary' : 'ghost'}
          >
            Beers on Tap
          </BeerTapButton>
          <BeerTapButton
            onClick={() => setActiveTab('photos')}
            variant={activeTab === 'photos' ? 'primary' : 'ghost'}
          >
            Photos
          </BeerTapButton>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Info Card */}
              <div className="lg:col-span-2">
                <AnimatedCard variant="brewery" className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">About {brewery.name}</h2>
                  <p className="text-gray-300 mb-6">
                    {brewery.description || 'A great place to enjoy craft beer with friends. Known for their exceptional brews and welcoming atmosphere.'}
                  </p>
                  
                  {/* Tags */}
                  {brewery.tags && brewery.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {brewery.tags.map((tag: string) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {brewery.phone && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Phone</h3>
                        <a href={`tel:${brewery.phone}`} className="text-amber-400 hover:text-amber-300">
                          {brewery.phone}
                        </a>
                      </div>
                    )}
                    {brewery.website && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Website</h3>
                        <a 
                          href={brewery.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300"
                        >
                          Visit Website →
                        </a>
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              </div>
              
              {/* Stats Card */}
              <div>
                <AnimatedCard variant="glass" glassEffect className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Live Stats</h3>
                  
                  <div className="space-y-4">
                    {brewery.currentVisitors !== undefined && (
                      <div>
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-gray-400">Currently Here</span>
                          <span className="text-2xl font-bold text-amber-500">
                            {brewery.currentVisitors}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-green-500 to-green-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(brewery.currentVisitors * 10, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {brewery.currentTaps !== undefined && (
                      <div>
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-gray-400">Beers on Tap</span>
                          <span className="text-2xl font-bold text-amber-500">
                            {brewery.currentTaps}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              </div>
            </motion.div>
          )}
          
          {/* Beers Tab */}
          {activeTab === 'beers' && (
            <motion.div
              key="beers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Beer List */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Currently on Tap</h2>
                <div className="space-y-4">
                  {beersOnTap.map((beer, index) => (
                    <motion.div
                      key={beer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AnimatedCard
                        variant="beer"
                        hoverable
                        clickable
                        onClick={() => setSelectedBeer(beer)}
                        className={`p-4 ${selectedBeer?.id === beer.id ? 'ring-2 ring-amber-500' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-white">{beer.name}</h3>
                            <p className="text-gray-400">{beer.style}</p>
                            {beer.description && (
                              <p className="text-sm text-gray-300 mt-2">{beer.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-amber-500 font-bold">{beer.abv}%</div>
                            {beer.ibu && (
                              <div className="text-sm text-gray-400">{beer.ibu} IBU</div>
                            )}
                          </div>
                        </div>
                      </AnimatedCard>
                    </motion.div>
                  ))}
                  
                  {beersOnTap.length === 0 && (
                    <EmptyBeerGlass message="No beers on tap information available" />
                  )}
                </div>
              </div>
              
              {/* Selected Beer Details */}
              {selectedBeer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <AnimatedCard variant="glass" glassEffect className="p-6 sticky top-4">
                    <h3 className="text-2xl font-bold text-amber-500 mb-2">{selectedBeer.name}</h3>
                    <p className="text-gray-400 mb-6">{selectedBeer.style}</p>
                    
                    {selectedBeer.flavorProfile && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-400 mb-4">Flavor Profile</h4>
                        <BeerFlavorChart flavorProfile={selectedBeer.flavorProfile} size="sm" />
                      </div>
                    )}
                    
                    {selectedBeer.ibu && (
                      <div className="mb-6">
                        <IBUMeter ibu={selectedBeer.ibu} showScale={false} />
                      </div>
                    )}
                  </AnimatedCard>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Photos</h2>
              {brewery.photos && brewery.photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brewery.photos.map((photo: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative aspect-square overflow-hidden rounded-xl"
                    >
                      <img 
                        src={photo} 
                        alt={`${brewery.name} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyBeerGlass message="No photos available" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BreweryDetails;
