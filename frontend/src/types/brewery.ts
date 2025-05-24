/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/types/brewery.ts
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * フロントエンドで使用するブルワリー型定義
 */

export interface Rating {
  score: number | null;
  url: string | null;
}

export interface Brewery {
  _id?: string;
  breweryId: string;
  name: string;
  slug: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    formattedAddress?: string;
  };
  location?: {
    type: string;
    coordinates: [number, number];
  };
  region: string;
  ratings: {
    untappd: Rating;
    rateBeer: Rating;
    beerAdvocate: Rating;
    aggregateScore?: number;
  };
  [key: string]: any;
}
