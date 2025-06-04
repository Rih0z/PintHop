/**
 * Login page comprehensive tests
 * Target: 100% coverage
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import '@testing-library/jest-dom';
import { LoginPage } from './Login';
import * as authService from '../services/auth';

// Mock the auth service
jest.mock('../services/auth');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form with all fields', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('heading', { name: /welcome to pinthop/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in to pinthop/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create one here/i })).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    const mockLogin = jest.fn().mockResolvedValue({
      user: { id: '1', username: 'testuser', email: 'test@example.com' },
      token: 'access_token',
      refreshToken: 'refresh_token'
    });
    mockedAuthService.login = mockLogin;

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/pages\.login\.email/i);
    const passwordInput = screen.getByLabelText(/pages\.login\.password/i);
    const submitButton = screen.getByRole('button', { name: /pages\.login\.submit/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows loading state during form submission', async () => {
    const mockLogin = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    mockedAuthService.login = mockLogin;

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/pages\.login\.email/i);
    const passwordInput = screen.getByLabelText(/pages\.login\.password/i);
    const submitButton = screen.getByRole('button', { name: /pages\.login\.submit/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/pages\.login\.loading/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('handles login error and displays error message', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    mockedAuthService.login = mockLogin;

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/pages\.login\.email/i);
    const passwordInput = screen.getByLabelText(/pages\.login\.password/i);
    const submitButton = screen.getByRole('button', { name: /pages\.login\.submit/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.login\.error/i)).toBeInTheDocument();
    });
  });

  it('validates required email field', async () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText(/pages\.login\.password/i);
    const submitButton = screen.getByRole('button', { name: /pages\.login\.submit/i });
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.login\.emailRequired/i)).toBeInTheDocument();
    });
  });

  it('validates required password field', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/pages\.login\.email/i);
    const submitButton = screen.getByRole('button', { name: /pages\.login\.submit/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.login\.passwordRequired/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/pages\.login\.email/i);
    const passwordInput = screen.getByLabelText(/pages\.login\.password/i);
    const submitButton = screen.getByRole('button', { name: /pages\.login\.submit/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.login\.emailInvalid/i)).toBeInTheDocument();
    });
  });

  it('navigates to register page when sign up link is clicked', () => {
    render(<LoginPage />);
    
    const signUpLink = screen.getByRole('link', { name: /pages\.login\.signUp/i });
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

  it('handles username/email login field correctly', async () => {
    const mockLogin = jest.fn().mockResolvedValue({
      user: { id: '1', username: 'testuser', email: 'test@example.com' },
      token: 'access_token',
      refreshToken: 'refresh_token'
    });
    mockedAuthService.login = mockLogin;

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/pages\.login\.email/i);
    const passwordInput = screen.getByLabelText(/pages\.login\.password/i);
    const submitButton = screen.getByRole('button', { name: /pages\.login\.submit/i });
    
    // Test with username instead of email
    fireEvent.change(emailInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  it('clears error message when user starts typing', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    mockedAuthService.login = mockLogin;

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/pages\.login\.email/i);
    const passwordInput = screen.getByLabelText(/pages\.login\.password/i);
    const submitButton = screen.getByRole('button', { name: /pages\.login\.submit/i });
    
    // First, trigger an error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.login\.error/i)).toBeInTheDocument();
    });
    
    // Then start typing to clear error
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });
    
    await waitFor(() => {
      expect(screen.queryByText(/pages\.login\.error/i)).not.toBeInTheDocument();
    });
  });

  it('shows password visibility toggle', () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText(/pages\.login\.password/i);
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});