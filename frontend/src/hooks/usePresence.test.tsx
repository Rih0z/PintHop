/**
 * usePresence hook tests
 * Target: Improve hook coverage
 */
import { renderHook, act } from '../test-utils';
import { usePresence } from './usePresence';

// Mock the presence service
jest.mock('../services/presence', () => ({
  fetchMyPresence: jest.fn(),
  updatePresence: jest.fn(),
}));

describe('usePresence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => usePresence());

    expect(result.current.presence).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle updatePresence function', () => {
    const { result } = renderHook(() => usePresence());

    expect(typeof result.current.updatePresence).toBe('function');
  });

  it('should handle fetchPresence function', () => {
    const { result } = renderHook(() => usePresence());

    expect(typeof result.current.fetchPresence).toBe('function');
  });
});