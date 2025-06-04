/**
 * Modern UI Components
 * Mobile-first, Netflix/Uber inspired components
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { modernColors, modernComponents, modernShadows, modernAnimations, modernSpacing } from '../../styles/modern-design-system';

// Modern Button Component
interface ModernButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
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
  onClick
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-150 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-5 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]',
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-amber-500 to-amber-600
      text-black font-medium
      hover:from-amber-600 hover:to-amber-700
      focus:ring-amber-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-100 text-gray-900
      border border-gray-300
      hover:bg-gray-200 hover:border-gray-400
      focus:ring-gray-500
    `,
    ghost: `
      bg-transparent text-gray-700
      hover:bg-gray-100
      focus:ring-gray-500
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600
      focus:ring-red-500
    `,
  };

  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <motion.div
          data-testid="loading-spinner"
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

// Modern Card Component
interface ModernCardProps {
  children: ReactNode;
  elevated?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  elevated = false,
  interactive = false,
  padding = 'md',
  glass = false,
  className = '',
  onClick
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseStyles = `
    bg-white rounded-2xl overflow-hidden
    ${elevated ? 'shadow-lg' : 'shadow-sm'}
    ${interactive ? 'cursor-pointer hover:shadow-xl transform transition-all duration-250' : ''}
    ${glass ? 'bg-white/80 backdrop-blur-lg' : ''}
    ${paddingStyles[padding]}
  `;

  return (
    <motion.div
      data-testid="modern-card"
      className={`${baseStyles} ${className}`}
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ duration: 0.25 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Modern Bottom Sheet Component (Mobile-first)
interface ModernBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  height?: 'auto' | 'half' | 'full';
}

export const ModernBottomSheet: React.FC<ModernBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
}) => {
  const heightStyles = {
    auto: 'max-h-[85vh]',
    half: 'h-1/2',
    full: 'h-full',
  };

  return (
    <motion.div
      data-testid="bottom-sheet-container"
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
    >
      {/* Backdrop */}
      <motion.div
        data-testid="bottom-sheet-backdrop"
        className="absolute inset-0 bg-black"
        variants={{
          open: { opacity: 0.5 },
          closed: { opacity: 0 }
        }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl ${heightStyles[height]} overflow-hidden`}
        variants={{
          open: { y: 0 },
          closed: { y: '100%' }
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <button
            data-testid="bottom-sheet-close"
            onClick={onClose}
            className="w-12 h-4 flex items-center justify-center focus:outline-none"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </button>
        </div>
        
        {/* Header */}
        {title && (
          <div className="px-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto p-6 pb-safe">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Modern Tab Component
interface ModernTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
  }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline';
}

export const ModernTabs: React.FC<ModernTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
}) => {
  return (
    <div 
      role="tablist"
      className={`flex ${variant === 'pills' ? 'p-1 bg-gray-100 rounded-lg' : 'border-b border-gray-200'}`}
    >
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex-1 flex items-center justify-center gap-2
            font-medium transition-all duration-200
            ${variant === 'pills' 
              ? `px-4 py-2 rounded-md ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`
              : `px-4 py-3 relative ${activeTab === tab.id ? 'text-amber-600' : 'text-gray-600'}`
            }
          `}
          whileTap={{ scale: 0.98 }}
        >
          {tab.icon && <span className="text-lg">{tab.icon}</span>}
          <span>{tab.label}</span>
          
          {variant === 'underline' && activeTab === tab.id && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

// Modern List Item Component
interface ModernListItemProps {
  title: string;
  subtitle?: string;
  leadingIcon?: ReactNode;
  trailingContent?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ModernListItem: React.FC<ModernListItemProps> = ({
  title,
  subtitle,
  leadingIcon,
  trailingContent,
  onClick,
  className = ''
}) => {
  return (
    <motion.div
      data-testid="modern-list-item"
      className={`flex items-center p-4 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${className}`}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {leadingIcon && (
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center mr-4">
          {leadingIcon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-medium text-gray-900 truncate">{title}</h4>
        {subtitle && (
          <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        )}
      </div>
      
      {trailingContent && (
        <div className="flex-shrink-0 ml-4">
          {trailingContent}
        </div>
      )}
    </motion.div>
  );
};

// Modern Floating Action Button
interface ModernFABProps {
  icon: ReactNode;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  extended?: boolean;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const ModernFAB: React.FC<ModernFABProps> = ({
  icon,
  position = 'bottom-right',
  extended = false,
  label,
  className = '',
  onClick
}) => {
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <motion.button
      className={`
        fixed ${positionStyles[position]}
        bg-amber-500 text-black
        ${extended ? 'px-6' : 'w-14 h-14'}
        rounded-full shadow-lg
        flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
        z-40
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={onClick}
    >
      {icon}
      {extended && label && (
        <span className="font-medium">{label}</span>
      )}
    </motion.button>
  );
};

// Modern Loading Skeleton
interface ModernSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: boolean;
}

export const ModernSkeleton: React.FC<ModernSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = true,
}) => {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const dimensions = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'circular' ? '40px' : variant === 'rectangular' ? '200px' : '16px'),
  };

  return (
    <motion.div
      data-testid="skeleton"
      className={`bg-gray-200 ${variantStyles[variant]} ${animation ? 'animate-pulse' : ''} ${className}`}
      style={dimensions}
      animate={animation ? { opacity: [0.5, 1, 0.5] } : undefined}
      transition={animation ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
    />
  );
};

// Modern Health Indicator (for ABV/Calories)
interface ModernHealthIndicatorProps {
  label: string;
  value: number;
  unit: string;
  status: 'low' | 'moderate' | 'high';
  icon?: ReactNode;
}

export const ModernHealthIndicator: React.FC<ModernHealthIndicatorProps> = ({
  label,
  value,
  unit,
  status,
  icon,
}) => {
  const statusColors = {
    low: modernColors.health.lowCalorie,
    moderate: modernColors.health.moderate,
    high: modernColors.health.highCalorie,
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 flex items-center justify-center text-gray-600">
            {icon}
          </div>
        )}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="text-right">
        <span className="text-lg font-semibold" style={{ color: statusColors[status] }}>
          {value}
        </span>
        <span className="text-sm text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  );
};

export default {
  ModernButton,
  ModernCard,
  ModernBottomSheet,
  ModernTabs,
  ModernListItem,
  ModernFAB,
  ModernSkeleton,
  ModernHealthIndicator,
};