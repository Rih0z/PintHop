import mongoose from 'mongoose';
import { BeerRepository } from '../../src/repositories/BeerRepository';
import { Beer } from '../../src/models/Beer';

// Mock models
jest.mock('../../src/models/Beer');

describe('BeerRepository', () => {
  let beerRepository: BeerRepository;
  const mockBeerId = new mongoose.Types.ObjectId();
  const mockBreweryId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    beerRepository = new BeerRepository();
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find beer by id', async () => {
      const mockBeer = { _id: mockBeerId, name: 'Test Beer', style: 'IPA' };
      
      (Beer.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockBeer)
      });

      const result = await beerRepository.findById(mockBeerId);

      expect(result).toEqual(mockBeer);
      expect(Beer.findById).toHaveBeenCalledWith(mockBeerId);
    });

    it('should handle string id', async () => {
      const stringId = mockBeerId.toString();
      const mockBeer = { _id: mockBeerId, name: 'Test Beer' };
      
      (Beer.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockBeer)
      });

      const result = await beerRepository.findById(stringId);

      expect(result).toEqual(mockBeer);
      expect(Beer.findById).toHaveBeenCalledWith(mockBeerId);
    });
  });

  describe('findByIdWithBrewery', () => {
    it('should find beer by id with brewery populated', async () => {
      const mockBeer = { 
        _id: mockBeerId, 
        name: 'Test Beer',
        brewery: { _id: mockBreweryId, name: 'Test Brewery' }
      };
      
      (Beer.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockBeer)
        })
      });

      const result = await beerRepository.findByIdWithBrewery(mockBeerId);

      expect(result).toEqual(mockBeer);
      expect(Beer.findById).toHaveBeenCalledWith(mockBeerId);
    });
  });

  describe('find', () => {
    it('should find beers with query', async () => {
      const query = { style: 'IPA' };
      const mockBeers = [
        { _id: mockBeerId, name: 'Test Beer 1', style: 'IPA' },
        { _id: new mongoose.Types.ObjectId(), name: 'Test Beer 2', style: 'IPA' }
      ];
      
      (Beer.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockBeers)
      });

      const result = await beerRepository.find(query);

      expect(result).toEqual(mockBeers);
      expect(Beer.find).toHaveBeenCalledWith(query);
    });
  });

  describe('findWithPagination', () => {
    it('should find beers with pagination and sorting', async () => {
      const query = { style: 'IPA' };
      const skip = 0;
      const limit = 10;
      const sort = { name: 1 };
      const mockBeers = [
        { _id: mockBeerId, name: 'Test Beer', style: 'IPA' }
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

      const result = await beerRepository.findWithPagination(query, skip, limit, sort);

      expect(result).toEqual(mockBeers);
      expect(Beer.find).toHaveBeenCalledWith(query);
    });
  });

  describe('count', () => {
    it('should count documents matching query', async () => {
      const query = { style: 'IPA' };
      const expectedCount = 5;
      
      (Beer.countDocuments as jest.Mock).mockResolvedValue(expectedCount);

      const result = await beerRepository.count(query);

      expect(result).toBe(expectedCount);
      expect(Beer.countDocuments).toHaveBeenCalledWith(query);
    });
  });

  describe('aggregate', () => {
    it('should execute aggregation pipeline', async () => {
      const pipeline = [
        { $match: { style: 'IPA' } },
        { $group: { _id: '$brewery', count: { $sum: 1 } } }
      ];
      const expectedResult = [
        { _id: mockBreweryId, count: 3 }
      ];
      
      (Beer.aggregate as jest.Mock).mockResolvedValue(expectedResult);

      const result = await beerRepository.aggregate(pipeline);

      expect(result).toEqual(expectedResult);
      expect(Beer.aggregate).toHaveBeenCalledWith(pipeline);
    });
  });

  describe('create', () => {
    it('should create new beer', async () => {
      const beerData = {
        name: 'New Beer',
        style: 'IPA',
        abv: 6.5,
        brewery: mockBreweryId
      };

      const mockBeer = {
        _id: mockBeerId,
        ...beerData,
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({ _id: mockBeerId, ...beerData })
      };

      (Beer as any).mockImplementation(() => mockBeer);

      const result = await beerRepository.create(beerData);

      expect(Beer).toHaveBeenCalledWith(beerData);
      expect(mockBeer.save).toHaveBeenCalled();
      expect(result).toEqual({ _id: mockBeerId, ...beerData });
    });
  });

  describe('update', () => {
    it('should update beer by id', async () => {
      const updateData = { name: 'Updated Beer Name' };
      const updatedBeer = { _id: mockBeerId, name: 'Updated Beer Name', style: 'IPA' };
      
      (Beer.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(updatedBeer)
      });

      const result = await beerRepository.update(mockBeerId, updateData);

      expect(result).toEqual(updatedBeer);
      expect(Beer.findByIdAndUpdate).toHaveBeenCalledWith(
        mockBeerId,
        updateData,
        { new: true }
      );
    });

    it('should handle string id', async () => {
      const stringId = mockBeerId.toString();
      const updateData = { name: 'Updated Beer Name' };
      const updatedBeer = { _id: mockBeerId, name: 'Updated Beer Name' };
      
      (Beer.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(updatedBeer)
      });

      const result = await beerRepository.update(stringId, updateData);

      expect(result).toEqual(updatedBeer);
      expect(Beer.findByIdAndUpdate).toHaveBeenCalledWith(
        mockBeerId,
        updateData,
        { new: true }
      );
    });

    it('should return null when beer not found', async () => {
      (Beer.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      const result = await beerRepository.update(mockBeerId, { name: 'New Name' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete beer by id and return true', async () => {
      const deletedBeer = { _id: mockBeerId, name: 'Deleted Beer' };
      
      (Beer.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedBeer);

      const result = await beerRepository.delete(mockBeerId);

      expect(result).toBe(true);
      expect(Beer.findByIdAndDelete).toHaveBeenCalledWith(mockBeerId);
    });

    it('should return false when beer not found', async () => {
      (Beer.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await beerRepository.delete(mockBeerId);

      expect(result).toBe(false);
    });

    it('should handle string id', async () => {
      const stringId = mockBeerId.toString();
      const deletedBeer = { _id: mockBeerId, name: 'Deleted Beer' };
      
      (Beer.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedBeer);

      const result = await beerRepository.delete(stringId);

      expect(result).toBe(true);
      expect(Beer.findByIdAndDelete).toHaveBeenCalledWith(mockBeerId);
    });
  });
});