/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Timeline.tsx
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 Koki Riho 新規作成
 *
 * 説明:
 * 友達のプレゼンスを一覧表示するタイムラインページ
 */

import React from 'react';
import { useFriendsPresence } from '../hooks/useFriendsPresence';
import FriendsPresenceList from '../components/presence/FriendsPresenceList';

const TimelinePage: React.FC = () => {
  const { presences, loading } = useFriendsPresence();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <FriendsPresenceList presences={presences} />;
};

export default TimelinePage;
