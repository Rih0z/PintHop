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

import { Request, Response, NextFunction } from 'express';
import Checkin from '../../models/Checkin';
import { AppError, ErrorCodes } from '../../utils/AppError';

export const createCheckin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    if (!req.body.breweryId) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Brewery ID is required');
    }
    
    const checkin = await Checkin.create({
      user: userId,
      brewery: req.body.breweryId,
      location: req.body.location,
      visibility: req.body.visibility,
      beers: req.body.beers || []
    });
    
    res.status(201).json({
      status: 'success',
      data: checkin
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to create checkin'));
    }
  }
};

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { checkinId } = req.params;
    
    if (!checkinId) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Checkin ID is required');
    }
    
    const checkin = await Checkin.findByIdAndUpdate(
      checkinId,
      { checkoutTime: new Date(), status: 'completed' },
      { new: true }
    );
    
    if (!checkin) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Checkin not found');
    }
    
    res.json({
      status: 'success',
      data: checkin
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to checkout'));
    }
  }
};

export const getCheckins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.query.userId as string) || req.user?.id;
    const query: any = {};
    if (userId) query.user = userId;
    if (req.query.breweryId) query.brewery = req.query.breweryId;
    if (req.query.status) query.status = req.query.status;
    
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    
    const checkins = await Checkin.find(query)
      .sort({ checkinTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('brewery', 'name location')
      .populate('user', 'username');
    
    res.json({
      status: 'success',
      data: {
        checkins,
        pagination: {
          page,
          limit,
          hasMore: checkins.length === limit
        }
      }
    });
  } catch (error) {
    next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to get checkins'));
  }
};

