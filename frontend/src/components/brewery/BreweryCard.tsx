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
  brewery: Brewery;
}

const BreweryCard: React.FC<BreweryCardProps> = ({ brewery }) => (
  <div className="border p-4 rounded" data-testid="brewery-card">
    <h3 className="text-lg font-bold mb-1">{brewery.name}</h3>
    {brewery.ratings?.untappd?.score && (
      <p className="text-sm">Untappd: {brewery.ratings.untappd.score}</p>
    )}
  </div>
);

export default BreweryCard;
