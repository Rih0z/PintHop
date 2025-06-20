/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/layout/Layout.tsx
 *
 * 作成者: Claude Code
 * 作成日: 2025-06-11
 * 最終更新日: 2025-06-11
 * バージョン: 2.0
 *
 * 説明:
 * 2024-2025 UI/UXトレンドに完全準拠したメインレイアウトコンポーネント
 * Dark Mode First、Glassmorphism、Micro-interactions実装
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isScrolled, setIsScrolled] = useState(false);

  // Dark Mode First: システム設定の検出とテーマ適用
  useEffect(() => {
    // システムのダークモード設定を検出
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 保存されたテーマまたはシステム設定を適用
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (mediaQuery.matches ? 'dark' : 'dark'); // Dark Mode First
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    // システム設定の変更を監視
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // Micro-interaction: スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // テーマ切り替え関数（将来的に設定画面で使用）
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen font-body transition-colors duration-300"
         style={{ 
           backgroundColor: 'var(--color-bg-primary)',
           color: 'var(--color-text-primary)'
         }}>
      
      {/* Optional: Glassmorphism header overlay when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-40 glass-light dark:glass-dark"
            style={{
              height: '60px',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              background: theme === 'dark' 
                ? 'rgba(17, 17, 17, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)',
              borderBottom: '1px solid var(--color-border-subtle)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Main content with padding for bottom nav */}
      <motion.main 
        className="pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1] // Apple-style easing
        }}
      >
        <div className="relative z-10">
          {children}
        </div>
      </motion.main>
      
      {/* 2025版 Bottom Navigation with Glassmorphism */}
      <BottomNavigation theme={theme} />
      
      {/* Background gradient for enhanced visual depth */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle at 50% 50%, rgba(185, 127, 36, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 50% 50%, rgba(185, 127, 36, 0.03) 0%, transparent 50%)',
          zIndex: 0
        }}
      />
    </div>
  );
};

export default Layout;