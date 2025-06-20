/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/layout/BottomNavigation.tsx
 *
 * 作成者: Claude Code
 * 作成日: 2025-06-11
 * 最終更新日: 2025-06-11
 * バージョン: 2.0
 *
 * 説明:
 * 2024-2025 UI/UXトレンドに完全準拠したBottomNavigationコンポーネント
 * Glassmorphism、Bold Typography、高度なMicro-interactions実装
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdTimeline,        // タイムライン用に変更
  MdMap, 
  MdSearch, 
  MdEvent, 
  MdPerson 
} from 'react-icons/md';
import { 
  HiOutlineHome,     // アウトラインアイコン（非アクティブ時）
  HiHome,            // 塗りつぶしアイコン（アクティブ時）
  HiOutlineMap,
  HiMap,
  HiOutlineSearch,
  HiSearch,
  HiOutlineCalendar,
  HiCalendar,
  HiOutlineUser,
  HiUser
} from 'react-icons/hi';

interface NavItem {
  key: string;
  path: string;
  iconOutline: React.ComponentType<any>;
  iconFilled: React.ComponentType<any>;
  label: string;
  labelBold: string;
  isActive: boolean;
}

interface BottomNavigationProps {
  theme?: 'light' | 'dark';
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ theme = 'dark' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [pressedItem, setPressedItem] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      key: 'timeline',
      path: '/timeline',
      iconOutline: HiOutlineHome,
      iconFilled: HiHome,
      label: 'タイムライン',
      labelBold: 'TIMELINE',
      isActive: location.pathname === '/timeline'
    },
    {
      key: 'map',
      path: '/map',
      iconOutline: HiOutlineMap,
      iconFilled: HiMap,
      label: 'マップ',
      labelBold: 'MAP',
      isActive: location.pathname === '/map'
    },
    {
      key: 'search',
      path: '/brewery-search',
      iconOutline: HiOutlineSearch,
      iconFilled: HiSearch,
      label: '検索',
      labelBold: 'SEARCH',
      isActive: location.pathname === '/brewery-search'
    },
    {
      key: 'events',
      path: '/events',
      iconOutline: HiOutlineCalendar,
      iconFilled: HiCalendar,
      label: 'イベント',
      labelBold: 'EVENTS',
      isActive: location.pathname === '/events'
    },
    {
      key: 'profile',
      path: '/profile',
      iconOutline: HiOutlineUser,
      iconFilled: HiUser,
      label: 'プロフィール',
      labelBold: 'PROFILE',
      isActive: location.pathname === '/profile'
    }
  ];

  const handleNavigation = (path: string) => {
    // Haptic feedback simulation (mobile)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate(path);
  };

  // Glassmorphism styles based on theme
  const glassStyles = {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background: theme === 'dark' 
      ? 'rgba(26, 26, 26, 0.85)' // Dark mode: semi-transparent dark
      : 'rgba(255, 255, 255, 0.85)', // Light mode: semi-transparent white
    borderTop: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    boxShadow: theme === 'dark'
      ? '0 -8px 32px 0 rgba(0, 0, 0, 0.4)'
      : '0 -8px 32px 0 rgba(31, 38, 135, 0.15)'
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50"
      style={glassStyles}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {/* Safe area padding for iPhone */}
      <div className="pb-safe">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2 px-4">
            {navItems.map((item) => {
              const isHovered = hoveredItem === item.key;
              const isPressed = pressedItem === item.key;
              const Icon = item.isActive ? item.iconFilled : item.iconOutline;
              
              return (
                <motion.button
                  key={item.key}
                  onClick={() => handleNavigation(item.path)}
                  onHoverStart={() => setHoveredItem(item.key)}
                  onHoverEnd={() => setHoveredItem(null)}
                  onTapStart={() => setPressedItem(item.key)}
                  onTapEnd={() => setPressedItem(null)}
                  className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 relative touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  animate={{
                    scale: isPressed ? 0.95 : isHovered ? 1.05 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                  }}
                >
                  {/* Active indicator with Glassmorphism */}
                  <AnimatePresence>
                    {item.isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-2xl"
                        style={{ 
                          background: theme === 'dark'
                            ? 'rgba(185, 127, 36, 0.15)'  // Amber glass for dark mode
                            : 'rgba(185, 127, 36, 0.1)',   // Lighter amber for light mode
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '1px solid rgba(185, 127, 36, 0.3)'
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Icon with micro-interactions */}
                  <motion.div 
                    className="relative z-10 mb-1"
                    animate={{
                      y: item.isActive ? -2 : 0,
                      rotate: isPressed ? 15 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    <Icon 
                      className="w-6 h-6 transition-all duration-200"
                      style={{
                        color: item.isActive 
                          ? theme === 'dark' ? '#ECB96A' : '#B97F24' // Amber variations
                          : theme === 'dark' ? '#b3b3b3' : '#666259',
                        filter: item.isActive ? 'drop-shadow(0 2px 4px rgba(185, 127, 36, 0.3))' : 'none'
                      }}
                    />
                  </motion.div>
                  
                  {/* Label with Bold Typography */}
                  <motion.span 
                    className={`relative z-10 transition-all duration-200`}
                    style={{
                      fontSize: item.isActive ? '0.75rem' : '0.625rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: item.isActive ? 800 : 600,
                      letterSpacing: item.isActive ? '0.05em' : '0.025em',
                      color: item.isActive 
                        ? theme === 'dark' ? '#ECB96A' : '#B97F24'
                        : theme === 'dark' ? '#808080' : '#807A70',
                      textTransform: item.isActive ? 'uppercase' : 'none'
                    }}
                    animate={{
                      scale: item.isActive ? 1 : 0.95,
                    }}
                  >
                    {item.isActive ? item.labelBold : item.label}
                  </motion.span>

                  {/* Hover glow effect */}
                  <AnimatePresence>
                    {(isHovered || item.isActive) && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          background: 'radial-gradient(circle at center, rgba(185, 127, 36, 0.2) 0%, transparent 70%)',
                          filter: 'blur(10px)'
                        }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BottomNavigation;