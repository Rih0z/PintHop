/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/hooks/useCheckins.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-31 00:00:00
 *
 * 更新履歴:
 * - 2025-05-31 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * チェックイン一覧取得用カスタムフック
 */

import { useEffect, useState } from 'react';
import { Checkin } from '../types/checkin';
import { fetchCheckins } from '../services/checkins';

export const useCheckins = (userId?: string) => {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCheckins({ userId });
        setCheckins(data);
      } catch (err) {
        console.error('Failed to fetch checkins', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  return { checkins, loading };
};
