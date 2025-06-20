/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Profile.tsx
 *
 * 作成者: Claude Code
 * 作成日: 2025-06-11
 * 最終更新日: 2025-06-11
 * バージョン: 3.0
 *
 * 更新履歴:
 * - 2025-06-11 Claude Code Complete Rewrite - 2024-2025 UI/UXトレンド完全準拠版
 *
 * 説明:
 * 2024-2025 UI/UXトレンドに完全準拠したユーザープロフィール・統計・設定画面
 * Dark Mode First、Glassmorphism、Bold Typography、AI強化機能、3D Effects実装
 * Advanced Micro-interactions、Modern Skeuomorphism、Spatial Design
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { ModernCard, ModernButton, ModernTabs, ModernBeerIndicator, ModernSkeleton } from '../components/common/ModernComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography, animations } from '../styles/design-system';
import { 
  HiUser,
  HiLocationMarker,
  HiAdjustments,
  HiPhotograph,
  HiTrendingUp,
  HiAcademicCap,
  HiCollection,
  HiClock,
  HiUsers,
  HiCalendar,
  HiShieldCheck,
  HiBell,
  HiQuestionMarkCircle,
  HiLogout,
  HiRefresh,
  HiSparkles,
  HiStar,
  HiTrophy,
  HiFire,
  HiHeart,
  HiGlobe,
  HiCog,
  HiEye,
  HiPencil,
  HiCheck,
  HiX
} from 'react-icons/hi';

