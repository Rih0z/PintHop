import request from 'supertest';
import { Request, Response, NextFunction } from 'express';
import * as beerController from '../../../src/api/controllers/beerController';
import { BeerService } from '../../../src/services/BeerService';
import { AppError } from '../../../src/utils/AppError';

// Mock BeerService
jest.mock('../../../src/services/BeerService');
jest.mock('../../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('Beer Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockBeerService: jest.Mocked<BeerService>;

  beforeEach(() => {
    mockReq = {
      query: {},
      params: {},
      body: {},
      user: {
        id: 'user123',
        email: 'test@example.com',
        username: 'testuser'
      }
    } as any;

    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
    mockBeerService = new BeerService() as jest.Mocked<BeerService>;
  });

  describe('getBeers', () => {
    it('should return beers with default pagination', async () => {
      const mockBeers = [
        { _id: 'beer1', name: 'Test Beer 1', style: 'IPA' },
        { _id: 'beer2', name: 'Test Beer 2', style: 'Lager' }
      ];

      const mockResult = {
        data: mockBeers,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1
        }
      };

      mockBeerService.findBeers = jest.fn().mockResolvedValue(mockResult);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await beerController.getBeers(mockReq as any, mockRes as Response);

      expect(mockBeerService.findBeers).toHaveBeenCalledWith(
        expect.objectContaining({
          style: undefined,
          minRating: undefined,
          maxRating: undefined,
          awardWinning: false,
          search: undefined,
          brewery: undefined
        }),
        expect.objectContaining({
          sortBy: 'name',
          sortOrder: 'asc'
        }),
        expect.objectContaining({
          page: 1,
          limit: 20
        })
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        beers: mockBeers,
        pagination: mockResult.pagination
      });
    });

    it('should handle query parameters', async () => {
      mockReq.query = {
        style: 'IPA',
        minRating: '4.0',
        maxRating: '5.0',
        awardWinning: 'true',
        search: 'hoppy',
        brewery: 'brewery123',
        sortBy: 'rating',
        sortOrder: 'desc',
        page: '2',
        limit: '10'
      };

      const mockResult = {
        data: [],
        pagination: { page: 2, limit: 10, total: 0, pages: 0 }
      };

      mockBeerService.findBeers = jest.fn().mockResolvedValue(mockResult);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await beerController.getBeers(mockReq as any, mockRes as Response);

      expect(mockBeerService.findBeers).toHaveBeenCalledWith(
        expect.objectContaining({
          style: 'IPA',
          minRating: 4.0,
          maxRating: 5.0,
          awardWinning: true,
          search: 'hoppy',
          brewery: 'brewery123'
        }),
        expect.objectContaining({
          sortBy: 'rating',
          sortOrder: 'desc'
        }),
        expect.objectContaining({
          page: 2,
          limit: 10
        })
      );
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockBeerService.findBeers = jest.fn().mockRejectedValue(error);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await expect(
        beerController.getBeers(mockReq as any, mockRes as Response)
      ).rejects.toThrow('Failed to fetch beers');
    });
  });

  describe('getBeerById', () => {
    it('should return beer details', async () => {
      mockReq.params = { id: 'beer123' };
      
      const mockBeerDetails = {
        beer: { _id: 'beer123', name: 'Test Beer', style: 'IPA' },
        userExperience: { rating: 4.5, notes: 'Great beer!' }
      };

      mockBeerService.getBeerDetails = jest.fn().mockResolvedValue(mockBeerDetails);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await beerController.getBeerById(mockReq as any, mockRes as Response);

      expect(mockBeerService.getBeerDetails).toHaveBeenCalledWith('beer123', 'user123');
      expect(mockRes.json).toHaveBeenCalledWith(mockBeerDetails);
    });

    it('should throw error for invalid beer ID', async () => {
      mockReq.params = { id: 'invalid-id' };

      await expect(
        beerController.getBeerById(mockReq as any, mockRes as Response)
      ).rejects.toThrow('Invalid beer ID');
    });

    it('should handle service errors', async () => {
      mockReq.params = { id: '507f1f77bcf86cd799439011' }; // valid ObjectId
      
      const error = new AppError(404, 'NOT_FOUND', 'Beer not found');
      mockBeerService.getBeerDetails = jest.fn().mockRejectedValue(error);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await expect(
        beerController.getBeerById(mockReq as any, mockRes as Response)
      ).rejects.toThrow(AppError);
    });
  });

  describe('createBeerExperience', () => {
    it('should create beer experience', async () => {
      mockReq.params = { id: '507f1f77bcf86cd799439011' };
      mockReq.body = {
        rating: 4.5,
        notes: 'Excellent beer!',
        flavorProfile: { hoppy: 8, bitter: 7 }
      };

      const mockExperience = {
        _id: 'experience123',
        user: 'user123',
        beer: '507f1f77bcf86cd799439011',
        rating: 4.5,
        isNew: true
      };

      mockBeerService.createOrUpdateExperience = jest.fn().mockResolvedValue(mockExperience);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await beerController.createBeerExperience(mockReq as any, mockRes as Response);

      expect(mockBeerService.createOrUpdateExperience).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        'user123',
        mockReq.body
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Beer experience created successfully',
        experience: mockExperience
      });
    });

    it('should update existing experience', async () => {
      mockReq.params = { id: '507f1f77bcf86cd799439011' };
      mockReq.body = { rating: 5.0 };

      const mockExperience = {
        _id: 'experience123',
        rating: 5.0,
        isNew: false
      };

      mockBeerService.createOrUpdateExperience = jest.fn().mockResolvedValue(mockExperience);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await beerController.createBeerExperience(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Beer experience updated successfully',
        experience: mockExperience
      });
    });

    it('should require authentication', async () => {
      mockReq.user = undefined;
      mockReq.params = { id: '507f1f77bcf86cd799439011' };

      await expect(
        beerController.createBeerExperience(mockReq as any, mockRes as Response)
      ).rejects.toThrow('Authentication required');
    });

    it('should validate beer ID', async () => {
      mockReq.params = { id: 'invalid-id' };

      await expect(
        beerController.createBeerExperience(mockReq as any, mockRes as Response)
      ).rejects.toThrow('Invalid beer ID');
    });
  });

  describe('getBeerRecommendations', () => {
    it('should return recommendations', async () => {
      mockReq.query = { limit: '5' };

      const mockRecommendations = [
        { beer: { name: 'Recommended Beer 1' }, score: 0.9 },
        { beer: { name: 'Recommended Beer 2' }, score: 0.8 }
      ];

      mockBeerService.getRecommendations = jest.fn().mockResolvedValue(mockRecommendations);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await beerController.getBeerRecommendations(mockReq as any, mockRes as Response);

      expect(mockBeerService.getRecommendations).toHaveBeenCalledWith('user123', 5);
      expect(mockRes.json).toHaveBeenCalledWith({
        recommendations: mockRecommendations
      });
    });

    it('should require authentication', async () => {
      mockReq.user = undefined;

      await expect(
        beerController.getBeerRecommendations(mockReq as any, mockRes as Response)
      ).rejects.toThrow('Authentication required');
    });
  });

  describe('getTrendingBeers', () => {
    it('should return trending beers', async () => {
      mockReq.query = { limit: '5', timeframe: '7d' };

      const mockTrending = [
        { beer: { name: 'Trending Beer 1' }, trendingScore: 0.95 }
      ];

      mockBeerService.getTrendingBeers = jest.fn().mockResolvedValue(mockTrending);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await beerController.getTrendingBeers(mockReq as any, mockRes as Response);

      expect(mockBeerService.getTrendingBeers).toHaveBeenCalledWith('7d', 5);
      expect(mockRes.json).toHaveBeenCalledWith({
        trending: mockTrending,
        timeframe: '7d',
        generatedAt: expect.any(String)
      });
    });

    it('should use default parameters', async () => {
      const mockTrending: any[] = [];

      mockBeerService.getTrendingBeers = jest.fn().mockResolvedValue(mockTrending);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await beerController.getTrendingBeers(mockReq as any, mockRes as Response);

      expect(mockBeerService.getTrendingBeers).toHaveBeenCalledWith('7d', 10);
    });
  });

  describe('getBeerStyles', () => {
    it('should return beer styles with user data', async () => {
      const mockStyles = [
        { _id: 'IPA', totalBeers: 50, userExperiences: 5 },
        { _id: 'Stout', totalBeers: 30, userExperiences: 2 }
      ];

      mockBeerService.getBeerStyles = jest.fn().mockResolvedValue(mockStyles);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await beerController.getBeerStyles(mockReq as any, mockRes as Response);

      expect(mockBeerService.getBeerStyles).toHaveBeenCalledWith('user123');
      expect(mockRes.json).toHaveBeenCalledWith({
        styles: mockStyles,
        totalStyles: 2
      });
    });

    it('should return beer styles without user data', async () => {
      mockReq.user = undefined;

      const mockStyles = [
        { _id: 'IPA', totalBeers: 50 }
      ];

      mockBeerService.getBeerStyles = jest.fn().mockResolvedValue(mockStyles);
      (BeerService as jest.Mock).mockImplementation(() => mockBeerService);

      await beerController.getBeerStyles(mockReq as any, mockRes as Response);

      expect(mockBeerService.getBeerStyles).toHaveBeenCalledWith(undefined);
    });
  });
});