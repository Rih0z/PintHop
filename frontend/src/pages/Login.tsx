/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Login.tsx
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-26
 *
 * 更新履歴:
 * - 2025-05-26 Koki Riho 初期作成
 *
 * 説明:
 * ログインページコンポーネント
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to login';
      setError(`Login failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-primary-900"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-beer-500/5"></div>
      
      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="text-6xl">🍺</div>
          </div>
          <h2 className="text-4xl font-display font-bold text-white mb-2">
            Welcome to <span className="bg-gradient-to-r from-primary-400 to-beer-400 bg-clip-text text-transparent">PintHop</span>
          </h2>
          <p className="text-dark-200">
            Sign in to start your beer hopping journey
          </p>
          <p className="mt-4 text-sm text-dark-300">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
              Create one here
            </Link>
          </p>
        </div>

        {/* Test Credentials */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-4">
          <div className="text-center">
            <p className="text-xs text-dark-300 mb-2">
              🧪 <span className="text-beer-400 font-medium">Test Credentials</span>
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-dark-200">
                <span>Username: <code className="text-primary-400">testuser</code></span>
                <span>Password: <code className="text-primary-400">test123456</code></span>
              </div>
              <div className="flex justify-between text-dark-200">
                <span>Username: <code className="text-primary-400">alice</code></span>
                <span>Password: <code className="text-primary-400">alice123456</code></span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-accent-danger/10 border border-accent-danger/20 rounded-xl p-4 animate-slide-up">
              <p className="text-sm text-accent-danger text-center">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-200 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-200 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-dark-600 disabled:to-dark-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-glow disabled:shadow-none"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In to PintHop'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-dark-400">
          By signing in, you agree to discover amazing breweries and connect with fellow beer enthusiasts.
        </div>
      </div>
    </div>
  );
};