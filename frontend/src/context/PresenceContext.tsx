/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/context/PresenceContext.tsx
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-27 00:00:00
 *
 * 更新履歴:
 * - 2025-05-27 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * プレゼンス情報を管理するReactコンテキスト
 */

import React, { createContext, useState } from 'react';
import { Presence } from '../types/presence';
import { updatePresence as apiUpdatePresence, UpdatePresenceData } from '../services/presence';

interface PresenceContextValue {
  presence: Presence | null;
  updatePresence: (data: UpdatePresenceData) => Promise<void>;
}

const PresenceContext = createContext<PresenceContextValue | undefined>(undefined);

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [presence, setPresence] = useState<Presence | null>(null);

  const updatePresence = async (data: UpdatePresenceData) => {
    const updated = await apiUpdatePresence(data);
    setPresence(updated);
  };

  return (
    <PresenceContext.Provider value={{ presence, updatePresence }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => {
  const ctx = React.useContext(PresenceContext);
  if (!ctx) {
    throw new Error('usePresence must be used within PresenceProvider');
  }
  return ctx;
};

export default PresenceContext;
