/**
 * Register page comprehensive tests
 * Target: 100% coverage
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import '@testing-library/jest-dom';
import { RegisterPage } from './Register';
import * as authService from '../services/auth';

// Mock the auth service
jest.mock('../services/auth');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders register form with all fields', () => {
    render(<RegisterPage />);
    
    expect(screen.getByRole('heading', { name: /pages\.register\.title/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/pages\.register\.username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pages\.register\.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pages\.register\.password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pages\.register\.confirmPassword/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pages\.register\.submit/i })).toBeInTheDocument();
    expect(screen.getByText(/pages\.register\.hasAccount/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pages\.register\.signIn/i })).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    const mockCheckAvailability = jest.fn().mockResolvedValue({ available: true });
    const mockRegister = jest.fn().mockResolvedValue({
      user: { id: '1', username: 'testuser', email: 'test@example.com' },
      token: 'access_token',
      refreshToken: 'refresh_token'
    });
    mockedAuthService.checkAvailability = mockCheckAvailability;
    mockedAuthService.register = mockRegister;

    render(<RegisterPage />);
    
    const usernameInput = screen.getByLabelText(/pages\.register\.username/i);
    const emailInput = screen.getByLabelText(/pages\.register\.email/i);
    const passwordInput = screen.getByLabelText(/pages\.register\.password/i);
    const confirmPasswordInput = screen.getByLabelText(/pages\.register\.confirmPassword/i);
    const submitButton = screen.getByRole('button', { name: /pages\.register\.submit/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('shows loading state during registration', async () => {
    const mockCheckAvailability = jest.fn().mockResolvedValue({ available: true });
    const mockRegister = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    mockedAuthService.checkAvailability = mockCheckAvailability;
    mockedAuthService.register = mockRegister;

    render(<RegisterPage />);
    
    const usernameInput = screen.getByLabelText(/pages\.register\.username/i);
    const emailInput = screen.getByLabelText(/pages\.register\.email/i);
    const passwordInput = screen.getByLabelText(/pages\.register\.password/i);
    const confirmPasswordInput = screen.getByLabelText(/pages\.register\.confirmPassword/i);
    const submitButton = screen.getByRole('button', { name: /pages\.register\.submit/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/pages\.register\.loading/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('handles registration error', async () => {
    const mockCheckAvailability = jest.fn().mockResolvedValue({ available: true });
    const mockRegister = jest.fn().mockRejectedValue(new Error('Registration failed'));
    mockedAuthService.checkAvailability = mockCheckAvailability;
    mockedAuthService.register = mockRegister;

    render(<RegisterPage />);
    
    const usernameInput = screen.getByLabelText(/pages\.register\.username/i);
    const emailInput = screen.getByLabelText(/pages\.register\.email/i);
    const passwordInput = screen.getByLabelText(/pages\.register\.password/i);
    const confirmPasswordInput = screen.getByLabelText(/pages\.register\.confirmPassword/i);
    const submitButton = screen.getByRole('button', { name: /pages\.register\.submit/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.register\.error/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<RegisterPage />);
    
    const submitButton = screen.getByRole('button', { name: /pages\.register\.submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.register\.usernameRequired/i)).toBeInTheDocument();
      expect(screen.getByText(/pages\.register\.emailRequired/i)).toBeInTheDocument();
      expect(screen.getByText(/pages\.register\.passwordRequired/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<RegisterPage />);
    
    const emailInput = screen.getByLabelText(/pages\.register\.email/i);
    const submitButton = screen.getByRole('button', { name: /pages\.register\.submit/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.register\.emailInvalid/i)).toBeInTheDocument();
    });
  });

  it('validates password confirmation match', async () => {
    render(<RegisterPage />);
    
    const passwordInput = screen.getByLabelText(/pages\.register\.password/i);
    const confirmPasswordInput = screen.getByLabelText(/pages\.register\.confirmPassword/i);
    const submitButton = screen.getByRole('button', { name: /pages\.register\.submit/i });
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.register\.passwordMismatch/i)).toBeInTheDocument();
    });
  });

  it('validates password length', async () => {
    render(<RegisterPage />);
    
    const passwordInput = screen.getByLabelText(/pages\.register\.password/i);
    const submitButton = screen.getByRole('button', { name: /pages\.register\.submit/i });
    
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.register\.passwordTooShort/i)).toBeInTheDocument();
    });
  });

  it('validates username length', async () => {
    render(<RegisterPage />);
    
    const usernameInput = screen.getByLabelText(/pages\.register\.username/i);
    const submitButton = screen.getByRole('button', { name: /pages\.register\.submit/i });
    
    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.register\.usernameTooShort/i)).toBeInTheDocument();
    });
  });

  it('checks username availability', async () => {
    const mockCheckAvailability = jest.fn().mockResolvedValue({ available: false });
    mockedAuthService.checkAvailability = mockCheckAvailability;

    render(<RegisterPage />);
    
    const usernameInput = screen.getByLabelText(/pages\.register\.username/i);
    
    fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
    fireEvent.blur(usernameInput);
    
    await waitFor(() => {
      expect(mockCheckAvailability).toHaveBeenCalledWith({ username: 'existinguser' });
      expect(screen.getByText(/pages\.register\.usernameUnavailable/i)).toBeInTheDocument();
    });
  });

  it('checks email availability', async () => {
    const mockCheckAvailability = jest.fn().mockResolvedValue({ available: false });
    mockedAuthService.checkAvailability = mockCheckAvailability;

    render(<RegisterPage />);
    
    const emailInput = screen.getByLabelText(/pages\.register\.email/i);
    
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(mockCheckAvailability).toHaveBeenCalledWith({ email: 'existing@example.com' });
      expect(screen.getByText(/pages\.register\.emailUnavailable/i)).toBeInTheDocument();
    });
  });

  it('navigates to login page when sign in link is clicked', () => {
    render(<RegisterPage />);
    
    const signInLink = screen.getByRole('link', { name: /pages\.register\.signIn/i });
    expect(signInLink).toHaveAttribute('href', '/login');
  });

  it('shows password visibility toggles', () => {
    render(<RegisterPage />);
    
    const passwordInput = screen.getByLabelText(/pages\.register\.password/i);
    const confirmPasswordInput = screen.getByLabelText(/pages\.register\.confirmPassword/i);
    const passwordToggleButtons = screen.getAllByRole('button', { name: /toggle password visibility/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    // Toggle password visibility
    fireEvent.click(passwordToggleButtons[0]);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(passwordToggleButtons[1]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('clears error messages when user starts typing', async () => {
    const mockRegister = jest.fn().mockRejectedValue(new Error('Registration failed'));
    mockedAuthService.register = mockRegister;

    render(<RegisterPage />);
    
    const usernameInput = screen.getByLabelText(/pages\.register\.username/i);
    const submitButton = screen.getByRole('button', { name: /pages\.register\.submit/i });
    
    // First, trigger an error
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.register\.usernameRequired/i)).toBeInTheDocument();
    });
    
    // Then start typing to clear error
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    
    await waitFor(() => {
      expect(screen.queryByText(/pages\.register\.usernameRequired/i)).not.toBeInTheDocument();
    });
  });

  it('shows availability indicators for valid inputs', async () => {
    const mockCheckAvailability = jest.fn().mockResolvedValue({ available: true });
    mockedAuthService.checkAvailability = mockCheckAvailability;

    render(<RegisterPage />);
    
    const usernameInput = screen.getByLabelText(/pages\.register\.username/i);
    const emailInput = screen.getByLabelText(/pages\.register\.email/i);
    
    fireEvent.change(usernameInput, { target: { value: 'availableuser' } });
    fireEvent.blur(usernameInput);
    
    fireEvent.change(emailInput, { target: { value: 'available@example.com' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.register\.usernameAvailable/i)).toBeInTheDocument();
      expect(screen.getByText(/pages\.register\.emailAvailable/i)).toBeInTheDocument();
    });
  });
});