/**
 * AuthContext tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as authService from '../services/auth';
import axios from 'axios';

jest.mock('../services/auth');
jest.mock('axios');

const TestConsumer: React.FC = () => {
  const { user, login, logout, error, isAuthenticated, loading } = useAuth();

  return (
    <div>
      {loading && <div data-testid="loading">Loading...</div>}
      {user ? (
        <>
          <div data-testid="user-info">{user.email}</div>
          <div data-testid="username">{user.username}</div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('test@example.com', 'password')}>Login</button>
      )}
      {error && <div data-testid="error">{error}</div>}
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
  });

  describe('Initial State', () => {
    it('should start with no user and loading false', async () => {
      await act(async () => {
        render(
          <AuthProvider>
            <TestConsumer />
          </AuthProvider>
        );
      });

      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    });

    it('should load token from localStorage on mount', async () => {
      localStorage.setItem('accessToken', 'stored-token');
      localStorage.setItem('refreshToken', 'stored-refresh-token');

      await act(async () => {
        render(
          <AuthProvider>
            <TestConsumer />
          </AuthProvider>
        );
      });

      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer stored-token');
    });
  });

  describe('Login Flow', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', username: 'testuser', email: 'test@example.com' },
          tokens: { 
            accessToken: 'access-token-123',
            refreshToken: 'refresh-token-123'
          }
        }
      };

      (authService.login as jest.Mock).mockResolvedValue(mockResponse);

      await act(async () => {
        render(
          <AuthProvider>
            <TestConsumer />
          </AuthProvider>
        );
      });

      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('user-info')).toHaveTextContent('test@example.com');
        expect(screen.getByTestId('username')).toHaveTextContent('testuser');
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      });

      expect(localStorage.getItem('accessToken')).toBe('access-token-123');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token-123');
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer access-token-123');
    });

    it('should handle login error', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Invalid credentials'
          }
        }
      };

      (authService.login as jest.Mock).mockRejectedValue(mockError);

      await act(async () => {
        render(
          <AuthProvider>
            <TestConsumer />
          </AuthProvider>
        );
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Login'));
      });

      await waitFor(() => {
        expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
        expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      });
    });
  });

  describe('Logout Flow', () => {
    it('should logout successfully', async () => {
      const mockLoginResponse = {
        data: {
          user: { id: '1', username: 'testuser', email: 'test@example.com' },
          tokens: { 
            accessToken: 'access-token-123',
            refreshToken: 'refresh-token-123'
          }
        }
      };

      (authService.login as jest.Mock).mockResolvedValue(mockLoginResponse);
      (authService.logout as jest.Mock).mockResolvedValue({});

      await act(async () => {
        render(
          <AuthProvider>
            <TestConsumer />
          </AuthProvider>
        );
      });

      // First login
      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('user-info')).toBeInTheDocument();
      });

      // Then logout
      fireEvent.click(screen.getByText('Logout'));

      await waitFor(() => {
        expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
        expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      });

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('useAuth Hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      const TestComponent = () => {
        useAuth();
        return null;
      };

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});