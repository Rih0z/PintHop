/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Timeline.tsx
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-24 00:00:00
 * 最終更新日: 2025-06-11
 * バージョン: 2.0
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 Koki Riho 新規作成
 * - 2025-01-05 全機能実装 - チェックイン履歴、友達アクティビティ表示
 * - 2025-06-11 Claude Code 2024-2025 UI/UXトレンド完全準拠版に更新
 *
 * 説明:
 * 2024-2025 UI/UXトレンドに完全準拠したタイムライン画面
 * Dark Mode First、Glassmorphism、Bold Typography、Micro-interactions実装
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18n';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { ModernCard, ModernButton, ModernTabs, ModernSkeleton } from '../components/common/ModernComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography, animations } from '../styles/design-system';
import { 
  HiHome, 
  HiUsers, 
  HiUser, 
  HiClock, 
  HiLocationMarker, 
  HiStar,
  HiRefresh,
  HiPlus
} from 'react-icons/hi';

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
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'friends' | 'mine'>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Theme detection
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'dark';
    setTheme(currentTheme);
  }, []);

  // Fetch check-ins
  const fetchCheckins = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_URL}/api/checkins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCheckins(response.data.checkins || []);
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
      setFriends(response.data.friends || []);
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

  // Load data with enhanced UX
  const loadData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      await Promise.all([fetchCheckins(), fetchFriends(), fetchTodayRoute()]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Refresh every 2 minutes
    const interval = setInterval(() => loadData(true), 120000);
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

  // Format time ago with Japanese support
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return 'たった今';
    if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}日前`;
    return new Date(timestamp).toLocaleDateString('ja-JP');
  };

  // Loading state with 2025 design
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        {/* Background gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: theme === 'dark' 
              ? 'radial-gradient(circle at 50% 50%, rgba(185, 127, 36, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 50% 50%, rgba(185, 127, 36, 0.05) 0%, transparent 50%)'
          }}
        />
        
        {/* 3D Beer Glass Loader */}
        <motion.div
          className="relative"
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div 
            className="text-8xl"
            style={{
              filter: 'drop-shadow(0 20px 40px rgba(185, 127, 36, 0.3))',
              transform: 'perspective(1000px) rotateX(15deg)'
            }}
          >
            🍺
          </div>
        </motion.div>
        
        <motion.p 
          className="absolute bottom-1/3 font-heading"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          タイムラインを読み込み中...
        </motion.p>
      </div>
    );
  }

  const filteredCheckins = getFilteredCheckins();

  // Tab configuration for ModernTabs
  const tabs = [
    {
      id: 'all',
      label: 'すべて',
      icon: <HiHome className="w-4 h-4" />
    },
    {
      id: 'friends',
      label: '友達',
      icon: <HiUsers className="w-4 h-4" />
    },
    {
      id: 'mine',
      label: '自分',
      icon: <HiUser className="w-4 h-4" />
    }
  ];

  return (
    <div 
      className="min-h-screen relative"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* 2025年版 Background layers */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: theme === 'dark' 
            ? `
              radial-gradient(circle at 20% 80%, rgba(185, 127, 36, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(91, 146, 191, 0.03) 0%, transparent 50%)
            `
            : `
              radial-gradient(circle at 20% 80%, rgba(185, 127, 36, 0.02) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(91, 146, 191, 0.01) 0%, transparent 50%)
            `
        }}
      />

      {/* Glassmorphism Header */}
      <motion.div 
        className="sticky top-0 z-20 border-b"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: theme === 'dark' 
            ? 'rgba(17, 17, 17, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          borderColor: 'var(--color-border-subtle)'
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.h1 
              className="font-display"
              style={{
                fontSize: typography.fontSize['4xl'],
                fontWeight: typography.fontWeight.black,
                color: 'var(--color-text-primary)',
                letterSpacing: typography.letterSpacing.tight
              }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              TIMELINE
            </motion.h1>
            
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <motion.button
                className="p-2 rounded-xl"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadData(true)}
                disabled={refreshing}
              >
                <motion.div
                  animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                  transition={refreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                >
                  <HiRefresh 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-text-secondary)' }}
                  />
                </motion.div>
              </motion.button>
              
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-4xl relative">
        {/* Today's Route Summary with Glassmorphism */}
        {todayRoute && todayRoute.totalStops > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ModernCard 
              glass={true} 
              glassIntensity="medium"
              theme={theme}
              padding="lg"
              className="relative overflow-hidden"
            >
              {/* Gradient overlay */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(135deg, rgba(185, 127, 36, 0.3) 0%, rgba(232, 93, 16, 0.2) 100%)'
                }}
              />
              
              <div className="relative z-10">
                <h2 
                  className="font-heading mb-4"
                  style={{
                    fontSize: typography.fontSize['2xl'],
                    fontWeight: typography.fontWeight.bold,
                    color: 'var(--color-text-primary)'
                  }}
                >
                  今日のルート
                </h2>
                
                <div className="flex items-center space-x-3 overflow-x-auto pb-3">
                  {todayRoute.stops.map((stop, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="flex items-center gap-3 flex-shrink-0"
                    >
                      <div className="text-sm">
                        <div 
                          className="font-semibold"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {stop.breweryName}
                        </div>
                        <div 
                          className="text-xs flex items-center gap-1"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                          <HiClock className="w-3 h-3" />
                          {new Date(stop.timestamp).toLocaleTimeString('ja-JP', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      
                      {index < todayRoute.stops.length - 1 && (
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <svg 
                            className="w-4 h-4 flex-shrink-0" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            style={{ color: colors.primary[400] }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <p 
                  className="text-sm mt-3 font-medium"
                  style={{ color: colors.primary[400] }}
                >
                  合計 {todayRoute.totalStops} ヶ所を訪問
                </p>
              </div>
            </ModernCard>
          </motion.div>
        )}

        {/* Enhanced Tabs with Glassmorphism */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ModernTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as 'all' | 'friends' | 'mine')}
            variant="glass"
            theme={theme}
          />
        </motion.div>

        {/* Check-ins List with 2025 Design */}
        <div className="space-y-6">
          {filteredCheckins.length === 0 ? (
            // Empty State with 3D Beer Glass
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="mb-8"
                animate={{ 
                  rotateY: [0, 15, -15, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div 
                  className="text-8xl mb-4"
                  style={{
                    filter: 'drop-shadow(0 10px 30px rgba(185, 127, 36, 0.2))',
                    transform: 'perspective(1000px) rotateX(10deg)'
                  }}
                >
                  🍺
                </div>
              </motion.div>
              
              <h3 
                className="font-heading mb-4"
                style={{
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: 'var(--color-text-primary)'
                }}
              >
                まだアクティビティがありません
              </h3>
              
              <p 
                className="mb-8"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: typography.fontSize.lg
                }}
              >
                ビアホッピングを始めて、友達と体験を共有しましょう！
              </p>
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.8, 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <Link to="/map">
                  <ModernButton
                    variant="primary"
                    size="lg"
                    theme={theme}
                    icon={<HiPlus className="w-5 h-5" />}
                  >
                    初回チェックイン
                  </ModernButton>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            // Check-ins with enhanced cards
            <AnimatePresence mode="popLayout">
              {filteredCheckins.map((checkin, index) => (
                <motion.div
                  key={checkin.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <ModernCard 
                    glass={true}
                    glassIntensity="medium"
                    theme={theme}
                    padding="lg"
                    interactive={true}
                    className="relative overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 
                          className="font-heading mb-2"
                          style={{
                            fontSize: typography.fontSize.xl,
                            fontWeight: typography.fontWeight.bold,
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          <span style={{ color: colors.primary[400] }}>
                            {checkin.username}
                          </span>
                          <span 
                            className="font-body"
                            style={{ 
                              color: 'var(--color-text-secondary)',
                              fontWeight: typography.fontWeight.normal
                            }}
                          > がチェックイン </span>
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <HiLocationMarker 
                            className="w-4 h-4"
                            style={{ color: colors.secondary[400] }}
                          />
                          <span 
                            className="font-medium"
                            style={{ 
                              color: 'var(--color-text-primary)',
                              fontSize: typography.fontSize.lg
                            }}
                          >
                            {checkin.breweryName}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <HiClock 
                            className="w-4 h-4"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          />
                          <span 
                            className="text-sm"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          >
                            {formatTimeAgo(checkin.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      {checkin.rating && (
                        <motion.div 
                          className="flex items-center gap-1 p-2 rounded-xl"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(185, 127, 36, 0.15)' : 'rgba(185, 127, 36, 0.1)',
                            border: `1px solid ${theme === 'dark' ? 'rgba(185, 127, 36, 0.3)' : 'rgba(185, 127, 36, 0.2)'}`
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <HiStar 
                            className="w-4 h-4"
                            style={{ color: colors.primary[400] }}
                          />
                          <span 
                            className="text-sm font-bold"
                            style={{ color: colors.primary[400] }}
                          >
                            {checkin.rating}
                          </span>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Note */}
                    {checkin.note && (
                      <p 
                        className="mb-4 font-body"
                        style={{ 
                          color: 'var(--color-text-secondary)',
                          fontSize: typography.fontSize.base,
                          lineHeight: 1.6
                        }}
                      >
                        {checkin.note}
                      </p>
                    )}
                    
                    {/* Photos */}
                    {checkin.photos && checkin.photos.length > 0 && (
                      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                        {checkin.photos.map((photo, photoIndex) => (
                          <motion.img 
                            key={photoIndex}
                            src={photo} 
                            alt={`チェックイン写真 ${photoIndex + 1}`}
                            className="w-24 h-24 object-cover rounded-2xl flex-shrink-0 border"
                            style={{
                              borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                            }}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: photoIndex * 0.1 + 0.2 }}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t"
                         style={{ borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}>
                      <Link to="/map">
                        <motion.div 
                          className="flex items-center gap-2 text-sm font-medium"
                          style={{ color: colors.primary[400] }}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          マップで見る
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      </Link>
                      
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {new Date(checkin.timestamp).toLocaleString('ja-JP')}
                      </span>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Load More with enhanced design */}
        {filteredCheckins.length >= 20 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ModernButton
              variant="glass"
              size="lg"
              theme={theme}
              icon={<HiRefresh className="w-5 h-5" />}
            >
              さらに読み込む
            </ModernButton>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;