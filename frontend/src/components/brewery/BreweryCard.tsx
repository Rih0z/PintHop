/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/brewery/BreweryCard.tsx
 *
 * 作成者: Koki Riho (https://github.com/Rih0z) and Codex
 * 作成日: 2025-05-25 00:00:00
 *
 * 更新履歴:
 * - 2025-05-25 00:00:00 Codex 新規作成
 *
 * 説明:
 * ブルワリーの名前と基本情報を表示するカードコンポーネント
 */

import React from 'react';
import { Brewery } from '../../types/brewery';

interface BreweryCardProps {
  brewery: Brewery & { currentPresenceCount?: number };
  onClick?: (brewery: Brewery) => void;
}

export const BreweryCard: React.FC<BreweryCardProps> = ({ brewery, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(brewery);
    }
  };

  return (
    <article
      className={`border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
      data-testid="brewery-card"
    >
      <h3 className="text-lg font-bold mb-1">{brewery.name}</h3>
      {brewery.breweryType && (
        <p className="text-sm text-gray-600 mb-2">{brewery.breweryType}</p>
      )}
      {brewery.address && (
        <p className="text-sm text-gray-700">
          {brewery.address.city}, {brewery.address.state}
        </p>
      )}
      {brewery.address?.formattedAddress && (
        <p className="text-sm text-gray-600 mt-1">{brewery.address.formattedAddress}</p>
      )}
      {brewery.currentPresenceCount && brewery.currentPresenceCount > 0 && (
        <p className="text-sm text-amber-600 mt-2">
          {brewery.currentPresenceCount} {brewery.currentPresenceCount === 1 ? 'person' : 'people'} here now
        </p>
      )}
      {brewery.ratings?.untappd?.score && (
        <p className="text-sm text-gray-500 mt-2">
          Untappd: {brewery.ratings.untappd.score}
        </p>
      )}
    </article>
  );
};
