/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/hooks/useBreweries.ts
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * ブルワリーデータ取得用カスタムフック
 */

import { useEffect, useState } from 'react';
import { Brewery } from '../types/brewery';
import { fetchBreweries } from '../services/breweries';

export const useBreweries = () => {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchBreweries();
        setBreweries(data);
      } catch (err) {
        console.error('Failed to fetch breweries', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { breweries, loading };
};
