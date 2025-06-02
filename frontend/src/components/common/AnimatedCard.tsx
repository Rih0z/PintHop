import React from 'react';
import { motion } from 'framer-motion';
import { colors, animations, effects } from '../../styles/design-system';

interface AnimatedCardProps {
  children: React.ReactNode;
  variant?: 'beer' | 'brewery' | 'glass';
  hoverable?: boolean;
  clickable?: boolean;
  glassEffect?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * アニメーション付きカードコンポーネント
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  variant = 'beer',
  hoverable = true,
  clickable = false,
  glassEffect = false,
  className = '',
  onClick
}) => {
  const baseClasses = `
    relative overflow-hidden rounded-2xl
    ${glassEffect ? 'backdrop-blur-md bg-white/10' : 'bg-gray-900/80'}
    ${clickable ? 'cursor-pointer' : ''}
    ${className}
  `;

  const variants = {
    beer: {
      rest: { scale: 1, rotateY: 0 },
      hover: { 
        scale: 1.02, 
        rotateY: 5,
        transition: { duration: 0.3, ease: animations.lift }
      },
      tap: { scale: 0.98 }
    },
    brewery: {
      rest: { y: 0, boxShadow: effects.shadow.md },
      hover: { 
        y: -4, 
        boxShadow: effects.shadow.xl,
        transition: { duration: 0.3, ease: animations.pour }
      },
      tap: { y: 0, scale: 0.98 }
    },
    glass: {
      rest: { scale: 1, rotateX: 0 },
      hover: { 
        scale: 1.05, 
        rotateX: -10,
        transition: { duration: 0.4, ease: animations.bubble }
      },
      tap: { scale: 0.95 }
    }
  };

  return (
    <motion.div
      className={baseClasses}
      variants={variants[variant]}
      initial="rest"
      whileHover={hoverable ? "hover" : undefined}
      whileTap={clickable ? "tap" : undefined}
      onClick={onClick}
    >
      <>
        {/* グラスエフェクトのオーバーレイ */}
        {glassEffect && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {children}
        
        {/* ビールバリアントの泡エフェクト */}
        {variant === 'beer' && (
          <motion.div
            className="absolute -top-2 -right-2 w-16 h-16 bg-white/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </>
    </motion.div>
  );
};

/**
 * ビール評価スター（アニメーション付き）
 */
export const AnimatedBeerRating: React.FC<{
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}> = ({ rating, maxRating = 5, size = 'md', interactive = false, onChange }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const isFilled = index < rating;
        const isHalf = index === Math.floor(rating) && rating % 1 !== 0;

        return (
          <motion.div
            key={index}
            className={`relative ${sizeMap[size]} ${interactive ? 'cursor-pointer' : ''}`}
            whileHover={interactive ? { scale: 1.2 } : undefined}
            whileTap={interactive ? { scale: 0.9 } : undefined}
            onClick={() => interactive && onChange?.(index + 1)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 500,
              damping: 25
            }}
          >
            {/* ビールグラスアイコン */}
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                d="M5 12V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5a7 7 0 0 1-7 7 7 7 0 0 1-7-7z"
                fill={isFilled ? colors.beer.amber[500] : 'none'}
                stroke={colors.beer.amber[500]}
                strokeWidth="2"
                className="transition-all duration-300"
              />
              {/* 泡 */}
              <path
                d="M6 6h12a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2z"
                fill={isFilled ? colors.foam[200] : 'none'}
                stroke={colors.foam[200]}
                strokeWidth="1"
                className="transition-all duration-300"
              />
              {/* ハーフレーティング */}
              {isHalf && (
                <clipPath id={`half-${index}`}>
                  <rect x="0" y="0" width="12" height="24" />
                </clipPath>
              )}
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

/**
 * タップボタン（ビールタップ風）
 */
export const BeerTapButton: React.FC<{
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', size = 'md', disabled = false }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: `bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700`,
    secondary: `bg-gradient-to-br from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900`,
    ghost: `bg-transparent text-amber-500 hover:bg-amber-500/10`
  };

  return (
    <motion.button
      className={`
        relative font-semibold rounded-lg transition-colors
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={(e) => onClick?.(e)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: animations.pour }}
    >
      {/* タップハンドルのような装飾 */}
      {variant === 'primary' && (
        <motion.div
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-800 rounded-full"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {children}
      
      {/* クリック時の波紋エフェクト */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{
          scale: 2,
          opacity: 0,
          transition: { duration: 0.5 }
        }}
        style={{ backgroundColor: colors.foam[100] }}
      />
    </motion.button>
  );
};

/**
 * フローティングアクションボタン（ビールジョッキ風）
 */
export const BeerFAB: React.FC<{
  onClick?: () => void;
  icon?: React.ReactNode;
}> = ({ onClick, icon }) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-2xl flex items-center justify-center"
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {icon || (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
        </svg>
      )}
      
      {/* 泡のアニメーション */}
      <motion.div
        className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full"
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};

export default {
  AnimatedCard,
  AnimatedBeerRating,
  BeerTapButton,
  BeerFAB
};