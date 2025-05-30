/**
 * Authentication middleware tests
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, optionalAuthenticate } from '../../src/api/middlewares/auth';
import { AppError, ErrorCodes } from '../../src/utils/AppError';
import User from '../../src/models/User';

// Mock User model
jest.mock('../../src/models/User');

describe('Authentication Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid token', async () => {
      const userId = 'user123';
      const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });
      
      mockReq.headers = { authorization: `Bearer ${token}` };
      
      const mockUser = {
        _id: userId,
        email: 'test@example.com',
        username: 'testuser'
      };
      
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual({
        id: userId,
        email: 'test@example.com',
        username: 'testuser'
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject request without token', async () => {
      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          code: ErrorCodes.UNAUTHORIZED,
          message: 'No token provided'
        })
      );
    });

    it('should reject invalid token format', async () => {
      mockReq.headers = { authorization: 'InvalidFormat token' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          code: ErrorCodes.UNAUTHORIZED,
          message: 'No token provided'
        })
      );
    });

    it('should reject expired token', async () => {
      const token = jwt.sign({ sub: 'user123' }, process.env.JWT_SECRET!, { expiresIn: '-1s' });
      mockReq.headers = { authorization: `Bearer ${token}` };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          code: ErrorCodes.TOKEN_EXPIRED,
          message: 'Token expired'
        })
      );
    });

    it('should reject token with invalid signature', async () => {
      const token = jwt.sign({ sub: 'user123' }, 'wrong-secret', { expiresIn: '15m' });
      mockReq.headers = { authorization: `Bearer ${token}` };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          code: ErrorCodes.UNAUTHORIZED,
          message: 'Invalid token'
        })
      );
    });

    it('should reject if user not found', async () => {
      const token = jwt.sign({ sub: 'user123' }, process.env.JWT_SECRET!, { expiresIn: '15m' });
      mockReq.headers = { authorization: `Bearer ${token}` };
      
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          code: ErrorCodes.USER_NOT_FOUND,
          message: 'User not found'
        })
      );
    });
  });

  describe('optionalAuthenticate', () => {
    it('should authenticate valid token', async () => {
      const userId = 'user123';
      const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });
      
      mockReq.headers = { authorization: `Bearer ${token}` };
      
      const mockUser = {
        _id: userId,
        email: 'test@example.com',
        username: 'testuser'
      };
      
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await optionalAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual({
        id: userId,
        email: 'test@example.com',
        username: 'testuser'
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without token', async () => {
      await optionalAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue with invalid token', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };

      await optionalAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});