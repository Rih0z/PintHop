/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/routes/presenceRoutes.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 * - 2025-05-28 00:00:00 Koki Riho and Codex getMyPresenceルート追加
 *
 * 説明:
 * プレゼンスAPIのルート定義
 */

import express from 'express';
import * as presenceController from '../controllers/presenceController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// 認証が必要なルート
router.post('/', authenticate, presenceController.updatePresence);
router.get('/friends', authenticate, presenceController.getFriendsPresence);
router.get('/me', authenticate, presenceController.getMyPresence);

export default router;
