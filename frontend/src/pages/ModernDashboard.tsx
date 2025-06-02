/**
 * Modern Dashboard Page - Mobile-first design
 * Health-conscious design based on persona analysis
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ModernCard,
  ModernButton,
  ModernTabs,
  ModernHealthIndicator,
  ModernSkeleton,
} from '../components/common/ModernComponents';
import { modernColors, modernGradients } from '../styles/modern-design-system';

interface UserStats {
  totalCheckins: number;
  uniqueBeers: number;
  uniqueBreweries: number;
  favoriteStyle: string;
  avgRating: number;
  totalABV: number;
  avgABV: number;
  weeklyLimit: number;
  weeklyConsumed: number;
  healthScore: number;
  monthlyTrend: 'up' | 'down' | 'stable';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'social' | 'exploration' | 'health' | 'expertise';
}

interface HealthInsight {
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action?: string;
}

interface BeerRecommendation {
  id: string;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  rating: number;
  reason: string;
  image: string;
  healthFriendly: boolean;
}

const ModernDashboardPage: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([]);
  const [recommendations, setRecommendations] = useState<BeerRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data based on persona analysis
    const mockStats: UserStats = {
      totalCheckins: 142,
      uniqueBeers: 89,
      uniqueBreweries: 23,
      favoriteStyle: 'IPA',
      avgRating: 4.2,
      totalABV: 45.6,
      avgABV: 6.3,
      weeklyLimit: 14, // Standard drinks per week
      weeklyConsumed: 8,
      healthScore: 85,
      monthlyTrend: 'down',
    };

    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'IPA Explorer',
        description: 'Try 25 different IPAs',
        icon: '🍺',
        progress: 18,
        maxProgress: 25,
        unlocked: false,
        category: 'exploration',
      },
      {
        id: '2',
        title: 'Health Conscious',
        description: 'Stay under weekly limit for 4 weeks',
        icon: '💚',
        progress: 3,
        maxProgress: 4,
        unlocked: false,
        category: 'health',
      },
      {
        id: '3',
        title: 'Social Butterfly',
        description: 'Check in with 10 different friends',
        icon: '🦋',
        progress: 10,
        maxProgress: 10,
        unlocked: true,
        category: 'social',
      },
    ];

    const mockInsights: HealthInsight[] = [
      {
        type: 'success',
        title: 'Great Week!',
        message: 'You\'re staying within your healthy drinking limits.',
        action: 'Keep it up!',
      },
      {
        type: 'info',
        title: 'Low ABV Options',
        message: 'Try session beers (under 4.5% ABV) for healthier choices.',
        action: 'Explore recommendations',
      },
    ];

    const mockRecommendations: BeerRecommendation[] = [
      {
        id: '1',
        name: 'Session Wheat',
        brewery: 'Local Brewery',
        style: 'Wheat Beer',
        abv: 4.2,
        rating: 4.1,
        reason: 'Lower ABV matches your health goals',
        image: 'https://via.placeholder.com/80x80/FFB300/000000?text=🍺',
        healthFriendly: true,
      },
      {
        id: '2',
        name: 'Hoppy Pilsner',
        brewery: 'Craft Co.',
        style: 'Pilsner',
        abv: 5.2,
        rating: 4.3,
        reason: 'Similar to your favorite IPAs but lighter',
        image: 'https://via.placeholder.com/80x80/66BB6A/000000?text=🍺',
        healthFriendly: true,
      },
    ];

    setTimeout(() => {
      setUserStats(mockStats);
      setAchievements(mockAchievements);
      setHealthInsights(mockInsights);
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  }, []);

  const getHealthStatus = (score: number): 'low' | 'moderate' | 'high' => {
    if (score >= 80) return 'low'; // Good health (green)
    if (score >= 60) return 'moderate'; // Moderate (amber)
    return 'high'; // Poor health (red)
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'health', label: 'Health', icon: '💚' },
    { id: 'achievements', label: 'Goals', icon: '🏆' },
    { id: 'social', label: 'Social', icon: '👥' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="space-y-4">
          <ModernSkeleton variant="rectangular" height={200} />
          <div className="grid grid-cols-2 gap-4">
            <ModernSkeleton variant="rectangular" height={120} />
            <ModernSkeleton variant="rectangular" height={120} />
          </div>
          <ModernSkeleton variant="rectangular" height={150} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm px-4 py-4 safe-area-top"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Your beer journey insights</p>
          </div>
          <ModernButton
            variant="ghost"
            size="sm"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>
        
        <ModernTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
        />
      </motion.div>

      {/* Content */}
      <div className="p-4 pb-20">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && userStats && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Health Score Card */}
              <ModernCard
                padding="lg"
                className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Health Score</h3>
                    <p className="text-sm text-gray-600">Based on your drinking patterns</p>
                  </div>
                  <div className="text-4xl font-bold text-green-600">
                    {userStats.healthScore}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <motion.div
                    className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${userStats.healthScore}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                <p className="text-sm text-green-700">
                  Excellent! You're maintaining healthy drinking habits.
                </p>
              </ModernCard>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <ModernCard padding="md" interactive>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{userStats.totalCheckins}</div>
                    <div className="text-sm text-gray-600">Total Check-ins</div>
                    <div className="flex items-center justify-center mt-1 text-green-600">
                      <span className="text-xs">{getTrendIcon(userStats.monthlyTrend)}</span>
                    </div>
                  </div>
                </ModernCard>

                <ModernCard padding="md" interactive>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{userStats.uniqueBeers}</div>
                    <div className="text-sm text-gray-600">Unique Beers</div>
                    <div className="text-xs text-amber-600 mt-1">
                      🍺 {userStats.favoriteStyle} fan
                    </div>
                  </div>
                </ModernCard>
              </div>

              {/* Weekly Consumption */}
              <ModernCard padding="lg">
                <h3 className="font-semibold text-gray-900 mb-4">This Week's Consumption</h3>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Standard drinks</span>
                    <span>{userStats.weeklyConsumed} / {userStats.weeklyLimit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(userStats.weeklyConsumed / userStats.weeklyLimit) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {userStats.weeklyLimit - userStats.weeklyConsumed} drinks remaining for healthy weekly limit
                </p>
              </ModernCard>

              {/* Health Insights */}
              <ModernCard padding="lg">
                <h3 className="font-semibold text-gray-900 mb-4">Health Insights</h3>
                <div className="space-y-3">
                  {healthInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        insight.type === 'success' ? 'bg-green-50 border-green-200' :
                        insight.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                        'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{getInsightIcon(insight.type)}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          <p className="text-sm text-gray-600">{insight.message}</p>
                          {insight.action && (
                            <ModernButton variant="ghost" size="sm" className="mt-2">
                              {insight.action}
                            </ModernButton>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ModernCard>
            </motion.div>
          )}

          {/* Health Tab */}
          {activeTab === 'health' && userStats && (
            <motion.div
              key="health"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Health Metrics */}
              <div className="grid grid-cols-1 gap-3">
                <ModernHealthIndicator
                  label="Average ABV"
                  value={userStats.avgABV}
                  unit="%"
                  status={getHealthStatus(userStats.healthScore)}
                  icon={<span>🍺</span>}
                />
                
                <ModernHealthIndicator
                  label="Weekly Consumption"
                  value={userStats.weeklyConsumed}
                  unit="drinks"
                  status="moderate"
                  icon={<span>📊</span>}
                />
                
                <ModernHealthIndicator
                  label="Health Score"
                  value={userStats.healthScore}
                  unit="/100"
                  status="low"
                  icon={<span>💚</span>}
                />
              </div>

              {/* Recommendations */}
              <ModernCard padding="lg">
                <h3 className="font-semibold text-gray-900 mb-4">Health-Friendly Recommendations</h3>
                <div className="space-y-3">
                  {recommendations.map((beer) => (
                    <motion.div
                      key={beer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <img
                        src={beer.image}
                        alt={beer.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{beer.name}</h4>
                        <p className="text-sm text-gray-600">{beer.brewery} • {beer.style}</p>
                        <p className="text-xs text-green-700 mt-1">{beer.reason}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">{beer.abv}%</div>
                        <div className="text-xs text-gray-500">⭐ {beer.rating}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ModernCard>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ModernCard
                      padding="lg"
                      className={achievement.unlocked ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200' : ''}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`text-4xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                          {achievement.icon}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <motion.div
                              className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{achievement.progress} / {achievement.maxProgress}</span>
                            <span className="capitalize">{achievement.category}</span>
                          </div>
                        </div>
                        
                        {achievement.unlocked && (
                          <div className="text-amber-500">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </ModernCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <ModernCard padding="lg">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Friends</h3>
                  <p className="text-gray-600 mb-4">
                    Share your beer journey and discover new favorites with friends.
                  </p>
                  <ModernButton variant="primary">
                    Find Friends
                  </ModernButton>
                </div>
              </ModernCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernDashboardPage;