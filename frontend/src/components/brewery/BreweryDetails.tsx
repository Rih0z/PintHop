/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/brewery/BreweryDetails.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * ブルワリーの詳細情報を表示するコンポーネント
 */

import React from 'react';
import { Brewery } from '../../types/brewery';
import BreweryRatings from './BreweryRatings';

interface BreweryDetailsProps {
  brewery: Brewery;
}

const BreweryDetails: React.FC<BreweryDetailsProps> = ({ brewery }) => {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">{brewery.name}</h2>
      {brewery.address && (
        <p className="mb-2">
          {brewery.address.street}, {brewery.address.city}
        </p>
      )}
      <BreweryRatings ratings={brewery.ratings} />
    </div>
  );
};

export default BreweryDetails;
