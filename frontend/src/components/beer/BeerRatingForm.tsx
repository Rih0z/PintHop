/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/beer/BeerRatingForm.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-01-05
 *
 * 説明:
 * ビール評価フォームコンポーネント - 5段階評価、フレーバープロファイル、コメント機能
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Beer {
  _id: string;
  name: string;
  style: string;
  abv?: number;
  ibu?: number;
  brewery: {
    _id: string;
    name: string;
  };
}

interface FlavorProfile {
  hoppy: number;
  malty: number;
  bitter: number;
  sweet: number;
  sour: number;
  roasted: number;
  fruity: number;
  smoky: number;
}

interface BeerExperience {
  rating: number;
  comment?: string;
  flavorProfile?: Partial<FlavorProfile>;
  wouldRecommend?: boolean;
  wouldOrderAgain?: boolean;
  photos?: string[];
}

interface BeerRatingFormProps {
  beer: Beer;
  existingExperience?: BeerExperience;
  onSubmit: (experience: BeerExperience) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const defaultFlavorProfile: FlavorProfile = {
  hoppy: 5,
  malty: 5,
  bitter: 5,
  sweet: 5,
  sour: 5,
  roasted: 5,
  fruity: 5,
  smoky: 5
};

export const BeerRatingForm: React.FC<BeerRatingFormProps> = ({
  beer,
  existingExperience,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const { t } = useTranslation();
  
  const [rating, setRating] = useState<number>(existingExperience?.rating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(existingExperience?.comment || '');
  const [flavorProfile, setFlavorProfile] = useState<FlavorProfile>({
    ...defaultFlavorProfile,
    ...existingExperience?.flavorProfile
  });
  const [wouldRecommend, setWouldRecommend] = useState<boolean>(
    existingExperience?.wouldRecommend || false
  );
  const [wouldOrderAgain, setWouldOrderAgain] = useState<boolean>(
    existingExperience?.wouldOrderAgain || false
  );
  const [errors, setErrors] = useState<string[]>([]);

  const flavorLabels: { [K in keyof FlavorProfile]: string } = {
    hoppy: t('beer.flavor.hoppy'),
    malty: t('beer.flavor.malty'),
    bitter: t('beer.flavor.bitter'),
    sweet: t('beer.flavor.sweet'),
    sour: t('beer.flavor.sour'),
    roasted: t('beer.flavor.roasted'),
    fruity: t('beer.flavor.fruity'),
    smoky: t('beer.flavor.smoky')
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
    setErrors(errors.filter(error => !error.includes('rating')));
  };

  const handleCommentChange = (value: string) => {
    // Limit to 500 characters
    if (value.length <= 500) {
      setComment(value);
    }
  };

  const handleFlavorChange = (flavor: keyof FlavorProfile, value: number) => {
    setFlavorProfile(prev => ({
      ...prev,
      [flavor]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (rating === 0) {
      newErrors.push(t('beer.validation.ratingRequired'));
    }

    if (rating < 1 || rating > 5) {
      newErrors.push(t('beer.validation.ratingRange'));
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const experience: BeerExperience = {
      rating,
      comment: comment.trim() || undefined,
      flavorProfile,
      wouldRecommend,
      wouldOrderAgain
    };

    onSubmit(experience);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoverRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          className={`text-3xl transition-colors ${
            isFilled ? 'text-beer-400' : 'text-dark-600 hover:text-beer-200'
          }`}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleStarClick(starValue)}
          aria-label={t('beer.rating.stars', { count: starValue })}
        >
          ★
        </button>
      );
    });
  };

  const renderFlavorProfileChart = () => {
    const maxValue = 10;
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    
    const points = Object.entries(flavorProfile).map(([flavor, value], index) => {
      const angle = (index * 2 * Math.PI) / 8 - Math.PI / 2; // Start from top
      const scaledValue = (value / maxValue) * radius;
      const x = centerX + scaledValue * Math.cos(angle);
      const y = centerY + scaledValue * Math.sin(angle);
      return { x, y, flavor, value };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
      <div className="flex justify-center" data-testid="flavor-profile-chart">
        <svg width="300" height="300" className="flavor-profile-chart">
          {/* Background grid */}
          {[2, 4, 6, 8, 10].map(value => (
            <circle
              key={value}
              cx={centerX}
              cy={centerY}
              r={(value / maxValue) * radius}
              fill="none"
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          
          {/* Axes */}
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index * 2 * Math.PI) / 8 - Math.PI / 2;
            const x2 = centerX + radius * Math.cos(angle);
            const y2 = centerY + radius * Math.sin(angle);
            
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={x2}
                y2={y2}
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
              />
            );
          })}
          
          {/* Flavor profile area */}
          <path
            d={pathData}
            fill="rgba(255, 107, 53, 0.2)"
            stroke="#ff6b35"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#ff6b35"
            />
          ))}
          
          {/* Labels */}
          {points.map((point, index) => {
            const angle = (index * 2 * Math.PI) / 8 - Math.PI / 2;
            const labelRadius = radius + 30;
            const labelX = centerX + labelRadius * Math.cos(angle);
            const labelY = centerY + labelRadius * Math.sin(angle);
            
            return (
              <text
                key={index}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-white"
              >
                {flavorLabels[point.flavor as keyof FlavorProfile]}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      <h2 className="text-xl font-bold text-white mb-6">
        {existingExperience ? t('beer.rating.editTitle') : t('beer.rating.title')} {beer.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            {t('beer.rating.overall')} *
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            {rating > 0 && (
              <span className="ml-4 text-white font-medium">
                {rating}/5
              </span>
            )}
          </div>
          {hoverRating > 0 && (
            <p className="text-sm text-dark-300 mt-1">
              {t(`beer.rating.descriptions.${hoverRating}`)}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-white mb-2">
            {t('beer.rating.comment')}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => handleCommentChange(e.target.value)}
            placeholder={t('beer.rating.commentPlaceholder')}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-dark-400">
              {comment.length} / 500
            </span>
          </div>
        </div>

        {/* Flavor Profile */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            {t('beer.rating.flavorProfile')}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(flavorProfile).map(([flavor, value]) => (
              <div key={flavor}>
                <label 
                  htmlFor={`flavor-${flavor}`}
                  className="block text-sm font-medium text-dark-300 mb-2"
                >
                  {flavorLabels[flavor as keyof FlavorProfile]}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    id={`flavor-${flavor}`}
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => handleFlavorChange(flavor as keyof FlavorProfile, parseInt(e.target.value))}
                    className="flex-1 appearance-none bg-dark-700 h-2 rounded-lg outline-none"
                    aria-label={flavorLabels[flavor as keyof FlavorProfile]}
                  />
                  <span className="text-white font-medium w-6 text-center">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Flavor Profile Visualization */}
          {renderFlavorProfileChart()}
        </div>

        {/* Recommendation Questions */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="would-recommend"
              type="checkbox"
              checked={wouldRecommend}
              onChange={(e) => setWouldRecommend(e.target.checked)}
              className="mr-3 h-4 w-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
            />
            <label htmlFor="would-recommend" className="text-sm text-white">
              {t('beer.rating.wouldRecommend')}
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="would-order-again"
              type="checkbox"
              checked={wouldOrderAgain}
              onChange={(e) => setWouldOrderAgain(e.target.checked)}
              className="mr-3 h-4 w-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
            />
            <label htmlFor="would-order-again" className="text-sm text-white">
              {t('beer.rating.wouldOrderAgain')}
            </label>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            {errors.map((error, index) => (
              <p key={index} className="text-red-400 text-sm">
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? t('beer.rating.submitting') 
              : existingExperience 
                ? t('beer.rating.updateRating')
                : t('beer.rating.submitRating')
            }
          </button>
        </div>
      </form>
    </div>
  );
};