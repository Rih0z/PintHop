/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/controllers/breweryController.ts
 * 
 * 作成者: Koki Riho
 * 作成日: 2025-05-04 00:00:00
 * 
 * 更新履歴:
 * - 2025-05-04 00:00:00 Koki Riho 初期作成
 * - 2025-05-24 20:15:50 AI Assistant ランダム取得エンドポイント追加
 *
 * 説明:
 * ブルワリーデータを扱うコントローラー
 */

import { Request, Response, NextFunction } from 'express';
import Brewery from '../../models/Brewery';
import { AppError, ErrorCodes } from '../../utils/AppError';

// すべてのブルワリーを取得
export const getAllBreweries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const breweries = await Brewery.find().sort({ name: 1 });
    res.json({
      status: 'success',
      data: breweries
    });
  } catch (error) {
    next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to fetch breweries'));
  }
};

// IDによるブルワリー取得
export const getBreweryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brewery = await Brewery.findById(req.params.id);
    if (!brewery) {
      throw new AppError(404, ErrorCodes.BREWERY_NOT_FOUND, 'Brewery not found');
    }
    res.json({
      status: 'success',
      data: brewery
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to fetch brewery'));
    }
  }
};

// 地域によるブルワリー取得
export const getBreweriesByRegion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { region } = req.params;
    const breweries = await Brewery.find({ 'region.name': region }).sort({ name: 1 });
    res.json({
      status: 'success',
      data: breweries
    });
  } catch (error) {
    next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to fetch breweries by region'));
  }
};

// 近くのブルワリーを取得
export const getNearbyBreweries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    
    if (!longitude || !latitude) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Longitude and latitude are required');
    }
    
    const lng = parseFloat(longitude as string);
    const lat = parseFloat(latitude as string);
    const distance = parseFloat(maxDistance as string);
    
    if (isNaN(lng) || isNaN(lat) || isNaN(distance)) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid coordinate or distance values');
    }
    
    const breweries = await Brewery.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: distance // メートル単位
        }
      }
    });
    
    res.json({
      status: 'success',
      data: breweries
    });
  } catch (error) {
    next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to fetch nearby breweries'));
  }
};

// ランダムなブルワリーを取得
export const getRandomBrewery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [brewery] = await Brewery.aggregate([{ $sample: { size: 1 } }]);
    if (!brewery) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'No breweries found in database');
    }
    res.json({
      status: 'success',
      data: brewery
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to fetch random brewery'));
    }
  }
};
