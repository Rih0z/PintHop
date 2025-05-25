/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/components/presence/FriendsPresenceList.tsx
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 Koki Riho 新規作成
 *
 * 説明:
 * 友達のプレゼンスリストを表示するコンポーネント
 */

import React from 'react';
import { Presence } from '../../types/presence';

interface FriendsPresenceListProps {
  presences: Presence[];
}

const FriendsPresenceList: React.FC<FriendsPresenceListProps> = ({ presences }) => (
  <ul data-testid="presence-list">
    {presences.map((p) => (
      <li key={p.user}>
        {p.user}: {p.status}
      </li>
    ))}
  </ul>
);

export default FriendsPresenceList;
