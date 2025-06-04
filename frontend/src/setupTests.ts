// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Global test environment setup
import './test-utils';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
global.sessionStorage = localStorageMock;

// Mock console methods for cleaner test output
global.console = {
  ...console,
  // Comment these out if you want to see console outputs in tests
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock URL constructor for tests
global.URL.createObjectURL = jest.fn(() => 'mock-object-url');

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;

// Setup environment variables for testing
process.env.REACT_APP_API_URL = 'http://localhost:8000';
process.env.NODE_ENV = 'test';

// Mock require for Leaflet images
jest.mock('leaflet/dist/images/marker-icon-2x.png', () => 'marker-icon-2x.png', { virtual: true });
jest.mock('leaflet/dist/images/marker-icon.png', () => 'marker-icon.png', { virtual: true });
jest.mock('leaflet/dist/images/marker-shadow.png', () => 'marker-shadow.png', { virtual: true });
