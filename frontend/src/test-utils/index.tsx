/**
 * Test utilities and providers for comprehensive testing
 */
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Mock react-i18next globally
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      // Handle interpolation
      if (options && Object.keys(options).length > 0) {
        let result = key;
        Object.keys(options).forEach(optionKey => {
          result = result.replace(`{{${optionKey}}}`, options[optionKey]);
        });
        return result;
      }
      return key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    }
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));

// Mock framer-motion for performance
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    input: ({ children, ...props }: any) => <input {...props}>{children}</input>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock leaflet for map components
jest.mock('leaflet', () => ({
  map: jest.fn(),
  tileLayer: jest.fn(),
  marker: jest.fn(),
  icon: jest.fn(),
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn(),
      },
      mergeOptions: jest.fn(),
    },
  },
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
}));

// Mock chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart" />,
  Bar: () => <div data-testid="bar-chart" />,
  Doughnut: () => <div data-testid="doughnut-chart" />,
}));

// Mock services
export const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  refresh: jest.fn(),
  checkAvailability: jest.fn(),
};

export const mockBreweriesService = {
  fetchBreweries: jest.fn(),
  getBreweryById: jest.fn(),
  searchBreweries: jest.fn(),
};

export const mockCheckinsService = {
  fetchCheckins: jest.fn(),
  createCheckin: jest.fn(),
  updateCheckin: jest.fn(),
  deleteCheckin: jest.fn(),
};

export const mockPresenceService = {
  fetchPresence: jest.fn(),
  updatePresence: jest.fn(),
  fetchFriendsPresence: jest.fn(),
};

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

// Mock AuthContext with default values
const mockAuthContext = {
  user: null,
  token: null,
  refreshToken: null,
  error: null,
  loading: false,
  isAuthenticated: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  refreshAccessToken: jest.fn(),
};

// Test wrapper with all providers
interface AllTheProvidersProps {
  children: React.ReactNode;
  authValue?: Partial<typeof mockAuthContext>;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ 
  children, 
  authValue = mockAuthContext 
}) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

// Custom render function with all providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    authValue?: Partial<typeof mockAuthContext>;
  }
) => {
  const { authValue, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} authValue={authValue} />,
    ...renderOptions,
  });
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
  ...overrides,
});

export const createMockBrewery = (overrides = {}) => ({
  _id: 'brewery-1',
  name: 'Test Brewery',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
  },
  location: {
    type: 'Point',
    coordinates: [-122.4194, 37.7749],
  },
  phone: '555-0123',
  website: 'https://testbrewery.com',
  tags: ['craft', 'local'],
  rating: 4.5,
  reviewCount: 100,
  currentVisitors: 5,
  currentTaps: 12,
  photos: ['photo1.jpg'],
  ...overrides,
});

export const createMockBeer = (overrides = {}) => ({
  _id: 'beer-1',
  name: 'Test IPA',
  style: 'IPA',
  abv: 6.5,
  ibu: 60,
  description: 'A hoppy test beer',
  brewery: createMockBrewery(),
  ...overrides,
});

export const createMockCheckin = (overrides = {}) => ({
  _id: 'checkin-1',
  user: createMockUser(),
  beer: createMockBeer(),
  brewery: createMockBrewery(),
  rating: 4,
  review: 'Great beer!',
  timestamp: new Date().toISOString(),
  ...overrides,
});

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };