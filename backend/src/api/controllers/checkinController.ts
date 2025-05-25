/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/controllers/checkinController.ts
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * チェックインAPIコントローラー
 */

import { Request, Response } from 'express';
import Checkin from '../../models/Checkin';

export const createCheckin = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const checkin = await Checkin.create({
      user: userId,
      brewery: req.body.breweryId,
      location: req.body.location,
      visibility: req.body.visibility,
      beers: req.body.beers || []
    });
    res.status(201).json(checkin);
  } catch (error) {
    console.error('Checkin create error:', error);
    res.status(500).json({ error: 'Failed to create checkin' });
  }
};

export const checkout = async (req: Request, res: Response) => {
  try {
    const { checkinId } = req.params;
    const checkin = await Checkin.findByIdAndUpdate(
      checkinId,
      { checkoutTime: new Date(), status: 'completed' },
      { new: true }
    );
    if (!checkin) {
      return res.status(404).json({ error: 'Checkin not found' });
    }
    res.json(checkin);
  } catch (error) {
    console.error('Checkin checkout error:', error);
    res.status(500).json({ error: 'Failed to checkout' });
  }
};

export const getCheckins = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || req.user?.id;
    const query: any = {};
    if (userId) query.user = userId;
    if (req.query.breweryId) query.brewery = req.query.breweryId;
    if (req.query.status) query.status = req.query.status;
    const limit = parseInt((req.query.limit as string) || '20', 10);
    const page = parseInt((req.query.page as string) || '1', 10);
    const checkins = await Checkin.find(query)
      .sort({ checkinTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ checkins });
  } catch (error) {
    console.error('Get checkins error:', error);
    res.status(500).json({ error: 'Failed to get checkins' });
  }
};

