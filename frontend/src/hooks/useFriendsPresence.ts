/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/hooks/useFriendsPresence.ts
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 Koki Riho 新規作成
 *
 * 説明:
 * 友達のプレゼンス取得用カスタムフック
 */

import { useEffect, useState } from 'react';
import { Presence } from '../types/presence';
import { fetchFriendsPresence } from '../services/presence';

export const useFriendsPresence = () => {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchFriendsPresence();
        setPresences(data);
      } catch (err) {
        console.error('Failed to fetch presence', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { presences, loading };
};
