import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as authService from '../services/auth';

jest.mock('../services/auth');

const TestConsumer: React.FC = () => {
  const { user, login, logout, error } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <div data-testid="user-info">{user.email}</div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('t@example.com', 'pass')}>Login</button>
      )}
      {error && <div data-testid="error">{error}</div>}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    (authService.login as jest.Mock).mockClear();
    localStorage.clear();
  });

  test('test_authContext_login_flow_success', async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      user: { id: '1', username: 'test', email: 't@example.com' },
      tokens: { accessToken: 'token' }
    });
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('t@example.com');
      expect(localStorage.getItem('token')).toBe('token');
    });
  });

  test('test_authContext_login_flow_error', async () => {
    (authService.login as jest.Mock).mockRejectedValue(new Error('fail'));
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Authentication failed');
    });
  });
});
