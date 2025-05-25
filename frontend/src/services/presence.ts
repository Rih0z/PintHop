/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/services/presence.ts
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 Koki Riho 新規作成
 *
 * 説明:
 * プレゼンスデータ取得サービス
 */

import axios from 'axios';
import { Presence } from '../types/presence';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchFriendsPresence = async (): Promise<Presence[]> => {
  const response = await axios.get(`${API_URL}/v1/presence/friends`);
  return response.data as Presence[];
};
