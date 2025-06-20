/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Events.tsx
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
 * 2024-2025 UI/UXトレンドに完全準拠したイベント表示・管理画面
 * Dark Mode First、Glassmorphism、Bold Typography、AI強化機能、3D Effects実装
 * Advanced Micro-interactions、Modern Skeuomorphism、Spatial Design
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { ModernCard, ModernButton, ModernTabs, ModernFAB, ModernBeerIndicator, ModernSkeleton } from '../components/common/ModernComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography, animations } from '../styles/design-system';
import { 
  HiCalendar,
  HiLocationMarker,
  HiUsers,
  HiClock,
  HiPlus,
  HiFilter,
  HiSearch,
  HiHeart,
  HiChat,
  HiShare,
  HiCheckCircle,
  HiX,
  HiRefresh,
  HiStar,
  HiTrendingUp,
  HiSparkles,
  HiEye,
  HiPlay,
  HiGlobe,
  HiPhone
} from 'react-icons/hi';

// Enhanced 2025 Event interfaces
interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    brewery?: string;
    coordinates?: { lat: number; lng: number };
  };
  organizer: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  participants: {
    confirmed: number;
    interested: number;
    maxCapacity?: number;
  };
  friends: Array<{
    username: string;
    avatar?: string;
    status: 'going' | 'interested';
  }>;
  userStatus: 'going' | 'interested' | 'not_going' | null;
  image?: string;
  tags: string[];
  price?: {
    amount: number;
    currency: string;
    type: 'free' | 'paid' | 'donation';
  };
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  beerStyles?: string[];
  aiRecommendationScore?: number;
  matchReasons?: string[];
  isLive?: boolean;
  socialStats: {
    likes: number;
    comments: number;
    shares: number;
  };
  breweryDetails?: {
    name: string;
    rating: number;
    specialties: string[];
  };
}

