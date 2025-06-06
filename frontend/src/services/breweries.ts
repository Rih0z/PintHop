/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/services/breweries.ts
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * ブルワリーデータ取得サービス
 */

import axios from 'axios';
import { Brewery } from '../types/brewery';

const API_URL = process.env.REACT_APP_API_URL || 'https://pinthop-api.riho-dare.workers.dev';

export const fetchBreweries = async (): Promise<Brewery[]> => {
  const response = await axios.get(`${API_URL}/api/breweries`);
  return response.data.breweries as Brewery[];
};
