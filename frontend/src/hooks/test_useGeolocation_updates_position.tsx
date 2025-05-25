import React from 'react';
import { render, screen, act } from '@testing-library/react';
import useGeolocation from './useGeolocation';

const mockWatch = jest.fn();
const mockClear = jest.fn();
let success: (pos: GeolocationPosition) => void;
let fail: (err: GeolocationPositionError) => void;

beforeEach(() => {
  mockWatch.mockImplementation((s, f) => {
    success = s;
    fail = f;
    return 1;
  });
  (global as any).navigator.geolocation = {
    watchPosition: mockWatch,
    clearWatch: mockClear,
  } as Geolocation;
});

afterEach(() => {
  jest.clearAllMocks();
});

const TestComponent: React.FC = () => {
  const { position, error } = useGeolocation();
  return (
    <div>
      {position && (
        <span data-testid="pos">{position.latitude},{position.longitude}</span>
      )}
      {error && <span data-testid="error">{error}</span>}
    </div>
  );
};

test('test_useGeolocation_updates_position', () => {
  render(<TestComponent />);
  act(() => {
    success({
      coords: { latitude: 1, longitude: 2, accuracy: 3, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
      timestamp: Date.now(),
    });
  });
  expect(screen.getByTestId('pos')).toHaveTextContent('1,2');
});
