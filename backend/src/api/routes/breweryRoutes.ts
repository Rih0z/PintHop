/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/routes/breweryRoutes.ts
 * 
 * 作成者: Koki Riho
 * 作成日: 2025-05-04 00:00:00
 * 
 * 更新履歴:
 * - 2025-05-04 00:00:00 Koki Riho 初期作成
 * - 2025-05-24 20:15:50 AI Assistant ランダム取得エンドポイント追加
 * - 2025-05-29 00:00:00 Koki Riho and Codex ブルワリーのプレゼンス取得エンドポイント追加
 *
 * 説明:
 * ブルワリーAPIのルート定義
 */

import express from 'express';
import * as breweryController from '../controllers/breweryController';
import * as presenceController from '../controllers/presenceController';

const router = express.Router();

// ブルワリー関連のエンドポイント
router.get('/', breweryController.getAllBreweries);
router.get('/random', breweryController.getRandomBrewery);
router.get('/nearby', breweryController.getNearbyBreweries);
router.get('/region/:region', breweryController.getBreweriesByRegion);
router.get('/:id', breweryController.getBreweryById);
router.get('/:breweryId/presence', presenceController.getPresenceByBrewery);

export default router;
