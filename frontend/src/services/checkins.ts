/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/services/checkins.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-31 00:00:00
 *
 * 更新履歴:
 * - 2025-05-31 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * チェックインAPI呼び出しを行うサービス
 */

import axios from 'axios';
import { Checkin } from '../types/checkin';

const API_URL = process.env.REACT_APP_API_URL || 'https://pinthop-api.riho-dare.workers.dev';

export const createCheckin = async (
  breweryId: string
): Promise<Checkin> => {
  const res = await axios.post(`${API_URL}/api/checkins`, { breweryId });
  return res.data as Checkin;
};

export const checkout = async (checkinId: string): Promise<Checkin> => {
  const res = await axios.post(
    `${API_URL}/api/checkins/${checkinId}/checkout`
  );
  return res.data as Checkin;
};

export const fetchCheckins = async (
  params: { userId?: string; breweryId?: string; status?: string } = {}
): Promise<Checkin[]> => {
  const res = await axios.get(`${API_URL}/api/checkins`, { params });
  return (res.data.checkins || []) as Checkin[];
};
