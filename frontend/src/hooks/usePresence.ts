/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/hooks/usePresence.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-27 00:00:00
 *
 * 更新履歴:
 * - 2025-05-27 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * PresenceContextを利用するためのカスタムフック
 */

import { useContext } from 'react';
import PresenceContext from '../context/PresenceContext';

const usePresence = () => {
  const ctx = useContext(PresenceContext);
  if (!ctx) {
    throw new Error('usePresence must be used within PresenceProvider');
  }
  return ctx;
};

export default usePresence;
