/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/brewery/BreweryRatings.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * レビューサイトの評価をリンク付きで表示するコンポーネント
 */

import React from 'react';
import { Rating } from '../../types/brewery';

interface RatingsProps {
  ratings: {
    untappd: Rating;
    rateBeer: Rating;
    beerAdvocate: Rating;
  };
}

const BreweryRatings: React.FC<RatingsProps> = ({ ratings }) => {
  return (
    <div className="flex space-x-4">
      {ratings.untappd.score && (
        <a
          href={ratings.untappd.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="untappd-link"
        >
          Untappd: {ratings.untappd.score}
        </a>
      )}
      {ratings.rateBeer.score && (
        <a
          href={ratings.rateBeer.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="ratebeer-link"
        >
          RateBeer: {ratings.rateBeer.score}
        </a>
      )}
      {ratings.beerAdvocate.score && (
        <a
          href={ratings.beerAdvocate.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="beeradvocate-link"
        >
          BeerAdvocate: {ratings.beerAdvocate.score}
        </a>
      )}
    </div>
  );
};

export default BreweryRatings;
