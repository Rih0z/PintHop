/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/BreweryDetails.tsx
 *
 * 作成者: Claude Code
 * 作成日: 2025-06-11
 *
 * 説明:
 * ブルワリー詳細画面コンポーネント
 * UI/UX仕様書に基づくコミュニティ情報表示機能中心の実装
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CheckinModal from '../components/checkin/CheckinModal';
import { 
  FiArrowLeft,
  FiMapPin, 
  FiClock, 
  FiPhone, 
  FiGlobe,
  FiUsers, 
  FiNavigation,
  FiTrendingUp,
  FiCalendar,
  FiCheckCircle,
  FiPlus,
  FiHeart,
  FiShare2,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

interface Brewery {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  description?: string;
  hours?: {
    [key: string]: string;
  };
  image?: string;
  rating?: number;
  reviewCount?: number;
}

interface FriendPresence {
  id: string;
  name: string;
  avatar?: string;
  checkedInAt: string;
  isVisible: boolean; // プライバシー設定による
}

interface ActiveRoute {
  id: string;
  name: string;
  participantCount: number;
  position: number; // ルート上での位置
  totalStops: number;
  nextStop?: string;
}

interface CheckinData {
  breweryId: string;
  privacy: 'public' | 'friends' | 'private';
  comment?: string;
  photo?: File;
  routeId?: string;
  createMeetup?: boolean;
}

interface TodayEvent {
  id: string;
  name: string;
  time: string;
  participantCount: number;
  type: 'meetup' | 'tasting' | 'tour' | 'special';
}

type CrowdingLevel = 'low' | 'medium' | 'high';

export const BreweryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [brewery, setBrewery] = useState<Brewery | null>(null);
  const [friendsPresent, setFriendsPresent] = useState<FriendPresence[]>([]);
  const [activeRoutes, setActiveRoutes] = useState<ActiveRoute[]>([]);
  const [todayEvents, setTodayEvents] = useState<TodayEvent[]>([]);
  const [crowdingLevel, setCrowdingLevel] = useState<CrowdingLevel>('medium');
  const [loading, setLoading] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API calls
    const mockBrewery: Brewery = {
      id: id || '1',
      name: 'Fremont Brewing',
      address: '1050 N 34th St',
      city: 'Seattle',
      state: 'WA',
      phone: '(206) 420-2407',
      website: 'https://fremontbrewing.com',
      description: '地域に愛され続けるシアトルの老舗ブルワリー。革新的なクラフトビールと温かいコミュニティの雰囲気で知られています。',
      hours: {
        '月': '15:00 - 22:00',
        '火': '15:00 - 22:00',
        '水': '15:00 - 22:00',
        '木': '15:00 - 23:00',
        '金': '15:00 - 24:00',
        '土': '12:00 - 24:00',
        '日': '12:00 - 22:00'
      },
      rating: 4.7,
      reviewCount: 342
    };

    const mockFriendsPresent: FriendPresence[] = [
      {
        id: '1',
        name: 'Alice',
        checkedInAt: '2025-06-11T18:30:00Z',
        isVisible: true
      },
      {
        id: '2', 
        name: 'Bob',
        checkedInAt: '2025-06-11T19:15:00Z',
        isVisible: false
      }
    ];

    const mockActiveRoutes: ActiveRoute[] = [
      {
        id: '1',
        name: 'シアトル・ブルワリーホップ',
        participantCount: 7,
        position: 2,
        totalStops: 5,
        nextStop: 'Stoup Brewing'
      }
    ];

    const mockTodayEvents: TodayEvent[] = [
      {
        id: '1',
        name: 'IPAテイスティング',
        time: '20:00',
        participantCount: 12,
        type: 'tasting'
      },
      {
        id: '2',
        name: 'ブルワリー見学',
        time: '21:30',
        participantCount: 8,
        type: 'tour'
      }
    ];

    setTimeout(() => {
      setBrewery(mockBrewery);
      setFriendsPresent(mockFriendsPresent);
      setActiveRoutes(mockActiveRoutes);
      setTodayEvents(mockTodayEvents);
      setCrowdingLevel('medium');
      setLoading(false);
    }, 1000);
  }, [id]);

  const getCrowdingColor = (level: CrowdingLevel) => {
    switch (level) {
      case 'low':
        return 'var(--color-status-success)';
      case 'medium':
        return 'var(--color-status-warning)';
      case 'high':
        return 'var(--color-status-error)';
      default:
        return 'var(--color-neutral-400)';
    }
  };

  const getCrowdingText = (level: CrowdingLevel) => {
    switch (level) {
      case 'low':
        return '空いています';
      case 'medium':
        return '適度に混雑';
      case 'high':
        return '混雑しています';
      default:
        return '情報なし';
    }
  };

  const handleCheckIn = () => {
    if (isCheckedIn) {
      // Already checked in, toggle off
      setIsCheckedIn(false);
      // TODO: Implement check-out logic
    } else {
      // Open checkin modal
      setShowCheckinModal(true);
    }
  };

  const handleCheckin = async (data: CheckinData) => {
    try {
      // TODO: Replace with actual API call
      console.log('チェックインデータ:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsCheckedIn(true);
      
      // Update friends present if privacy allows
      if (data.privacy !== 'private') {
        setFriendsPresent(prev => [
          ...prev,
          {
            id: 'current-user',
            name: 'あなた',
            checkedInAt: new Date().toISOString(),
            isVisible: data.privacy === 'public' || data.privacy === 'friends'
          }
        ]);
      }
      
      // TODO: Show success feedback
      console.log('チェックインが完了しました');
      
    } catch (error) {
      console.error('チェックインエラー:', error);
      throw error;
    }
  };

  const handleCreateMeetup = () => {
    // TODO: Navigate to meetup creation page
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
        <div className="animate-pulse">
          <div className="h-64" style={{ backgroundColor: 'var(--color-neutral-200)' }}></div>
          <div className="p-4 space-y-4">
            <div className="h-8" style={{ backgroundColor: 'var(--color-neutral-200)' }}></div>
            <div className="h-4" style={{ backgroundColor: 'var(--color-neutral-200)' }}></div>
            <div className="h-4 w-2/3" style={{ backgroundColor: 'var(--color-neutral-200)' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!brewery) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
        <div className="text-center">
          <p className="font-body" style={{ color: 'var(--color-neutral-600)' }}>
            ブルワリーが見つかりません
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 rounded-lg font-accent"
            style={{ 
              backgroundColor: 'var(--color-primary-500)',
              color: 'white'
            }}
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
      {/* Header */}
      <div className="relative">
        {/* Hero Image */}
        <div 
          className="h-64 bg-gradient-to-r from-amber-400 to-orange-500"
          style={{ 
            background: `linear-gradient(135deg, var(--color-primary-300), var(--color-accent-400))`
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 bg-black bg-opacity-30 rounded-full text-white z-10"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="p-2 bg-black bg-opacity-30 rounded-full text-white">
              <FiHeart className="w-5 h-5" />
            </button>
            <button className="p-2 bg-black bg-opacity-30 rounded-full text-white">
              <FiShare2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Brewery Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm p-4">
          <h1 
            className="text-2xl font-heading font-bold mb-2"
            style={{ color: 'var(--color-neutral-900)' }}
          >
            {brewery.name}
          </h1>
          <div className="flex items-center" style={{ color: 'var(--color-neutral-600)' }}>
            <FiMapPin className="w-4 h-4 mr-2" />
            <span className="font-body text-sm">{brewery.address}, {brewery.city}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Description */}
        {brewery.description && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="font-body" style={{ color: 'var(--color-neutral-700)' }}>
              {brewery.description}
            </p>
          </div>
        )}

        {/* Community Information Section - 主要機能 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h3 
            className="text-lg font-heading font-bold mb-6"
            style={{ color: 'var(--color-neutral-900)' }}
          >
            コミュニティ情報
          </h3>

          <div className="space-y-4">
            {/* Friends Presence */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: 'var(--color-secondary-100)' }}
                >
                  <FiUsers 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-secondary-600)' }}
                  />
                </div>
                <div>
                  <span 
                    className="font-accent font-medium"
                    style={{ color: 'var(--color-neutral-800)' }}
                  >
                    現在の友達:
                  </span>
                  <div className="mt-1">
                    {friendsPresent.filter(f => f.isVisible).length > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span 
                          className="font-body text-sm"
                          style={{ color: 'var(--color-primary-600)' }}
                        >
                          {friendsPresent.filter(f => f.isVisible).length}人が滞在中
                        </span>
                        <div className="flex -space-x-1">
                          {friendsPresent.filter(f => f.isVisible).slice(0, 3).map((friend) => (
                            <div
                              key={friend.id}
                              className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center border-2 border-white font-accent"
                              style={{ backgroundColor: 'var(--color-secondary-500)' }}
                            >
                              {friend.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span 
                        className="font-body text-sm"
                        style={{ color: 'var(--color-neutral-500)' }}
                      >
                        友達はいません
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Routes */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: 'var(--color-accent-100)' }}
                >
                  <FiNavigation 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-accent-600)' }}
                  />
                </div>
                <div>
                  <span 
                    className="font-accent font-medium"
                    style={{ color: 'var(--color-neutral-800)' }}
                  >
                    アクティブルート:
                  </span>
                  <div className="mt-1">
                    {activeRoutes.length > 0 ? (
                      <div>
                        <span 
                          className="font-body text-sm"
                          style={{ color: 'var(--color-accent-600)' }}
                        >
                          {activeRoutes.length}個のルートで通過中
                        </span>
                        {activeRoutes.map((route) => (
                          <div key={route.id} className="mt-1">
                            <span 
                              className="font-body text-xs"
                              style={{ color: 'var(--color-neutral-600)' }}
                            >
                              {route.name} ({route.position}/{route.totalStops})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span 
                        className="font-body text-sm"
                        style={{ color: 'var(--color-neutral-500)' }}
                      >
                        アクティブなルートはありません
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Crowding Level */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: 'var(--color-neutral-100)' }}
                >
                  <FiTrendingUp 
                    className="w-5 h-5"
                    style={{ color: getCrowdingColor(crowdingLevel) }}
                  />
                </div>
                <div>
                  <span 
                    className="font-accent font-medium"
                    style={{ color: 'var(--color-neutral-800)' }}
                  >
                    混雑状況:
                  </span>
                  <div className="mt-1">
                    <span 
                      className="font-body text-sm font-medium"
                      style={{ color: getCrowdingColor(crowdingLevel) }}
                    >
                      {getCrowdingText(crowdingLevel)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Events */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: 'var(--color-primary-100)' }}
                >
                  <FiCalendar 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-primary-600)' }}
                  />
                </div>
                <div>
                  <span 
                    className="font-accent font-medium"
                    style={{ color: 'var(--color-neutral-800)' }}
                  >
                    今日のイベント:
                  </span>
                  <div className="mt-1">
                    {todayEvents.length > 0 ? (
                      <div>
                        <span 
                          className="font-body text-sm"
                          style={{ color: 'var(--color-primary-600)' }}
                        >
                          {todayEvents.length}件のイベント
                        </span>
                        {todayEvents.map((event) => (
                          <div key={event.id} className="mt-1">
                            <span 
                              className="font-body text-xs"
                              style={{ color: 'var(--color-neutral-600)' }}
                            >
                              {event.time} - {event.name} ({event.participantCount}人参加)
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span 
                        className="font-body text-sm"
                        style={{ color: 'var(--color-neutral-500)' }}
                      >
                        イベントはありません
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleCheckIn}
            className="flex items-center justify-center px-6 py-3 rounded-xl font-accent font-medium transition-colors"
            style={{ 
              backgroundColor: isCheckedIn ? 'var(--color-status-success)' : 'var(--color-primary-500)',
              color: 'white'
            }}
          >
            <FiCheckCircle className="w-5 h-5 mr-2" />
            {isCheckedIn ? 'チェックイン済み' : 'チェックイン'}
          </button>
          
          <button
            onClick={handleCreateMeetup}
            className="flex items-center justify-center px-6 py-3 rounded-xl font-accent font-medium transition-colors border"
            style={{ 
              backgroundColor: 'transparent',
              borderColor: 'var(--color-primary-500)',
              color: 'var(--color-primary-500)'
            }}
          >
            <FiPlus className="w-5 h-5 mr-2" />
            ミートアップ開催
          </button>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 
            className="text-lg font-heading font-bold mb-4"
            style={{ color: 'var(--color-neutral-900)' }}
          >
            基本情報
          </h3>
          
          <div className="space-y-3">
            {brewery.phone && (
              <div className="flex items-center">
                <FiPhone 
                  className="w-4 h-4 mr-3"
                  style={{ color: 'var(--color-neutral-500)' }}
                />
                <span className="font-body" style={{ color: 'var(--color-neutral-700)' }}>
                  {brewery.phone}
                </span>
              </div>
            )}
            
            {brewery.website && (
              <div className="flex items-center">
                <FiGlobe 
                  className="w-4 h-4 mr-3"
                  style={{ color: 'var(--color-neutral-500)' }}
                />
                <a 
                  href={brewery.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body underline"
                  style={{ color: 'var(--color-primary-600)' }}
                >
                  ウェブサイトを見る
                </a>
              </div>
            )}
            
            {brewery.hours && (
              <div>
                <div className="flex items-center mb-2">
                  <FiClock 
                    className="w-4 h-4 mr-3"
                    style={{ color: 'var(--color-neutral-500)' }}
                  />
                  <span 
                    className="font-accent font-medium"
                    style={{ color: 'var(--color-neutral-800)' }}
                  >
                    営業時間
                  </span>
                </div>
                <div className="ml-7 space-y-1">
                  {Object.entries(brewery.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span 
                        className="font-body text-sm"
                        style={{ color: 'var(--color-neutral-600)' }}
                      >
                        {day}曜日
                      </span>
                      <span 
                        className="font-body text-sm"
                        style={{ color: 'var(--color-neutral-700)' }}
                      >
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkin Modal */}
      {brewery && (
        <CheckinModal
          isOpen={showCheckinModal}
          onClose={() => setShowCheckinModal(false)}
          brewery={brewery}
          onCheckin={handleCheckin}
          nearbyRoutes={activeRoutes}
        />
      )}
    </div>
  );
};

export default BreweryDetailsPage;