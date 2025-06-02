import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedCard, AnimatedBeerRating, BeerTapButton } from '../common/AnimatedCard';
import { BeerGlassLoader } from '../common/LoadingStates';
import { colors, animations, effects } from '../../styles/design-system';

interface Brewery {
  id: string;
  name: string;
  description?: string;
  address?: {
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
  specialtyStyles?: Array<{ style: string; rating: number }>;
}

interface OptimizedBreweryCardProps {
  brewery: Brewery;
  onCheckIn?: () => void;
  showPresence?: boolean;
}

export const OptimizedBreweryCard: React.FC<OptimizedBreweryCardProps> = ({
  brewery,
  onCheckIn,
  showPresence = true
}) => {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // 平均評価を計算
  const getAverageRating = () => {
    const ratings = brewery.ratings || {};
    const scores = Object.values(ratings)
      .map(r => r?.score)
      .filter(score => score !== undefined && score !== null);
    
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const averageRating = getAverageRating();

  return (
    <AnimatedCard
      variant="brewery"
      hoverable
      clickable
      glassEffect
      onClick={() => navigate(`/brewery/${brewery.id}`)}
      className="p-0 overflow-hidden"
    >
      {/* 画像セクション */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <BeerGlassLoader size="sm" />
          </div>
        )}
        
        {!imageError && brewery.photos?.[0] && (
          <motion.img
            src={brewery.photos[0]}
            alt={brewery.name}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        
        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* ライブインジケーター */}
        {showPresence && brewery.currentVisitors && brewery.currentVisitors > 0 && (
          <motion.div
            className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white text-sm font-medium">
              {brewery.currentVisitors} here now
            </span>
          </motion.div>
        )}
        
        {/* 現在のタップ数 */}
        {brewery.currentTaps && (
          <motion.div
            className="absolute bottom-4 left-4 bg-amber-600/90 backdrop-blur-sm rounded-lg px-3 py-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-white text-sm font-bold">
              {brewery.currentTaps} beers on tap
            </span>
          </motion.div>
        )}
      </div>
      
      {/* コンテンツセクション */}
      <div className="p-6">
        {/* ヘッダー */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {brewery.name}
          </h3>
          
          {/* 評価 */}
          {averageRating > 0 && (
            <AnimatedBeerRating
              rating={averageRating}
              size="sm"
              interactive={false}
            />
          )}
          
          {/* 住所 */}
          {brewery.address && (
            <p className="text-sm text-gray-400 mt-2">
              {brewery.address.city && brewery.address.state
                ? `${brewery.address.city}, ${brewery.address.state}`
                : brewery.address.street}
            </p>
          )}
        </div>
        
        {/* 説明文 */}
        {brewery.description && (
          <p className="text-gray-300 text-sm line-clamp-2 mb-4">
            {brewery.description}
          </p>
        )}
        
        {/* スペシャルティスタイル */}
        {brewery.specialtyStyles && brewery.specialtyStyles.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Specialties:</p>
            <div className="flex flex-wrap gap-1">
              {brewery.specialtyStyles.slice(0, 3).map((specialty, index) => (
                <motion.span
                  key={specialty.style}
                  className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {specialty.style}
                </motion.span>
              ))}
            </div>
          </div>
        )}
        
        {/* アクションボタン */}
        <div className="flex gap-2">
          <BeerTapButton
            variant="primary"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              navigate(`/brewery/${brewery.id}`);
            }}
          >
            View Details
          </BeerTapButton>
          
          {onCheckIn && (
            <BeerTapButton
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onCheckIn();
              }}
            >
              Check In
            </BeerTapButton>
          )}
        </div>
      </div>
      
      {/* ホバー時のビールアニメーション */}
      <AnimatePresence>
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 pointer-events-none"
          initial={{ rotate: -45, opacity: 0 }}
          whileHover={{ rotate: 0, opacity: 0.1 }}
          transition={{ duration: 0.5 }}
        >
          {/* ビールグラスのシルエット */}
          <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-500">
            <path d="M30 20 Q30 10 40 10 L60 10 Q70 10 70 20 L65 70 Q65 80 55 80 L45 80 Q35 80 35 70 Z" />
          </svg>
        </motion.div>
      </AnimatePresence>
    </AnimatedCard>
  );
};

/**
 * ブルワリーリストビュー用の最適化されたカード
 */
export const BreweryListItem: React.FC<{
  brewery: Brewery;
  onClick?: () => void;
  selected?: boolean;
}> = ({ brewery, onClick, selected = false }) => {
  const averageRating = brewery.ratings
    ? Object.values(brewery.ratings)
        .map(r => r?.score)
        .filter(s => s)
        .reduce((sum, score, _, arr) => sum + score / arr.length, 0)
    : 0;

  return (
    <motion.div
      className={`
        p-4 rounded-xl cursor-pointer transition-all
        ${selected ? 'bg-amber-500/20 border-amber-500' : 'bg-gray-900/50 border-gray-800'}
        border hover:border-amber-500/50
      `}
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        {/* サムネイル */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
          {brewery.photos?.[0] ? (
            <img
              src={brewery.photos[0]}
              alt={brewery.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* 情報 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{brewery.name}</h4>
          <p className="text-sm text-gray-400">
            {brewery.address?.city || 'Location unknown'}
          </p>
          {averageRating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <div className="w-4 h-4 text-amber-500">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-sm text-amber-500 font-medium">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        {/* ステータスインジケーター */}
        <div className="flex items-center gap-2">
          {brewery.currentVisitors && brewery.currentVisitors > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">{brewery.currentVisitors}</span>
            </div>
          )}
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default {
  OptimizedBreweryCard,
  BreweryListItem
};