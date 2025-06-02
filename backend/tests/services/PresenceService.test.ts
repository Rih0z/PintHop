import mongoose from 'mongoose';
import { PresenceService } from '../../src/services/PresenceService';
import Presence from '../../src/models/Presence';
import User from '../../src/models/User';
import { AppError } from '../../src/utils/AppError';

// Mock models
jest.mock('../../src/models/Presence');
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

describe('PresenceService', () => {
  let presenceService: PresenceService;
  const mockUserId = new mongoose.Types.ObjectId();
  const mockPresenceId = new mongoose.Types.ObjectId();
  const mockBreweryId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    presenceService = new PresenceService();
    jest.clearAllMocks();
  });

  describe('createPresence', () => {
    it('should create a new presence', async () => {
      const presenceData = {
        breweryId: mockBreweryId,
        status: 'arrived' as const,
        visibility: 'public' as const,
        location: { latitude: 47.6062, longitude: -122.3321 },
        notes: 'Great brewery!'
      };

      const mockPresence = {
        _id: mockPresenceId,
        user: mockUserId,
        brewery: mockBreweryId,
        status: 'arrived',
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            _id: mockPresenceId,
            user: { username: 'testuser' },
            brewery: { name: 'Test Brewery' }
          })
        }),
        toObject: jest.fn().mockReturnValue({
          _id: mockPresenceId,
          user: mockUserId,
          brewery: mockBreweryId,
          status: 'arrived',
          visibility: 'public',
          location: { latitude: 47.6062, longitude: -122.3321 },
          notes: 'Great brewery!',
          timestamp: new Date(),
          isActive: true
        })
      };

      // Mock endActivePresence
      jest.spyOn(presenceService, 'endActivePresence').mockResolvedValue();
      // Mock notifyNearbyUsers
      jest.spyOn(presenceService, 'notifyNearbyUsers').mockResolvedValue();

      (Presence as any).mockImplementation(() => mockPresence);

      const result = await presenceService.createPresence(mockUserId, presenceData);

      expect(presenceService.endActivePresence).toHaveBeenCalledWith(mockUserId);
      expect(Presence).toHaveBeenCalledWith(
        expect.objectContaining({
          user: mockUserId,
          brewery: mockBreweryId,
          status: 'arrived',
          visibility: 'public',
          isActive: true
        })
      );
      expect(mockPresence.save).toHaveBeenCalled();
      expect(presenceService.notifyNearbyUsers).toHaveBeenCalledWith(result);
    });

    it('should not notify when visibility is private', async () => {
      const presenceData = {
        breweryId: mockBreweryId,
        status: 'arrived' as const,
        visibility: 'private' as const
      };

      const mockPresence = {
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            _id: mockPresenceId,
            visibility: 'private'
          })
        }),
        toObject: jest.fn().mockReturnValue({
          _id: mockPresenceId,
          user: mockUserId,
          brewery: mockBreweryId,
          status: 'arrived',
          visibility: 'private',
          timestamp: new Date(),
          isActive: true
        })
      };

      jest.spyOn(presenceService, 'endActivePresence').mockResolvedValue();
      jest.spyOn(presenceService, 'notifyNearbyUsers').mockResolvedValue();

      (Presence as any).mockImplementation(() => mockPresence);

      await presenceService.createPresence(mockUserId, presenceData);

      expect(presenceService.notifyNearbyUsers).not.toHaveBeenCalled();
    });
  });

  describe('findPresences', () => {
    it('should find presences with filters', async () => {
      const mockPresences = [
        { _id: mockPresenceId, user: mockUserId, brewery: mockBreweryId }
      ];

      (Presence.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                  lean: jest.fn().mockResolvedValue(mockPresences)
                })
              })
            })
          })
        })
      });

      (Presence.countDocuments as jest.Mock).mockResolvedValue(1);

      const filter = { userId: mockUserId, isActive: true };
      const sort = { sortBy: 'timestamp', sortOrder: 'desc' } as const;
      const pagination = { page: 1, limit: 20 };

      const result = await presenceService.findPresences(filter, sort, pagination);

      expect(result.data).toEqual(mockPresences);
      expect(result.pagination.total).toBe(1);
      expect(Presence.find).toHaveBeenCalledWith(
        expect.objectContaining({ 
          user: mockUserId,
          isActive: true
        })
      );
    });

    it('should apply location filter', async () => {
      const nearLocation = {
        latitude: 47.6062,
        longitude: -122.3321,
        radiusKm: 5
      };

      (Presence.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                  lean: jest.fn().mockResolvedValue([])
                })
              })
            })
          })
        })
      });

      (Presence.countDocuments as jest.Mock).mockResolvedValue(0);

      const filter = { nearLocation };
      const sort = { sortBy: 'timestamp', sortOrder: 'desc' } as const;
      const pagination = { page: 1, limit: 20 };

      await presenceService.findPresences(filter, sort, pagination);

      expect(Presence.find).toHaveBeenCalledWith(
        expect.objectContaining({
          location: expect.objectContaining({
            $near: expect.objectContaining({
              $geometry: {
                type: 'Point',
                coordinates: [-122.3321, 47.6062]
              },
              $maxDistance: 5000
            })
          })
        })
      );
    });
  });

  describe('updatePresence', () => {
    it('should throw error when presence not found', async () => {
      (Presence.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        presenceService.updatePresence(mockPresenceId, mockUserId, { status: 'departed' })
      ).rejects.toThrow(AppError);
    });

    it('should throw error when user not authorized', async () => {
      const mockPresence = { 
        _id: mockPresenceId, 
        user: new mongoose.Types.ObjectId() // different user
      };

      (Presence.findById as jest.Mock).mockResolvedValue(mockPresence);

      await expect(
        presenceService.updatePresence(mockPresenceId, mockUserId, { status: 'departed' })
      ).rejects.toThrow(AppError);
    });

    it('should update presence successfully', async () => {
      const mockPresence = { 
        _id: mockPresenceId, 
        user: mockUserId,
        toString: () => mockUserId.toString()
      };

      const updatedPresence = {
        _id: mockPresenceId,
        user: mockUserId,
        status: 'departed',
        isActive: false,
        toObject: jest.fn().mockReturnValue({
          _id: mockPresenceId,
          user: mockUserId,
          status: 'departed',
          isActive: false
        })
      };

      (Presence.findById as jest.Mock).mockResolvedValue(mockPresence);
      (Presence.findByIdAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(updatedPresence)
        })
      });

      const result = await presenceService.updatePresence(mockPresenceId, mockUserId, {
        status: 'departed',
        notes: 'Great visit!'
      });

      expect(result).toEqual(updatedPresence.toObject());
      expect(Presence.findByIdAndUpdate).toHaveBeenCalledWith(
        mockPresenceId,
        expect.objectContaining({ 
          status: 'departed',
          isActive: false,
          departureTime: expect.any(Date),
          notes: 'Great visit!'
        }),
        expect.objectContaining({ new: true, runValidators: true })
      );
    });
  });

  describe('endActivePresence', () => {
    it('should end all active presences for user', async () => {
      (Presence.updateMany as jest.Mock).mockResolvedValue({ modifiedCount: 2 });

      await presenceService.endActivePresence(mockUserId);

      expect(Presence.updateMany).toHaveBeenCalledWith(
        {
          user: mockUserId,
          isActive: true
        },
        {
          isActive: false,
          status: 'departed',
          departureTime: expect.any(Date)
        }
      );
    });
  });

  describe('findNearbyPresences', () => {
    it('should find nearby presences', async () => {
      const mockNearbyPresences = [
        {
          _id: mockPresenceId,
          user: { username: 'nearbyuser' },
          brewery: { name: 'Nearby Brewery' },
          distance: 0.5
        }
      ];

      (Presence.aggregate as jest.Mock).mockResolvedValue(mockNearbyPresences);

      const result = await presenceService.findNearbyPresences(
        47.6062, -122.3321, 5, mockUserId
      );

      expect(result).toEqual(mockNearbyPresences);
      expect(Presence.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: expect.objectContaining({
              isActive: true,
              visibility: { $in: ['public', 'friends'] },
              user: { $ne: mockUserId }
            })
          })
        ])
      );
    });
  });

  describe('getBreweryActivePresences', () => {
    it('should return active presences at brewery', async () => {
      const mockPresences = [
        { _id: mockPresenceId, user: mockUserId, brewery: mockBreweryId }
      ];

      (Presence.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(mockPresences)
            })
          })
        })
      });

      const result = await presenceService.getBreweryActivePresences(mockBreweryId);

      expect(result).toEqual(mockPresences);
      expect(Presence.find).toHaveBeenCalledWith({
        brewery: mockBreweryId,
        isActive: true,
        visibility: { $in: ['public', 'friends'] }
      });
    });
  });

  describe('getFriendsPresences', () => {
    it('should throw error when user not found', async () => {
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(
        presenceService.getFriendsPresences(mockUserId, { page: 1, limit: 20 })
      ).rejects.toThrow(AppError);
    });

    it('should return friends presences', async () => {
      const friendId = new mongoose.Types.ObjectId();
      const mockUser = { 
        _id: mockUserId, 
        friends: [friendId] 
      };

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      // Mock the findPresences method
      jest.spyOn(presenceService, 'findPresences').mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      });

      const result = await presenceService.getFriendsPresences(mockUserId, { page: 1, limit: 20 });

      expect(result.data).toEqual([]);
      expect(presenceService.findPresences).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: expect.objectContaining({ $in: [friendId] })
        }),
        expect.any(Object),
        expect.any(Object)
      );
    });
  });

  describe('getUserStatistics', () => {
    it('should return user presence statistics', async () => {
      const mockStats = [
        {
          totalVisits: 15,
          uniqueBreweries: 8,
          breweryVisits: [
            { brewery: mockBreweryId, breweryName: 'Test Brewery', duration: 3600000 }
          ]
        }
      ];

      const mockMonthlyStats = [
        { _id: { year: 2023, month: 12 }, count: 5 }
      ];

      (Presence.aggregate as jest.Mock)
        .mockResolvedValueOnce(mockStats)
        .mockResolvedValueOnce(mockMonthlyStats);

      const result = await presenceService.getUserStatistics(mockUserId, 'all');

      expect(result.totalVisits).toBe(15);
      expect(result.uniqueBreweries).toBe(8);
      expect(result.monthlyVisits).toHaveLength(1);
      expect(result.monthlyVisits[0].month).toBe('2023-12');
      expect(result.monthlyVisits[0].count).toBe(5);
    });

    it('should apply timeframe filter', async () => {
      (Presence.aggregate as jest.Mock).mockResolvedValue([]);

      await presenceService.getUserStatistics(mockUserId, 'week');

      const aggregateCall = (Presence.aggregate as jest.Mock).mock.calls[0][0];
      const matchStage = aggregateCall.find((stage: any) => stage.$match);
      
      expect(matchStage.$match.timestamp.$gte).toBeInstanceOf(Date);
    });
  });

  describe('notifyNearbyUsers', () => {
    it('should return early if no location', async () => {
      const presenceWithoutLocation = {
        _id: mockPresenceId,
        user: mockUserId,
        brewery: mockBreweryId,
        location: undefined
      };

      await presenceService.notifyNearbyUsers(presenceWithoutLocation as any);

      // Should not throw or call any other methods
      // This is a basic test since the method currently only logs
    });

    it('should log notification for presence with location', async () => {
      const presenceWithLocation = {
        _id: mockPresenceId,
        user: mockUserId,
        brewery: mockBreweryId,
        location: { latitude: 47.6062, longitude: -122.3321 }
      };

      await presenceService.notifyNearbyUsers(presenceWithLocation as any, 2);

      // Should complete without throwing
      // In a real implementation, this would test actual notification logic
    });
  });
});