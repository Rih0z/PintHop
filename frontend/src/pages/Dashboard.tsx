/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Dashboard.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-30
 * 
 * 更新履歴:
 * - 2025-06-01 AI Assistant リアルタイム機能、言語切り替え、自動更新を追加
 *
 * 説明:
 * ログイン後のダッシュボードページ
 * リアルタイムプレゼンス、チェックイン、友達アクティビティを表示
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFriendsPresence } from '../hooks/useFriendsPresence';
import { useCheckins } from '../hooks/useCheckins';
import { useBreweries } from '../hooks/useBreweries';
import { Presence } from '../types/presence';
import { Checkin } from '../types/checkin';
import { Brewery } from '../types/brewery';
import { fetchFriendsPresence, fetchMyPresence } from '../services/presence';
import { fetchCheckins } from '../services/checkins';
import { fetchBreweries } from '../services/breweries';
import { useNavigate } from 'react-router-dom';

// 言語定義
const translations = {
  en: {
    welcome: 'Welcome back,',
    dashboard: 'Dashboard',
    discover: 'Discover',
    friends: 'Friends',
    map: 'Map',
    signOut: 'Sign Out',
    realTimeStats: 'Real-Time Stats',
    friendsAtBreweries: 'Friends at Breweries',
    todaysCheckins: "Today's Check-ins",
    activePresence: 'Friends Currently at Breweries',
    recentActivity: 'Recent Activity',
    todaysRoute: "Today's Route",
    quickActions: 'Quick Actions',
    checkIn: 'Check In',
    checkInSubtitle: 'Mark your current location',
    exploreMap: 'Explore Map',
    exploreMapSubtitle: 'Find nearby breweries',
    findFriends: 'Find Friends',
    findFriendsSubtitle: "See who's nearby",
    setGoal: 'Set Goal',
    setGoalSubtitle: 'Plan your beer route',
    hotSpots: 'Hot Spots',
    mostPopular: 'Most popular breweries right now',
    live: 'Live',
    friendsHere: 'friends here',
    checkedInAt: 'checked in at',
    startedHopping: 'started beer hopping in',
    discoveredBeer: 'discovered a new beer',
    minAgo: 'min ago',
    hourAgo: 'hour ago',
    yourJourney: 'Your Journey',
    breweriesVisited: 'Breweries Visited',
    beersTried: 'Beers Tried',
    friendsMet: 'Friends Met',
    routesCompleted: 'Routes Completed',
    developmentMode: 'Development Mode',
    developmentNotice: 'This is a preview version. Features are being actively developed based on user feedback.',
    noActivePresence: 'No friends are currently at breweries',
    noRecentActivity: 'No recent activity',
    noRouteToday: "You haven't started a route today",
    startRoute: 'Start Your Route',
    viewOnMap: 'View on Map',
    lastUpdated: 'Last updated',
    autoRefresh: 'Auto-refresh in',
    seconds: 'seconds',
    language: 'Language',
  },
  ja: {
    welcome: 'おかえりなさい、',
    dashboard: 'ダッシュボード',
    discover: '発見',
    friends: '友達',
    map: 'マップ',
    signOut: 'ログアウト',
    realTimeStats: 'リアルタイム統計',
    friendsAtBreweries: 'ブルワリーにいる友達',
    todaysCheckins: '今日のチェックイン',
    activePresence: '現在ブルワリーにいる友達',
    recentActivity: '最近のアクティビティ',
    todaysRoute: '今日のルート',
    quickActions: 'クイックアクション',
    checkIn: 'チェックイン',
    checkInSubtitle: '現在地を記録',
    exploreMap: 'マップを探索',
    exploreMapSubtitle: '近くのブルワリーを見つける',
    findFriends: '友達を探す',
    findFriendsSubtitle: '近くにいる人を見る',
    setGoal: '目標を設定',
    setGoalSubtitle: 'ビールルートを計画',
    hotSpots: 'ホットスポット',
    mostPopular: '今最も人気のブルワリー',
    live: 'ライブ',
    friendsHere: '人の友達がここにいます',
    checkedInAt: 'にチェックイン',
    startedHopping: 'でビアホッピングを開始',
    discoveredBeer: '新しいビールを発見',
    minAgo: '分前',
    hourAgo: '時間前',
    yourJourney: 'あなたの旅',
    breweriesVisited: '訪問したブルワリー',
    beersTried: '試したビール',
    friendsMet: '会った友達',
    routesCompleted: '完了したルート',
    developmentMode: '開発モード',
    developmentNotice: 'これはプレビュー版です。ユーザーフィードバックに基づいて機能を積極的に開発しています。',
    noActivePresence: '現在ブルワリーにいる友達はいません',
    noRecentActivity: '最近のアクティビティはありません',
    noRouteToday: '今日はまだルートを開始していません',
    startRoute: 'ルートを開始',
    viewOnMap: 'マップで見る',
    lastUpdated: '最終更新',
    autoRefresh: '自動更新まで',
    seconds: '秒',
    language: '言語',
  },
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [refreshTimer, setRefreshTimer] = useState(30);
  const [friendsPresence, setFriendsPresence] = useState<Presence[]>([]);
  const [todaysCheckins, setTodaysCheckins] = useState<Checkin[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [breweries, setBreweries] = useState<Map<string, Brewery>>(new Map());
  const [loading, setLoading] = useState(true);
  const [myPresence, setMyPresence] = useState<Presence | null>(null);

  const t = translations[language];

  // データ取得関数
  const fetchData = useCallback(async () => {
    try {
      // 友達のプレゼンス情報を取得
      const presenceData = await fetchFriendsPresence();
      setFriendsPresence(presenceData.filter(p => p.brewery && p.status === 'online'));

      // 自分のプレゼンス情報を取得
      const myPresenceData = await fetchMyPresence();
      setMyPresence(myPresenceData);

      // 今日のチェックインを取得
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkinsData = await fetchCheckins();
      const todaysData = checkinsData.filter(c => 
        new Date(c.checkinTime || '').getTime() >= today.getTime()
      );
      setTodaysCheckins(todaysData);

      // ブルワリー情報を取得
      const breweriesData = await fetchBreweries();
      const breweryMap = new Map(breweriesData.map(b => [b.breweryId, b]));
      setBreweries(breweryMap);

      // 最近のアクティビティ（モックデータ - 実際のAPIがあれば置き換え）
      setRecentActivities([
        { 
          user: 'Alice', 
          action: 'checkedInAt', 
          brewery: 'Pike Brewing', 
          time: '5', 
          unit: 'minAgo',
          avatar: 'A' 
        },
        { 
          user: 'Bob', 
          action: 'startedHopping', 
          location: 'Ballard', 
          time: '12', 
          unit: 'minAgo',
          avatar: 'B' 
        },
        { 
          user: 'Charlie', 
          action: 'discoveredBeer', 
          beer: 'IPA', 
          time: '1', 
          unit: 'hourAgo',
          avatar: 'C' 
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  }, []);

  // 初回データ取得と自動更新
  useEffect(() => {
    fetchData();

    // 30秒ごとに自動更新
    const interval = setInterval(() => {
      fetchData();
      setRefreshTimer(30);
    }, 30000);

    // カウントダウンタイマー
    const timerInterval = setInterval(() => {
      setRefreshTimer(prev => prev > 0 ? prev - 1 : 30);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timerInterval);
    };
  }, [fetchData]);

  // 言語を保存
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // 保存された言語を読み込み
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ja';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const activePresenceCount = friendsPresence.length;

  const getBreweryName = (breweryId: string) => {
    return breweries.get(breweryId)?.name || breweryId;
  };

  const formatActivity = (activity: any) => {
    if (activity.action === 'checkedInAt') {
      return `${(t as any)[activity.action]} ${activity.brewery}`;
    } else if (activity.action === 'startedHopping') {
      return `${(t as any)[activity.action]} ${activity.location}`;
    } else if (activity.action === 'discoveredBeer') {
      return `${(t as any)[activity.action]} ${activity.beer}`;
    }
    return activity.action;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header - Netflix Style */}
      <header className="bg-dark-800/95 backdrop-blur-sm border-b border-dark-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-display font-bold text-white flex items-center">
                🍺 <span className="ml-2 bg-gradient-to-r from-primary-500 to-beer-500 bg-clip-text text-transparent">PintHop</span>
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-dark-200 hover:text-white transition-colors font-medium">{t.discover}</a>
                <a href="#" className="text-dark-200 hover:text-white transition-colors font-medium">{t.friends}</a>
                <button 
                  onClick={() => navigate('/map')}
                  className="text-dark-200 hover:text-white transition-colors font-medium"
                >
                  {t.map}
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ja')}
                className="bg-dark-700 text-white border border-dark-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="en">🇺🇸 English</option>
                <option value="ja">🇯🇵 日本語</option>
              </select>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-beer-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium hidden sm:block">
                  {t.welcome} {user?.username}!
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-dark-700 hover:bg-dark-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105"
              >
                {t.signOut}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Real-time Stats Bar */}
      <div className="bg-gradient-to-r from-primary-900/50 to-beer-900/50 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent-success rounded-full animate-pulse"></div>
                <span className="text-white font-medium">{t.realTimeStats}</span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-white">
                  <span className="text-2xl font-bold">{activePresenceCount}</span>
                  <span className="text-dark-300 ml-2">{t.friendsAtBreweries}</span>
                </div>
                <div className="text-white">
                  <span className="text-2xl font-bold">{todaysCheckins.length}</span>
                  <span className="text-dark-300 ml-2">{t.todaysCheckins}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-dark-300 text-sm">
              <span>{t.autoRefresh}</span>
              <span className="text-primary-400 font-mono">{refreshTimer}</span>
              <span>{t.seconds}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Active Presence & Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Presence */}
            <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700">
              <div className="p-6 border-b border-dark-700">
                <h3 className="text-xl font-bold text-white flex items-center justify-between">
                  <span className="flex items-center">
                    👥 <span className="ml-2">{t.activePresence}</span>
                  </span>
                  <span className="text-sm text-accent-success">
                    {activePresenceCount > 0 && '● ' + t.live}
                  </span>
                </h3>
              </div>
              <div className="p-6">
                {activePresenceCount > 0 ? (
                  <div className="space-y-4">
                    {friendsPresence.map((presence, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 rounded-xl bg-dark-700/50 hover:bg-dark-700 transition-all cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-beer-500 rounded-full flex items-center justify-center text-white font-bold">
                            {presence.user.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{presence.user}</p>
                            <p className="text-dark-300 text-sm">
                              @ {getBreweryName(presence.brewery || '')}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/map')}
                          className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                        >
                          {t.viewOnMap} →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-400 text-center py-8">{t.noActivePresence}</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700">
              <div className="p-6 border-b border-dark-700">
                <h3 className="text-xl font-bold text-white flex items-center">
                  ⚡ <span className="ml-2">{t.recentActivity}</span>
                </h3>
              </div>
              <div className="p-6">
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-dark-700/50 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-beer-500 rounded-full flex items-center justify-center text-white font-bold">
                          {activity.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-white">
                            <span className="font-medium">{activity.user}</span>{" "}
                            <span className="text-dark-300">{formatActivity(activity)}</span>
                          </p>
                          <p className="text-dark-400 text-sm">
                            {activity.time} {(t as any)[activity.unit]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-400 text-center py-8">{t.noRecentActivity}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Today's Route & Quick Actions */}
          <div className="space-y-8">
            {/* Today's Route */}
            <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700">
              <div className="p-6 border-b border-dark-700">
                <h3 className="text-xl font-bold text-white flex items-center">
                  🗺️ <span className="ml-2">{t.todaysRoute}</span>
                </h3>
              </div>
              <div className="p-6">
                {todaysCheckins.length > 0 ? (
                  <div className="space-y-4">
                    {todaysCheckins.map((checkin, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {getBreweryName(checkin.brewery)}
                          </p>
                          <p className="text-dark-400 text-sm">
                            {new Date(checkin.checkinTime || '').toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => navigate('/map')}
                      className="w-full mt-4 bg-dark-700 hover:bg-dark-600 text-white font-medium py-3 px-4 rounded-xl transition-all"
                    >
                      {t.viewOnMap} →
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-dark-400 mb-4">{t.noRouteToday}</p>
                    <button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105">
                      🍺 {t.startRoute}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700">
              <div className="p-6 border-b border-dark-700">
                <h3 className="text-xl font-bold text-white">{t.quickActions}</h3>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { icon: "📍", title: t.checkIn, subtitle: t.checkInSubtitle, color: "from-primary-500 to-primary-600" },
                  { icon: "🗺️", title: t.exploreMap, subtitle: t.exploreMapSubtitle, color: "from-accent-blue to-blue-600", action: () => navigate('/map') },
                  { icon: "👥", title: t.findFriends, subtitle: t.findFriendsSubtitle, color: "from-accent-success to-green-600" },
                  { icon: "🎯", title: t.setGoal, subtitle: t.setGoalSubtitle, color: "from-beer-500 to-beer-600" },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full group bg-dark-700 hover:bg-dark-600 rounded-xl p-4 transition-all duration-200 hover:scale-105 cursor-pointer border border-dark-600 hover:border-primary-500/50 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{action.title}</h4>
                        <p className="text-dark-300 text-sm">{action.subtitle}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <section className="mt-12">
          <h3 className="text-2xl font-display font-bold text-white mb-6">{t.yourJourney}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t.breweriesVisited, value: "12", icon: "🏪" },
              { label: t.beersTried, value: "47", icon: "🍺" },
              { label: t.friendsMet, value: "8", icon: "👥" },
              { label: t.routesCompleted, value: "3", icon: "🗺️" },
            ].map((stat, index) => (
              <div key={index} className="bg-dark-800 rounded-2xl p-6 text-center border border-dark-700 hover:border-primary-500/50 transition-all">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-dark-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Development Notice */}
        <div className="mt-12 bg-gradient-to-r from-beer-500/20 to-primary-500/20 border border-beer-500/30 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🚧</span>
            <div>
              <h4 className="text-beer-400 font-bold">{t.developmentMode}</h4>
              <p className="text-dark-200 text-sm">{t.developmentNotice}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;