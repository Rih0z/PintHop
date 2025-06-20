/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Dashboard.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-06-02
 * 最終更新日: 2025-06-11
 * バージョン: 2.0
 *
 * 更新履歴:
 * - 2025-06-11 Claude Code 2024-2025 UI/UXトレンド完全準拠版に更新
 *
 * 説明:
 * 2024-2025 UI/UXトレンドに完全準拠したダッシュボード画面
 * Dark Mode First、Glassmorphism、Bold Typography、3D Charts実装
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18n';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { ModernCard, ModernButton, ModernTabs, ModernSkeleton, ModernBeerIndicator } from '../components/common/ModernComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography, animations } from '../styles/design-system';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  HiChartBar, 
  HiTrendingUp, 
  HiCollection,
  HiLocationMarker,
  HiStar,
  HiBadgeCheck,
  HiLightBulb,
  HiClock,
  HiUsers,
  HiSparkles
} from 'react-icons/hi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_URL = process.env.REACT_APP_API_URL || 'https://pinthop-api.riho-dare.workers.dev';

interface BeerStats {
  totalCheckins: number;
  uniqueBeers: number;
  uniqueBreweries: number;
  favoriteStyle: string;
  avgRating: number;
  monthlyCheckins: Array<{ month: string; count: number }>;
  styleDistribution: Array<{ style: string; count: number }>;
}

interface FavoriteBeer {
  id: string;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  ibu: number;
  rating: number;
  flavorProfile: {
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

interface RecommendedBrewery {
  id: string;
  name: string;
  description?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
  };
  ratings?: {
    untappd?: { score: number };
    rateBeer?: { score: number };
    beerAdvocate?: { score: number };
  };
  photos?: string[];
  currentTaps?: number;
  currentVisitors?: number;
  matchScore: number;
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BeerStats | null>(null);
  const [favoriteBeer, setFavoriteBeer] = useState<FavoriteBeer | null>(null);
  const [recommendedBreweries, setRecommendedBreweries] = useState<RecommendedBrewery[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'beers' | 'breweries'>('overview');

  // Fetch user statistics
  const fetchStats = async () => {
    if (!token) return;
    
    try {
      // Simulated data for now
      setStats({
        totalCheckins: 142,
        uniqueBeers: 89,
        uniqueBreweries: 23,
        favoriteStyle: 'IPA',
        avgRating: 4.2,
        monthlyCheckins: [
          { month: 'Jan', count: 12 },
          { month: 'Feb', count: 18 },
          { month: 'Mar', count: 22 },
          { month: 'Apr', count: 28 },
          { month: 'May', count: 35 },
          { month: 'Jun', count: 27 }
        ],
        styleDistribution: [
          { style: 'IPA', count: 35 },
          { style: 'Stout', count: 22 },
          { style: 'Lager', count: 18 },
          { style: 'Wheat', count: 14 }
        ]
      });
      
      setFavoriteBeer({
        id: '1',
        name: 'Space Dust IPA',
        brewery: 'Elysian Brewing',
        style: 'IPA',
        abv: 8.2,
        ibu: 73,
        rating: 4.5,
        flavorProfile: {
          hoppy: 9,
          malty: 4,
          bitter: 8,
          sweet: 2,
          citrus: 7,
          roasted: 1,
          fruity: 6,
          spicy: 3
        }
      });
      
      setRecommendedBreweries([
        {
          id: '1',
          name: 'Fremont Brewing',
          description: 'Urban beer garden with award-winning IPAs',
          address: {
            street: '1050 N 34th St',
            city: 'Seattle',
            state: 'WA'
          },
          ratings: {
            untappd: { score: 4.3 },
            rateBeer: { score: 4.2 },
            beerAdvocate: { score: 4.4 }
          },
          photos: ['https://example.com/fremont.jpg'],
          currentTaps: 12,
          currentVisitors: 5,
          matchScore: 92
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchStats();
      setLoading(false);
    };
    
    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <BeerGlassLoader size="lg" />
      </div>
    );
  }

  // Chart configurations
  const monthlyChartData = {
    labels: stats?.monthlyCheckins.map(m => m.month) || [],
    datasets: [{
      label: 'Check-ins',
      data: stats?.monthlyCheckins.map(m => m.count) || [],
      fill: true,
      backgroundColor: `${colors.beer.amber[500]}20`,
      borderColor: colors.beer.amber[500],
      tension: 0.4,
      pointBackgroundColor: colors.beer.amber[600],
      pointBorderColor: colors.foam[100],
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  };

  const styleChartData = {
    labels: stats?.styleDistribution.map(s => s.style) || [],
    datasets: [{
      data: stats?.styleDistribution.map(s => s.count) || [],
      backgroundColor: [
        colors.beer.amber[500],
        colors.beer.dark[800],
        colors.beer.light[400],
        colors.hop[500]
      ],
      borderColor: colors.brewery[900],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.foam[200],
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: colors.brewery[900],
        borderColor: colors.beer.amber[500],
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { color: colors.foam[200] },
        grid: { color: colors.brewery[800] }
      },
      y: {
        ticks: { color: colors.foam[200] },
        grid: { color: colors.brewery[800] }
      }
    }
  };

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
            <h1 className="text-2xl font-bold text-white">{t('nav.dashboard')}</h1>
            <LanguageSwitcher />
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* View Tabs */}
        <motion.div 
          className="flex gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <BeerTapButton
            onClick={() => setActiveView('overview')}
            variant={activeView === 'overview' ? 'primary' : 'ghost'}
          >
            Overview
          </BeerTapButton>
          <BeerTapButton
            onClick={() => setActiveView('beers')}
            variant={activeView === 'beers' ? 'primary' : 'ghost'}
          >
            Beer Analysis
          </BeerTapButton>
          <BeerTapButton
            onClick={() => setActiveView('breweries')}
            variant={activeView === 'breweries' ? 'primary' : 'ghost'}
          >
            Recommendations
          </BeerTapButton>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {/* Stats Cards */}
              <AnimatedCard variant="glass" glassEffect className="p-6">
                <div className="text-amber-500 mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white">{stats?.totalCheckins || 0}</h3>
                <p className="text-gray-400">Total Check-ins</p>
              </AnimatedCard>

              <AnimatedCard variant="glass" glassEffect className="p-6">
                <div className="text-hop-500 mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white">{stats?.uniqueBeers || 0}</h3>
                <p className="text-gray-400">Unique Beers</p>
              </AnimatedCard>

              <AnimatedCard variant="glass" glassEffect className="p-6">
                <div className="text-beer-dark-800 mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white">{stats?.uniqueBreweries || 0}</h3>
                <p className="text-gray-400">Breweries Visited</p>
              </AnimatedCard>

              <AnimatedCard variant="glass" glassEffect className="p-6">
                <div className="text-foam-200 mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white">{stats?.avgRating.toFixed(1) || 0}</h3>
                <p className="text-gray-400">Average Rating</p>
              </AnimatedCard>

              {/* Charts */}
              <div className="col-span-1 md:col-span-2 lg:col-span-2">
                <AnimatedCard variant="brewery" className="p-6 h-80">
                  <h3 className="text-lg font-bold text-white mb-4">Monthly Activity</h3>
                  <Line data={monthlyChartData} options={chartOptions} />
                </AnimatedCard>
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-2">
                <AnimatedCard variant="brewery" className="p-6 h-80">
                  <h3 className="text-lg font-bold text-white mb-4">Beer Styles</h3>
                  <Doughnut data={styleChartData} options={{...chartOptions, maintainAspectRatio: true}} />
                </AnimatedCard>
              </div>
            </motion.div>
          )}

          {activeView === 'beers' && favoriteBeer && (
            <motion.div
              key="beers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Favorite Beer Analysis */}
              <AnimatedCard variant="beer" className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Your Favorite Beer</h2>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-amber-500">{favoriteBeer.name}</h3>
                  <p className="text-gray-400">{favoriteBeer.brewery} • {favoriteBeer.style}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <ABVGauge abv={favoriteBeer.abv} style={favoriteBeer.style} />
                  <IBUMeter ibu={favoriteBeer.ibu} />
                </div>
                
                <div className="flex justify-center">
                  <BeerFlavorChart flavorProfile={favoriteBeer.flavorProfile} size="md" />
                </div>
              </AnimatedCard>

              {/* Beer Progress */}
              <AnimatedCard variant="glass" glassEffect className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Beer Journey Progress</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">IPA Explorer</span>
                      <span className="text-amber-500 font-medium">72%</span>
                    </div>
                    <BeerPourProgress progress={72} />
                    <p className="text-xs text-gray-500 mt-1">28 more IPAs to Master level</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Stout Connoisseur</span>
                      <span className="text-amber-500 font-medium">45%</span>
                    </div>
                    <BeerPourProgress progress={45} />
                    <p className="text-xs text-gray-500 mt-1">55 more Stouts to unlock</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">World Traveler</span>
                      <span className="text-amber-500 font-medium">23%</span>
                    </div>
                    <BeerPourProgress progress={23} />
                    <p className="text-xs text-gray-500 mt-1">Try beers from 77 more countries</p>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <h4 className="font-medium text-amber-400 mb-2">Next Achievement</h4>
                  <p className="text-gray-300">Try 3 more Belgian Tripels to unlock "Abbey Explorer" badge</p>
                </div>
              </AnimatedCard>
            </motion.div>
          )}

          {activeView === 'breweries' && (
            <motion.div
              key="breweries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Recommended Breweries</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedBreweries.map((brewery, index) => (
                  <motion.div
                    key={brewery.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative">
                      <OptimizedBreweryCard brewery={brewery} />
                      <motion.div
                        className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      >
                        <span className="text-white text-sm font-bold">{brewery.matchScore}% Match</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Custom CSS for shine animation */}
      <style jsx>{`
        @keyframes shine {
          0%, 100% { transform: translateX(-100%) rotate(45deg); }
          50% { transform: translateX(100%) rotate(45deg); }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;