/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/types/presence.ts
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 Koki Riho 新規作成
 *
 * 説明:
 * プレゼンス情報型定義
 */

export interface Presence {
  user: string;
  status: 'online' | 'away' | 'offline';
  brewery?: string;
  lastUpdated?: string;
}
