/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/hooks/useGeolocation.ts
 *
 * 作成者: Koki Riho (https://github.com/Rih0z) and Codex
 * 作成日: 2025-05-26 00:00:00
 *
 * 更新履歴:
 * - 2025-05-26 00:00:00 Codex 新規作成
 *
 * 説明:
 * ブラウザのGeolocation APIを利用して位置情報を取得するカスタムフック
 */

import { useState, useEffect } from 'react';

export interface PositionData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const useGeolocation = () => {
  const [position, setPosition] = useState<PositionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    let watchId: number;
    const successHandler = (pos: GeolocationPosition) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
    };
    const errorHandler = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    watchId = navigator.geolocation.watchPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { position, error };
};

export default useGeolocation;
