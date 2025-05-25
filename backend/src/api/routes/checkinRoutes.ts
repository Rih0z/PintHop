/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/routes/checkinRoutes.ts
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * チェックインAPIのルート定義
 */

import express from 'express';
import * as checkinController from '../controllers/checkinController';

const router = express.Router();

router.post('/', checkinController.createCheckin);
router.post('/:checkinId/checkout', checkinController.checkout);
router.get('/', checkinController.getCheckins);

export default router;

