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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { ModernButton, ModernCard } from '../components/common/ModernComponents';
import * as authService from '../services/auth';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://pinthop-api.riho-dare.workers.dev';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslation();
  
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
      errors.username = t('auth.validation.usernamePattern');
    } else {
      errors.username = '';
    }
    
    // メールの検証
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('auth.validation.emailInvalid');
    } else {
      errors.email = '';
    }
    
    // パスワードの検証
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = t('auth.validation.passwordTooShort');
      } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(formData.password)) {
        errors.password = t('auth.validation.passwordPattern');
      } else {
        errors.password = '';
      }
    }
    
    // パスワード確認の検証
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('auth.validation.passwordsNotMatch');
    } else {
      errors.confirmPassword = '';
    }
    
    setValidationErrors(errors);
  }, [formData, t]);

  // ユーザー名の利用可能性チェック（デバウンス付き）
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username && !validationErrors.username) {
        try {
          const result = await authService.checkAvailability(formData.username);
          setAvailability(prev => ({ ...prev, username: result.username }));
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
          const result = await authService.checkAvailability(undefined, formData.email);
          setAvailability(prev => ({ ...prev, email: result.email }));
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
      setError(t('auth.validation.registrationFailed'));
      return;
    }

    // 利用可能性チェック
    if (availability.username === false) {
      setError(t('auth.validation.usernameNotAvailable'));
      return;
    }
    if (availability.email === false) {
      setError(t('auth.validation.emailNotAvailable'));
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || t('auth.validation.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 safe-area-top">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="text-6xl">🍺</div>
          </div>
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-2">
            Join <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">PintHop</span>
          </h2>
          <p className="text-gray-600 mb-4">
            Create your account to start discovering amazing breweries
          </p>
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-amber-600 hover:text-amber-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        {/* 登録フォーム */}
        <ModernCard padding="lg" glass>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-slide-up">
                <p className="text-sm text-red-600 text-center">{error}</p>
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
            <ModernButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={Object.values(validationErrors).some(err => err !== '')}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </ModernButton>
          </form>
        </ModernCard>

        {/* 利用規約 */}
        <div className="text-center text-xs text-gray-500">
          By creating an account, you agree to discover amazing breweries and connect with fellow beer enthusiasts.
        </div>
      </div>
    </div>
  );
};