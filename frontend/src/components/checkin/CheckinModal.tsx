/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/checkin/CheckinModal.tsx
 *
 * 作成者: Claude Code
 * 作成日: 2025-06-11
 *
 * 説明:
 * 低摩擦設計のチェックインモーダルコンポーネント
 * UI/UX仕様書に基づく最小限入力ステップの実装
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin,
  FiLock,
  FiUsers,
  FiEye,
  FiEyeOff,
  FiCamera,
  FiMessageCircle,
  FiNavigation,
  FiX,
  FiCheck,
  FiChevronRight,
  FiPlus
} from 'react-icons/fi';

interface Brewery {
  id: string;
  name: string;
  address: string;
  city: string;
}

interface Route {
  id: string;
  name: string;
  participantCount: number;
}

type PrivacyLevel = 'public' | 'friends' | 'private';

interface CheckinData {
  breweryId: string;
  privacy: PrivacyLevel;
  comment?: string;
  photo?: File;
  routeId?: string;
  createMeetup?: boolean;
}

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  brewery: Brewery;
  onCheckin: (data: CheckinData) => void;
  nearbyRoutes?: Route[];
}

export const CheckinModal: React.FC<CheckinModalProps> = ({
  isOpen,
  onClose,
  brewery,
  onCheckin,
  nearbyRoutes = []
}) => {
  const [currentStep, setCurrentStep] = useState<'basic' | 'details'>('basic');
  const [privacy, setPrivacy] = useState<PrivacyLevel>('friends'); // デフォルトはプライバシー優先
  const [comment, setComment] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string | undefined>();
  const [photo, setPhoto] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyOptions, setShowPrivacyOptions] = useState(false);

  // モーダルが開かれた時の初期化
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('basic');
      setPrivacy('friends');
      setComment('');
      setSelectedRoute(undefined);
      setPhoto(undefined);
      setShowPrivacyOptions(false);
    }
  }, [isOpen]);

  const getPrivacyIcon = (level: PrivacyLevel) => {
    switch (level) {
      case 'public':
        return FiEye;
      case 'friends':
        return FiUsers;
      case 'private':
        return FiEyeOff;
    }
  };

  const getPrivacyLabel = (level: PrivacyLevel) => {
    switch (level) {
      case 'public':
        return '公開';
      case 'friends':
        return '友達のみ';
      case 'private':
        return '非公開';
    }
  };

  const getPrivacyDescription = (level: PrivacyLevel) => {
    switch (level) {
      case 'public':
        return 'すべてのユーザーに表示されます';
      case 'friends':
        return '友達にのみ表示されます';
      case 'private':
        return 'あなたのみに表示されます';
    }
  };

  // ワンタップチェックイン - 基本ステップで完了
  const handleQuickCheckin = async () => {
    setIsSubmitting(true);
    
    const checkinData: CheckinData = {
      breweryId: brewery.id,
      privacy: privacy,
    };

    try {
      await onCheckin(checkinData);
      onClose();
    } catch (error) {
      console.error('チェックインに失敗しました:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 詳細情報付きチェックイン
  const handleDetailedCheckin = async () => {
    setIsSubmitting(true);
    
    const checkinData: CheckinData = {
      breweryId: brewery.id,
      privacy: privacy,
      comment: comment.trim() || undefined,
      photo: photo,
      routeId: selectedRoute,
    };

    try {
      await onCheckin(checkinData);
      onClose();
    } catch (error) {
      console.error('チェックインに失敗しました:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 300, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 300, scale: 0.9 }}
          className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderBottomColor: 'var(--color-neutral-200)' }}>
            <h2 
              className="text-xl font-heading font-bold"
              style={{ color: 'var(--color-neutral-900)' }}
            >
              チェックイン
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors"
              style={{ color: 'var(--color-neutral-500)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {/* Brewery Info */}
            <div className="flex items-center mb-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                style={{ backgroundColor: 'var(--color-primary-100)' }}
              >
                <FiMapPin 
                  className="w-6 h-6"
                  style={{ color: 'var(--color-primary-600)' }}
                />
              </div>
              <div>
                <h3 
                  className="font-heading font-bold"
                  style={{ color: 'var(--color-neutral-900)' }}
                >
                  {brewery.name}
                </h3>
                <p 
                  className="text-sm font-body"
                  style={{ color: 'var(--color-neutral-600)' }}
                >
                  {brewery.address}, {brewery.city}
                </p>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="mb-6">
              <label 
                className="block text-sm font-accent font-medium mb-3"
                style={{ color: 'var(--color-neutral-800)' }}
              >
                プライバシー設定
              </label>
              
              <button
                onClick={() => setShowPrivacyOptions(!showPrivacyOptions)}
                className="w-full flex items-center justify-between p-3 border rounded-xl transition-colors"
                style={{ 
                  borderColor: 'var(--color-neutral-200)',
                  backgroundColor: showPrivacyOptions ? 'var(--color-neutral-50)' : 'transparent'
                }}
              >
                <div className="flex items-center">
                  {React.createElement(getPrivacyIcon(privacy), {
                    className: "w-5 h-5 mr-3",
                    style: { color: 'var(--color-primary-500)' }
                  })}
                  <div className="text-left">
                    <div 
                      className="font-accent font-medium"
                      style={{ color: 'var(--color-neutral-900)' }}
                    >
                      {getPrivacyLabel(privacy)}
                    </div>
                    <div 
                      className="text-sm font-body"
                      style={{ color: 'var(--color-neutral-600)' }}
                    >
                      {getPrivacyDescription(privacy)}
                    </div>
                  </div>
                </div>
                <FiChevronRight 
                  className={`w-5 h-5 transform transition-transform ${showPrivacyOptions ? 'rotate-90' : ''}`}
                  style={{ color: 'var(--color-neutral-400)' }}
                />
              </button>

              {/* Privacy Options */}
              <AnimatePresence>
                {showPrivacyOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 border rounded-xl overflow-hidden"
                    style={{ borderColor: 'var(--color-neutral-200)' }}
                  >
                    {(['friends', 'public', 'private'] as PrivacyLevel[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setPrivacy(level);
                          setShowPrivacyOptions(false);
                        }}
                        className="w-full flex items-center p-3 border-b transition-colors font-body"
                        style={{
                          borderBottomColor: 'var(--color-neutral-100)',
                          backgroundColor: privacy === level ? 'var(--color-primary-50)' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (privacy !== level) {
                            e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (privacy !== level) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {React.createElement(getPrivacyIcon(level), {
                          className: "w-5 h-5 mr-3",
                          style: { color: privacy === level ? 'var(--color-primary-500)' : 'var(--color-neutral-500)' }
                        })}
                        <div className="text-left">
                          <div 
                            className="font-medium"
                            style={{ color: privacy === level ? 'var(--color-primary-600)' : 'var(--color-neutral-900)' }}
                          >
                            {getPrivacyLabel(level)}
                          </div>
                          <div 
                            className="text-sm"
                            style={{ color: 'var(--color-neutral-600)' }}
                          >
                            {getPrivacyDescription(level)}
                          </div>
                        </div>
                        {privacy === level && (
                          <FiCheck 
                            className="w-5 h-5 ml-auto"
                            style={{ color: 'var(--color-primary-500)' }}
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 段階的詳細入力 */}
            {currentStep === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Comment */}
                <div>
                  <label 
                    className="block text-sm font-accent font-medium mb-2"
                    style={{ color: 'var(--color-neutral-800)' }}
                  >
                    コメント（任意）
                  </label>
                  <div className="relative">
                    <FiMessageCircle 
                      className="absolute left-3 top-3 w-5 h-5"
                      style={{ color: 'var(--color-neutral-400)' }}
                    />
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="今日のビール体験を共有しましょう..."
                      className="w-full pl-10 pr-4 py-3 border rounded-xl font-body resize-none focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: 'var(--color-neutral-200)',
                        focusRingColor: 'var(--color-primary-500)'
                      }}
                      rows={3}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary-500)';
                        e.target.style.boxShadow = '0 0 0 2px rgba(185, 127, 36, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-neutral-200)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Photo */}
                <div>
                  <label 
                    className="block text-sm font-accent font-medium mb-2"
                    style={{ color: 'var(--color-neutral-800)' }}
                  >
                    写真（任意）
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                      style={{ 
                        borderColor: photo ? 'var(--color-primary-300)' : 'var(--color-neutral-300)',
                        backgroundColor: photo ? 'var(--color-primary-50)' : 'transparent'
                      }}
                    >
                      <FiCamera 
                        className="w-6 h-6 mr-2"
                        style={{ color: photo ? 'var(--color-primary-600)' : 'var(--color-neutral-500)' }}
                      />
                      <span 
                        className="font-body"
                        style={{ color: photo ? 'var(--color-primary-600)' : 'var(--color-neutral-600)' }}
                      >
                        {photo ? photo.name : '写真を追加'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Routes */}
                {nearbyRoutes.length > 0 && (
                  <div>
                    <label 
                      className="block text-sm font-accent font-medium mb-2"
                      style={{ color: 'var(--color-neutral-800)' }}
                    >
                      ルートに参加（任意）
                    </label>
                    <div className="space-y-2">
                      {nearbyRoutes.map((route) => (
                        <button
                          key={route.id}
                          onClick={() => setSelectedRoute(selectedRoute === route.id ? undefined : route.id)}
                          className="w-full flex items-center justify-between p-3 border rounded-xl transition-colors"
                          style={{
                            borderColor: selectedRoute === route.id ? 'var(--color-primary-300)' : 'var(--color-neutral-200)',
                            backgroundColor: selectedRoute === route.id ? 'var(--color-primary-50)' : 'transparent'
                          }}
                        >
                          <div className="flex items-center">
                            <FiNavigation 
                              className="w-5 h-5 mr-3"
                              style={{ color: selectedRoute === route.id ? 'var(--color-primary-600)' : 'var(--color-neutral-500)' }}
                            />
                            <div className="text-left">
                              <div 
                                className="font-accent font-medium"
                                style={{ color: selectedRoute === route.id ? 'var(--color-primary-600)' : 'var(--color-neutral-900)' }}
                              >
                                {route.name}
                              </div>
                              <div 
                                className="text-sm font-body"
                                style={{ color: 'var(--color-neutral-600)' }}
                              >
                                {route.participantCount}人が参加中
                              </div>
                            </div>
                          </div>
                          {selectedRoute === route.id && (
                            <FiCheck 
                              className="w-5 h-5"
                              style={{ color: 'var(--color-primary-500)' }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t" style={{ borderTopColor: 'var(--color-neutral-200)' }}>
            {currentStep === 'basic' ? (
              <div className="space-y-3">
                {/* ワンタップチェックイン */}
                <button
                  onClick={handleQuickCheckin}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center py-3 rounded-xl font-accent font-medium transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--color-primary-500)',
                    color: 'white'
                  }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <FiCheck className="w-5 h-5 mr-2" />
                  )}
                  チェックイン
                </button>
                
                {/* 詳細オプション */}
                <button
                  onClick={() => setCurrentStep('details')}
                  className="w-full flex items-center justify-center py-3 rounded-xl font-accent font-medium transition-colors border"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--color-neutral-300)',
                    color: 'var(--color-neutral-700)'
                  }}
                >
                  <FiPlus className="w-5 h-5 mr-2" />
                  詳細を追加
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => setCurrentStep('basic')}
                  className="flex-1 py-3 rounded-xl font-accent font-medium transition-colors border"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--color-neutral-300)',
                    color: 'var(--color-neutral-700)'
                  }}
                >
                  戻る
                </button>
                <button
                  onClick={handleDetailedCheckin}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center py-3 rounded-xl font-accent font-medium transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--color-primary-500)',
                    color: 'white'
                  }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <FiCheck className="w-5 h-5 mr-2" />
                  )}
                  チェックイン
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckinModal;