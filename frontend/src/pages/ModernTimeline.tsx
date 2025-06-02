/**
 * Modern Timeline Page - Mobile-first design
 * Stories-style feed inspired by Netflix/Instagram
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ModernCard,
  ModernButton,
  ModernTabs,
  ModernListItem,
  ModernHealthIndicator,
  ModernSkeleton,
} from '../components/common/ModernComponents';
import { modernColors, modernGradients } from '../styles/modern-design-system';

interface CheckIn {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  breweryId: string;
  breweryName: string;
  beerName: string;
  beerStyle: string;
  rating: number;
  note: string;
  photos: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  abv: number;
  ibu?: number;
  location: {
    city: string;
    state: string;
  };
  badges?: string[];
}

interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isViewed: boolean;
  timestamp: string;
}

const ModernTimelinePage: React.FC = () => {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeTab, setActiveTab] = useState('feed');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  useEffect(() => {
    const mockStories: Story[] = [
      {
        id: '1',
        userId: 'user1',
        username: 'alex_hops',
        userAvatar: 'https://via.placeholder.com/40x40/FFB300/000000?text=A',
        isViewed: false,
        timestamp: '2 hours ago',
      },
      {
        id: '2',
        userId: 'user2',
        username: 'sarah_brews',
        userAvatar: 'https://via.placeholder.com/40x40/66BB6A/000000?text=S',
        isViewed: true,
        timestamp: '4 hours ago',
      },
    ];

    const mockCheckins: CheckIn[] = [
      {
        id: '1',
        userId: 'user1',
        username: 'alex_hops',
        userAvatar: 'https://via.placeholder.com/40x40/FFB300/000000?text=A',
        breweryId: 'brewery1',
        breweryName: 'Pike Brewing Company',
        beerName: 'Pike IPA',
        beerStyle: 'American IPA',
        rating: 4.5,
        note: 'Perfect hoppy balance! The citrus notes really shine through. Great beer garden atmosphere.',
        photos: ['https://via.placeholder.com/300x200/FFB300/000000?text=Beer'],
        timestamp: '2024-06-02T10:30:00Z',
        likes: 12,
        comments: 3,
        isLiked: false,
        abv: 6.8,
        ibu: 65,
        location: {
          city: 'Seattle',
          state: 'WA',
        },
        badges: ['IPA Explorer', 'First Timer'],
      },
      {
        id: '2',
        userId: 'user2',
        username: 'sarah_brews',
        userAvatar: 'https://via.placeholder.com/40x40/66BB6A/000000?text=S',
        breweryId: 'brewery2',
        breweryName: 'Fremont Brewing',
        beerName: 'Dark Star Stout',
        beerStyle: 'Imperial Stout',
        rating: 5.0,
        note: 'Rich chocolate and coffee notes. Perfect for a rainy Seattle evening.',
        photos: [],
        timestamp: '2024-06-02T08:15:00Z',
        likes: 8,
        comments: 1,
        isLiked: true,
        abv: 9.2,
        location: {
          city: 'Seattle',
          state: 'WA',
        },
        badges: ['Stout Master'],
      },
    ];

    setTimeout(() => {
      setStories(mockStories);
      setCheckins(mockCheckins);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleLike = (checkinId: string) => {
    setCheckins(prev => prev.map(checkin => 
      checkin.id === checkinId 
        ? { 
            ...checkin, 
            isLiked: !checkin.isLiked,
            likes: checkin.isLiked ? checkin.likes - 1 : checkin.likes + 1
          }
        : checkin
    ));
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000 / 60); // minutes
    
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-amber-500' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const getABVStatus = (abv: number): 'low' | 'moderate' | 'high' => {
    if (abv < 5) return 'low';
    if (abv < 8) return 'moderate';
    return 'high';
  };

  const tabs = [
    { id: 'feed', label: 'Feed', icon: '🏠' },
    { id: 'following', label: 'Following', icon: '👥' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm px-4 py-3 safe-area-top sticky top-0 z-20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
          <div className="flex gap-2">
            <ModernButton
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              loading={refreshing}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            />
            <ModernButton
              variant="ghost"
              size="sm"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Post
            </ModernButton>
          </div>
        </div>
        
        <ModernTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />
      </motion.div>

      {/* Stories Section */}
      {activeTab === 'feed' && (
        <motion.div 
          className="bg-white px-4 py-3 border-b border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex gap-4 overflow-x-auto pb-2">
            {/* Add Your Story */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-1">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">Your story</span>
            </div>
            
            {/* Stories */}
            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center flex-shrink-0">
                <div className={`w-16 h-16 rounded-full p-0.5 ${story.isViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-amber-500 to-pink-500'}`}>
                  <img
                    src={story.userAvatar}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                <span className="text-xs text-gray-600 mt-1 max-w-[60px] truncate">
                  {story.username}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Feed Content */}
      <div className="pb-20">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <ModernCard key={i} padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <ModernSkeleton variant="circular" width={40} height={40} />
                  <div className="flex-1">
                    <ModernSkeleton variant="text" width="60%" />
                    <ModernSkeleton variant="text" width="40%" />
                  </div>
                </div>
                <ModernSkeleton variant="rectangular" height={200} className="mb-4" />
                <ModernSkeleton variant="text" width="80%" />
              </ModernCard>
            ))}
          </div>
        ) : (
          <div className="space-y-4 p-4">
            <AnimatePresence>
              {checkins.map((checkin, index) => (
                <motion.div
                  key={checkin.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ModernCard padding="none" className="overflow-hidden">
                    {/* Header */}
                    <div className="p-4 pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={checkin.userAvatar}
                            alt={checkin.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{checkin.username}</h3>
                            <p className="text-sm text-gray-600">
                              at {checkin.breweryName} • {formatTimeAgo(checkin.timestamp)}
                            </p>
                          </div>
                        </div>
                        <ModernButton variant="ghost" size="sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </ModernButton>
                      </div>
                      
                      {/* Beer Info */}
                      <div className="mb-3">
                        <h4 className="font-bold text-lg text-gray-900">{checkin.beerName}</h4>
                        <p className="text-gray-600">{checkin.beerStyle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">{renderStars(checkin.rating)}</div>
                          <span className="text-sm text-gray-600">({checkin.rating})</span>
                        </div>
                      </div>
                    </div>

                    {/* Photo */}
                    {checkin.photos.length > 0 && (
                      <div className="relative">
                        <img
                          src={checkin.photos[0]}
                          alt="Beer photo"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      {/* Health Indicators */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <ModernHealthIndicator
                          label="ABV"
                          value={checkin.abv}
                          unit="%"
                          status={getABVStatus(checkin.abv)}
                          icon={<span>🍺</span>}
                        />
                        {checkin.ibu && (
                          <ModernHealthIndicator
                            label="IBU"
                            value={checkin.ibu}
                            unit=""
                            status="moderate"
                            icon={<span>🌿</span>}
                          />
                        )}
                      </div>

                      {/* Note */}
                      <p className="text-gray-800 mb-4">{checkin.note}</p>

                      {/* Badges */}
                      {checkin.badges && checkin.badges.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {checkin.badges.map((badge) => (
                            <span
                              key={badge}
                              className="px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 text-sm rounded-full border border-amber-300"
                            >
                              🏆 {badge}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <motion.button
                            onClick={() => handleLike(checkin.id)}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                            whileTap={{ scale: 0.9 }}
                          >
                            <motion.svg
                              className={`w-6 h-6 ${checkin.isLiked ? 'text-red-500 fill-current' : ''}`}
                              fill={checkin.isLiked ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              animate={checkin.isLiked ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </motion.svg>
                            <span className="text-sm font-medium">{checkin.likes}</span>
                          </motion.button>
                          
                          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-sm font-medium">{checkin.comments}</span>
                          </button>
                        </div>
                        
                        <button className="text-gray-600 hover:text-gray-800 transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTimelinePage;