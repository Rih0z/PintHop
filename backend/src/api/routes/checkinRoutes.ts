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
import { authenticate, optionalAuthenticate } from '../middlewares/auth';

const router = express.Router();

// 認証が必要なルート
router.post('/', authenticate, checkinController.createCheckin);
// router.post('/:checkinId/checkout', authenticate, checkinController.checkout);

// オプショナル認証（ログインしていなくても見られるが、ログインしていれば自分のデータを優先）
router.get('/', optionalAuthenticate, checkinController.getCheckins);

export default router;

