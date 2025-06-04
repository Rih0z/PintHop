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

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should get current position successfully', async () => {
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

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.getCurrentPosition();
    });

    expect(result.current.location).toEqual(mockPosition);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle geolocation error', async () => {
    const mockError = {
      code: 1,
      message: 'Permission denied',
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError);
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.getCurrentPosition();
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toEqual(mockError);
    expect(result.current.loading).toBe(false);
  });

  it('should start watching position', () => {
    const mockWatchId = 123;
    mockGeolocation.watchPosition.mockReturnValue(mockWatchId);

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.watchPosition();
    });

    expect(mockGeolocation.watchPosition).toHaveBeenCalled();
  });

  it('should clear watch when component unmounts', () => {
    const mockWatchId = 123;
    mockGeolocation.watchPosition.mockReturnValue(mockWatchId);

    const { result, unmount } = renderHook(() => useGeolocation());

    act(() => {
      result.current.watchPosition();
    });

    unmount();

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(mockWatchId);
  });

  it('should handle watch position updates', () => {
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

    let watchSuccess: any;
    mockGeolocation.watchPosition.mockImplementation((success) => {
      watchSuccess = success;
      return 123;
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.watchPosition();
    });

    act(() => {
      watchSuccess(mockPosition);
    });

    expect(result.current.location).toEqual(mockPosition);
  });
});