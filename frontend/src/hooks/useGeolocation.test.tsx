/**
 * useGeolocation hook tests
 * Target: Improve hook coverage
 */
import { renderHook, act } from '../test-utils';
import { useGeolocation } from './useGeolocation';

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

describe('useGeolocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useGeolocation());

    expect(result.current.position).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should watch position automatically on mount', () => {
    const mockWatchId = 123;
    mockGeolocation.watchPosition.mockReturnValue(mockWatchId);

    renderHook(() => useGeolocation());

    expect(mockGeolocation.watchPosition).toHaveBeenCalled();
  });

  it('should handle geolocation error', () => {
    const mockError = {
      code: 1,
      message: 'Permission denied',
    };

    let errorCallback: any;
    mockGeolocation.watchPosition.mockImplementation((success, error) => {
      errorCallback = error;
      return 123;
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      errorCallback(mockError);
    });

    expect(result.current.position).toBeNull();
    expect(result.current.error).toEqual(mockError.message);
  });

  it('should update position when location changes', () => {
    const mockPosition = {
      coords: {
        latitude: 47.6062,
        longitude: -122.3321,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    let successCallback: any;
    mockGeolocation.watchPosition.mockImplementation((success) => {
      successCallback = success;
      return 123;
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      successCallback(mockPosition);
    });

    expect(result.current.position).toEqual({
      latitude: 47.6062,
      longitude: -122.3321,
      accuracy: 10,
    });
  });

  it('should clear watch when component unmounts', () => {
    const mockWatchId = 123;
    mockGeolocation.watchPosition.mockReturnValue(mockWatchId);

    const { unmount } = renderHook(() => useGeolocation());

    unmount();

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(mockWatchId);
  });

  it('should handle missing geolocation support', () => {
    const originalGeolocation = global.navigator.geolocation;
    // @ts-ignore
    delete global.navigator.geolocation;

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.position).toBeNull();
    expect(result.current.error).toBe('Geolocation not supported');

    // Restore
    Object.defineProperty(global.navigator, 'geolocation', {
      value: originalGeolocation,
      writable: true,
    });
  });
});