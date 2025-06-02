/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Timeline.tsx
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 Koki Riho 新規作成
 * - 2025-01-05 全機能実装 - チェックイン履歴、友達アクティビティ表示
 *
 * 説明:
 * タイムライン - チェックイン履歴と友達のアクティビティを表示
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { AnimatedCard, AnimatedBeerRating, BeerTapButton } from '../components/common/AnimatedCard';
import { BeerGlassLoader, EmptyBeerGlass, TaplistSkeleton } from '../components/common/LoadingStates';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../styles/design-system';

const API_URL = process.env.REACT_APP_API_URL || 'https://pinthop-api.riho-dare.workers.dev';

interface CheckIn {
  id: string;
  userId: string;
  username: string;
  breweryId: string;
  breweryName: string;
  timestamp: string;
  rating?: number;
  note?: string;
  photos?: string[];
  isPublic: boolean;
}

interface Friend {
  username: string;
  email: string;
  since: string;
}

interface Route {
  date: string;
  stops: {
    breweryId: string;
    breweryName: string;
    timestamp: string;
  }[];
  totalStops: number;
}

const TimelinePage: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [todayRoute, setTodayRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'friends' | 'mine'>('all');

  // Fetch check-ins
  const fetchCheckins = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_URL}/api/checkins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCheckins(response.data.checkins);
    } catch (error) {
      console.error('Failed to fetch check-ins:', error);
    }
  };

  // Fetch friends
  const fetchFriends = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_URL}/api/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(response.data.friends);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  // Fetch today's route
  const fetchTodayRoute = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_URL}/api/routes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodayRoute(response.data.route);
    } catch (error) {
      console.error('Failed to fetch route:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCheckins(), fetchFriends(), fetchTodayRoute()]);
      setLoading(false);
    };
    
    loadData();
    
    // Refresh every minute
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [token]);

  // Filter check-ins based on active tab
  const getFilteredCheckins = () => {
    switch (activeTab) {
      case 'friends':
        const friendUsernames = friends.map(f => f.username);
        return checkins.filter(c => friendUsernames.includes(c.username) && c.isPublic);
      case 'mine':
        return checkins.filter(c => c.userId === user?.username);
      default:
        return checkins.filter(c => c.isPublic || c.userId === user?.username);
    }
  };

  // Format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000); // seconds

    if (diff < 60) return t('timeline.justNow');
    if (diff < 3600) return t('timeline.minutesAgo', { count: Math.floor(diff / 60) });
    if (diff < 86400) return t('timeline.hoursAgo', { count: Math.floor(diff / 3600) });
    return t('timeline.daysAgo', { count: Math.floor(diff / 86400) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <BeerGlassLoader size="lg" />
      </div>
    );
  }

  const filteredCheckins = getFilteredCheckins();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <motion.div 
        className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{t('nav.timeline')}</h1>
            <LanguageSwitcher />
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Today's Route Summary */}
        {todayRoute && todayRoute.totalStops > 0 && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatedCard variant="glass" glassEffect className="p-6 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20">
              <h2 className="text-lg font-bold text-white mb-3">{t('timeline.todayRoute')}</h2>
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {todayRoute.stops.map((stop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="text-sm flex-shrink-0">
                      <div className="font-medium text-white">{stop.breweryName}</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(stop.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {index < todayRoute.stops.length - 1 && (
                      <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </motion.div>
                ))}
              </div>
              <p className="text-amber-400 text-sm mt-2">
                {t('timeline.totalStops', { count: todayRoute.totalStops })}
              </p>
            </AnimatedCard>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div 
          className="flex space-x-1 mb-6 bg-gray-900/50 backdrop-blur-sm p-1 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <BeerTapButton
            onClick={() => setActiveTab('all')}
            variant={activeTab === 'all' ? 'primary' : 'ghost'}
            size="md"
          >
            {t('timeline.allActivity')}
          </BeerTapButton>
          <BeerTapButton
            onClick={() => setActiveTab('friends')}
            variant={activeTab === 'friends' ? 'primary' : 'ghost'}
            size="md"
          >
            {t('timeline.friendsOnly')}
          </BeerTapButton>
          <BeerTapButton
            onClick={() => setActiveTab('mine')}
            variant={activeTab === 'mine' ? 'primary' : 'ghost'}
            size="md"
          >
            {t('timeline.myActivity')}
          </BeerTapButton>
        </motion.div>

        {/* Check-ins List */}
        <div className="space-y-4">
          {filteredCheckins.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <EmptyBeerGlass message={t('timeline.noActivity')} />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Link to="/map">
                  <BeerTapButton variant="primary" size="lg">
                    {t('timeline.checkInNow')}
                  </BeerTapButton>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredCheckins.map((checkin, index) => (
                <motion.div
                  key={checkin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedCard 
                    variant="beer"
                    hoverable
                    className="p-6 mb-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {checkin.username}
                          <span className="text-gray-400 font-normal"> {t('timeline.checkedInAt')} </span>
                          {checkin.breweryName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {formatTimeAgo(checkin.timestamp)}
                        </p>
                      </div>
                      {checkin.rating && (
                        <AnimatedBeerRating 
                          rating={checkin.rating} 
                          size="sm" 
                          interactive={false}
                        />
                      )}
                    </div>
                    
                    {checkin.note && (
                      <p className="text-gray-200 mb-3">{checkin.note}</p>
                    )}
                    
                    {checkin.photos && checkin.photos.length > 0 && (
                      <div className="flex gap-2 mb-3 overflow-x-auto">
                        {checkin.photos.map((photo, photoIndex) => (
                          <motion.img 
                            key={photoIndex}
                            src={photo} 
                            alt={`Check-in photo ${photoIndex + 1}`}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: photoIndex * 0.1 }}
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <Link to="/map">
                        <motion.span 
                          className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                          whileHover={{ x: 5 }}
                        >
                          {t('timeline.viewOnMap')} 
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.span>
                      </Link>
                      <div className="text-gray-400">
                        {new Date(checkin.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Load More */}
        {filteredCheckins.length >= 20 && (
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <BeerTapButton variant="secondary" size="lg">
              {t('common.loadMore')}
            </BeerTapButton>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;