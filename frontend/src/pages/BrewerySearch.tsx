/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/BrewerySearch.tsx
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
 * 2024-2025 UI/UXトレンドに完全準拠したブルワリー検索・フィルタリング画面
 * Dark Mode First、Glassmorphism、Bold Typography、AI強化検索、3D Effects実装
 * Advanced Micro-interactions、Modern Skeuomorphism、Spatial Design
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { ModernCard, ModernButton, ModernTabs, ModernListItem, ModernSkeleton, ModernBeerIndicator, ModernFAB } from '../components/common/ModernComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography, animations } from '../styles/design-system';
import { 
  HiSearch, 
  HiFilter,
  HiLocationMarker,
  HiStar,
  HiClock,
  HiUsers,
  HiTrendingUp,
  HiViewGrid,
  HiViewList,
  HiAdjustments,
  HiX,
  HiMicrophone,
  HiSparkles,
  HiRefresh,
  HiEye,
  HiHeart,
  HiThumbUp,
  HiCheckCircle,
  HiGlobe
} from 'react-icons/hi';

// Enhanced 2025 data structures
interface BreweryLocation {
  street?: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface BreweryRatings {
  overall: number;
  untappd?: { score: number; reviews: number };
  rateBeer?: { score: number; reviews: number };
  beerAdvocate?: { score: number; reviews: number };
  pinthop?: { score: number; reviews: number };
}

interface BrewerySpecialty {
  style: string;
  rating: number;
  abv: number;
  popularity: number;
}

interface Brewery {
  id: string;
  name: string;
  description?: string;
  address: BreweryLocation;
  distance?: number;
  ratings: BreweryRatings;
  isOpen: boolean;
  isVerified: boolean;
  tags: string[];
  photos?: string[];
  currentTaps?: number;
  specialtyStyles?: BrewerySpecialty[];
  priceRange: 'budget' | 'moderate' | 'upscale';
  amenities?: string[];
  currentVisitors?: number;
  popularTimes?: Array<{ hour: number; popularity: number }>;
  aiRecommendationScore?: number;
  matchReasons?: string[];
  establishedYear?: number;
  website?: string;
  phone?: string;
}

interface SearchFilters {
  query: string;
  rating: number;
  distance: number;
  openOnly: boolean;
  verifiedOnly: boolean;
  priceRange: string[];
  beerStyles: string[];
  amenities: string[];
  sortBy: 'relevance' | 'distance' | 'rating' | 'popularity' | 'newest';
  minTaps: number;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'brewery' | 'location' | 'style' | 'recent';
  metadata?: any;
}

export const BrewerySearchPage: React.FC = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Enhanced state management
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [filteredBreweries, setFilteredBreweries] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // AI-enhanced filters
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    rating: 0,
    distance: 50,
    openOnly: false,
    verifiedOnly: false,
    priceRange: [],
    beerStyles: [],
    amenities: [],
    sortBy: 'relevance',
    minTaps: 0
  });

  // Theme detection with Dark Mode First
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'dark';
    setTheme(currentTheme);
  }, []);

  // Enhanced mock data with 2025 features
  const generateMockBreweries = (): Brewery[] => [
    {
      id: '1',
      name: 'Cloudburst Brewing',
      description: 'IPA & Hazy specialists with rotating fresh hop taps',
      address: {
        street: '2116 Western Ave',
        city: 'Seattle',
        state: 'WA',
        coordinates: { lat: 47.6131, lng: -122.3414 }
      },
      distance: 1.2,
      ratings: {
        overall: 4.8,
        untappd: { score: 4.2, reviews: 1247 },
        rateBeer: { score: 4.1, reviews: 567 },
        pinthop: { score: 4.9, reviews: 234 }
      },
      isOpen: true,
      isVerified: true,
      tags: ['IPA', 'Hazy', 'Fresh Hop', 'Local Favorite'],
      currentTaps: 16,
      specialtyStyles: [
        { style: 'New England IPA', rating: 4.9, abv: 6.5, popularity: 95 },
        { style: 'Fresh Hop IPA', rating: 4.8, abv: 7.2, popularity: 88 }
      ],
      priceRange: 'moderate',
      amenities: ['Dog Friendly', 'Outdoor Seating', 'Growler Fills', 'Food Truck'],
      currentVisitors: 12,
      aiRecommendationScore: 98,
      matchReasons: ['高評価IPAが豊富', '現在営業中', '近距離', 'フレッシュホップシーズン'],
      establishedYear: 2016,
      website: 'https://cloudburstbrew.com',
      phone: '+1 (206) 602-6061'
    },
    {
      id: '2',
      name: 'Fremont Brewing',
      description: 'Urban beer garden with award-winning seasonal ales',
      address: {
        street: '1050 N 34th St',
        city: 'Seattle',
        state: 'WA',
        coordinates: { lat: 47.6512, lng: -122.3477 }
      },
      distance: 2.8,
      ratings: {
        overall: 4.5,
        untappd: { score: 4.0, reviews: 2156 },
        rateBeer: { score: 3.9, reviews: 892 },
        pinthop: { score: 4.6, reviews: 445 }
      },
      isOpen: true,
      isVerified: true,
      tags: ['Seasonal', 'Garden', 'Family Friendly', 'Food Trucks'],
      currentTaps: 20,
      specialtyStyles: [
        { style: 'Summer Ale', rating: 4.3, abv: 5.1, popularity: 78 },
        { style: 'Universale Pale', rating: 4.5, abv: 5.8, popularity: 82 }
      ],
      priceRange: 'moderate',
      amenities: ['Large Outdoor Space', 'Family Friendly', 'Food Trucks', 'Private Events'],
      currentVisitors: 28,
      aiRecommendationScore: 89,
      matchReasons: ['大きなビアガーデン', 'ファミリー向け', '豊富なタップ選択'],
      establishedYear: 2009,
      website: 'https://fremontbrewing.com',
      phone: '+1 (206) 420-2407'
    },
    {
      id: '3',
      name: 'Holy Mountain Brewing',
      description: 'Innovative wild ales, sours, and farmhouse beers',
      address: {
        street: '1421 Elliott Ave W',
        city: 'Seattle',
        state: 'WA',
        coordinates: { lat: 47.6364, lng: -122.3753 }
      },
      distance: 3.5,
      ratings: {
        overall: 4.7,
        untappd: { score: 4.3, reviews: 934 },
        rateBeer: { score: 4.2, reviews: 334 },
        pinthop: { score: 4.8, reviews: 156 }
      },
      isOpen: false,
      isVerified: true,
      tags: ['Wild Ales', 'Sour', 'Farmhouse', 'Experimental'],
      currentTaps: 12,
      specialtyStyles: [
        { style: 'Saison', rating: 4.6, abv: 6.2, popularity: 71 },
        { style: 'Wild Ale', rating: 4.8, abv: 7.8, popularity: 85 }
      ],
      priceRange: 'upscale',
      amenities: ['Tasting Room', 'Bottle Sales', 'Limited Releases', 'Expert Staff'],
      currentVisitors: 0,
      aiRecommendationScore: 92,
      matchReasons: ['ユニークなサワービール', '限定リリース多数', '高品質'],
      establishedYear: 2016,
      website: 'https://holymountainbrewing.com',
      phone: '+1 (206) 457-5674'
    },
    {
      id: '4',
      name: 'Stoup Brewing',
      description: 'Neighborhood brewery with classic styles and games',
      address: {
        street: '1108 NW 52nd St',
        city: 'Seattle',
        state: 'WA',
        coordinates: { lat: 47.6698, lng: -122.3756 }
      },
      distance: 4.1,
      ratings: {
        overall: 4.4,
        untappd: { score: 3.9, reviews: 1567 },
        rateBeer: { score: 3.8, reviews: 445 },
        pinthop: { score: 4.5, reviews: 289 }
      },
      isOpen: true,
      isVerified: true,
      tags: ['Neighborhood', 'Games', 'Classic Styles', 'Community'],
      currentTaps: 14,
      specialtyStyles: [
        { style: 'Pilsner', rating: 4.2, abv: 4.8, popularity: 65 },
        { style: 'Porter', rating: 4.3, abv: 6.1, popularity: 72 }
      ],
      priceRange: 'budget',
      amenities: ['Board Games', 'Dog Friendly', 'Trivia Nights', 'Happy Hour'],
      currentVisitors: 8,
      aiRecommendationScore: 76,
      matchReasons: ['手頃な価格', 'ゲーム設備', 'クラシックスタイル'],
      establishedYear: 2013,
      website: 'https://stoupbrewing.com',
      phone: '+1 (206) 457-5679'
    }
  ];

  // Load brewery data with enhanced features
  useEffect(() => {
    const loadBreweries = async () => {
      setLoading(true);
      try {
        // Simulate API call with enhanced data
        await new Promise(resolve => setTimeout(resolve, 1200));
        const mockData = generateMockBreweries();
        setBreweries(mockData);
        setFilteredBreweries(mockData);
      } catch (error) {
        console.error('Failed to load breweries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBreweries();
  }, []);

  // AI-enhanced search with debouncing
  const performSearch = useCallback(async (query: string) => {
    setSearching(true);
    
    // Simulate AI-powered search
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = breweries;
    
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      filtered = filtered.filter(brewery => {
        const searchableText = `
          ${brewery.name}
          ${brewery.description || ''}
          ${brewery.address.city}
          ${brewery.address.state}
          ${brewery.tags.join(' ')}
          ${brewery.specialtyStyles?.map(s => s.style).join(' ') || ''}
          ${brewery.amenities?.join(' ') || ''}
        `.toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
      });
      
      // AI-based relevance scoring
      filtered = filtered.map(brewery => ({
        ...brewery,
        aiRecommendationScore: calculateRelevanceScore(brewery, query)
      }));
    }
    
    // Apply filters
    filtered = applyFilters(filtered);
    
    // Sort by selected criteria
    filtered = sortBreweries(filtered);
    
    setFilteredBreweries(filtered);
    setSearching(false);
  }, [breweries, filters]);

  // AI relevance scoring algorithm
  const calculateRelevanceScore = (brewery: Brewery, query: string): number => {
    let score = brewery.aiRecommendationScore || 50;
    const queryLower = query.toLowerCase();
    
    // Name match bonus
    if (brewery.name.toLowerCase().includes(queryLower)) score += 30;
    
    // Tag match bonus
    brewery.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) score += 15;
    });
    
    // Specialty style match bonus
    brewery.specialtyStyles?.forEach(style => {
      if (style.style.toLowerCase().includes(queryLower)) score += 20;
    });
    
    // Rating bonus
    score += (brewery.ratings.overall - 3) * 10;
    
    // Distance penalty
    if (brewery.distance) {
      score -= brewery.distance * 2;
    }
    
    // Current visitors bonus (trending)
    if (brewery.currentVisitors && brewery.currentVisitors > 5) {
      score += 10;
    }
    
    return Math.min(Math.max(score, 0), 100);
  };

  // Advanced filtering system
  const applyFilters = (breweries: Brewery[]): Brewery[] => {
    let filtered = breweries;
    
    if (filters.rating > 0) {
      filtered = filtered.filter(b => b.ratings.overall >= filters.rating);
    }
    
    if (filters.distance < 50) {
      filtered = filtered.filter(b => !b.distance || b.distance <= filters.distance);
    }
    
    if (filters.openOnly) {
      filtered = filtered.filter(b => b.isOpen);
    }
    
    if (filters.verifiedOnly) {
      filtered = filtered.filter(b => b.isVerified);
    }
    
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(b => filters.priceRange.includes(b.priceRange));
    }
    
    if (filters.beerStyles.length > 0) {
      filtered = filtered.filter(b => 
        b.specialtyStyles?.some(style => 
          filters.beerStyles.some(filterStyle => 
            style.style.toLowerCase().includes(filterStyle.toLowerCase())
          )
        )
      );
    }
    
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(b => 
        filters.amenities.every(amenity => 
          b.amenities?.some(bAmenity => 
            bAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }
    
    if (filters.minTaps > 0) {
      filtered = filtered.filter(b => (b.currentTaps || 0) >= filters.minTaps);
    }
    
    return filtered;
  };

  // Enhanced sorting system
  const sortBreweries = (breweries: Brewery[]): Brewery[] => {
    return [...breweries].sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return (a.distance || 999) - (b.distance || 999);
        case 'rating':
          return b.ratings.overall - a.ratings.overall;
        case 'popularity':
          return (b.currentVisitors || 0) - (a.currentVisitors || 0);
        case 'newest':
          return (b.establishedYear || 0) - (a.establishedYear || 0);
        case 'relevance':
        default:
          return (b.aiRecommendationScore || 0) - (a.aiRecommendationScore || 0);
      }
    });
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // AI-powered search suggestions
  const generateSuggestions = (query: string): SearchSuggestion[] => {
    if (!query.trim()) return [];
    
    const suggestions: SearchSuggestion[] = [];
    
    // Brewery name suggestions
    breweries.forEach(brewery => {
      if (brewery.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          id: `brewery-${brewery.id}`,
          text: brewery.name,
          type: 'brewery',
          metadata: brewery
        });
      }
    });
    
    // Beer style suggestions
    const allStyles = Array.from(new Set(
      breweries.flatMap(b => b.specialtyStyles?.map(s => s.style) || [])
    ));
    allStyles.forEach(style => {
      if (style.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          id: `style-${style}`,
          text: style,
          type: 'style',
          metadata: { style }
        });
      }
    });
    
    // Location suggestions
    const locations = Array.from(new Set(breweries.map(b => b.address.city)));
    locations.forEach(city => {
      if (city.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          id: `location-${city}`,
          text: `${city}のブルワリー`,
          type: 'location',
          metadata: { city }
        });
      }
    });
    
    return suggestions.slice(0, 6);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const newSuggestions = generateSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0 && value.trim().length > 0);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    
    if (suggestion.type === 'brewery') {
      navigate(`/brewery/${suggestion.metadata.id}`);
    }
  };

  // Voice search simulation
  const handleVoiceSearch = () => {
    setIsVoiceSearch(true);
    // Simulate voice recognition
    setTimeout(() => {
      const voiceQueries = ['IPA', 'Seattle breweries', 'dog friendly', 'outdoor seating'];
      const randomQuery = voiceQueries[Math.floor(Math.random() * voiceQueries.length)];
      setSearchQuery(randomQuery);
      setIsVoiceSearch(false);
    }, 2000);
  };

  // Filter tabs configuration
  const filterTabs = [
    { id: 'all', label: 'すべて', icon: <HiSparkles className="w-4 h-4" /> },
    { id: 'nearby', label: '近く', icon: <HiLocationMarker className="w-4 h-4" /> },
    { id: 'trending', label: 'トレンド', icon: <HiTrendingUp className="w-4 h-4" /> },
    { id: 'recommended', label: 'おすすめ', icon: <HiThumbUp className="w-4 h-4" /> }
  ];

  // Get price range color
  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case 'budget': return colors.secondary[400];
      case 'moderate': return colors.primary[400];
      case 'upscale': return colors.accent[400];
      default: return colors.primary[400];
    }
  };

  // Get price range text
  const getPriceRangeText = (priceRange: string) => {
    switch (priceRange) {
      case 'budget': return '¥';
      case 'moderate': return '¥¥';
      case 'upscale': return '¥¥¥';
      default: return '¥¥';
    }
  };

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
              BREWERY SEARCH
            </motion.h1>
            
            <LanguageSwitcher />
          </div>

          {/* Enhanced AI Search Bar with Glassmorphism */}
          <motion.div 
            className="relative mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="relative">
              {/* Search icon */}
              <div 
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ 
                  color: searchFocused ? colors.primary[400] : 'var(--color-text-tertiary)' 
                }}
              >
                <motion.div
                  animate={searching ? { rotate: 360 } : { rotate: 0 }}
                  transition={searching ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                >
                  <HiSearch className="w-6 h-6" />
                </motion.div>
              </div>
              
              {/* Enhanced search input */}
              <motion.input
                ref={searchInputRef}
                type="text"
                placeholder="ブルワリー名、地域、ビールスタイルで検索..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  setSearchFocused(true);
                  if (searchQuery.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setSearchFocused(false);
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className="w-full pl-14 pr-24 py-4 rounded-2xl text-lg font-medium transition-all duration-300 bg-transparent border-2"
                style={{
                  color: 'var(--color-text-primary)',
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderColor: searchFocused 
                    ? colors.primary[400]
                    : 'var(--color-border-primary)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: searchFocused 
                    ? `0 0 0 3px ${colors.primary[400]}20, 0 8px 32px rgba(0, 0, 0, 0.1)`
                    : '0 4px 16px rgba(0, 0, 0, 0.05)'
                }}
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              
              {/* Voice search and clear buttons */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <motion.button
                    className="p-2 rounded-xl"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      color: 'var(--color-text-tertiary)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                      searchInputRef.current?.focus();
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <HiX className="w-4 h-4" />
                  </motion.button>
                )}
                
                <motion.button
                  className="p-2 rounded-xl"
                  style={{
                    backgroundColor: isVoiceSearch 
                      ? colors.primary[400] 
                      : theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: isVoiceSearch ? '#000000' : 'var(--color-text-tertiary)'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleVoiceSearch}
                  disabled={isVoiceSearch}
                  animate={isVoiceSearch ? { 
                    scale: [1, 1.2, 1],
                    backgroundColor: [colors.primary[400], colors.primary[500], colors.primary[400]]
                  } : {}}
                  transition={isVoiceSearch ? { duration: 0.8, repeat: Infinity } : {}}
                >
                  <HiMicrophone className="w-4 h-4" />
                </motion.button>
              </div>
              
              {/* AI Search Suggestions with Glassmorphism */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl border overflow-hidden z-50"
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      background: theme === 'dark' 
                        ? 'rgba(26, 26, 26, 0.95)' 
                        : 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'var(--color-border-primary)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                    }}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={suggestion.id}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 border-b last:border-b-0"
                        style={{
                          borderColor: 'var(--color-border-subtle)',
                          backgroundColor: 'transparent'
                        }}
                        whileHover={{
                          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
                        }}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div 
                          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ 
                            backgroundColor: colors.primary[400],
                            color: '#000000'
                          }}
                        >
                          {suggestion.type === 'brewery' && <HiLocationMarker className="w-4 h-4" />}
                          {suggestion.type === 'style' && <HiSparkles className="w-4 h-4" />}
                          {suggestion.type === 'location' && <HiGlobe className="w-4 h-4" />}
                          {suggestion.type === 'recent' && <HiClock className="w-4 h-4" />}
                        </div>
                        <span 
                          className="font-medium"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {suggestion.text}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
              activeTab="all"
              onChange={() => {}}
              variant="glass"
              theme={theme}
            />
          </motion.div>

          {/* Quick Filters */}
          <motion.div 
            className="flex flex-wrap items-center gap-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <ModernButton
              variant="ghost"
              size="sm"
              theme={theme}
              icon={<HiFilter className="w-4 h-4" />}
              onClick={() => setShowFilters(true)}
            >
              詳細フィルター
            </ModernButton>
            
            <motion.button
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: filters.openOnly 
                  ? colors.primary[400] 
                  : theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                color: filters.openOnly ? '#000000' : 'var(--color-text-secondary)',
                border: `1px solid ${filters.openOnly ? colors.primary[400] : 'var(--color-border-primary)'}`
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilters(prev => ({ ...prev, openOnly: !prev.openOnly }))}
            >
              <HiCheckCircle className="w-4 h-4" />
              営業中のみ
            </motion.button>
            
            <motion.button
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: filters.verifiedOnly 
                  ? colors.secondary[400] 
                  : theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                color: filters.verifiedOnly ? '#000000' : 'var(--color-text-secondary)',
                border: `1px solid ${filters.verifiedOnly ? colors.secondary[400] : 'var(--color-border-primary)'}`
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
            >
              <HiCheckCircle className="w-4 h-4" />
              認証済み
            </motion.button>
          </motion.div>

          {/* View Mode Toggle & Sort */}
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {loading ? '検索中...' : `${filteredBreweries.length}件のブルワリー`}
              </span>
              
              {searching && (
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
              transition={{ delay: 1 }}
            >
              <motion.button
                className="p-2 rounded-xl"
                style={{
                  backgroundColor: viewMode === 'list' 
                    ? colors.primary[400] 
                    : theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  color: viewMode === 'list' ? '#000000' : 'var(--color-text-secondary)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
              >
                <HiViewList className="w-5 h-5" />
              </motion.button>
              
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
                <HiViewGrid className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Content with Glassmorphism Cards */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {loading ? (
          // Enhanced 3D Loading State
          <div className="space-y-6">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ModernCard glass glassIntensity="medium" theme={theme} padding="lg">
                  <div className="flex items-start gap-4">
                    <ModernSkeleton variant="circular" width={60} height={60} glass theme={theme} />
                    <div className="flex-1 space-y-3">
                      <ModernSkeleton variant="text" width="60%" glass theme={theme} />
                      <ModernSkeleton variant="text" width="80%" glass theme={theme} />
                      <ModernSkeleton variant="text" width="40%" glass theme={theme} />
                    </div>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        ) : filteredBreweries.length === 0 ? (
          // Enhanced Empty State with 3D Beer Glass
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
              ブルワリーが見つかりません
            </h3>
            
            <p 
              className="mb-8"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: typography.fontSize.lg
              }}
            >
              検索条件を変更してお試しください
            </p>
            
            <ModernButton
              variant="primary"
              size="lg"
              theme={theme}
              icon={<HiRefresh className="w-5 h-5" />}
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  query: '',
                  rating: 0,
                  distance: 50,
                  openOnly: false,
                  verifiedOnly: false,
                  priceRange: [],
                  beerStyles: [],
                  amenities: [],
                  sortBy: 'relevance',
                  minTaps: 0
                });
              }}
            >
              検索をリセット
            </ModernButton>
          </motion.div>
        ) : (
          // Enhanced Brewery Cards
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredBreweries.map((brewery, index) => (
              <motion.div
                key={brewery.id}
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
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/brewery/${brewery.id}`)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 
                          className="font-heading"
                          style={{
                            fontSize: typography.fontSize.xl,
                            fontWeight: typography.fontWeight.bold,
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          {brewery.name}
                        </h3>
                        {brewery.isVerified && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <HiCheckCircle 
                              className="w-5 h-5"
                              style={{ color: colors.secondary[400] }}
                            />
                          </motion.div>
                        )}
                      </div>
                      
                      <p 
                        className="text-sm mb-3"
                        style={{ 
                          color: 'var(--color-text-secondary)',
                          lineHeight: 1.5
                        }}
                      >
                        {brewery.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <HiLocationMarker 
                            className="w-4 h-4"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          />
                          <span style={{ color: 'var(--color-text-tertiary)' }}>
                            {brewery.distance?.toFixed(1)}km • {brewery.address.city}
                          </span>
                        </div>
                        
                        <div 
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                          style={{
                            backgroundColor: brewery.isOpen ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: brewery.isOpen ? '#22C55E' : '#EF4444'
                          }}
                        >
                          <HiClock className="w-3 h-3" />
                          {brewery.isOpen ? '営業中' : '営業時間外'}
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Recommendation Score */}
                    {brewery.aiRecommendationScore && brewery.aiRecommendationScore > 80 && (
                      <motion.div 
                        className="px-2 py-1 rounded-xl text-xs font-bold"
                        style={{
                          backgroundColor: colors.primary[400],
                          color: '#000000'
                        }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        AI推奨
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <ModernBeerIndicator
                      label="評価"
                      value={brewery.ratings.overall.toFixed(1)}
                      unit="⭐"
                      type="rating"
                      glass
                      theme={theme}
                    />
                    <ModernBeerIndicator
                      label="タップ"
                      value={brewery.currentTaps || 0}
                      unit="🍺"
                      type="custom"
                      glass
                      theme={theme}
                    />
                    <ModernBeerIndicator
                      label="価格"
                      value={getPriceRangeText(brewery.priceRange)}
                      unit=""
                      type="custom"
                      glass
                      theme={theme}
                    />
                  </div>
                  
                  {/* Current Visitors */}
                  {brewery.currentVisitors && brewery.currentVisitors > 0 && (
                    <motion.div 
                      className="flex items-center gap-2 mb-4 p-2 rounded-xl"
                      style={{
                        backgroundColor: theme === 'dark' 
                          ? 'rgba(185, 127, 36, 0.15)' 
                          : 'rgba(185, 127, 36, 0.1)',
                        border: '1px solid rgba(185, 127, 36, 0.3)'
                      }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <HiUsers 
                        className="w-4 h-4"
                        style={{ color: colors.primary[400] }}
                      />
                      <span 
                        className="text-xs font-medium"
                        style={{ color: colors.primary[400] }}
                      >
                        {brewery.currentVisitors}人がいます
                      </span>
                    </motion.div>
                  )}
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {brewery.tags.slice(0, 3).map((tag, tagIndex) => (
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
                  <div className="flex gap-3">
                    <ModernButton
                      variant="primary"
                      size="sm"
                      fullWidth
                      theme={theme}
                      icon={<HiEye className="w-4 h-4" />}
                      onClick={(e) => {
                        e?.stopPropagation();
                        navigate(`/brewery/${brewery.id}`);
                      }}
                    >
                      詳細を見る
                    </ModernButton>
                    
                    <motion.button
                      className="p-2 rounded-xl border"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--color-border-primary)',
                        color: 'var(--color-text-secondary)'
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: colors.primary[400],
                        color: '#000000'
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e?.stopPropagation();
                        // Add to favorites logic
                      }}
                    >
                      <HiHeart className="w-4 h-4" />
                    </motion.button>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Filter FAB */}
      <ModernFAB
        icon={<HiFilter className="w-6 h-6" />}
        position="bottom-right"
        glass={true}
        theme={theme}
        onClick={() => setShowFilters(true)}
      />
    </div>
  );
};

export default BrewerySearchPage;