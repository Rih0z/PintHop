/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/controllers/breweryController.ts
 * 
 * 作成者: Koki Riho
 * 作成日: 2025-05-04 00:00:00
 * 
 * 更新履歴:
 * - 2025-05-04 00:00:00 Koki Riho 初期作成
 *
 * 説明:
 * ブルワリーデータを扱うコントローラー
 */

import { Request, Response } from 'express';
import Brewery from '../../models/Brewery';

// すべてのブルワリーを取得
export const getAllBreweries = async (req: Request, res: Response) => {
  try {
    const breweries = await Brewery.find().sort({ name: 1 });
    res.json(breweries);
  } catch (error) {
    console.error('Error fetching breweries:', error);
    res.status(500).json({ error: 'Failed to fetch breweries' });
  }
};

// IDによるブルワリー取得
export const getBreweryById = async (req: Request, res: Response) => {
  try {
    const brewery = await Brewery.findById(req.params.id);
    if (!brewery) {
      return res.status(404).json({ error: 'Brewery not found' });
    }
    res.json(brewery);
  } catch (error) {
    console.error('Error fetching brewery:', error);
    res.status(500).json({ error: 'Failed to fetch brewery' });
  }
};

// 地域によるブルワリー取得
export const getBreweriesByRegion = async (req: Request, res: Response) => {
  try {
    const { region } = req.params;
    const breweries = await Brewery.find({ 'region.name': region }).sort({ name: 1 });
    res.json(breweries);
  } catch (error) {
    console.error('Error fetching breweries by region:', error);
    res.status(500).json({ error: 'Failed to fetch breweries by region' });
  }
};

// 近くのブルワリーを取得
export const getNearbyBreweries = async (req: Request, res: Response) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }
    
    const lng = parseFloat(longitude as string);
    const lat = parseFloat(latitude as string);
    const distance = parseFloat(maxDistance as string);
    
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
    
    res.json(breweries);
  } catch (error) {
    console.error('Error fetching nearby breweries:', error);
    res.status(500).json({ error: 'Failed to fetch nearby breweries' });
  }
};
