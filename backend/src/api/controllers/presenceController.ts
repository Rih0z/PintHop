/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/controllers/presenceController.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 * - 2025-05-28 00:00:00 Koki Riho and Codex getMyPresence追加
 * - 2025-05-29 00:00:00 Koki Riho and Codex getPresenceByBrewery追加
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

export const getMyPresence = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const presence = await Presence.findOne({ user: userId }).populate('brewery', 'name');
    if (!presence) {
      return res.status(404).json({ error: 'Presence not found' });
    }
    res.json(presence);
  } catch (err) {
    console.error('Get my presence error:', err);
    res.status(500).json({ error: 'Failed to get presence' });
  }
};

export const getPresenceByBrewery = async (
  req: Request,
  res: Response
) => {
  try {
    const { breweryId } = req.params;
    const presences = await Presence.find({ brewery: breweryId })
      .populate('user', 'username')
      .populate('brewery', 'name');
    res.json(presences);
  } catch (err) {
    console.error('Get brewery presence error:', err);
    res.status(500).json({ error: 'Failed to get brewery presence' });
  }
};

