/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/api/routes/presenceRoutes.ts
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * プレゼンスAPIのルート定義
 */

import express from 'express';
import * as presenceController from '../controllers/presenceController';

const router = express.Router();

router.post('/', presenceController.updatePresence);
router.get('/friends', presenceController.getFriendsPresence);

export default router;
