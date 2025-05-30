/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/services/presence.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 Koki Riho 新規作成
 * - 2025-05-27 00:00:00 Koki Riho and Codex updatePresence関数追加
 * - 2025-05-29 00:00:00 Koki Riho and Codex fetchBreweryPresence関数追加
 * - 2025-05-30 00:00:00 Koki Riho and Codex fetchMyPresence関数追加
 *
 * 説明:
 * プレゼンスデータ取得サービス
 */

import axios from 'axios';
import { Presence } from '../types/presence';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';

export const fetchFriendsPresence = async (): Promise<Presence[]> => {
  const response = await axios.get(`${API_URL}/presence/friends`);
  return response.data as Presence[];
};

export const fetchBreweryPresence = async (
  breweryId: string
): Promise<Presence[]> => {
  const response = await axios.get(
    `${API_URL}/breweries/${breweryId}/presence`
  );
  return response.data as Presence[];
};

export interface UpdatePresenceData {
  status?: 'online' | 'away' | 'offline';
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  breweryId?: string;
  visibility?: 'everyone' | 'friends' | 'none';
}

export const updatePresence = async (
  data: UpdatePresenceData
): Promise<Presence> => {
  const response = await axios.post(`${API_URL}/presence`, data);
  return response.data as Presence;
};

export const fetchMyPresence = async (): Promise<Presence> => {
  const response = await axios.get(`${API_URL}/presence/me`);
  return response.data as Presence;
};
