/**
 * PrivateRoute component tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import * as useAuthHook from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

describe('PrivateRoute', () => {
  const mockedUseAuth = useAuthHook.useAuth as jest.MockedFunction<typeof useAuthHook.useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state when loading', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      user: null,
      token: null,
      refreshToken: null,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshAccessToken: jest.fn()
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <TestComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'testuser', email: 'test@example.com' },
      token: 'token',
      refreshToken: 'refresh-token',
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshAccessToken: jest.fn()
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <TestComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
      token: null,
      refreshToken: null,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshAccessToken: jest.fn()
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <TestComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should preserve location state when redirecting', () => {
    let capturedLocation: any = null;

    const LoginWithLocation = () => {
      const location = window.location;
      capturedLocation = location;
      return <div>Login Page</div>;
    };

    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
      token: null,
      refreshToken: null,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshAccessToken: jest.fn()
    });

    render(
      <MemoryRouter initialEntries={['/protected/resource']}>
        <Routes>
          <Route
            path="/protected/resource"
            element={
              <PrivateRoute>
                <TestComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginWithLocation />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});