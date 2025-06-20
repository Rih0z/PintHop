/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Login.tsx
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-26
 * 最終更新日: 2025-06-11
 * バージョン: 2.0
 *
 * 更新履歴:
 * - 2025-05-26 Koki Riho 初期作成
 * - 2025-06-11 Claude Code 2024-2025 UI/UXトレンド完全準拠版に更新
 *
 * 説明:
 * 2024-2025 UI/UXトレンドに完全準拠したログインページコンポーネント
 * Dark Mode First、Glassmorphism、Bold Typography、Micro-interactions実装
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ModernButton, ModernCard } from '../components/common/ModernComponents';
import { HiEye, HiEyeOff, HiUser, HiLockClosed } from 'react-icons/hi';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);

  const from = (location.state as LocationState)?.from?.pathname || '/timeline';

  // Theme detection
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'dark';
    setTheme(currentTheme);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'ログインに失敗しました';
      setError(`認証情報が正しくありません: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* 2025年版 Background with multiple layers */}
      <div 
        className="absolute inset-0"
        style={{
          background: theme === 'dark' 
            ? `
              radial-gradient(circle at 20% 80%, rgba(185, 127, 36, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(91, 146, 191, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(232, 93, 16, 0.05) 0%, transparent 50%)
            `
            : `
              radial-gradient(circle at 20% 80%, rgba(185, 127, 36, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(91, 146, 191, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(232, 93, 16, 0.02) 0%, transparent 50%)
            `
        }}
      />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(185, 127, 36, 0.2)' : 'rgba(185, 127, 36, 0.1)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="relative max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.4, 0, 0.2, 1] 
        }}
      >
        {/* Hero Section with Bold Typography */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* 3D Beer Glass Icon */}
          <motion.div 
            className="flex justify-center mb-8"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div 
              className="w-20 h-20 flex items-center justify-center text-7xl relative"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(185, 127, 36, 0.3))',
                transform: 'perspective(1000px) rotateX(15deg)'
              }}
              aria-label="ビール"
            >
              🍺
              {/* Modern Skeuomorphism glass shine */}
              <div 
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                  transform: 'rotate(45deg)'
                }}
              />
            </div>
          </motion.div>

          {/* Bold Typography Hero Title */}
          <motion.h1 
            className="font-display mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.05em',
              background: theme === 'dark'
                ? 'linear-gradient(135deg, #ECB96A 0%, #D39E47 50%, #B97F24 100%)'
                : 'linear-gradient(135deg, #B97F24 0%, #D39E47 50%, #ECB96A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] }}
          >
            PINTHOP
          </motion.h1>

          <motion.h2 
            className="font-heading mb-2"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '0.025em'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            ログイン
          </motion.h2>

          <motion.p 
            className="font-body"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.1rem',
              fontWeight: 500
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            ビアホッピングの旅を始めましょう
          </motion.p>

          <motion.p 
            className="mt-6 text-sm"
            style={{ color: 'var(--color-text-tertiary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            アカウントをお持ちでない方は{' '}
            <Link 
              to="/register" 
              className="font-semibold interactive"
              style={{ 
                color: 'var(--color-primary-500)',
                textDecoration: 'none',
                borderBottom: '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = 'var(--color-primary-500)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              アカウント作成
            </Link>
          </motion.p>
        </motion.div>

        {/* Test Credentials with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <ModernCard 
            glass={true} 
            glassIntensity="medium"
            theme={theme}
            padding="md"
            className="relative"
          >
            <div className="text-center">
              <motion.p 
                className="text-sm font-semibold mb-3"
                style={{ color: 'var(--color-text-secondary)' }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🧪 <span style={{ color: 'var(--color-primary-300)' }}>テスト用アカウント</span>
              </motion.p>
              <div className="space-y-2 text-xs">
                <div 
                  className="flex justify-between p-2 rounded-lg"
                  style={{ backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    ユーザー名: <code 
                      className="font-mono px-1 py-0.5 rounded"
                      style={{ 
                        backgroundColor: 'var(--color-primary-500)',
                        color: '#000000',
                        fontSize: '0.75rem'
                      }}
                    >alice</code>
                  </span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    パスワード: <code 
                      className="font-mono px-1 py-0.5 rounded"
                      style={{ 
                        backgroundColor: 'var(--color-primary-500)',
                        color: '#000000',
                        fontSize: '0.75rem'
                      }}
                    >alice123456</code>
                  </span>
                </div>
                <div 
                  className="flex justify-between p-2 rounded-lg"
                  style={{ backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    ユーザー名: <code 
                      className="font-mono px-1 py-0.5 rounded"
                      style={{ 
                        backgroundColor: 'var(--color-primary-500)',
                        color: '#000000',
                        fontSize: '0.75rem'
                      }}
                    >realuser2025</code>
                  </span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    パスワード: <code 
                      className="font-mono px-1 py-0.5 rounded"
                      style={{ 
                        backgroundColor: 'var(--color-primary-500)',
                        color: '#000000',
                        fontSize: '0.75rem'
                      }}
                    >RealTest123!@#</code>
                  </span>
                </div>
              </div>
            </div>
          </ModernCard>
        </motion.div>
        
        {/* Login Form with enhanced Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <ModernCard 
            glass={true} 
            glassIntensity="strong"
            theme={theme}
            padding="lg"
            className="relative"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error Message with Animation */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="p-4 rounded-2xl border"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
                      borderColor: theme === 'dark' ? 'rgba(244, 67, 54, 0.3)' : 'rgba(244, 67, 54, 0.2)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <p 
                      className="text-sm text-center font-medium"
                      style={{ color: '#F44336' }}
                    >
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-5">
                {/* Username Field */}
                <div>
                  <label 
                    htmlFor="username" 
                    className="block text-sm font-semibold mb-3"
                    style={{ 
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.025em'
                    }}
                  >
                    ユーザー名
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiUser 
                        className="h-5 w-5"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      />
                    </div>
                    <motion.input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl text-base font-medium transition-all duration-300 bg-transparent border"
                      style={{
                        color: 'var(--color-text-primary)',
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                        borderColor: isFormFocused ? 'var(--color-primary-500)' : 'var(--color-border-primary)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                      }}
                      placeholder="ユーザー名またはメールアドレス"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setIsFormFocused(true)}
                      onBlur={() => setIsFormFocused(false)}
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-semibold mb-3"
                    style={{ 
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.025em'
                    }}
                  >
                    パスワード
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiLockClosed 
                        className="h-5 w-5"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      />
                    </div>
                    <motion.input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="w-full pl-12 pr-12 py-4 rounded-2xl text-base font-medium transition-all duration-300 bg-transparent border"
                      style={{
                        color: 'var(--color-text-primary)',
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                        borderColor: isFormFocused ? 'var(--color-primary-500)' : 'var(--color-border-primary)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                      }}
                      placeholder="パスワード"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFormFocused(true)}
                      onBlur={() => setIsFormFocused(false)}
                      whileFocus={{ scale: 1.02 }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? (
                          <HiEyeOff 
                            className="h-5 w-5"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          />
                        ) : (
                          <HiEye 
                            className="h-5 w-5"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          />
                        )}
                      </motion.div>
                    </button>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <ModernButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  theme={theme}
                >
                  {loading ? 'ログイン中...' : 'ログイン'}
                </ModernButton>
              </motion.div>
            </form>
          </ModernCard>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center text-sm"
          style={{ color: 'var(--color-text-tertiary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          ログインすることで、素晴らしいブルワリーを発見し、ビール愛好家とつながることに同意したことになります。
        </motion.div>
      </motion.div>
    </div>
  );
};