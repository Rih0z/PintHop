/**
 * AppError utility tests
 */

import { AppError, ErrorCodes } from '../../src/utils/AppError';

describe('AppError', () => {
  it('should create an instance with correct properties', () => {
    const error = new AppError(404, ErrorCodes.NOT_FOUND, 'Resource not found');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe(ErrorCodes.NOT_FOUND);
    expect(error.message).toBe('Resource not found');
    expect(error.isOperational).toBe(true);
  });

  it('should set isOperational to false when specified', () => {
    const error = new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Critical error', false);

    expect(error.isOperational).toBe(false);
  });

  it('should have a stack trace', () => {
    const error = new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Validation failed');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('AppError');
  });

  it('should use predefined error codes', () => {
    expect(ErrorCodes.INVALID_CREDENTIALS).toBe('INVALID_CREDENTIALS');
    expect(ErrorCodes.TOKEN_EXPIRED).toBe('TOKEN_EXPIRED');
    expect(ErrorCodes.BREWERY_NOT_FOUND).toBe('BREWERY_NOT_FOUND');
    expect(ErrorCodes.DATABASE_ERROR).toBe('DATABASE_ERROR');
  });
});