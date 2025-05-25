/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/hooks/useBreweryPresence.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-29 00:00:00
 *
 * 更新履歴:
 * - 2025-05-29 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * 指定ブルワリーのプレゼンス取得用カスタムフック
 */

import { useEffect, useState } from 'react';
import { Presence } from '../types/presence';
import { fetchBreweryPresence } from '../services/presence';

export const useBreweryPresence = (breweryId: string) => {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchBreweryPresence(breweryId);
        setPresences(data);
      } catch (err) {
        console.error('Failed to fetch brewery presence', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [breweryId]);

  return { presences, loading };
};