// Enhanced 2025 interfaces
interface UserStats {
  breweriesVisited: number;
  beersRecorded: number;
  routesCompleted: number;
  friendsMet: number;
  eventsAttended: number;
  badgesEarned: number;
  averageRating: number;
  hoursSpent: number;
  favoriteStyle: string;
  visitStreak: number;
  aiPersonalityScore: number;
  socialRank: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'exploration' | 'social' | 'taste' | 'achievement';
  aiRecommended?: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface ActivityItem {
  id: string;
  type: 'checkin' | 'badge' | 'friend' | 'event';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Enhanced state management
  const [activeTab, setActiveTab] = useState<'stats' | 'badges' | 'achievements' | 'activity' | 'settings'>('stats');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.username || '',
    bio: '',
    location: '',
    favoriteStyles: [] as string[]
  });

  // Theme detection with Dark Mode First
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'dark';
    setTheme(currentTheme);
  }, []);

  // Enhanced mock data with 2025 features
  const generateMockStats = (): UserStats => ({
    breweriesVisited: 23,
    beersRecorded: 89,
    routesCompleted: 7,
    friendsMet: 15,
    eventsAttended: 12,
    badgesEarned: 8,
    averageRating: 4.2,
    hoursSpent: 47,
    favoriteStyle: 'New England IPA',
    visitStreak: 5,
    aiPersonalityScore: 87,
    socialRank: 156
  });

  const generateMockBadges = (): Badge[] => [
    {
      id: '1',
      name: 'First Steps',
      description: '初回ブルワリー訪問',
      icon: '🍺',
      earnedAt: '2025-05-15',
      rarity: 'common',
      category: 'exploration'
    },
    {
      id: '2',
      name: 'Explorer',
      description: '10軒のブルワリーを訪問',
      icon: '🗺️',
      earnedAt: '2025-05-28',
      rarity: 'rare',
      category: 'exploration'
    },
    {
      id: '3',
      name: 'Social Butterfly',
      description: '5人の新しい友達と出会う',
      icon: '👥',
      earnedAt: '2025-06-02',
      rarity: 'rare',
      category: 'social'
    },
    {
      id: '4',
      name: 'Route Master',
      description: '5つのルートを完走',
      icon: '🏃',
      progress: 3,
      maxProgress: 5,
      rarity: 'epic',
      category: 'achievement'
    },
    {
      id: '5',
      name: 'Event Enthusiast',
      description: '10個のイベントに参加',
      icon: '🎉',
      progress: 7,
      maxProgress: 10,
      rarity: 'rare',
      category: 'social'
    },
    {
      id: '6',
      name: 'IPA Connoisseur',
      description: '50種類のIPAを記録',
      icon: '🍻',
      progress: 23,
      maxProgress: 50,
      rarity: 'epic',
      category: 'taste',
      aiRecommended: true
    }
  ];

  const generateMockAchievements = (): Achievement[] => [
    {
      id: '1',
      title: 'Weekend Warrior',
      description: '週末に5回連続チェックイン',
      unlockedAt: '2025-06-01',
      icon: '⚔️',
      rarity: 'gold'
    },
    {
      id: '2',
      title: 'Taste Maker',
      description: '10人以上に推薦されたビール',
      unlockedAt: '2025-05-20',
      icon: '👨‍🍳',
      rarity: 'platinum'
    },
    {
      id: '3',
      title: 'Community Builder',
      description: '新規ユーザー3人を招待',
      unlockedAt: '2025-05-10',
      icon: '🏗️',
      rarity: 'silver'
    }
  ];

  const generateMockActivity = (): ActivityItem[] => [
    {
      id: '1',
      type: 'checkin',
      title: 'Cloudburst Brewingでチェックイン',
      description: 'Nebula Hazy IPA - 評価: 4.5/5',
      timestamp: '2025-06-11T15:30:00Z'
    },
    {
      id: '2',
      type: 'badge',
      title: '新しいバッジを獲得',
      description: 'Social Butterfly バッジを獲得しました',
      timestamp: '2025-06-10T19:45:00Z'
    },
    {
      id: '3',
      type: 'friend',
      title: '新しい友達',
      description: 'BeerExplorer42 と友達になりました',
      timestamp: '2025-06-09T14:20:00Z'
    },
    {
      id: '4',
      type: 'event',
      title: 'イベント参加',
      description: 'Seattle Beer Week Kickoff に参加',
      timestamp: '2025-06-08T18:00:00Z'
    }
  ];

  // Load profile data with enhanced features
  const loadProfileData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Simulate API calls with enhanced data
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setStats(generateMockStats());
      setBadges(generateMockBadges());
      setAchievements(generateMockAchievements());
      setRecentActivity(generateMockActivity());
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  // Get rarity color
  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return colors.accent[400];
      case 'epic':
        return colors.secondary[400];
      case 'rare':
        return colors.primary[400];
      case 'common':
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  // Get achievement rarity color
  const getAchievementColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'platinum':
        return '#E5E7EB';
      case 'gold':
        return '#F59E0B';
      case 'silver':
        return '#9CA3AF';
      case 'bronze':
      default:
        return '#92400E';
    }
  };

  // Format time ago
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

  // Tab configuration
  const tabs = [
    { id: 'stats', label: '統計', icon: <HiTrendingUp className="w-4 h-4" /> },
    { id: 'badges', label: 'バッジ', icon: <HiCollection className="w-4 h-4" /> },
    { id: 'achievements', label: '実績', icon: <HiTrophy className="w-4 h-4" /> },
    { id: 'activity', label: '履歴', icon: <HiClock className="w-4 h-4" /> },
    { id: 'settings', label: '設定', icon: <HiCog className="w-4 h-4" /> }
  ];

  // 2025年版 3D Loading with Spatial Design
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        {/* Spatial Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: theme === 'dark' 
              ? `
                radial-gradient(circle at 25% 25%, rgba(185, 127, 36, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(91, 146, 191, 0.1) 0%, transparent 50%),
                linear-gradient(45deg, rgba(232, 93, 16, 0.05) 0%, transparent 100%)
              `
              : `
                radial-gradient(circle at 25% 25%, rgba(185, 127, 36, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(91, 146, 191, 0.05) 0%, transparent 50%),
                linear-gradient(45deg, rgba(232, 93, 16, 0.03) 0%, transparent 100%)
              `
          }}
        />
        
        {/* 3D Rotating User Icon */}
        <motion.div
          className="relative"
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.3, 1],
            rotateX: [0, 20, 0]
          }}
          transition={{ 
            rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            rotateX: { duration: 3, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
          }}
        >
          <div 
            className="text-9xl"
            style={{
              filter: 'drop-shadow(0 30px 60px rgba(185, 127, 36, 0.5))',
              transform: 'perspective(1200px) rotateX(25deg)',
              textShadow: '0 0 40px rgba(185, 127, 36, 0.6)'
            }}
          >
            👤
          </div>
        </motion.div>
        
        {/* Bold Typography Loading Text */}
        <motion.div 
          className="absolute bottom-1/3 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <h2 
            className="font-display mb-3"
            style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.black,
              color: 'var(--color-text-primary)',
              letterSpacing: typography.letterSpacing.wide,
              textTransform: 'uppercase'
            }}
          >
            PROFILE LOADING
          </h2>
          <p 
            className="font-body"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.medium
            }}
          >
            プロフィールデータを読み込み中...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* 2025年版 Spatial Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: theme === 'dark' 
            ? `
              radial-gradient(circle at 25% 30%, rgba(185, 127, 36, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 75% 70%, rgba(91, 146, 191, 0.06) 0%, transparent 50%),
              linear-gradient(45deg, rgba(232, 93, 16, 0.04) 0%, transparent 100%)
            `
            : `
              radial-gradient(circle at 25% 30%, rgba(185, 127, 36, 0.04) 0%, transparent 50%),
              radial-gradient(circle at 75% 70%, rgba(91, 146, 191, 0.03) 0%, transparent 50%),
              linear-gradient(45deg, rgba(232, 93, 16, 0.02) 0%, transparent 100%)
            `
        }}
      />

      {/* Enhanced Glassmorphism Header */}
      <motion.div 
        className="sticky top-0 z-30 border-b"
        style={{
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          background: theme === 'dark' 
            ? 'rgba(17, 17, 17, 0.9)' 
            : 'rgba(255, 255, 255, 0.9)',
          borderColor: 'var(--color-border-subtle)',
          boxShadow: theme === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.15)'
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container mx-auto px-4 py-6">
          {/* Header with language switcher */}
          <div className="flex justify-between items-center mb-6">
            <motion.h1 
              className="font-display"
              style={{
                fontSize: typography.fontSize['4xl'],
                fontWeight: typography.fontWeight.black,
                color: 'var(--color-text-primary)',
                letterSpacing: typography.letterSpacing.tight,
                textTransform: 'uppercase'
              }}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              MY PROFILE
            </motion.h1>
            
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <motion.button
                className="p-3 rounded-2xl"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  backdropFilter: 'blur(8px)'
                }}
                whileHover={{ scale: 1.05, rotateY: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadProfileData(true)}
                disabled={refreshing}
              >
                <motion.div
                  animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                  transition={refreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                >
                  <HiRefresh 
                    className="w-5 h-5"
                    style={{ 
                      color: refreshing ? colors.primary[400] : 'var(--color-text-secondary)' 
                    }}
                  />
                </motion.div>
              </motion.button>
              
              <LanguageSwitcher />
            </div>
          </div>

          {/* Enhanced Profile Header with 3D Avatar */}
          <motion.div 
            className="flex items-center gap-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* 3D Avatar with Modern Skeuomorphism */}
            <div className="relative">
              <motion.div 
                className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[600]} 100%)`,
                  color: '#000000',
                  boxShadow: `
                    0 20px 40px rgba(185, 127, 36, 0.4),
                    inset 0 4px 8px rgba(255, 255, 255, 0.2),
                    inset 0 -4px 8px rgba(0, 0, 0, 0.1)
                  `
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 15,
                  boxShadow: `
                    0 25px 50px rgba(185, 127, 36, 0.5),
                    inset 0 4px 8px rgba(255, 255, 255, 0.3),
                    inset 0 -4px 8px rgba(0, 0, 0, 0.2)
                  `
                }}
                animate={{ 
                  rotateY: [0, 5, -5, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 hover:opacity-100"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)'
                  }}
                />
              </motion.div>
              
              {/* Camera Button with 3D Effect */}
              <motion.button 
                className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.secondary[400]} 0%, ${colors.secondary[600]} 100%)`,
                  color: '#000000',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiPhotograph className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Enhanced Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 
                  className="font-display"
                  style={{
                    fontSize: typography.fontSize['3xl'],
                    fontWeight: typography.fontWeight.bold,
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {user?.username || 'ユーザー'}
                </h2>
                
                {/* Verification Badge */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <HiShieldCheck 
                    className="w-6 h-6"
                    style={{ color: colors.primary[400] }}
                  />
                </motion.div>
              </div>
              
              <p 
                className="mb-2"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: typography.fontSize.lg
                }}
              >
                {user?.email}
              </p>
              
              <p 
                className="text-sm mb-4"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                PintHop Explorer since May 2025
              </p>
              
              {/* Quick Stats */}
              {stats && (
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div 
                      className="font-display"
                      style={{
                        fontSize: typography.fontSize['2xl'],
                        fontWeight: typography.fontWeight.bold,
                        color: colors.primary[400]
                      }}
                    >
                      {stats.breweriesVisited}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      ブルワリー
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div 
                      className="font-display"
                      style={{
                        fontSize: typography.fontSize['2xl'],
                        fontWeight: typography.fontWeight.bold,
                        color: colors.secondary[400]
                      }}
                    >
                      {stats.badgesEarned}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      バッジ
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div 
                      className="font-display"
                      style={{
                        fontSize: typography.fontSize['2xl'],
                        fontWeight: typography.fontWeight.bold,
                        color: colors.accent[400]
                      }}
                    >
                      {stats.friendsMet}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      友達
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Edit Profile Button */}
            <ModernButton
              variant="primary"
              size="md"
              theme={theme}
              icon={<HiPencil className="w-4 h-4" />}
              onClick={() => setEditingProfile(true)}
            >
              プロフィール編集
            </ModernButton>
          </motion.div>

          {/* Enhanced Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <ModernTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
              variant="glass"
              theme={theme}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'stats' && stats && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* AI Personality Score */}
              <ModernCard glass glassIntensity="medium" theme={theme} padding="lg">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🧠
                  </motion.div>
                  <h3 
                    className="font-display mb-2"
                    style={{
                      fontSize: typography.fontSize['2xl'],
                      fontWeight: typography.fontWeight.bold,
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    AI パーソナリティスコア
                  </h3>
                  <div 
                    className="font-display mb-2"
                    style={{
                      fontSize: typography.fontSize['4xl'],
                      fontWeight: typography.fontWeight.black,
                      background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.secondary[500]} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {stats.aiPersonalityScore}/100
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    冒険的で社交的なビール愛好家
                  </p>
                </div>
              </ModernCard>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ModernBeerIndicator
                  label="ブルワリー"
                  value={stats.breweriesVisited}
                  unit="軒"
                  type="custom"
                  glass
                  theme={theme}
                  icon={<HiFire className="w-5 h-5" />}
                />
                <ModernBeerIndicator
                  label="ビール記録"
                  value={stats.beersRecorded}
                  unit="種"
                  type="custom"
                  glass
                  theme={theme}
                  icon={<HiCollection className="w-5 h-5" />}
                />
                <ModernBeerIndicator
                  label="平均評価"
                  value={stats.averageRating}
                  unit="⭐"
                  type="rating"
                  glass
                  theme={theme}
                />
                <ModernBeerIndicator
                  label="完走ルート"
                  value={stats.routesCompleted}
                  unit="本"
                  type="custom"
                  glass
                  theme={theme}
                  icon={<HiLocationMarker className="w-5 h-5" />}
                />
                <ModernBeerIndicator
                  label="友達"
                  value={stats.friendsMet}
                  unit="人"
                  type="custom"
                  glass
                  theme={theme}
                  icon={<HiUsers className="w-5 h-5" />}
                />
                <ModernBeerIndicator
                  label="イベント"
                  value={stats.eventsAttended}
                  unit="回"
                  type="custom"
                  glass
                  theme={theme}
                  icon={<HiCalendar className="w-5 h-5" />}
                />
                <ModernBeerIndicator
                  label="累計時間"
                  value={stats.hoursSpent}
                  unit="h"
                  type="custom"
                  glass
                  theme={theme}
                  icon={<HiClock className="w-5 h-5" />}
                />
                <ModernBeerIndicator
                  label="連続訪問"
                  value={stats.visitStreak}
                  unit="日"
                  type="custom"
                  glass
                  theme={theme}
                  icon={<HiTrendingUp className="w-5 h-5" />}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* AI Recommended Badges */}
              <ModernCard glass glassIntensity="medium" theme={theme} padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <HiSparkles 
                    className="w-6 h-6"
                    style={{ color: colors.primary[400] }}
                  />
                  <h3 
                    className="font-display"
                    style={{
                      fontSize: typography.fontSize.xl,
                      fontWeight: typography.fontWeight.bold,
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    AI推奨バッジ
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.filter(b => b.aiRecommended).map((badge) => (
                    <div
                      key={badge.id}
                      className="p-4 rounded-2xl border"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(185, 127, 36, 0.1)' : 'rgba(185, 127, 36, 0.05)',
                        borderColor: colors.primary[400]
                      }}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h4 className="font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                          {badge.name}
                        </h4>
                        <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                          {badge.description}
                        </p>
                        {badge.progress !== undefined && badge.maxProgress !== undefined && (
                          <div>
                            <div 
                              className="h-2 rounded-full mb-2"
                              style={{ backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                            >
                              <motion.div
                                className="h-2 rounded-full"
                                style={{ backgroundColor: colors.primary[400] }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                              {badge.progress} / {badge.maxProgress}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ModernCard>

              {/* All Badges */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ModernCard
                      glass
                      glassIntensity="medium"
                      theme={theme}
                      padding="lg"
                      interactive
                      className="text-center relative overflow-hidden"
                    >
                      {/* Rarity Border */}
                      <div 
                        className="absolute inset-0 rounded-3xl"
                        style={{
                          background: `linear-gradient(135deg, ${getRarityColor(badge.rarity)} 0%, transparent 100%)`,
                          opacity: 0.1
                        }}
                      />
                      
                      <div className="relative z-10">
                        <motion.div 
                          className={`text-4xl mb-3 ${!badge.earnedAt ? 'grayscale opacity-50' : ''}`}
                          animate={badge.earnedAt ? { rotate: [0, 10, -10, 0] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {badge.icon}
                        </motion.div>
                        
                        <h4 
                          className="font-heading mb-2"
                          style={{
                            fontSize: typography.fontSize.lg,
                            fontWeight: typography.fontWeight.bold,
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          {badge.name}
                        </h4>
                        
                        <p 
                          className="text-sm mb-4"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {badge.description}
                        </p>
                        
                        {badge.earnedAt ? (
                          <div 
                            className="text-xs px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: getRarityColor(badge.rarity),
                              color: '#000000'
                            }}
                          >
                            {new Date(badge.earnedAt).toLocaleDateString('ja-JP')}
                          </div>
                        ) : badge.progress !== undefined && badge.maxProgress !== undefined ? (
                          <div>
                            <div 
                              className="h-2 rounded-full mb-2"
                              style={{ backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                            >
                              <motion.div
                                className="h-2 rounded-full"
                                style={{ backgroundColor: getRarityColor(badge.rarity) }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                            <p 
                              className="text-xs"
                              style={{ color: 'var(--color-text-tertiary)' }}
                            >
                              {badge.progress} / {badge.maxProgress}
                            </p>
                          </div>
                        ) : (
                          <div 
                            className="text-xs px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                              color: 'var(--color-text-tertiary)'
                            }}
                          >
                            未獲得
                          </div>
                        )}
                      </div>
                    </ModernCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ModernCard
                    glass
                    glassIntensity="medium"
                    theme={theme}
                    padding="lg"
                    className="text-center"
                  >
                    <motion.div 
                      className="text-5xl mb-4"
                      animate={{ rotateY: [0, 15, -15, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {achievement.icon}
                    </motion.div>
                    
                    <h4 
                      className="font-display mb-2"
                      style={{
                        fontSize: typography.fontSize.xl,
                        fontWeight: typography.fontWeight.bold,
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      {achievement.title}
                    </h4>
                    
                    <p 
                      className="text-sm mb-4"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {achievement.description}
                    </p>
                    
                    <div 
                      className="text-xs px-3 py-1 rounded-full inline-block"
                      style={{
                        backgroundColor: getAchievementColor(achievement.rarity),
                        color: achievement.rarity === 'platinum' || achievement.rarity === 'silver' ? '#000000' : '#ffffff'
                      }}
                    >
                      {achievement.rarity.toUpperCase()}
                    </div>
                    
                    <p 
                      className="text-xs mt-2"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      獲得日: {new Date(achievement.unlockedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </ModernCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ModernCard
                    glass
                    glassIntensity="medium"
                    theme={theme}
                    padding="lg"
                    interactive
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: activity.type === 'checkin' ? colors.primary[400] :
                                        activity.type === 'badge' ? colors.secondary[400] :
                                        activity.type === 'friend' ? colors.accent[400] :
                                        colors.primary[300],
                          color: '#000000'
                        }}
                      >
                        {activity.type === 'checkin' && <HiFire className="w-6 h-6" />}
                        {activity.type === 'badge' && <HiTrophy className="w-6 h-6" />}
                        {activity.type === 'friend' && <HiUsers className="w-6 h-6" />}
                        {activity.type === 'event' && <HiCalendar className="w-6 h-6" />}
                      </div>
                      
                      <div className="flex-1">
                        <h4 
                          className="font-heading mb-1"
                          style={{
                            fontSize: typography.fontSize.lg,
                            fontWeight: typography.fontWeight.bold,
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          {activity.title}
                        </h4>
                        
                        <p 
                          className="text-sm mb-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {activity.description}
                        </p>
                        
                        <p 
                          className="text-xs"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Settings Sections */}
              {[
                {
                  icon: <HiUser className="w-5 h-5" />,
                  title: 'アカウント設定',
                  description: 'プロフィール情報・表示名の編集'
                },
                {
                  icon: <HiShieldCheck className="w-5 h-5" />,
                  title: 'プライバシー設定',
                  description: '位置情報・アクティビティの公開範囲'
                },
                {
                  icon: <HiBell className="w-5 h-5" />,
                  title: '通知設定',
                  description: 'プッシュ通知・メール通知の管理'
                },
                {
                  icon: <HiGlobe className="w-5 h-5" />,
                  title: '言語・地域設定',
                  description: '表示言語・タイムゾーンの変更'
                },
                {
                  icon: <HiQuestionMarkCircle className="w-5 h-5" />,
                  title: 'ヘルプ・サポート',
                  description: 'よくある質問・お問い合わせ'
                }
              ].map((setting, index) => (
                <motion.div
                  key={setting.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ModernCard
                    glass
                    glassIntensity="medium"
                    theme={theme}
                    padding="lg"
                    interactive
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{
                          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          color: 'var(--color-text-secondary)'
                        }}
                      >
                        {setting.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h4 
                          className="font-heading mb-1"
                          style={{
                            fontSize: typography.fontSize.lg,
                            fontWeight: typography.fontWeight.bold,
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          {setting.title}
                        </h4>
                        
                        <p 
                          className="text-sm"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {setting.description}
                        </p>
                      </div>
                      
                      <HiAdjustments 
                        className="w-5 h-5"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      />
                    </div>
                  </ModernCard>
                </motion.div>
              ))}

              {/* Logout Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ModernCard
                  glass
                  glassIntensity="medium"
                  theme={theme}
                  padding="lg"
                  interactive
                  className="cursor-pointer"
                  onClick={logout}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#EF4444'
                      }}
                    >
                      <HiLogout className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 
                        className="font-heading mb-1"
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.bold,
                          color: '#EF4444'
                        }}
                      >
                        ログアウト
                      </h4>
                      
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        アカウントからログアウト
                      </p>
                    </div>
                  </div>
                </ModernCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;