/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/utils/logger.ts
 *
 * 作成者: Koki Riho and Codex
 * 作成日: 2025-05-31 00:00:00
 *
 * 更新履歴:
 * - 2025-05-31 00:00:00 Koki Riho and Codex 新規作成
 *
 * 説明:
 * コンソールラッパーによる単純なロギングユーティリティ
 */

export const logger = {
  info: (message: string, ...optionalParams: unknown[]): void => {
    console.log(message, ...optionalParams);
  },
  error: (message: string, ...optionalParams: unknown[]): void => {
    console.error(message, ...optionalParams);
  },
  warn: (message: string, ...optionalParams: unknown[]): void => {
    console.warn(message, ...optionalParams);
  },
  debug: (message: string, ...optionalParams: unknown[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DEBUG]', message, ...optionalParams);
    }
  }
};

export default logger;
