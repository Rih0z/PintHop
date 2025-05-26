/**
 * プロジェクト: PintHop
 * ファイルパス: backend/tests/logger.test.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-31 00:00:00
 *
 * 更新履歴:
 * - 2025-05-31 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * loggerユーティリティのテスト
 */

import { logger } from '../src/utils/logger';

describe('logger', () => {
  it('test_logger_info_outputs_message', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logger.info('hello');
    expect(spy).toHaveBeenCalledWith('hello');
    spy.mockRestore();
  });

  it('test_logger_error_outputs_message', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    logger.error('oops');
    expect(spy).toHaveBeenCalledWith('oops');
    spy.mockRestore();
  });
});
