/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/types/checkin.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-31 00:00:00
 *
 * 更新履歴:
 * - 2025-05-31 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * フロントエンドで使用するチェックイン型定義
 */

export interface Checkin {
  _id?: string;
  brewery: string;
  status: 'active' | 'completed' | 'cancelled';
  checkinTime?: string;
  checkoutTime?: string;
  visibility?: 'public' | 'friends' | 'private';
}
