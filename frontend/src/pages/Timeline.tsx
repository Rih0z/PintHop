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
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const filteredCheckins = getFilteredCheckins();

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{t('nav.timeline')}</h1>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Today's Route Summary */}
        {todayRoute && todayRoute.totalStops > 0 && (
          <div className="mb-6 p-6 bg-gradient-to-r from-primary-500/10 to-beer-500/10 rounded-xl border border-primary-500/20">
            <h2 className="text-lg font-bold text-white mb-3">{t('timeline.todayRoute')}</h2>
            <div className="flex items-center space-x-2">
              {todayRoute.stops.map((stop, index) => (
                <React.Fragment key={index}>
                  <div className="text-sm">
                    <div className="font-medium text-white">{stop.breweryName}</div>
                    <div className="text-dark-400 text-xs">
                      {new Date(stop.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {index < todayRoute.stops.length - 1 && (
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-primary-400 text-sm mt-2">
              {t('timeline.totalStops', { count: todayRoute.totalStops })}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-dark-800/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'all' 
                ? 'bg-primary-500 text-white' 
                : 'text-dark-300 hover:text-white'
            }`}
          >
            {t('timeline.allActivity')}
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'friends' 
                ? 'bg-primary-500 text-white' 
                : 'text-dark-300 hover:text-white'
            }`}
          >
            {t('timeline.friendsOnly')}
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'mine' 
                ? 'bg-primary-500 text-white' 
                : 'text-dark-300 hover:text-white'
            }`}
          >
            {t('timeline.myActivity')}
          </button>
        </div>

        {/* Check-ins List */}
        <div className="space-y-4">
          {filteredCheckins.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-400 mb-4">{t('timeline.noActivity')}</p>
              <Link
                to="/map"
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {t('timeline.checkInNow')}
              </Link>
            </div>
          ) : (
            filteredCheckins.map((checkin) => (
              <div 
                key={checkin.id} 
                className="bg-dark-800/50 rounded-xl p-6 border border-dark-700 hover:border-dark-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {checkin.username}
                      <span className="text-dark-400 font-normal"> {t('timeline.checkedInAt')} </span>
                      {checkin.breweryName}
                    </h3>
                    <p className="text-sm text-dark-400">
                      {formatTimeAgo(checkin.timestamp)}
                    </p>
                  </div>
                  {checkin.rating && (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < (checkin.rating || 0) ? 'text-beer-400' : 'text-dark-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
                
                {checkin.note && (
                  <p className="text-dark-200 mb-3">{checkin.note}</p>
                )}
                
                {checkin.photos && checkin.photos.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {checkin.photos.map((photo, index) => (
                      <img 
                        key={index}
                        src={photo} 
                        alt={`Check-in photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/map"
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {t('timeline.viewOnMap')} →
                  </Link>
                  <div className="text-dark-400">
                    {new Date(checkin.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredCheckins.length >= 20 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-colors">
              {t('common.loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;