/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Register.tsx
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-26
 *
 * 更新履歴:
 * - 2025-05-26 Koki Riho 初期作成
 * - 2025-01-05 モダンデザインとリアルタイムバリデーション追加
 *
 * 説明:
 * ユーザー登録ページコンポーネント
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://pinthop-api.riho-dare.workers.dev';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [availability, setAvailability] = useState({
    username: null as boolean | null,
    email: null as boolean | null
  });

  // リアルタイムバリデーション
  useEffect(() => {
    const errors = { ...validationErrors };
    
    // ユーザー名の検証
    if (formData.username && !/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      errors.username = 'Username must be 3-20 characters (letters, numbers, underscore only)';
    } else {
      errors.username = '';
    }
    
    // メールの検証
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    } else {
      errors.email = '';
    }
    
    // パスワードの検証
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(formData.password)) {
        errors.password = 'Password must contain at least one letter and one number';
      } else {
        errors.password = '';
      }
    }
    
    // パスワード確認の検証
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    } else {
      errors.confirmPassword = '';
    }
    
    setValidationErrors(errors);
  }, [formData]);

  // ユーザー名の利用可能性チェック（デバウンス付き）
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username && !validationErrors.username) {
        try {
          const response = await axios.get(`${API_URL}/api/auth/check-username/${formData.username}`);
          setAvailability(prev => ({ ...prev, username: response.data.available }));
        } catch (error) {
          console.error('Username check failed:', error);
        }
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [formData.username, validationErrors.username]);

  // メールの利用可能性チェック（デバウンス付き）
  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email && !validationErrors.email) {
        try {
          const response = await axios.get(`${API_URL}/api/auth/check-email/${formData.email}`);
          setAvailability(prev => ({ ...prev, email: response.data.available }));
        } catch (error) {
          console.error('Email check failed:', error);
        }
      }
    };

    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [formData.email, validationErrors.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーションエラーがある場合は送信しない
    if (Object.values(validationErrors).some(err => err !== '')) {
      setError('Please fix all errors before submitting');
      return;
    }

    // 利用可能性チェック
    if (availability.username === false) {
      setError('Username is already taken');
      return;
    }
    if (availability.email === false) {
      setError('Email is already registered');
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-800 via-dark-900 to-primary-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary-400 to-beer-400 bg-clip-text text-transparent">
              PintHop
            </span>
          </h1>
          <h2 className="text-2xl font-bold text-white mb-2">
            Join the Community
          </h2>
          <p className="text-dark-300">
            Start your beer hopping journey today
          </p>
        </div>

        {/* 登録フォーム */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-dark-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-accent-danger/10 border border-accent-danger/20 rounded-lg p-4">
                <p className="text-sm text-accent-danger">{error}</p>
              </div>
            )}
            
            {/* ユーザー名入力 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-200 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`w-full px-4 py-3 bg-dark-700 border ${
                    validationErrors.username ? 'border-accent-danger' : 
                    availability.username === false ? 'border-accent-danger' :
                    availability.username === true ? 'border-accent-success' :
                    'border-dark-600'
                  } rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {availability.username !== null && !validationErrors.username && (
                  <span className={`absolute right-3 top-3.5 text-sm ${
                    availability.username ? 'text-accent-success' : 'text-accent-danger'
                  }`}>
                    {availability.username ? '✓ Available' : '✗ Taken'}
                  </span>
                )}
              </div>
              {validationErrors.username && (
                <p className="mt-1 text-sm text-accent-danger">{validationErrors.username}</p>
              )}
            </div>
            
            {/* メール入力 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full px-4 py-3 bg-dark-700 border ${
                    validationErrors.email ? 'border-accent-danger' : 
                    availability.email === false ? 'border-accent-danger' :
                    availability.email === true ? 'border-accent-success' :
                    'border-dark-600'
                  } rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {availability.email !== null && !validationErrors.email && (
                  <span className={`absolute right-3 top-3.5 text-sm ${
                    availability.email ? 'text-accent-success' : 'text-accent-danger'
                  }`}>
                    {availability.email ? '✓ Available' : '✗ Already registered'}
                  </span>
                )}
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-accent-danger">{validationErrors.email}</p>
              )}
            </div>
            
            {/* パスワード入力 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-200 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`w-full px-4 py-3 bg-dark-700 border ${
                  validationErrors.password ? 'border-accent-danger' : 'border-dark-600'
                } rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-accent-danger">{validationErrors.password}</p>
              )}
            </div>
            
            {/* パスワード確認 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-200 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`w-full px-4 py-3 bg-dark-700 border ${
                  validationErrors.confirmPassword ? 'border-accent-danger' : 'border-dark-600'
                } rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-accent-danger">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={loading || Object.values(validationErrors).some(err => err !== '')}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg shadow-glow hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-dark-600 disabled:to-dark-600 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* ログインリンク */}
          <div className="mt-6 text-center">
            <p className="text-dark-300">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* 利用規約 */}
        <p className="mt-6 text-center text-xs text-dark-400">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};