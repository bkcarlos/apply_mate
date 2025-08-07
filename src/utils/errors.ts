// 统一错误封装与生成辅助
export interface AppErrorPayload {
  code: string;
  message: string;
  cause?: unknown;
  meta?: Record<string, any>;
}

export class AppError extends Error {
  code: string;
  cause?: unknown;
  meta?: Record<string, any>;

  constructor(payload: AppErrorPayload) {
    super(payload.message);
    this.code = payload.code;
    this.cause = payload.cause;
    this.meta = payload.meta;
    this.name = 'AppError';
  }
}

export const createError = (code: string, message: string, cause?: unknown, meta?: Record<string, any>) => {
  return new AppError({ code, message, cause, meta });
};

export const isAppError = (err: unknown): err is AppError => {
  return err instanceof AppError;
};

// 常见错误代码常量
export const ERROR_CODES = {
  STORAGE_GET_FAILED: 'STORAGE_GET_FAILED',
  STORAGE_SET_FAILED: 'STORAGE_SET_FAILED',
  STORAGE_IMPORT_INVALID: 'STORAGE_IMPORT_INVALID',
  STORAGE_IMPORT_FAILED: 'STORAGE_IMPORT_FAILED',
  STORE_SAVE_FAILED: 'STORE_SAVE_FAILED',
  STORE_ENTITY_NOT_FOUND: 'STORE_ENTITY_NOT_FOUND'
} as const;
