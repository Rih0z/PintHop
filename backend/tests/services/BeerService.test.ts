import mongoose from 'mongoose';
import { BeerService } from '../../src/services/BeerService';
import { Beer } from '../../src/models/Beer';
import { BeerExperience } from '../../src/models/BeerExperience';
import User from '../../src/models/User';
import Brewery from '../../src/models/Brewery';
import { AppError } from '../../src/utils/AppError';

// Mock models
jest.mock('../../src/models/Beer');
jest.mock('../../src/models/BeerExperience');
jest.mock('../../src/models/User');
jest.mock('../../src/models/Brewery');
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('BeerService', () => {
  let beerService: BeerService;
  const mockUserId = new mongoose.Types.ObjectId();
  const mockBeerId = new mongoose.Types.ObjectId();
  const mockBreweryId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    beerService = new BeerService();
    jest.clearAllMocks();
  });

  describe('findBeers', () => {
    it('should find beers with basic filters', async () => {
      const mockBeers = [
        { _id: mockBeerId, name: 'Test Beer', style: 'IPA' },
        { _id: new mongoose.Types.ObjectId(), name: 'Test Beer 2', style: 'Lager' }
      ];

      (Beer.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockBeers)
              })
            })
          })
        })
      });

      (Beer.countDocuments as jest.Mock).mockResolvedValue(2);

      const filter = { style: 'IPA' };
      const sort = { sortBy: 'name', sortOrder: 'asc' } as const;
      const pagination = { page: 1, limit: 10 };

      const result = await beerService.findBeers(filter, sort, pagination);

      expect(result.data).toEqual(mockBeers);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should handle search filter', async () => {
      const searchQuery = 'IPA';
      (Beer.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([])
              })
            })
          })
        })
      });
      (Beer.countDocuments as jest.Mock).mockResolvedValue(0);

      const filter = { search: searchQuery };
      const sort = { sortBy: 'name', sortOrder: 'asc' } as const;
      const pagination = { page: 1, limit: 10 };

      await beerService.findBeers(filter, sort, pagination);

      expect(Beer.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            { name: expect.any(RegExp) },
            { description: expect.any(RegExp) },
            { style: expect.any(RegExp) }
          ])
        })
      );
    });

    it('should handle rating filters', async () => {
      (Beer.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([])
              })
            })
          })
        })
      });
      (Beer.countDocuments as jest.Mock).mockResolvedValue(0);

      const filter = { minRating: 4.0, maxRating: 5.0 };
      const sort = { sortBy: 'name', sortOrder: 'asc' } as const;
      const pagination = { page: 1, limit: 10 };

      await beerService.findBeers(filter, sort, pagination);

      expect(Beer.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            { 'ratings.untappd': { $gte: 4.0, $lte: 5.0 } },
            { 'ratings.beerAdvocate': { $gte: 4.0, $lte: 5.0 } }
          ])
        })
      );
    });
  });

  describe('findBeerById', () => {
    it('should find beer by id', async () => {
      const mockBeer = { _id: mockBeerId, name: 'Test Beer', style: 'IPA' };
      
      (Beer.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockBeer)
      });

      const result = await beerService.findBeerById(mockBeerId);

      expect(result).toEqual(mockBeer);
      expect(Beer.findById).toHaveBeenCalledWith(mockBeerId);
    });

    it('should return null when beer not found', async () => {
      (Beer.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      const result = await beerService.findBeerById(mockBeerId);

      expect(result).toBeNull();
    });
  });

  describe('getBeerDetails', () => {
    it('should throw error when beer not found', async () => {
      jest.spyOn(beerService, 'findBeerById').mockResolvedValue(null);

      await expect(beerService.getBeerDetails(mockBeerId)).rejects.toThrow(AppError);
    });

    it('should get beer details without user experience', async () => {
      const mockBeer = { _id: mockBeerId, name: 'Test Beer', style: 'IPA' };
      
      jest.spyOn(beerService, 'findBeerById').mockResolvedValue(mockBeer as any);

      const result = await beerService.getBeerDetails(mockBeerId);

      expect(result.beer).toEqual(mockBeer);
      expect(result.userExperience).toBeUndefined();
    });

    it('should get beer details with user experience', async () => {
      const mockBeer = { _id: mockBeerId, name: 'Test Beer', style: 'IPA' };
      const mockExperience = { 
        _id: new mongoose.Types.ObjectId(), 
        user: mockUserId, 
        beer: mockBeerId, 
        rating: 4.5 
      };

      jest.spyOn(beerService, 'findBeerById').mockResolvedValue(mockBeer as any);
      (BeerExperience.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockExperience)
      });

      const result = await beerService.getBeerDetails(mockBeerId, mockUserId);

      expect(result.beer).toEqual(mockBeer);
      expect(result.userExperience).toEqual(mockExperience);
    });
  });

  describe('createOrUpdateExperience', () => {
    it('should throw error when beer not found', async () => {
      jest.spyOn(beerService, 'findBeerById').mockResolvedValue(null);

      await expect(
        beerService.createOrUpdateExperience(mockBeerId, mockUserId, { rating: 4.5 })
      ).rejects.toThrow(AppError);
    });

    it('should create new experience', async () => {
      const mockBeer = { _id: mockBeerId, name: 'Test Beer', style: 'IPA' };
      const mockExperience = {
        _id: new mongoose.Types.ObjectId(),
        user: mockUserId,
        beer: mockBeerId,
        rating: 4.5,
        isNew: true,
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(beerService, 'findBeerById').mockResolvedValue(mockBeer as any);
      (BeerExperience.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });
      (BeerExperience as any).mockImplementation(() => mockExperience);

      const result = await beerService.createOrUpdateExperience(mockBeerId, mockUserId, {
        rating: 4.5
      });

      expect(result).toEqual(mockExperience);
      expect(mockExperience.save).toHaveBeenCalled();
    });
  });

  describe('getRecommendations', () => {
    it('should return empty array when user not found', async () => {
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null)
        })
      });

      const result = await beerService.getRecommendations(mockUserId);

      expect(result).toEqual([]);
    });

    it('should return recommendations based on user preferences', async () => {
      const mockUser = { _id: mockUserId, favoriteStyles: ['IPA', 'Stout'] };
      const mockRecommendations = [
        { 
          beer: { _id: mockBeerId, name: 'Recommended Beer', style: 'IPA' },
          score: 0.9,
          reasons: ['Similar to your favorite styles']
        }
      ];

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockUser)
        })
      });

      (Beer.aggregate as jest.Mock).mockResolvedValue(mockRecommendations);

      const result = await beerService.getRecommendations(mockUserId, 5);

      expect(result).toEqual(mockRecommendations);
      expect(Beer.aggregate).toHaveBeenCalled();
    });
  });

  describe('getTrendingBeers', () => {
    it('should return trending beers', async () => {
      const mockTrendingBeers = [
        {
          beer: { _id: mockBeerId, name: 'Trending Beer', style: 'IPA' },
          trendingScore: 0.95,
          recentExperiences: 15,
          averageRating: 4.5
        }
      ];

      (BeerExperience.aggregate as jest.Mock).mockResolvedValue(mockTrendingBeers);

      const result = await beerService.getTrendingBeers('7d', 10);

      expect(result).toEqual(mockTrendingBeers);
      expect(BeerExperience.aggregate).toHaveBeenCalled();
    });

    it('should use correct timeframe filter', async () => {
      (BeerExperience.aggregate as jest.Mock).mockResolvedValue([]);

      await beerService.getTrendingBeers('1d', 5);

      const aggregateCall = (BeerExperience.aggregate as jest.Mock).mock.calls[0][0];
      const matchStage = aggregateCall.find((stage: any) => stage.$match);
      
      expect(matchStage.$match.timestamp.$gte).toBeInstanceOf(Date);
    });
  });

  describe('getBeerStyles', () => {
    it('should return beer styles without user data', async () => {
      const mockStyles = [
        { _id: 'IPA', totalBeers: 50, averageABV: 6.5 },
        { _id: 'Stout', totalBeers: 30, averageABV: 7.2 }
      ];

      (Beer.aggregate as jest.Mock).mockResolvedValue(mockStyles);

      const result = await beerService.getBeerStyles();

      expect(result).toEqual(mockStyles);
      expect(Beer.aggregate).toHaveBeenCalled();
    });

    it('should return beer styles with user preferences', async () => {
      const mockStyles = [
        { 
          _id: 'IPA', 
          totalBeers: 50, 
          averageABV: 6.5,
          userExperiences: 5,
          userAverageRating: 4.2
        }
      ];

      (BeerExperience.aggregate as jest.Mock).mockResolvedValue(mockStyles);

      const result = await beerService.getBeerStyles(mockUserId);

      expect(result).toEqual(mockStyles);
      expect(BeerExperience.aggregate).toHaveBeenCalled();
    });
  });
});