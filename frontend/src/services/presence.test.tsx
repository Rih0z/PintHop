/**
 * Presence service tests
 * Target: Improve service layer coverage
 */
import { 
  fetchFriendsPresence, 
  fetchBreweryPresence, 
  updatePresence, 
  fetchMyPresence 
} from './presence';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockPresence = {
  id: '1',
  userId: 'user-1',
  breweryId: 'brewery-1',
  status: 'online' as const,
  location: {
    type: 'Point' as const,
    coordinates: [-122.3321, 47.6062]
  },
  visibility: 'friends' as const,
  timestamp: new Date().toISOString()
};

describe('Presence Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchFriendsPresence', () => {
    it('should fetch friends presence data', async () => {
      const mockResponse = {
        data: [mockPresence]
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await fetchFriendsPresence();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/presence/friends')
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle fetch friends presence errors', async () => {
      const errorResponse = {
        response: {
          data: { error: 'Failed to fetch friends presence' }
        }
      };
      mockedAxios.get.mockRejectedValue(errorResponse);

      await expect(fetchFriendsPresence()).rejects.toEqual(errorResponse);
    });
  });

  describe('fetchBreweryPresence', () => {
    it('should fetch brewery presence data', async () => {
      const mockResponse = {
        data: [mockPresence]
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await fetchBreweryPresence('brewery-1');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/breweries/brewery-1/presence')
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle fetch brewery presence errors', async () => {
      const errorResponse = {
        response: {
          data: { error: 'Brewery not found' }
        }
      };
      mockedAxios.get.mockRejectedValue(errorResponse);

      await expect(fetchBreweryPresence('invalid-brewery')).rejects.toEqual(errorResponse);
    });
  });

  describe('updatePresence', () => {
    it('should update presence with status', async () => {
      const mockResponse = {
        data: mockPresence
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const updateData = {
        status: 'online' as const,
        visibility: 'friends' as const
      };
      const result = await updatePresence(updateData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/presence'),
        updateData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should update presence with location', async () => {
      const mockResponse = {
        data: mockPresence
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const updateData = {
        status: 'online' as const,
        location: {
          type: 'Point' as const,
          coordinates: [-122.3321, 47.6062] as [number, number]
        },
        breweryId: 'brewery-1'
      };
      const result = await updatePresence(updateData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/presence'),
        updateData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle update presence errors', async () => {
      const errorResponse = {
        response: {
          data: { error: 'Failed to update presence' }
        }
      };
      mockedAxios.post.mockRejectedValue(errorResponse);

      const updateData = { status: 'online' as const };
      await expect(updatePresence(updateData)).rejects.toEqual(errorResponse);
    });
  });

  describe('fetchMyPresence', () => {
    it('should fetch current user presence', async () => {
      const mockResponse = {
        data: mockPresence
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await fetchMyPresence();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/presence/me')
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle fetch my presence errors', async () => {
      const errorResponse = {
        response: {
          data: { error: 'User not authenticated' }
        }
      };
      mockedAxios.get.mockRejectedValue(errorResponse);

      await expect(fetchMyPresence()).rejects.toEqual(errorResponse);
    });
  });
});