/**
 * usePresence hook tests
 * Target: Improve hook coverage
 */
import { renderHook } from '../test-utils';
import usePresence from './usePresence';
import React from 'react';
import PresenceContext from '../context/PresenceContext';

// Mock the presence context
const mockPresenceContext = {
  presence: null,
  updatePresence: jest.fn(),
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PresenceContext.Provider value={mockPresenceContext}>
    {children}
  </PresenceContext.Provider>
);

describe('usePresence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return context values', () => {
    const { result } = renderHook(() => usePresence(), { wrapper });

    expect(result.current.presence).toBeNull();
    expect(typeof result.current.updatePresence).toBe('function');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => usePresence());
    }).toThrow('usePresence must be used within PresenceProvider');

    console.error = originalError;
  });
});