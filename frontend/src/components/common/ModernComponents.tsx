/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/common/ModernComponents.tsx
 *
 * 作成者: Claude Code
 * 作成日: 2025-06-11
 * 最終更新日: 2025-06-11
 * バージョン: 2.0
 *
 * 説明:
 * 2024-2025 UI/UXトレンドに完全準拠した共通UIコンポーネント集
 * Dark Mode First、Glassmorphism、Bold Typography、Micro-interactions実装
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography, effects, animations, spacing, borderRadius } from '../../styles/design-system';

// 2025 Modern Button Component with Glassmorphism & Micro-interactions
interface ModernButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  theme?: 'light' | 'dark';
  onClick?: () => void;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  theme,
  onClick
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const currentTheme = theme || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
  
  const baseStyles = `
    inline-flex items-center justify-center
    font-heading rounded-2xl
    transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
    ${fullWidth ? 'w-full' : ''}
  `;

  const sizeStyles = {
    sm: 'px-5 py-2.5 text-sm min-h-[40px] font-semibold',
    md: 'px-6 py-3 text-base min-h-[48px] font-bold',
    lg: 'px-8 py-4 text-lg min-h-[56px] font-extrabold',
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-amber-500 to-amber-600
      text-black
      hover:from-amber-600 hover:to-amber-700
      focus:ring-amber-500
      shadow-lg hover:shadow-xl
      transform hover:-translate-y-0.5
    `,
    secondary: currentTheme === 'dark' ? `
      bg-gray-800 text-gray-100
      border border-gray-700
      hover:bg-gray-700 hover:border-gray-600
      focus:ring-gray-500
    ` : `
      bg-white text-gray-900
      border border-gray-300
      hover:bg-gray-50 hover:border-gray-400
      focus:ring-gray-500
    `,
    ghost: currentTheme === 'dark' ? `
      bg-transparent text-gray-100
      hover:bg-white/10
      focus:ring-gray-500
    ` : `
      bg-transparent text-gray-700
      hover:bg-black/5
      focus:ring-gray-500
    `,
    glass: `
      backdrop-filter backdrop-blur-16
      ${currentTheme === 'dark' 
        ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
        : 'bg-black/10 text-gray-900 border border-black/20 hover:bg-black/20'
      }
      focus:ring-amber-500
      shadow-lg hover:shadow-xl
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600
      focus:ring-red-500
      shadow-lg hover:shadow-xl
    `,
  };

  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      style={{
        transition: `all ${animations.duration.normal} ${animations.easing.appleInOut}`,
        letterSpacing: typography.letterSpacing.wide
      }}
      whileHover={!disabled && !loading ? { 
        scale: 1.02,
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
      } : undefined}
      whileTap={!disabled && !loading ? { 
        scale: 0.96,
        transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] }
      } : undefined}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {/* Shimmer effect for glass variant */}
      {variant === 'glass' && (
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)'
          }}
        />
      )}
      
      {/* Modern Skeuomorphism shadow for primary */}
      {variant === 'primary' && isPressed && (
        <div className="absolute inset-0 shadow-inner opacity-20 bg-black rounded-2xl" />
      )}
      
      {loading ? (
        <motion.div
          data-testid="loading-spinner"
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <>
          {icon && <motion.span 
            className="mr-2"
            animate={{ rotate: isPressed ? 15 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >{icon}</motion.span>}
          <span style={{ fontWeight: typography.fontWeight[size === 'lg' ? 'black' : size === 'md' ? 'bold' : 'semibold'] }}>
            {children}
          </span>
        </>
      )}
    </motion.button>
  );
};

// 2025 Modern Card Component with Glassmorphism
interface ModernCardProps {
  children: ReactNode;
  elevated?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
  glassIntensity?: 'subtle' | 'medium' | 'strong';
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  elevated = false,
  interactive = false,
  padding = 'md',
  glass = true, // Glassmorphism by default in 2025
  glassIntensity = 'medium',
  theme,
  className = '',
  onClick
}) => {
  const currentTheme = theme || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
  const [isHovered, setIsHovered] = useState(false);
  
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Get glassmorphism styles from design system
  const glassStyles = glass ? effects.glassmorphism[currentTheme][glassIntensity] : {};

  const baseStyles = `
    rounded-3xl overflow-hidden
    ${!glass && currentTheme === 'dark' ? 'bg-gray-900' : !glass ? 'bg-white' : ''}
    ${elevated ? 'shadow-2xl' : 'shadow-lg'}
    ${interactive ? 'cursor-pointer transform transition-all' : ''}
    ${paddingStyles[padding]}
  `;

  return (
    <motion.div
      data-testid="modern-card"
      className={`${baseStyles} ${className}`}
      style={glass ? {
        ...glassStyles,
        transition: `all ${animations.duration.normal} ${animations.easing.appleInOut}`
      } : {}}
      whileHover={interactive ? { 
        y: -6,
        scale: 1.01,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      } : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Gradient overlay for depth */}
      {glass && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: currentTheme === 'dark' 
              ? 'radial-gradient(circle at 30% 20%, rgba(185, 127, 36, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 30% 20%, rgba(185, 127, 36, 0.05) 0%, transparent 50%)'
          }}
        />
      )}
      
      {/* Content with relative positioning */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Hover glow effect */}
      <AnimatePresence>
        {interactive && isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              boxShadow: '0 20px 40px rgba(185, 127, 36, 0.2)'
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 2025 Modern Bottom Sheet Component with Glassmorphism
interface ModernBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  height?: 'auto' | 'half' | 'full';
  glass?: boolean;
  theme?: 'light' | 'dark';
}

export const ModernBottomSheet: React.FC<ModernBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
  glass = true,
  theme
}) => {
  const currentTheme = theme || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
  
  const heightStyles = {
    auto: 'max-h-[85vh]',
    half: 'h-1/2',
    full: 'h-full',
  };

  const sheetStyles = glass ? {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background: currentTheme === 'dark' 
      ? 'rgba(26, 26, 26, 0.95)' 
      : 'rgba(255, 255, 255, 0.95)',
    borderTop: `1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
    boxShadow: '0 -20px 50px rgba(0, 0, 0, 0.3)'
  } : {
    backgroundColor: currentTheme === 'dark' ? '#1a1a1a' : '#ffffff'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="bottom-sheet-container"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            data-testid="bottom-sheet-backdrop"
            className="absolute inset-0"
            style={{
              backgroundColor: currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={onClose}
          />
          
          {/* Sheet with Glassmorphism */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 rounded-t-3xl ${heightStyles[height]} overflow-hidden`}
            style={sheetStyles}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: "spring", 
              damping: 32, 
              stiffness: 350,
              mass: 0.8
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.velocity.y > 500 || info.offset.y > 100) {
                onClose();
              }
            }}
          >
            {/* Handle with glass effect */}
            <div className="flex justify-center pt-4 pb-3">
              <motion.button
                data-testid="bottom-sheet-close"
                onClick={onClose}
                className="w-14 h-5 flex items-center justify-center focus:outline-none touch-manipulation"
                whileTap={{ scale: 0.9 }}
              >
                <div 
                  className="w-12 h-1.5 rounded-full"
                  style={{
                    backgroundColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
                  }}
                />
              </motion.button>
            </div>
            
            {/* Header with Bold Typography */}
            {title && (
              <div 
                className="px-6 pb-4 border-b"
                style={{
                  borderColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <h3 
                  className="font-display"
                  style={{
                    fontSize: typography.fontSize['2xl'],
                    fontWeight: typography.fontWeight.bold,
                    color: 'var(--color-text-primary)'
                  }}
                >{title}</h3>
              </div>
            )}
            
            {/* Content with custom scrollbar */}
            <div 
              className="overflow-y-auto p-6 pb-safe custom-scrollbar"
              style={{
                color: 'var(--color-text-primary)'
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 2025 Modern Tab Component with Glassmorphism
interface ModernTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
  }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline' | 'glass';
  theme?: 'light' | 'dark';
}

export const ModernTabs: React.FC<ModernTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'glass',
  theme
}) => {
  const currentTheme = theme || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
  
  const containerStyles = {
    pills: currentTheme === 'dark' 
      ? 'p-1 bg-gray-800 rounded-2xl' 
      : 'p-1 bg-gray-100 rounded-2xl',
    underline: `border-b ${currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`,
    glass: ''
  };

  const glassContainerStyle = variant === 'glass' ? {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    background: currentTheme === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.05)',
    border: `1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    borderRadius: borderRadius['2xl'],
    padding: '4px'
  } : {};
  
  return (
    <div 
      role="tablist"
      className={`flex ${containerStyles[variant]}`}
      style={glassContainerStyle}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2
              font-heading transition-all
              ${variant === 'glass' ? 'rounded-xl px-4 py-3' : variant === 'pills' ? 'rounded-xl px-4 py-2' : 'px-4 py-3'}
              ${isActive && variant !== 'underline' ? 'relative z-10' : ''}
            `}
            style={{
              fontWeight: isActive ? typography.fontWeight.bold : typography.fontWeight.medium,
              fontSize: isActive ? '0.95rem' : '0.875rem',
              letterSpacing: isActive ? typography.letterSpacing.wide : typography.letterSpacing.normal,
              color: isActive 
                ? currentTheme === 'dark' ? colors.primary[300] : colors.primary[500]
                : 'var(--color-text-secondary)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {/* Active background with glassmorphism */}
            {isActive && variant !== 'underline' && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                layoutId={`activeTab-${variant}`}
                style={{
                  background: variant === 'glass'
                    ? currentTheme === 'dark' 
                      ? 'linear-gradient(135deg, rgba(185, 127, 36, 0.2) 0%, rgba(185, 127, 36, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(185, 127, 36, 0.15) 0%, rgba(185, 127, 36, 0.05) 100%)'
                    : currentTheme === 'dark' ? '#2a2a2a' : '#ffffff',
                  boxShadow: variant === 'glass' 
                    ? '0 4px 20px rgba(185, 127, 36, 0.2)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: variant === 'glass' 
                    ? `1px solid ${currentTheme === 'dark' ? 'rgba(185, 127, 36, 0.3)' : 'rgba(185, 127, 36, 0.2)'}`
                    : 'none'
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-2">
              {tab.icon && (
                <motion.span 
                  className="text-lg"
                  animate={{ rotate: isActive ? 360 : 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {tab.icon}
                </motion.span>
              )}
              <span style={{ textTransform: isActive ? 'uppercase' : 'none' }}>
                {tab.label}
              </span>
            </div>
            
            {/* Underline indicator */}
            {variant === 'underline' && isActive && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: colors.primary[500] }}
                layoutId="activeTab-underline"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

// 2025 Modern List Item Component with Micro-interactions
interface ModernListItemProps {
  title: string;
  subtitle?: string;
  leadingIcon?: ReactNode;
  trailingContent?: ReactNode;
  onClick?: () => void;
  glass?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export const ModernListItem: React.FC<ModernListItemProps> = ({
  title,
  subtitle,
  leadingIcon,
  trailingContent,
  onClick,
  glass = false,
  theme,
  className = ''
}) => {
  const currentTheme = theme || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
  const [isPressed, setIsPressed] = useState(false);
  
  const itemStyles = glass ? {
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    background: currentTheme === 'dark' 
      ? 'rgba(255, 255, 255, 0.03)' 
      : 'rgba(0, 0, 0, 0.02)',
    border: `1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
  } : {};
  
  return (
    <motion.div
      data-testid="modern-list-item"
      className={`
        flex items-center p-4 rounded-2xl
        ${onClick ? 'cursor-pointer' : ''} 
        ${className}
      `}
      style={{
        ...itemStyles,
        transition: `all ${animations.duration.fast} ${animations.easing.appleInOut}`,
        backgroundColor: !glass && onClick && isPressed 
          ? currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
          : 'transparent'
      }}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={onClick ? { 
        scale: 1.01,
        backgroundColor: glass ? undefined : currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)'
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {leadingIcon && (
        <motion.div 
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center mr-4"
          animate={{ rotate: isPressed ? 15 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            color: colors.primary[currentTheme === 'dark' ? 300 : 500]
          }}
        >
          {leadingIcon}
        </motion.div>
      )}
      
      <div className="flex-1 min-w-0">
        <h4 
          className="text-base font-heading truncate"
          style={{
            fontWeight: typography.fontWeight.bold,
            color: 'var(--color-text-primary)'
          }}
        >
          {title}
        </h4>
        {subtitle && (
          <p 
            className="text-sm truncate"
            style={{
              color: 'var(--color-text-secondary)',
              fontWeight: typography.fontWeight.medium
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      
      {trailingContent && (
        <motion.div 
          className="flex-shrink-0 ml-4"
          animate={{ x: isPressed ? -2 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {trailingContent}
        </motion.div>
      )}
    </motion.div>
  );
};

// 2025 Modern Floating Action Button with Modern Skeuomorphism
interface ModernFABProps {
  icon: ReactNode;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  extended?: boolean;
  label?: string;
  onClick?: () => void;
  glass?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export const ModernFAB: React.FC<ModernFABProps> = ({
  icon,
  position = 'bottom-right',
  extended = false,
  label,
  glass = false,
  theme,
  className = '',
  onClick
}) => {
  const currentTheme = theme || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
  const [isPressed, setIsPressed] = useState(false);
  
  const positionStyles = {
    'bottom-right': 'bottom-20 right-6', // Adjusted for bottom nav
    'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-20 left-6',
  };

  const fabStyles = glass ? {
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    background: currentTheme === 'dark' 
      ? 'rgba(185, 127, 36, 0.2)' 
      : 'rgba(185, 127, 36, 0.15)',
    border: `2px solid ${currentTheme === 'dark' ? 'rgba(185, 127, 36, 0.4)' : 'rgba(185, 127, 36, 0.3)'}`,
    boxShadow: `
      0 20px 40px rgba(185, 127, 36, 0.3),
      inset 0 2px 4px rgba(255, 255, 255, 0.2),
      inset 0 -2px 4px rgba(0, 0, 0, 0.1)
    `
  } : {
    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
    boxShadow: `
      0 10px 30px rgba(185, 127, 36, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.3),
      inset 0 -2px 4px rgba(0, 0, 0, 0.2)
    `
  };

  return (
    <motion.button
      className={`
        fixed ${positionStyles[position]}
        ${extended ? 'px-8 py-4' : 'w-16 h-16'}
        rounded-full
        flex items-center justify-center gap-3
        focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-amber-500
        z-40
        ${className}
      `}
      style={{
        ...fabStyles,
        color: glass 
          ? currentTheme === 'dark' ? colors.primary[300] : colors.primary[700]
          : '#000000',
        transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
        transition: `all ${animations.duration.fast} ${animations.easing.appleInOut}`
      }}
      whileHover={{ 
        scale: 1.08,
        boxShadow: glass 
          ? '0 25px 50px rgba(185, 127, 36, 0.4)'
          : '0 15px 40px rgba(185, 127, 36, 0.5)'
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {/* Modern Skeuomorphism inner shadow when pressed */}
      {isPressed && (
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
        />
      )}
      
      {/* Icon with rotation animation */}
      <motion.div
        animate={{ rotate: isPressed ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {icon}
      </motion.div>
      
      {extended && label && (
        <span 
          className="font-heading"
          style={{
            fontWeight: typography.fontWeight.bold,
            letterSpacing: typography.letterSpacing.wide,
            textTransform: 'uppercase'
          }}
        >
          {label}
        </span>
      )}
    </motion.button>
  );
};

// 2025 Modern Loading Skeleton with Glassmorphism
interface ModernSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: boolean;
  glass?: boolean;
  theme?: 'light' | 'dark';
}

export const ModernSkeleton: React.FC<ModernSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = true,
  glass = true,
  theme
}) => {
  const currentTheme = theme || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
  
  const variantStyles = {
    text: 'h-4 rounded-lg',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
  };

  const dimensions = {
    width: width || (variant === 'circular' ? '48px' : '100%'),
    height: height || (variant === 'circular' ? '48px' : variant === 'rectangular' ? '200px' : '20px'),
  };

  const skeletonStyles = glass ? {
    background: currentTheme === 'dark'
      ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%)'
      : 'linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.05) 100%)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    border: `1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
    backgroundSize: '200% 100%'
  } : {
    backgroundColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    backgroundImage: `linear-gradient(
      90deg,
      transparent 0%,
      ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'} 50%,
      transparent 100%
    )`,
    backgroundSize: '200% 100%'
  };

  return (
    <motion.div
      data-testid="skeleton"
      className={`${variantStyles[variant]} ${className}`}
      style={{
        ...dimensions,
        ...skeletonStyles,
        position: 'relative',
        overflow: 'hidden'
      }}
      animate={animation ? {
        backgroundPosition: ['200% 0', '-200% 0']
      } : undefined}
      transition={animation ? {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      } : undefined}
    >
      {/* Shimmer effect overlay */}
      {animation && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              90deg,
              transparent 30%,
              ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'} 50%,
              transparent 70%
            )`,
            transform: 'skewX(-20deg)'
          }}
          animate={{
            x: ['-200%', '200%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

// 2025 Modern Beer Indicator with 3D Glass Effect
interface ModernBeerIndicatorProps {
  label: string;
  value: number | string;
  unit: string;
  type?: 'abv' | 'ibu' | 'rating' | 'custom';
  icon?: ReactNode;
  glass?: boolean;
  theme?: 'light' | 'dark';
}

export const ModernBeerIndicator: React.FC<ModernBeerIndicatorProps> = ({
  label,
  value,
  unit,
  type = 'custom',
  icon,
  glass = true,
  theme
}) => {
  const currentTheme = theme || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
  const [isHovered, setIsHovered] = useState(false);
  
  // Type-based color schemes
  const typeColors = {
    abv: { start: colors.primary[400], end: colors.primary[600] },
    ibu: { start: colors.secondary[400], end: colors.secondary[600] },
    rating: { start: colors.accent[400], end: colors.accent[600] },
    custom: { start: colors.primary[300], end: colors.primary[500] }
  };

  const indicatorStyles = glass ? {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    background: currentTheme === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(255, 255, 255, 0.8)',
    border: `1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
    boxShadow: isHovered 
      ? '0 8px 32px rgba(185, 127, 36, 0.2)'
      : '0 4px 16px rgba(0, 0, 0, 0.1)'
  } : {
    backgroundColor: currentTheme === 'dark' ? '#1a1a1a' : '#f9f9f9',
    border: `1px solid ${currentTheme === 'dark' ? '#333333' : '#e5e5e5'}`,
  };

  return (
    <motion.div 
      className="flex items-center justify-between p-4 rounded-2xl"
      style={{
        ...indicatorStyles,
        transition: `all ${animations.duration.normal} ${animations.easing.appleInOut}`,
        position: 'relative',
        overflow: 'hidden'
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* 3D Beer glass gradient background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${typeColors[type].start} 0%, ${typeColors[type].end} 100%)`,
          filter: 'blur(20px)'
        }}
        animate={isHovered ? { opacity: 0.2 } : { opacity: 0.1 }}
      />
      
      <div className="flex items-center gap-3 relative z-10">
        {icon && (
          <motion.div 
            className="w-10 h-10 flex items-center justify-center rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${typeColors[type].start} 0%, ${typeColors[type].end} 100%)`,
              color: currentTheme === 'dark' ? '#000000' : '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {icon}
          </motion.div>
        )}
        <span 
          className="font-heading"
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: 'var(--color-text-secondary)',
            letterSpacing: typography.letterSpacing.wide,
            textTransform: 'uppercase'
          }}
        >
          {label}
        </span>
      </div>
      
      <div className="text-right relative z-10">
        <motion.span 
          className="font-display"
          style={{
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.black,
            background: `linear-gradient(135deg, ${typeColors[type].start} 0%, ${typeColors[type].end} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {value}
        </motion.span>
        <span 
          className="ml-1"
          style={{
            fontSize: typography.fontSize.sm,
            color: 'var(--color-text-tertiary)',
            fontWeight: typography.fontWeight.medium
          }}
        >
          {unit}
        </span>
      </div>
    </motion.div>
  );
};

// 2025 Custom CSS for scrollbar styling
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(185, 127, 36, 0.3);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(185, 127, 36, 0.5);
  }
`;

// Inject custom styles
if (typeof document !== 'undefined' && !document.getElementById('modern-components-styles')) {
  const style = document.createElement('style');
  style.id = 'modern-components-styles';
  style.textContent = customScrollbarStyles;
  document.head.appendChild(style);
}

export default {
  ModernButton,
  ModernCard,
  ModernBottomSheet,
  ModernTabs,
  ModernListItem,
  ModernFAB,
  ModernSkeleton,
  ModernBeerIndicator,
};