/**
 * Auth service tests
 * Target: Improve service layer coverage
 */
import { login, register, checkAvailability } from './auth';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should make login request with correct parameters', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', username: 'testuser', email: 'test@example.com' },
          token: 'access_token',
          refreshToken: 'refresh_token'
        }
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await login('testuser', 'password123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        { username: 'testuser', password: 'password123' }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login errors', async () => {
      const errorResponse = {
        response: {
          data: { error: 'Invalid credentials' }
        }
      };
      mockedAxios.post.mockRejectedValue(errorResponse);

      await expect(login('wronguser', 'wrongpass')).rejects.toEqual(errorResponse);
    });
  });

  describe('register', () => {
    it('should make register request with correct parameters', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };
      const mockResponse = {
        data: {
          user: { id: '2', ...userData },
          token: 'access_token',
          refreshToken: 'refresh_token'
        }
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await register(userData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        userData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle registration errors', async () => {
      const userData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };
      const errorResponse = {
        response: {
          data: { error: 'User already exists' }
        }
      };
      mockedAxios.post.mockRejectedValue(errorResponse);

      await expect(register(userData)).rejects.toEqual(errorResponse);
    });
  });

  describe('checkAvailability', () => {
    it('should check username availability', async () => {
      const mockResponse = {
        data: { available: true }
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await checkAvailability({ username: 'testuser' });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/auth/availability'),
        { params: { username: 'testuser' } }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should check email availability', async () => {
      const mockResponse = {
        data: { available: false }
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await checkAvailability({ email: 'test@example.com' });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/auth/availability'),
        { params: { email: 'test@example.com' } }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle availability check errors', async () => {
      const errorResponse = {
        response: {
          data: { error: 'Server error' }
        }
      };
      mockedAxios.get.mockRejectedValue(errorResponse);

      await expect(checkAvailability({ username: 'testuser' })).rejects.toEqual(errorResponse);
    });
  });
});