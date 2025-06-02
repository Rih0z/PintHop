import { Types } from 'mongoose';
import { TaplistService } from '../../src/services/TaplistService';
import { Taplist } from '../../src/models/Taplist';
import { logger } from '../../src/utils/logger';
import { AppError, ErrorCodes } from '../../src/utils/AppError';

// Mock dependencies
jest.mock('../../src/models/Taplist');
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));
jest.mock('../../src/utils/AppError');

const MockedTaplist = Taplist as jest.MockedClass<typeof Taplist>;
const mockedLogger = logger as jest.Mocked<typeof logger>;

// Mock AppError
const MockedAppError = AppError as jest.MockedClass<typeof AppError>;
MockedAppError.mockImplementation((statusCode: number, errorCode: string, message: string) => {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  error.errorCode = errorCode;
  return error;
});

describe('TaplistService', () => {
  let taplistService: TaplistService;
  let mockTaplist: any;

  beforeEach(() => {
    jest.clearAllMocks();
    taplistService = new TaplistService();
    
    mockTaplist = {
      _id: new Types.ObjectId(),
      brewery: new Types.ObjectId(),
      uploadedBy: new Types.ObjectId(),
      timestamp: new Date(),
      photoUrl: 'https://example.com/photo.jpg',
      beers: [],
      extractedBeers: [],
      ocrText: 'Sample OCR text',
      ocrProcessed: true,
      ocrConfidence: 0.85,
      verificationVotes: [],
      isActive: true,
      notes: 'Test notes',
      source: 'photo',
      save: jest.fn().mockResolvedValue(undefined),
      toString: jest.fn().mockReturnValue('mock-id')
    };
  });

  describe('createTaplist', () => {
    it('should create a new taplist with string userId and breweryId', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const createData = {
        breweryId: '507f1f77bcf86cd799439012',
        photoUrl: 'https://example.com/photo.jpg',
        notes: 'Test notes',
        extractedBeers: [],
        ocrText: 'Sample text',
        ocrProcessed: true,
        ocrConfidence: 0.85
      };

      const mockDeactivateOldTaplists = jest.spyOn(taplistService, 'deactivateOldTaplists')
        .mockResolvedValue(undefined);

      MockedTaplist.mockImplementation(() => mockTaplist);

      const result = await taplistService.createTaplist(userId, createData);

      expect(mockDeactivateOldTaplists).toHaveBeenCalledWith(expect.any(Types.ObjectId));
      expect(MockedTaplist).toHaveBeenCalledWith({
        brewery: expect.any(Types.ObjectId),
        uploadedBy: expect.any(Types.ObjectId),
        photoUrl: createData.photoUrl,
        notes: createData.notes,
        extractedBeers: createData.extractedBeers,
        ocrText: createData.ocrText,
        ocrProcessed: createData.ocrProcessed,
        ocrConfidence: createData.ocrConfidence,
        source: 'photo',
        isActive: true
      });
      expect(mockTaplist.save).toHaveBeenCalled();
      expect(mockedLogger.info).toHaveBeenCalled();
      expect(result).toBe(mockTaplist);
    });

    it('should create a new taplist with ObjectId userId and breweryId', async () => {
      const userId = new Types.ObjectId();
      const breweryId = new Types.ObjectId();
      const createData = {
        breweryId: breweryId,
        photoUrl: 'https://example.com/photo.jpg'
      };

      const mockDeactivateOldTaplists = jest.spyOn(taplistService, 'deactivateOldTaplists')
        .mockResolvedValue(undefined);

      MockedTaplist.mockImplementation(() => mockTaplist);

      const result = await taplistService.createTaplist(userId, createData);

      expect(mockDeactivateOldTaplists).toHaveBeenCalledWith(breweryId);
      expect(MockedTaplist).toHaveBeenCalledWith({
        brewery: breweryId,
        uploadedBy: userId,
        photoUrl: createData.photoUrl,
        notes: undefined,
        extractedBeers: [],
        ocrText: undefined,
        ocrProcessed: false,
        ocrConfidence: undefined,
        source: 'photo',
        isActive: true
      });
      expect(result).toBe(mockTaplist);
    });
  });

  describe('findTaplists', () => {
    let mockPaginationResult: any;

    beforeEach(() => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockTaplist])
      };

      MockedTaplist.find = jest.fn().mockReturnValue(mockQuery);
      MockedTaplist.countDocuments = jest.fn().mockResolvedValue(1);
      
      mockPaginationResult = {
        taplists: [mockTaplist],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1
        }
      };
    });

    it('should find taplists with default parameters', async () => {
      const filter = {};
      const sort = {};
      const pagination = { page: 1, limit: 20 };

      const result = await taplistService.findTaplists(filter, sort, pagination);

      expect(MockedTaplist.countDocuments).toHaveBeenCalledWith({});
      expect(MockedTaplist.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockPaginationResult);
    });

    it('should find taplists with brewery filter (string)', async () => {
      const filter = { brewery: '507f1f77bcf86cd799439012' };
      const sort = {};
      const pagination = { page: 1, limit: 20 };

      await taplistService.findTaplists(filter, sort, pagination);

      expect(MockedTaplist.find).toHaveBeenCalledWith({ brewery: '507f1f77bcf86cd799439012' });
    });

    it('should find taplists with activeOnly filter', async () => {
      const filter = { activeOnly: true };
      const sort = {};
      const pagination = { page: 1, limit: 20 };

      await taplistService.findTaplists(filter, sort, pagination);

      expect(MockedTaplist.find).toHaveBeenCalledWith({ isActive: true });
    });

    it('should find taplists with freshOnly filter', async () => {
      const filter = { freshOnly: true };
      const sort = {};
      const pagination = { page: 1, limit: 20 };

      await taplistService.findTaplists(filter, sort, pagination);

      expect(MockedTaplist.find).toHaveBeenCalledWith({ 
        timestamp: { $gte: expect.any(Date) }
      });
    });

    it('should find taplists with search filter', async () => {
      const filter = { search: 'IPA' };
      const sort = {};
      const pagination = { page: 1, limit: 20 };

      await taplistService.findTaplists(filter, sort, pagination);

      expect(MockedTaplist.find).toHaveBeenCalledWith({ 
        $text: { $search: 'IPA' }
      });
    });

    it('should sort by reliability (fallback to timestamp)', async () => {
      const filter = {};
      const sort = { sortBy: 'reliability' as const, sortOrder: 'desc' as const };
      const pagination = { page: 1, limit: 20 };

      await taplistService.findTaplists(filter, sort, pagination);

      const mockQuery = (MockedTaplist.find as jest.Mock).mock.results[0].value;
      expect(mockQuery.sort).toHaveBeenCalledWith({ timestamp: -1 });
    });

    it('should sort by timestamp in ascending order', async () => {
      const filter = {};
      const sort = { sortBy: 'timestamp' as const, sortOrder: 'asc' as const };
      const pagination = { page: 1, limit: 20 };

      await taplistService.findTaplists(filter, sort, pagination);

      const mockQuery = (MockedTaplist.find as jest.Mock).mock.results[0].value;
      expect(mockQuery.sort).toHaveBeenCalledWith({ timestamp: 1 });
    });

    it('should handle pagination correctly', async () => {
      const filter = {};
      const sort = {};
      const pagination = { page: 2, limit: 10 };

      MockedTaplist.countDocuments = jest.fn().mockResolvedValue(25);

      const result = await taplistService.findTaplists(filter, sort, pagination);

      const mockQuery = (MockedTaplist.find as jest.Mock).mock.results[0].value;
      expect(mockQuery.skip).toHaveBeenCalledWith(10);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(result.pagination.pages).toBe(3);
    });

    it('should combine multiple filters', async () => {
      const filter = { 
        brewery: '507f1f77bcf86cd799439012',
        activeOnly: true,
        freshOnly: true,
        search: 'IPA'
      };
      const sort = {};
      const pagination = { page: 1, limit: 20 };

      await taplistService.findTaplists(filter, sort, pagination);

      expect(MockedTaplist.find).toHaveBeenCalledWith({ 
        brewery: '507f1f77bcf86cd799439012',
        isActive: true,
        timestamp: { $gte: expect.any(Date) },
        $text: { $search: 'IPA' }
      });
    });
  });

  describe('findTaplistById', () => {
    it('should find taplist by string ID', async () => {
      const taplistId = '507f1f77bcf86cd799439013';
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockTaplist)
      };

      MockedTaplist.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await taplistService.findTaplistById(taplistId);

      expect(MockedTaplist.findById).toHaveBeenCalledWith(expect.any(Types.ObjectId));
      expect(result).toBe(mockTaplist);
    });

    it('should find taplist by ObjectId', async () => {
      const taplistId = new Types.ObjectId();
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockTaplist)
      };

      MockedTaplist.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await taplistService.findTaplistById(taplistId);

      expect(MockedTaplist.findById).toHaveBeenCalledWith(taplistId);
      expect(result).toBe(mockTaplist);
    });

    it('should return null when taplist not found', async () => {
      const taplistId = '507f1f77bcf86cd799439099';
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null)
      };

      MockedTaplist.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await taplistService.findTaplistById(taplistId);

      expect(result).toBeNull();
    });
  });

  describe('addVerification', () => {
    it('should add new verification vote', async () => {
      const taplistId = '507f1f77bcf86cd799439013';
      const userId = '507f1f77bcf86cd799439011';
      const isAccurate = true;
      const comment = 'Looks good!';

      const mockTaplistDoc = {
        ...mockTaplist,
        uploadedBy: new Types.ObjectId(),
        verificationVotes: [],
        save: jest.fn().mockResolvedValue(undefined)
      };

      MockedTaplist.findById = jest.fn().mockResolvedValue(mockTaplistDoc);

      const result = await taplistService.addVerification(taplistId, userId, isAccurate, comment);

      expect(mockTaplistDoc.verificationVotes).toHaveLength(1);
      expect(mockTaplistDoc.verificationVotes[0]).toMatchObject({
        user: expect.any(Types.ObjectId),
        isAccurate,
        timestamp: expect.any(Date),
        comment
      });
      expect(mockTaplistDoc.save).toHaveBeenCalled();
      expect(mockedLogger.info).toHaveBeenCalled();
      expect(result).toBe(mockTaplistDoc);
    });

    it('should update existing verification vote', async () => {
      const taplistId = '507f1f77bcf86cd799439013';
      const userId = new Types.ObjectId();
      const isAccurate = false;

      const mockTaplistDoc = {
        ...mockTaplist,
        uploadedBy: new Types.ObjectId(),
        verificationVotes: [{
          user: userId,
          isAccurate: true,
          timestamp: new Date(),
          comment: 'Old comment'
        }],
        save: jest.fn().mockResolvedValue(undefined)
      };

      // Mock toString method for ObjectId comparison
      userId.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');
      mockTaplistDoc.verificationVotes[0].user.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');

      MockedTaplist.findById = jest.fn().mockResolvedValue(mockTaplistDoc);

      const result = await taplistService.addVerification(taplistId, userId, isAccurate);

      expect(mockTaplistDoc.verificationVotes).toHaveLength(1);
      expect(mockTaplistDoc.verificationVotes[0].isAccurate).toBe(false);
      expect(mockTaplistDoc.save).toHaveBeenCalled();
      expect(result).toBe(mockTaplistDoc);
    });

    it('should throw error when taplist not found', async () => {
      const taplistId = '507f1f77bcf86cd799439099';
      const userId = '507f1f77bcf86cd799439011';

      MockedTaplist.findById = jest.fn().mockResolvedValue(null);

      await expect(taplistService.addVerification(taplistId, userId, true))
        .rejects.toThrow('Taplist not found');
    });

    it('should throw error when user tries to verify own taplist', async () => {
      const taplistId = '507f1f77bcf86cd799439013';
      const userId = new Types.ObjectId();

      const mockTaplistDoc = {
        ...mockTaplist,
        uploadedBy: userId,
        verificationVotes: []
      };

      // Mock toString method
      userId.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');
      mockTaplistDoc.uploadedBy.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');

      MockedTaplist.findById = jest.fn().mockResolvedValue(mockTaplistDoc);

      await expect(taplistService.addVerification(taplistId, userId, true))
        .rejects.toThrow('Cannot verify your own taplist');
    });

    it('should handle addVerification with ObjectId parameters', async () => {
      const taplistId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const isAccurate = true;

      const mockTaplistDoc = {
        ...mockTaplist,
        uploadedBy: new Types.ObjectId(),
        verificationVotes: [],
        save: jest.fn().mockResolvedValue(undefined)
      };

      MockedTaplist.findById = jest.fn().mockResolvedValue(mockTaplistDoc);

      const result = await taplistService.addVerification(taplistId, userId, isAccurate);

      expect(MockedTaplist.findById).toHaveBeenCalledWith(taplistId);
      expect(result).toBe(mockTaplistDoc);
    });
  });

  describe('mapExtractedBeers', () => {
    it('should map extracted beers to beer documents', async () => {
      const taplistId = '507f1f77bcf86cd799439013';
      const userId = new Types.ObjectId();
      const mappings = [
        { extractedBeerIndex: 0, beerId: new Types.ObjectId() },
        { extractedBeerIndex: 1, beerId: '507f1f77bcf86cd799439014' }
      ];

      const mockTaplistDoc = {
        ...mockTaplist,
        uploadedBy: userId,
        extractedBeers: [
          { name: 'Beer 1' },
          { name: 'Beer 2' },
          { name: 'Beer 3' }
        ],
        beers: [],
        save: jest.fn().mockResolvedValue(undefined)
      };

      // Mock toString method
      userId.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');
      mockTaplistDoc.uploadedBy.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');

      MockedTaplist.findById = jest.fn().mockResolvedValue(mockTaplistDoc);

      const result = await taplistService.mapExtractedBeers(taplistId, userId, mappings);

      expect(mockTaplistDoc.beers).toHaveLength(2);
      expect(mockTaplistDoc.save).toHaveBeenCalled();
      expect(mockedLogger.info).toHaveBeenCalled();
      expect(result).toBe(mockTaplistDoc);
    });

    it('should handle invalid extracted beer indices', async () => {
      const taplistId = '507f1f77bcf86cd799439013';
      const userId = new Types.ObjectId();
      const mappings = [
        { extractedBeerIndex: -1, beerId: new Types.ObjectId() },
        { extractedBeerIndex: 10, beerId: '507f1f77bcf86cd799439014' }
      ];

      const mockTaplistDoc = {
        ...mockTaplist,
        uploadedBy: userId,
        extractedBeers: [{ name: 'Beer 1' }],
        beers: [],
        save: jest.fn().mockResolvedValue(undefined)
      };

      userId.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');
      mockTaplistDoc.uploadedBy.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');

      MockedTaplist.findById = jest.fn().mockResolvedValue(mockTaplistDoc);

      const result = await taplistService.mapExtractedBeers(taplistId, userId, mappings);

      expect(mockTaplistDoc.beers).toHaveLength(0);
      expect(result).toBe(mockTaplistDoc);
    });

    it('should throw error when taplist not found', async () => {
      const taplistId = '507f1f77bcf86cd799439099';
      const userId = '507f1f77bcf86cd799439011';
      const mappings: Array<{ extractedBeerIndex: number; beerId: string | Types.ObjectId }> = [];

      MockedTaplist.findById = jest.fn().mockResolvedValue(null);

      await expect(taplistService.mapExtractedBeers(taplistId, userId, mappings))
        .rejects.toThrow('Taplist not found');
    });

    it('should throw error when user is not the uploader', async () => {
      const taplistId = '507f1f77bcf86cd799439013';
      const userId = new Types.ObjectId();
      const mappings: Array<{ extractedBeerIndex: number; beerId: string | Types.ObjectId }> = [];

      const mockTaplistDoc = {
        ...mockTaplist,
        uploadedBy: new Types.ObjectId(),
        extractedBeers: []
      };

      userId.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');
      mockTaplistDoc.uploadedBy.toString = jest.fn().mockReturnValue('different-user');

      MockedTaplist.findById = jest.fn().mockResolvedValue(mockTaplistDoc);

      await expect(taplistService.mapExtractedBeers(taplistId, userId, mappings))
        .rejects.toThrow('Only the uploader can map beers');
    });

    it('should handle ObjectId taplistId and userId', async () => {
      const taplistId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const mappings = [
        { extractedBeerIndex: 0, beerId: new Types.ObjectId() }
      ];

      const mockTaplistDoc = {
        ...mockTaplist,
        uploadedBy: userId,
        extractedBeers: [{ name: 'Beer 1' }],
        beers: [],
        save: jest.fn().mockResolvedValue(undefined)
      };

      userId.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');
      mockTaplistDoc.uploadedBy.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');

      MockedTaplist.findById = jest.fn().mockResolvedValue(mockTaplistDoc);

      const result = await taplistService.mapExtractedBeers(taplistId, userId, mappings);

      expect(MockedTaplist.findById).toHaveBeenCalledWith(taplistId);
      expect(result).toBe(mockTaplistDoc);
    });

    it('should handle string beerId in mappings', async () => {
      const taplistId = '507f1f77bcf86cd799439013';
      const userId = new Types.ObjectId();
      const mappings = [
        { extractedBeerIndex: 0, beerId: '507f1f77bcf86cd799439015' }
      ];

      const mockTaplistDoc = {
        ...mockTaplist,
        uploadedBy: userId,
        extractedBeers: [{ name: 'Beer 1' }],
        beers: [],
        save: jest.fn().mockResolvedValue(undefined)
      };

      userId.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');
      mockTaplistDoc.uploadedBy.toString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');

      MockedTaplist.findById = jest.fn().mockResolvedValue(mockTaplistDoc);

      await taplistService.mapExtractedBeers(taplistId, userId, mappings);

      expect(mockTaplistDoc.beers).toHaveLength(1);
      expect(mockTaplistDoc.beers[0]).toBeInstanceOf(Types.ObjectId);
    });
  });

  describe('getStatistics', () => {
    it('should get statistics without brewery filter', async () => {
      const mockStats = [{
        _id: null,
        totalTaplists: 10,
        activeTaplists: 5,
        ocrProcessedCount: 8,
        averageReliability: 0.75,
        latestUpdate: new Date()
      }];

      MockedTaplist.aggregate = jest.fn().mockResolvedValue(mockStats);

      const result = await taplistService.getStatistics();

      expect(MockedTaplist.aggregate).toHaveBeenCalledWith([
        { $match: {} },
        expect.objectContaining({
          $group: expect.any(Object)
        })
      ]);
      expect(result).toEqual(mockStats[0]);
    });

    it('should get statistics with string brewery filter', async () => {
      const breweryId = '507f1f77bcf86cd799439012';
      const mockStats = [{
        _id: null,
        totalTaplists: 5,
        activeTaplists: 3,
        ocrProcessedCount: 4,
        averageReliability: 0.8,
        latestUpdate: new Date()
      }];

      MockedTaplist.aggregate = jest.fn().mockResolvedValue(mockStats);

      const result = await taplistService.getStatistics(breweryId);

      expect(MockedTaplist.aggregate).toHaveBeenCalledWith([
        { $match: { brewery: expect.any(Types.ObjectId) } },
        expect.objectContaining({
          $group: expect.any(Object)
        })
      ]);
      expect(result).toEqual(mockStats[0]);
    });

    it('should get statistics with ObjectId brewery filter', async () => {
      const breweryId = new Types.ObjectId();
      const mockStats: any[] = [];

      MockedTaplist.aggregate = jest.fn().mockResolvedValue(mockStats);

      const result = await taplistService.getStatistics(breweryId);

      expect(MockedTaplist.aggregate).toHaveBeenCalledWith([
        { $match: { brewery: breweryId } },
        expect.objectContaining({
          $group: expect.any(Object)
        })
      ]);
      expect(result).toEqual({
        totalTaplists: 0,
        activeTaplists: 0,
        ocrProcessedCount: 0,
        averageReliability: 0,
        latestUpdate: null
      });
    });
  });

  describe('deactivateOldTaplists', () => {
    it('should deactivate old taplists with string brewery ID', async () => {
      const breweryId = '507f1f77bcf86cd799439012';

      MockedTaplist.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 2 });

      await taplistService.deactivateOldTaplists(breweryId);

      expect(MockedTaplist.updateMany).toHaveBeenCalledWith(
        {
          brewery: expect.any(Types.ObjectId),
          isActive: true
        },
        {
          isActive: false
        }
      );
    });

    it('should deactivate old taplists with ObjectId brewery ID', async () => {
      const breweryId = new Types.ObjectId();

      MockedTaplist.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 1 });

      await taplistService.deactivateOldTaplists(breweryId);

      expect(MockedTaplist.updateMany).toHaveBeenCalledWith(
        {
          brewery: breweryId,
          isActive: true
        },
        {
          isActive: false
        }
      );
    });
  });
});