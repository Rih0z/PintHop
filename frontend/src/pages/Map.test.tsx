/**
 * Map page comprehensive tests
 * Target: 100% coverage
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import '@testing-library/jest-dom';
import MapPage from './Map';
import * as breweryService from '../services/breweries';
import * as presenceService from '../services/presence';

// Mock services
jest.mock('../services/breweries');
jest.mock('../services/presence');
const mockedBreweryService = breweryService as jest.Mocked<typeof breweryService>;
const mockedPresenceService = presenceService as jest.Mocked<typeof presenceService>;

// Mock axios for API calls
jest.mock('axios');

const mockBreweries = [
  {
    id: '1',
    name: 'Test Brewery 1',
    description: 'A great brewery',
    address: { street: '123 Main St', city: 'Seattle', state: 'WA' },
    latitude: 47.6062,
    longitude: -122.3321,
    phone: '555-0123',
    website: 'https://testbrewery1.com',
    type: 'microbrewery',
    tags: ['craft', 'local'],
    rating: 4.5,
    reviewCount: 100,
    currentVisitors: 5,
    currentTaps: 12,
    photos: ['photo1.jpg'],
    beers: []
  },
  {
    id: '2',
    name: 'Test Brewery 2',
    description: 'Another great brewery',
    address: { street: '456 Oak Ave', city: 'Seattle', state: 'WA' },
    latitude: 47.6205,
    longitude: -122.3493,
    phone: '555-0456',
    website: 'https://testbrewery2.com',
    type: 'brewpub',
    tags: ['craft', 'food'],
    rating: 4.2,
    reviewCount: 85,
    currentVisitors: 8,
    currentTaps: 16,
    photos: ['photo2.jpg'],
    beers: []
  }
];

const mockPresence = {
  1: { count: 5, users: ['user1', 'user2'] },
  2: { count: 8, users: ['user3', 'user4', 'user5'] }
};

describe('MapPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedBreweryService.fetchBreweries.mockResolvedValue(mockBreweries);
    mockedPresenceService.fetchFriendsPresence.mockResolvedValue([]);
    mockedPresenceService.fetchBreweryPresence.mockResolvedValue([]);
    
    // Mock geolocation
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) => 
        success({
          coords: {
            latitude: 47.6062,
            longitude: -122.3321,
            accuracy: 10
          }
        })
      ),
      watchPosition: jest.fn(),
      clearWatch: jest.fn()
    };
  });

  it('renders map with breweries', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
      expect(screen.getByText('Test Brewery 1')).toBeInTheDocument();
      expect(screen.getByText('Test Brewery 2')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching breweries', () => {
    mockedBreweryService.fetchBreweries.mockImplementation(() => new Promise(() => {}));
    
    render(<MapPage />);
    
    expect(screen.getByTestId('beer-glass-loader')).toBeInTheDocument();
  });

  it('handles brewery fetch error', async () => {
    mockedBreweryService.fetchBreweries.mockRejectedValue(new Error('Failed to fetch'));
    
    render(<MapPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.map\.error/i)).toBeInTheDocument();
    });
  });

  it('displays brewery markers on map', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      const markers = screen.getAllByTestId('marker');
      expect(markers).toHaveLength(2);
    });
  });

  it('shows brewery popup when marker is clicked', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      const markers = screen.getAllByTestId('marker');
      fireEvent.click(markers[0]);
      
      expect(screen.getByTestId('popup')).toBeInTheDocument();
    });
  });

  it('filters breweries by search term', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/pages\.map\.searchPlaceholder/i);
      fireEvent.change(searchInput, { target: { value: 'Test Brewery 1' } });
      
      expect(screen.getByText('Test Brewery 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Brewery 2')).not.toBeInTheDocument();
    });
  });

  it('filters breweries by type', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      const typeFilter = screen.getByRole('combobox', { name: /pages\.map\.filterByType/i });
      fireEvent.change(typeFilter, { target: { value: 'microbrewery' } });
      
      expect(screen.getByText('Test Brewery 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Brewery 2')).not.toBeInTheDocument();
    });
  });

  it('shows brewery list view', async () => {
    render(<MapPage />);
    
    const listViewButton = screen.getByRole('button', { name: /pages\.map\.listView/i });
    fireEvent.click(listViewButton);
    
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
  });

  it('switches between map and list views', async () => {
    render(<MapPage />);
    
    const listViewButton = screen.getByRole('button', { name: /pages\.map\.listView/i });
    const mapViewButton = screen.getByRole('button', { name: /pages\.map\.mapView/i });
    
    fireEvent.click(listViewButton);
    expect(screen.getByRole('list')).toBeInTheDocument();
    
    fireEvent.click(mapViewButton);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('displays current location on map', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
      expect(screen.getByTestId('current-location-marker')).toBeInTheDocument();
    });
  });

  it('handles geolocation error', async () => {
    global.navigator.geolocation.getCurrentPosition = jest.fn().mockImplementation((success, error) => 
      error({ code: 1, message: 'Permission denied' })
    );
    
    render(<MapPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.map\.locationError/i)).toBeInTheDocument();
    });
  });

  it('shows brewery presence information', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      expect(screen.getByText('5 pages.map.visitors')).toBeInTheDocument();
      expect(screen.getByText('8 pages.map.visitors')).toBeInTheDocument();
    });
  });

  it('allows user to check in at brewery', async () => {
    const mockCheckIn = jest.fn().mockResolvedValue({ success: true });
    // Assuming there's a check-in service
    
    render(<MapPage />);
    
    await waitFor(() => {
      const checkInButton = screen.getAllByRole('button', { name: /pages\.map\.checkIn/i })[0];
      fireEvent.click(checkInButton);
      
      expect(mockCheckIn).toHaveBeenCalledWith('1');
    });
  });

  it('refreshes brewery data when refresh button is clicked', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      const refreshButton = screen.getByRole('button', { name: /pages\.map\.refresh/i });
      fireEvent.click(refreshButton);
      
      expect(mockedBreweryService.fetchBreweries).toHaveBeenCalledTimes(2);
    });
  });

  it('shows brewery details in bottom sheet when brewery card is clicked', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      const breweryCard = screen.getByText('Test Brewery 1').closest('div');
      fireEvent.click(breweryCard!);
      
      expect(screen.getByText('A great brewery')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('555-0123')).toBeInTheDocument();
    });
  });

  it('opens brewery website when website link is clicked', async () => {
    global.open = jest.fn();
    
    render(<MapPage />);
    
    await waitFor(() => {
      const breweryCard = screen.getByText('Test Brewery 1').closest('div');
      fireEvent.click(breweryCard!);
      
      const websiteLink = screen.getByRole('link', { name: /pages\.map\.website/i });
      fireEvent.click(websiteLink);
      
      expect(global.open).toHaveBeenCalledWith('https://testbrewery1.com', '_blank');
    });
  });

  it('shows directions to brewery when directions button is clicked', async () => {
    global.open = jest.fn();
    
    render(<MapPage />);
    
    await waitFor(() => {
      const breweryCard = screen.getByText('Test Brewery 1').closest('div');
      fireEvent.click(breweryCard!);
      
      const directionsButton = screen.getByRole('button', { name: /pages\.map\.directions/i });
      fireEvent.click(directionsButton);
      
      expect(global.open).toHaveBeenCalledWith(
        expect.stringContaining('google.com/maps/dir/'),
        '_blank'
      );
    });
  });

  it('displays brewery ratings and reviews', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('100 pages.map.reviews')).toBeInTheDocument();
      expect(screen.getByText('4.2')).toBeInTheDocument();
      expect(screen.getByText('85 pages.map.reviews')).toBeInTheDocument();
    });
  });

  it('shows tap count information', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      expect(screen.getByText('12 pages.map.taps')).toBeInTheDocument();
      expect(screen.getByText('16 pages.map.taps')).toBeInTheDocument();
    });
  });

  it('handles empty brewery list', async () => {
    mockedBreweryService.fetchBreweries.mockResolvedValue([]);
    
    render(<MapPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/pages\.map\.noBreweries/i)).toBeInTheDocument();
    });
  });

  it('centers map on user location', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      const centerButton = screen.getByRole('button', { name: /pages\.map\.centerOnLocation/i });
      fireEvent.click(centerButton);
      
      expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(2);
    });
  });

  it('displays language switcher', () => {
    render(<MapPage />);
    
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });
});