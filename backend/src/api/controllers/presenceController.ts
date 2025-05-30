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

import { Request, Response, NextFunction } from 'express';
import Presence from '../../models/Presence';
import { AppError, ErrorCodes } from '../../utils/AppError';

export const updatePresence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId || req.user?.id; // req.userは認証ミドルウェアで設定される想定
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
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
    
    res.json({
      status: 'success',
      data: presence
    });
  } catch (err) {
    next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to update presence'));
  }
};

export const getFriendsPresence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const presences = await Presence.find({ user: { $ne: userId } })
      .populate('brewery', 'name')
      .limit(20);
    
    res.json({
      status: 'success',
      data: presences
    });
  } catch (err) {
    next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to get friends presence'));
  }
};

export const getMyPresence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    const presence = await Presence.findOne({ user: userId }).populate('brewery', 'name');
    if (!presence) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Presence not found');
    }
    
    res.json({
      status: 'success',
      data: presence
    });
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to get presence'));
    }
  }
};

export const getPresenceByBrewery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breweryId } = req.params;
    
    if (!breweryId) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Brewery ID is required');
    }
    
    const presences = await Presence.find({ brewery: breweryId })
      .populate('user', 'username')
      .populate('brewery', 'name');
    
    res.json({
      status: 'success',
      data: presences
    });
  } catch (err) {
    next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to get brewery presence'));
  }
};

