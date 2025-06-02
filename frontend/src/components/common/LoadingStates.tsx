import React from 'react';
import { colors, animations } from '../../styles/design-system';

/**
 * ビールグラスのローディングアニメーション
 */
export const BeerGlassLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 'w-16 h-20',
    md: 'w-24 h-32',
    lg: 'w-32 h-40'
  };

  return (
    <div className={`relative ${sizeMap[size]} animate-pulse`}>
      {/* グラス本体 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 rounded-b-3xl opacity-20" />
      
      {/* ビールの注がれるアニメーション */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-amber-400 rounded-b-3xl"
        style={{
          animation: `pour ${animations.duration.pour} ${animations.pour} infinite`,
          height: '0%',
        }}
      />
      
      {/* 泡のアニメーション */}
      <div className="absolute top-0 left-0 right-0 h-1/4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-60"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              animation: `bubble ${Math.random() * 2 + 1}s ${animations.bubble} infinite`,
              animationDelay: `${Math.random() * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * スケルトンローディング for ブルワリーカード
 */
export const BreweryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
      {/* 画像プレースホルダー */}
      <div className="h-48 bg-gray-800 rounded-xl mb-4" />
      
      {/* タイトル */}
      <div className="h-6 bg-gray-800 rounded w-3/4 mb-2" />
      
      {/* 評価 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 w-4 bg-gray-800 rounded-full" />
        <div className="h-4 bg-gray-800 rounded w-16" />
      </div>
      
      {/* 説明文 */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-800 rounded w-5/6" />
      </div>
      
      {/* ボタン */}
      <div className="mt-4 h-10 bg-gray-800 rounded-lg" />
    </div>
  );
};

/**
 * ビールタップリストのスケルトン
 */
export const TaplistSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-lg animate-pulse">
          {/* ビール番号 */}
          <div className="w-10 h-10 bg-gray-800 rounded-full" />
          
          {/* ビール情報 */}
          <div className="flex-1">
            <div className="h-5 bg-gray-800 rounded w-2/3 mb-2" />
            <div className="h-3 bg-gray-800 rounded w-1/3" />
          </div>
          
          {/* ABV */}
          <div className="h-4 bg-gray-800 rounded w-12" />
        </div>
      ))}
    </div>
  );
};

/**
 * プログレスローダー（ビール注ぎアニメーション付き）
 */
export const BeerPourProgress: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="relative w-full h-8 bg-gray-900/50 rounded-full overflow-hidden">
      {/* 背景グラス */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700" />
      </div>
      
      {/* ビール（プログレス） */}
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-full transition-all duration-500"
        style={{ 
          width: `${progress}%`,
          transition: `width ${animations.duration.pour} ${animations.pour}`
        }}
      >
        {/* 泡のエフェクト */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent" />
      </div>
      
      {/* パーセンテージ表示 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white drop-shadow-lg">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

/**
 * 空状態のイラスト
 */
export const EmptyBeerGlass: React.FC<{ message?: string }> = ({ message = "No beers found" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* 空のビールグラス */}
      <div className="relative w-32 h-40 mb-6">
        <svg viewBox="0 0 128 160" className="w-full h-full">
          {/* グラス */}
          <path
            d="M32 40 Q32 20 48 20 L80 20 Q96 20 96 40 L88 140 Q88 150 80 150 L48 150 Q40 150 40 140 Z"
            fill="none"
            stroke={colors.brewery[800]}
            strokeWidth="3"
            className="opacity-50"
          />
          
          {/* 悲しい顔 */}
          <circle cx="50" cy="80" r="3" fill={colors.brewery[800]} className="opacity-50" />
          <circle cx="78" cy="80" r="3" fill={colors.brewery[800]} className="opacity-50" />
          <path
            d="M50 100 Q64 90 78 100"
            fill="none"
            stroke={colors.brewery[800]}
            strokeWidth="2"
            className="opacity-50"
          />
        </svg>
      </div>
      
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};

// CSSアニメーション定義
const styles = `
  @keyframes pour {
    0% { height: 0%; }
    100% { height: 80%; }
  }
  
  @keyframes bubble {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translateY(-20px) scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: translateY(-40px) scale(0.8);
      opacity: 0;
    }
  }
`;

// スタイルを挿入
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default {
  BeerGlassLoader,
  BreweryCardSkeleton,
  TaplistSkeleton,
  BeerPourProgress,
  EmptyBeerGlass
};