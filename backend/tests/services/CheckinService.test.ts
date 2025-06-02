import mongoose from 'mongoose';
import { CheckinService } from '../../src/services/CheckinService';
import Checkin from '../../src/models/Checkin';
import User from '../../src/models/User';
import { AppError } from '../../src/utils/AppError';

// Mock models
jest.mock('../../src/models/Checkin');
jest.mock('../../src/models/User');
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('CheckinService', () => {
  let checkinService: CheckinService;
  const mockUserId = new mongoose.Types.ObjectId();
  const mockCheckinId = new mongoose.Types.ObjectId();
  const mockBreweryId = new mongoose.Types.ObjectId();
  const mockBeerId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    checkinService = new CheckinService();
    jest.clearAllMocks();
  });

  describe('createCheckin', () => {
    it('should create a new checkin', async () => {
      const checkinData = {
        breweryId: mockBreweryId,
        beerId: mockBeerId,
        rating: 4.5,
        notes: 'Great beer!',
        flavorProfile: { bitter: 7, sweet: 3, sour: 2, malty: 5, hoppy: 8 }
      };

      const mockCheckin = {
        _id: mockCheckinId,
        user: mockUserId,
        brewery: mockBreweryId,
        beer: mockBeerId,
        rating: 4.5,
        notes: 'Great beer!',
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockReturnThis(),
        toObject: jest.fn().mockReturnValue({
          _id: mockCheckinId,
          user: { username: 'testuser' },
          brewery: { name: 'Test Brewery' },
          beer: { name: 'Test Beer' },
          rating: 4.5,
          notes: 'Great beer!',
          timestamp: new Date()
        })
      };

      (Checkin as any).mockImplementation(() => mockCheckin);

      const result = await checkinService.createCheckin(mockUserId, checkinData);

      expect(Checkin).toHaveBeenCalledWith(
        expect.objectContaining({
          user: mockUserId,
          brewery: mockBreweryId,
          beer: mockBeerId,
          rating: 4.5,
          notes: 'Great beer!'
        })
      );
      expect(mockCheckin.save).toHaveBeenCalled();
      expect(result.user).toEqual({ username: 'testuser' });
    });

    it('should create checkin without beer', async () => {
      const checkinData = {
        breweryId: mockBreweryId,
        rating: 4.0
      };

      const mockCheckin = {
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockReturnThis(),
        toObject: jest.fn().mockReturnValue({
          _id: mockCheckinId,
          user: { username: 'testuser' },
          brewery: { name: 'Test Brewery' },
          rating: 4.0,
          timestamp: new Date()
        })
      };

      (Checkin as any).mockImplementation(() => mockCheckin);

      const result = await checkinService.createCheckin(mockUserId, checkinData);

      expect(Checkin).toHaveBeenCalledWith(
        expect.objectContaining({
          user: mockUserId,
          brewery: mockBreweryId,
          beer: undefined,
          rating: 4.0
        })
      );
    });
  });

  describe('findCheckins', () => {
    it('should find checkins with filters', async () => {
      const mockCheckins = [
        { _id: mockCheckinId, user: mockUserId, brewery: mockBreweryId }
      ];

      (Checkin.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                  populate: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue(mockCheckins)
                  })
                })
              })
            })
          })
        })
      });

      (Checkin.countDocuments as jest.Mock).mockResolvedValue(1);

      const filter = { userId: mockUserId };
      const sort = { sortBy: 'timestamp', sortOrder: 'desc' } as const;
      const pagination = { page: 1, limit: 20 };

      const result = await checkinService.findCheckins(filter, sort, pagination);

      expect(result.data).toEqual(mockCheckins);
      expect(result.pagination.total).toBe(1);
      expect(Checkin.find).toHaveBeenCalledWith(
        expect.objectContaining({ user: mockUserId })
      );
    });

    it('should apply date range filter', async () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-12-31');

      (Checkin.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                  populate: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue([])
                  })
                })
              })
            })
          })
        })
      });

      (Checkin.countDocuments as jest.Mock).mockResolvedValue(0);

      const filter = { startDate, endDate };
      const sort = { sortBy: 'timestamp', sortOrder: 'desc' } as const;
      const pagination = { page: 1, limit: 20 };

      await checkinService.findCheckins(filter, sort, pagination);

      expect(Checkin.find).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: { $gte: startDate, $lte: endDate }
        })
      );
    });
  });

  describe('findCheckinById', () => {
    it('should find checkin by id', async () => {
      const mockCheckin = { _id: mockCheckinId, user: mockUserId };

      (Checkin.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(mockCheckin)
            })
          })
        })
      });

      const result = await checkinService.findCheckinById(mockCheckinId);

      expect(result).toEqual(mockCheckin);
      expect(Checkin.findById).toHaveBeenCalledWith(mockCheckinId);
    });
  });

  describe('updateCheckin', () => {
    it('should throw error when checkin not found', async () => {
      (Checkin.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        checkinService.updateCheckin(mockCheckinId, mockUserId, { rating: 5.0 })
      ).rejects.toThrow(AppError);
    });

    it('should throw error when user not authorized', async () => {
      const mockCheckin = { 
        _id: mockCheckinId, 
        user: new mongoose.Types.ObjectId() // different user
      };

      (Checkin.findById as jest.Mock).mockResolvedValue(mockCheckin);

      await expect(
        checkinService.updateCheckin(mockCheckinId, mockUserId, { rating: 5.0 })
      ).rejects.toThrow(AppError);
    });

    it('should update checkin successfully', async () => {
      const mockCheckin = { 
        _id: mockCheckinId, 
        user: mockUserId,
        toString: () => mockUserId.toString()
      };

      const updatedCheckin = {
        _id: mockCheckinId,
        user: mockUserId,
        rating: 5.0,
        toObject: jest.fn().mockReturnValue({
          _id: mockCheckinId,
          user: mockUserId,
          rating: 5.0,
          notes: 'Updated notes'
        })
      };

      (Checkin.findById as jest.Mock).mockResolvedValue(mockCheckin);
      (Checkin.findByIdAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(updatedCheckin)
          })
        })
      });

      const result = await checkinService.updateCheckin(mockCheckinId, mockUserId, {
        rating: 5.0,
        notes: 'Updated notes'
      });

      expect(result).toEqual(updatedCheckin.toObject());
      expect(Checkin.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCheckinId,
        expect.objectContaining({ rating: 5.0, notes: 'Updated notes' }),
        expect.objectContaining({ new: true, runValidators: true })
      );
    });
  });

  describe('deleteCheckin', () => {
    it('should throw error when checkin not found', async () => {
      (Checkin.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        checkinService.deleteCheckin(mockCheckinId, mockUserId)
      ).rejects.toThrow(AppError);
    });

    it('should throw error when user not authorized', async () => {
      const mockCheckin = { 
        _id: mockCheckinId, 
        user: new mongoose.Types.ObjectId() // different user
      };

      (Checkin.findById as jest.Mock).mockResolvedValue(mockCheckin);

      await expect(
        checkinService.deleteCheckin(mockCheckinId, mockUserId)
      ).rejects.toThrow(AppError);
    });

    it('should delete checkin successfully', async () => {
      const mockCheckin = { 
        _id: mockCheckinId, 
        user: mockUserId,
        toString: () => mockUserId.toString()
      };

      (Checkin.findById as jest.Mock).mockResolvedValue(mockCheckin);
      (Checkin.findByIdAndDelete as jest.Mock).mockResolvedValue(mockCheckin);

      await checkinService.deleteCheckin(mockCheckinId, mockUserId);

      expect(Checkin.findByIdAndDelete).toHaveBeenCalledWith(mockCheckinId);
    });
  });

  describe('getUserStatistics', () => {
    it('should return user statistics', async () => {
      const mockStats = [
        {
          totalCheckins: 10,
          uniqueBeers: 8,
          uniqueBreweries: 5,
          averageRating: 4.2,
          styles: ['IPA', 'IPA', 'Stout', 'Lager']
        }
      ];

      (Checkin.aggregate as jest.Mock).mockResolvedValue(mockStats);
      (Checkin.countDocuments as jest.Mock).mockResolvedValue(3); // this month

      const result = await checkinService.getUserStatistics(mockUserId, 'all');

      expect(result.totalCheckins).toBe(10);
      expect(result.uniqueBeers).toBe(8);
      expect(result.uniqueBreweries).toBe(5);
      expect(result.averageRating).toBe(4.2);
      expect(result.checkinsThisMonth).toBe(3);
    });

    it('should apply timeframe filter', async () => {
      (Checkin.aggregate as jest.Mock).mockResolvedValue([]);
      (Checkin.countDocuments as jest.Mock).mockResolvedValue(0);

      await checkinService.getUserStatistics(mockUserId, 'week');

      const aggregateCall = (Checkin.aggregate as jest.Mock).mock.calls[0][0];
      const matchStage = aggregateCall.find((stage: any) => stage.$match);
      
      expect(matchStage.$match.timestamp.$gte).toBeInstanceOf(Date);
    });
  });

  describe('getFriendsActivity', () => {
    it('should throw error when user not found', async () => {
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(
        checkinService.getFriendsActivity(mockUserId, { page: 1, limit: 20 })
      ).rejects.toThrow(AppError);
    });

    it('should return friends activity', async () => {
      const friendId = new mongoose.Types.ObjectId();
      const mockUser = { 
        _id: mockUserId, 
        friends: [friendId] 
      };

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      // Mock the findCheckins method
      jest.spyOn(checkinService, 'findCheckins').mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      });

      const result = await checkinService.getFriendsActivity(mockUserId, { page: 1, limit: 20 });

      expect(result.data).toEqual([]);
      expect(checkinService.findCheckins).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: expect.objectContaining({ $in: [friendId, mockUserId] })
        }),
        expect.any(Object),
        expect.any(Object)
      );
    });
  });

  describe('Missing coverage tests', () => {
    it('should handle string breweryId and beerId in filters', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };

      (Checkin.find as jest.Mock).mockReturnValue(mockQuery);
      (Checkin.countDocuments as jest.Mock).mockResolvedValue(0);

      // Test with string breweryId and beerId to cover lines 67, 73
      await checkinService.findCheckins(
        { 
          breweryId: '507f1f77bcf86cd799439011',
          beerId: '507f1f77bcf86cd799439012'
        },
        {},
        { page: 1, limit: 20 }
      );

      expect(Checkin.find).toHaveBeenCalled();
    });

    it('should handle month and year timeframes in user statistics', async () => {
      (Checkin.aggregate as jest.Mock).mockResolvedValue([]);
      (Checkin.countDocuments as jest.Mock).mockResolvedValue(0);

      // Test month timeframe (line 206)
      await checkinService.getUserStatistics(mockUserId, 'month');
      
      // Test year timeframe (line 209)
      await checkinService.getUserStatistics(mockUserId, 'year');

      expect(Checkin.aggregate).toHaveBeenCalledTimes(2);
    });

    it('should test getBreweryCheckins method', async () => {
      const spy = jest.spyOn(checkinService, 'findCheckins').mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      });

      // Test with ObjectId (lines 288-292)
      await checkinService.getBreweryCheckins(mockBreweryId, { page: 1, limit: 20 });

      expect(spy).toHaveBeenCalledWith(
        { breweryId: mockBreweryId },
        { sortBy: 'timestamp', sortOrder: 'desc' },
        { page: 1, limit: 20 }
      );

      spy.mockRestore();
    });

    it('should test getBeerCheckins method', async () => {
      const mockBeerId = new mongoose.Types.ObjectId();
      const spy = jest.spyOn(checkinService, 'findCheckins').mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      });

      // Test getBeerCheckins (lines 295-303)
      await checkinService.getBeerCheckins(mockBeerId, { page: 1, limit: 20 });

      expect(spy).toHaveBeenCalledWith(
        { beerId: mockBeerId },
        { sortBy: 'timestamp', sortOrder: 'desc' },
        { page: 1, limit: 20 }
      );

      spy.mockRestore();
    });

    it('should handle update checkin failure', async () => {
      const checkinId = new mongoose.Types.ObjectId();
      const updateData = { rating: 4.5 };

      // Mock findByIdAndUpdate to return null (failure case)
      (Checkin.findByIdAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis().mockReturnValue({
          populate: jest.fn().mockReturnThis().mockReturnValue({
            populate: jest.fn().mockReturnThis().mockReturnValue({
              populate: jest.fn().mockResolvedValue(null) // Simulate update failure
            })
          })
        })
      });

      // This should trigger the error on line 161
      await expect(
        checkinService.updateCheckin(checkinId, mockUserId, updateData)
      ).rejects.toThrow('Failed to update checkin');
    });
  });
});