/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/controllers/presenceController.ts
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * プレゼンスAPIコントローラー
 */

import { Request, Response } from 'express';
import Presence from '../../models/Presence';

export const updatePresence = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || req.user?.id; // req.userは認証ミドルウェアで設定される想定
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const data = {
      status: req.body.status,
      location: req.body.location,
      brewery: req.body.breweryId,
      visibility: req.body.visibility
    };
    const presence = await Presence.findOneAndUpdate(
      { user: userId },
      { ...data, lastUpdated: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(presence);
  } catch (err) {
    console.error('Presence update error:', err);
    res.status(500).json({ error: 'Failed to update presence' });
  }
};

export const getFriendsPresence = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const presences = await Presence.find({ user: { $ne: userId } })
      .populate('brewery', 'name')
      .limit(20);
    res.json(presences);
  } catch (err) {
    console.error('Friends presence error:', err);
    res.status(500).json({ error: 'Failed to get friends presence' });
  }
};
