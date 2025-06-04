/**
 * Breweries service tests
 * Target: Improve service layer coverage
 */
import { fetchBreweries } from './breweries';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockBrewery = {
  id: '1',
  name: 'Test Brewery',
  description: 'A test brewery',
  address: { street: '123 Main St', city: 'Test City', state: 'TS' },
  latitude: 47.6062,
  longitude: -122.3321,
  phone: '555-0123',
  website: 'https://testbrewery.com',
  type: 'microbrewery',
  tags: ['craft'],
  rating: 4.5,
  reviewCount: 100,
  currentVisitors: 5,
  currentTaps: 12,
  photos: ['photo1.jpg'],
  beers: []
};

describe('Breweries Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchBreweries', () => {
    it('should fetch all breweries', async () => {
      const mockResponse = {
        data: [mockBrewery]
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await fetchBreweries();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/breweries')
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle fetch breweries errors', async () => {
      const errorResponse = {
        response: {
          data: { error: 'Failed to fetch breweries' }
        }
      };
      mockedAxios.get.mockRejectedValue(errorResponse);

      await expect(fetchBreweries()).rejects.toEqual(errorResponse);
    });
  });

});