interface EventFilters {
  category: 'all' | 'going' | 'interested' | 'nearby' | 'trending';
  dateRange: 'today' | 'week' | 'month' | 'all';
  priceRange: 'free' | 'paid' | 'all';
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  beerStyles: string[];
  sortBy: 'date' | 'popularity' | 'relevance' | 'distance';
}

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Enhanced state management
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // AI-enhanced filters
  const [filters, setFilters] = useState<EventFilters>({
    category: 'all',
    dateRange: 'week',
    priceRange: 'all',
    difficulty: 'all',
    beerStyles: [],
    sortBy: 'relevance'
  });

  // Theme detection with Dark Mode First
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'dark';
    setTheme(currentTheme);
  }, []);

  // Enhanced mock data with 2025 features
  const generateMockEvents = (): Event[] => [
    {
      id: '1',
      name: 'Seattle Beer Week Kickoff',
      description: 'Join us for the official start of Seattle Beer Week with special tastings, brewery tours, and exclusive releases.',
      date: '2025-06-15',
      time: '18:00',
      location: {
        name: 'Fremont Brewing Urban Beer Garden',
        address: '1050 N 34th St, Seattle, WA',
        brewery: 'Fremont Brewing',
        coordinates: { lat: 47.6512, lng: -122.3477 }
      },
      organizer: {
        name: 'Seattle Beer Association',
        verified: true
      },
      participants: {
        confirmed: 47,
        interested: 23,
        maxCapacity: 100
      },
      friends: [
        { username: 'TakeshiSan', status: 'going' },
        { username: 'BeerExplorer42', status: 'interested' },
        { username: 'HoppyDays', status: 'going' }
      ],
      userStatus: 'going',
      tags: ['beer-week', 'tasting', 'community', 'seasonal'],
      price: { amount: 0, currency: 'USD', type: 'free' },
      difficulty: 'beginner',
      beerStyles: ['Pale Ale', 'IPA', 'Lager'],
      aiRecommendationScore: 96,
      matchReasons: ['高評価ブルワリー', '友達も参加', '無料イベント', 'ビールウィーク特別'],
      isLive: false,
      socialStats: { likes: 124, comments: 18, shares: 9 },
      breweryDetails: {
        name: 'Fremont Brewing',
        rating: 4.5,
        specialties: ['Summer Ale', 'Universale Pale', 'Seasonal Brews']
      }
    },
    {
      id: '2',
      name: 'IPA Mastery Workshop',
      description: 'Deep dive into the world of IPAs with guided tastings, expert presentations, and brewing techniques.',
      date: '2025-06-18',
      time: '19:30',
      location: {
        name: 'Cloudburst Brewing Tasting Room',
        address: '2116 Western Ave, Seattle, WA',
        brewery: 'Cloudburst Brewing',
        coordinates: { lat: 47.6131, lng: -122.3414 }
      },
      organizer: {
        name: 'Pacific Northwest Beer Institute',
        verified: true
      },
      participants: {
        confirmed: 23,
        interested: 31,
        maxCapacity: 40
      },
      friends: [
        { username: 'IPAExpert', status: 'going' },
        { username: 'HopHead2025', status: 'interested' }
      ],
      userStatus: 'interested',
      tags: ['ipa', 'education', 'workshop', 'expert-led'],
      price: { amount: 35, currency: 'USD', type: 'paid' },
      difficulty: 'intermediate',
      beerStyles: ['New England IPA', 'West Coast IPA', 'Double IPA'],
      aiRecommendationScore: 92,
      matchReasons: ['IPAへの関心', '評価の高いブルワリー', '教育的コンテンツ'],
      isLive: false,
      socialStats: { likes: 89, comments: 12, shares: 6 },
      breweryDetails: {
        name: 'Cloudburst Brewing',
        rating: 4.8,
        specialties: ['Fresh Hop IPA', 'Hazy IPA', 'Seasonal Releases']
      }
    },
    {
      id: '3',
      name: 'Brewery Trivia Championship',
      description: 'Test your beer knowledge in our monthly trivia competition with amazing prizes and craft brews.',
      date: '2025-06-20',
      time: '20:00',
      location: {
        name: 'Holy Mountain Brewing',
        address: '1421 Elliott Ave W, Seattle, WA',
        brewery: 'Holy Mountain Brewing',
        coordinates: { lat: 47.6364, lng: -122.3753 }
      },
      organizer: {
        name: 'Trivia Masters Seattle',
        verified: false
      },
      participants: {
        confirmed: 32,
        interested: 18,
        maxCapacity: 60
      },
      friends: [
        { username: 'QuizMaster', status: 'going' },
        { username: 'BeerTrivia', status: 'going' }
      ],
      userStatus: null,
      tags: ['trivia', 'social', 'games', 'competition'],
      price: { amount: 15, currency: 'USD', type: 'paid' },
      difficulty: 'beginner',
      beerStyles: ['Wild Ales', 'Sour', 'Farmhouse'],
      aiRecommendationScore: 78,
      matchReasons: ['ソーシャルイベント', '友達も参加', '手頃な価格'],
      isLive: true,
      socialStats: { likes: 156, comments: 24, shares: 11 },
      breweryDetails: {
        name: 'Holy Mountain Brewing',
        rating: 4.7,
        specialties: ['Wild Ales', 'Saison', 'Experimental Brews']
      }
    },
    {
      id: '4',
      name: 'Sour Beer & Food Pairing Experience',
      description: 'Explore the complex world of sour beers paired with artisanal foods in an intimate setting.',
      date: '2025-06-22',
      time: '17:00',
      location: {
        name: 'Stoup Brewing Private Room',
        address: '1108 NW 52nd St, Seattle, WA',
        brewery: 'Stoup Brewing',
        coordinates: { lat: 47.6698, lng: -122.3756 }
      },
      organizer: {
        name: 'Culinary Beer Society',
        verified: true
      },
      participants: {
        confirmed: 16,
        interested: 8,
        maxCapacity: 20
      },
      friends: [
        { username: 'SourLover', status: 'interested' }
      ],
      userStatus: 'interested',
      tags: ['sour-beer', 'food-pairing', 'premium', 'intimate'],
      price: { amount: 65, currency: 'USD', type: 'paid' },
      difficulty: 'advanced',
      beerStyles: ['Berliner Weisse', 'Gose', 'Lambic'],
      aiRecommendationScore: 85,
      matchReasons: ['プレミアム体験', 'ユニークなペアリング', '少人数制'],
      isLive: false,
      socialStats: { likes: 67, comments: 8, shares: 4 },
      breweryDetails: {
        name: 'Stoup Brewing',
        rating: 4.4,
        specialties: ['Pilsner', 'Porter', 'Classic Styles']
      }
    }
  ];

  // Load events with enhanced features
  const loadEvents = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Simulate API call with enhanced data
      await new Promise(resolve => setTimeout(resolve, 1200));
      const mockData = generateMockEvents();
      setEvents(mockData);
      setFilteredEvents(mockData);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // AI-enhanced filtering and search
  const performSearch = useCallback(async (query: string, currentFilters: EventFilters) => {
    let filtered = events;
    
    // Search by name, description, location, and tags
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      filtered = filtered.filter(event => {
        const searchableText = `
          ${event.name}
          ${event.description}
          ${event.location.name}
          ${event.organizer.name}
          ${event.tags.join(' ')}
          ${event.beerStyles?.join(' ') || ''}
        `.toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
      });
    }
    
    // Category filter
    if (currentFilters.category !== 'all') {
      switch (currentFilters.category) {
        case 'going':
          filtered = filtered.filter(e => e.userStatus === 'going');
          break;
        case 'interested':
          filtered = filtered.filter(e => e.userStatus === 'interested');
          break;
        case 'nearby':
          // Filter by proximity (mock)
          filtered = filtered.filter(e => e.location.coordinates);
          break;
        case 'trending':
          filtered = filtered.filter(e => (e.aiRecommendationScore || 0) > 85);
          break;
      }
    }
    
    // Date range filter
    const now = new Date();
    if (currentFilters.dateRange !== 'all') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        
        switch (currentFilters.dateRange) {
          case 'today':
            return daysDiff === 0;
          case 'week':
            return daysDiff >= 0 && daysDiff <= 7;
          case 'month':
            return daysDiff >= 0 && daysDiff <= 30;
          default:
            return true;
        }
      });
    }
    
    // Price filter
    if (currentFilters.priceRange !== 'all') {
      filtered = filtered.filter(event => {
        const isFree = !event.price || event.price.type === 'free' || event.price.amount === 0;
        return currentFilters.priceRange === 'free' ? isFree : !isFree;
      });
    }
    
    // Beer styles filter
    if (currentFilters.beerStyles.length > 0) {
      filtered = filtered.filter(event =>
        event.beerStyles?.some(style =>
          currentFilters.beerStyles.some(filterStyle =>
            style.toLowerCase().includes(filterStyle.toLowerCase())
          )
        )
      );
    }
    
    // Sort events
    filtered = sortEvents(filtered, currentFilters.sortBy);
    
    setFilteredEvents(filtered);
  }, [events]);

  // Enhanced sorting system
  const sortEvents = (events: Event[], sortBy: EventFilters['sortBy']): Event[] => {
    return [...events].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popularity':
          return (b.participants.confirmed + b.participants.interested) - (a.participants.confirmed + a.participants.interested);
        case 'distance':
          // Mock distance sorting
          return 0;
        case 'relevance':
        default:
          return (b.aiRecommendationScore || 0) - (a.aiRecommendationScore || 0);
      }
    });
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery, filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, performSearch]);

  // Get status styling
  const getStatusStyling = (status: Event['userStatus']) => {
    switch (status) {
      case 'going':
        return {
          backgroundColor: colors.primary[400],
          color: '#000000'
        };
      case 'interested':
        return {
          backgroundColor: colors.secondary[400],
          color: '#000000'
        };
      case 'not_going':
        return {
          backgroundColor: colors.error[400],
          color: '#ffffff'
        };
      default:
        return {
          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          color: 'var(--color-text-secondary)'
        };
    }
  };

  // Get status text
  const getStatusText = (status: Event['userStatus']) => {
    switch (status) {
      case 'going':
        return '参加予定';
      case 'interested':
        return '興味あり';
      case 'not_going':
        return '不参加';
      default:
        return '未回答';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return colors.primary[400];
      case 'intermediate':
        return colors.secondary[400];
      case 'advanced':
        return colors.accent[400];
      default:
        return colors.primary[400];
    }
  };

  // Filter tabs configuration
  const filterTabs = [
    { id: 'all', label: 'すべて', icon: <HiSparkles className="w-4 h-4" /> },
    { id: 'going', label: '参加予定', icon: <HiCheckCircle className="w-4 h-4" /> },
    { id: 'interested', label: '興味あり', icon: <HiHeart className="w-4 h-4" /> },
    { id: 'nearby', label: '近く', icon: <HiLocationMarker className="w-4 h-4" /> },
    { id: 'trending', label: 'トレンド', icon: <HiTrendingUp className="w-4 h-4" /> }
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
        
        {/* 3D Rotating Calendar Icon */}
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
            📅
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
            EVENTS LOADING
          </h2>
          <p 
            className="font-body"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.medium
            }}
          >
            イベントデータを読み込み中...
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
              BEER EVENTS
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
                onClick={() => loadEvents(true)}
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

          {/* Enhanced Search Bar with AI */}
          <motion.div 
            className="relative mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="relative">
              <HiSearch 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6"
                style={{ color: 'var(--color-text-tertiary)' }}
              />
              <input
                type="text"
                placeholder="イベント名、場所、ビールスタイルで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-16 py-4 rounded-2xl text-lg font-medium transition-all duration-300 bg-transparent border-2"
                style={{
                  color: 'var(--color-text-primary)',
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderColor: 'var(--color-border-primary)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                }}
              />
              
              {searchQuery && (
                <motion.button
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: 'var(--color-text-tertiary)'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchQuery('')}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <HiX className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Enhanced Filter Tabs */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <ModernTabs
              tabs={filterTabs}
              activeTab={filters.category}
              onChange={(tabId) => setFilters(prev => ({ ...prev, category: tabId as EventFilters['category'] }))}
              variant="glass"
              theme={theme}
            />
          </motion.div>

          {/* View Mode Toggle & Stats */}
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {filteredEvents.length}件のイベント
              </span>
              
              {refreshing && (
                <motion.div 
                  className="w-4 h-4 rounded-full border-2 border-t-transparent"
                  style={{ borderColor: colors.primary[400] }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className="p-2 rounded-xl"
                style={{
                  backgroundColor: viewMode === 'grid' 
                    ? colors.primary[400] 
                    : theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  color: viewMode === 'grid' ? '#000000' : 'var(--color-text-secondary)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
              >
                <HiUsers className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="p-2 rounded-xl"
                style={{
                  backgroundColor: viewMode === 'calendar' 
                    ? colors.primary[400] 
                    : theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  color: viewMode === 'calendar' ? '#000000' : 'var(--color-text-secondary)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('calendar')}
              >
                <HiCalendar className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Content with Glassmorphism Cards */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {filteredEvents.length === 0 ? (
          // Enhanced Empty State with 3D Calendar
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
                📅
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
              イベントが見つかりません
            </h3>
            
            <p 
              className="mb-8"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: typography.fontSize.lg
              }}
            >
              検索条件を変更するか、新しいイベントを作成しましょう！
            </p>
            
            <ModernButton
              variant="primary"
              size="lg"
              theme={theme}
              icon={<HiPlus className="w-5 h-5" />}
              onClick={() => navigate('/events/create')}
            >
              イベント作成
            </ModernButton>
          </motion.div>
        ) : (
          // Enhanced Event Cards Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <ModernCard 
                  glass 
                  glassIntensity="medium" 
                  theme={theme} 
                  padding="lg" 
                  interactive
                  className="relative overflow-hidden cursor-pointer h-full"
                  onClick={() => setSelectedEvent(event)}
                >
                  {/* Live indicator */}
                  {event.isLive && (
                    <motion.div 
                      className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: '#EF4444',
                        color: '#ffffff'
                      }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                      LIVE
                    </motion.div>
                  )}

                  {/* AI Recommendation Badge */}
                  {event.aiRecommendationScore && event.aiRecommendationScore > 90 && (
                    <motion.div 
                      className="absolute top-4 left-4 px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1"
                      style={{
                        backgroundColor: colors.primary[400],
                        color: '#000000'
                      }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <HiSparkles className="w-3 h-3" />
                      AI推奨
                    </motion.div>
                  )}

                  {/* Event Image Placeholder */}
                  <div 
                    className="w-full h-48 rounded-2xl mb-4 flex items-center justify-center text-6xl"
                    style={{
                      background: `linear-gradient(135deg, ${getDifficultyColor(event.difficulty)} 0%, ${colors.primary[600]} 100%)`,
                      filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.1))'
                    }}
                  >
                    📅
                  </div>

                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 
                        className="font-heading flex-1"
                        style={{
                          fontSize: typography.fontSize.xl,
                          fontWeight: typography.fontWeight.bold,
                          color: 'var(--color-text-primary)',
                          lineHeight: 1.3
                        }}
                      >
                        {event.name}
                      </h3>
                      
                      <motion.div
                        className="px-2 py-1 rounded-xl text-xs font-bold"
                        style={getStatusStyling(event.userStatus)}
                        whileHover={{ scale: 1.05 }}
                      >
                        {getStatusText(event.userStatus)}
                      </motion.div>
                    </div>
                    
                    <p 
                      className="text-sm mb-3 line-clamp-2"
                      style={{ 
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.5
                      }}
                    >
                      {event.description}
                    </p>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <HiCalendar 
                        className="w-4 h-4"
                        style={{ color: colors.primary[400] }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {new Date(event.date).toLocaleDateString('ja-JP')} {event.time}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <HiLocationMarker 
                        className="w-4 h-4"
                        style={{ color: colors.secondary[400] }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {event.location.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <HiUsers 
                        className="w-4 h-4"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {event.participants.confirmed}人参加
                        {event.participants.maxCapacity && ` / ${event.participants.maxCapacity}人`}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <ModernBeerIndicator
                      label="価格"
                      value={event.price?.type === 'free' ? '無料' : `¥${event.price?.amount || 0}`}
                      unit=""
                      type="custom"
                      glass
                      theme={theme}
                    />
                    <ModernBeerIndicator
                      label="難易度"
                      value={event.difficulty === 'beginner' ? '初級' : event.difficulty === 'intermediate' ? '中級' : '上級'}
                      unit=""
                      type="custom"
                      glass
                      theme={theme}
                    />
                    <ModernBeerIndicator
                      label="興味"
                      value={event.participants.interested}
                      unit="人"
                      type="custom"
                      glass
                      theme={theme}
                    />
                  </div>

                  {/* Friends attending */}
                  {event.friends.length > 0 && (
                    <motion.div 
                      className="mb-4 p-3 rounded-xl"
                      style={{
                        backgroundColor: theme === 'dark' 
                          ? 'rgba(185, 127, 36, 0.15)' 
                          : 'rgba(185, 127, 36, 0.1)',
                        border: '1px solid rgba(185, 127, 36, 0.3)'
                      }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <HiUsers 
                          className="w-4 h-4"
                          style={{ color: colors.primary[400] }}
                        />
                        <span 
                          className="text-sm font-medium"
                          style={{ color: colors.primary[400] }}
                        >
                          友達も参加
                        </span>
                      </div>
                      
                      <div className="flex -space-x-2">
                        {event.friends.slice(0, 3).map((friend, friendIndex) => (
                          <div
                            key={friendIndex}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                            style={{
                              backgroundColor: colors.primary[500],
                              color: '#000000',
                              borderColor: 'var(--color-bg-primary)'
                            }}
                          >
                            {friend.username.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {event.friends.length > 3 && (
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                            style={{
                              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                              color: 'var(--color-text-tertiary)',
                              borderColor: 'var(--color-bg-primary)'
                            }}
                          >
                            +{event.friends.length - 3}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.slice(0, 3).map((tag, tagIndex) => (
                      <motion.span
                        key={tag}
                        className="px-2 py-1 rounded-lg text-xs font-medium"
                        style={{
                          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          color: 'var(--color-text-secondary)'
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: tagIndex * 0.1 + 0.2 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t"
                       style={{ borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}>
                    <div className="flex items-center gap-3">
                      <motion.button
                        className="flex items-center gap-1 text-sm"
                        style={{ color: 'var(--color-text-tertiary)' }}
                        whileHover={{ 
                          scale: 1.05,
                          color: colors.primary[400]
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <HiHeart className="w-4 h-4" />
                        {event.socialStats.likes}
                      </motion.button>
                      
                      <motion.button
                        className="flex items-center gap-1 text-sm"
                        style={{ color: 'var(--color-text-tertiary)' }}
                        whileHover={{ 
                          scale: 1.05,
                          color: colors.secondary[400]
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <HiChat className="w-4 h-4" />
                        {event.socialStats.comments}
                      </motion.button>
                    </div>
                    
                    <motion.button
                      className="p-2 rounded-xl"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                        color: 'var(--color-text-tertiary)'
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: colors.primary[400],
                        color: '#000000'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <HiShare className="w-4 h-4" />
                    </motion.button>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredEvents.length >= 12 && (
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

      {/* Enhanced Create Event FAB */}
      <ModernFAB
        icon={<HiPlus className="w-6 h-6" />}
        position="bottom-right"
        glass={true}
        theme={theme}
        onClick={() => navigate('/events/create')}
      />
    </div>
  );
};

export default EventsPage;