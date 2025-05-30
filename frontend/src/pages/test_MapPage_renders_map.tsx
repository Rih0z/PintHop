import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MapPage from './Map';
import * as breweryService from '../services/breweries';
import { Brewery } from '../types/brewery';

jest.mock('../services/breweries');

const mockBreweries: Brewery[] = [
  {
    breweryId: 'b1',
    name: 'Test Brewery',
    slug: 'test-brewery',
    address: {
      city: 'Seattle',
      state: 'Washington'
    },
    region: 'seattle',
    location: { type: 'Point', coordinates: [-122.33, 47.6] },
    ratings: {
      untappd: { score: 4.1, url: null },
      rateBeer: { score: 90, url: null },
      beerAdvocate: { score: 85, url: null },
    },
  },
];

(breweryService.fetchBreweries as jest.Mock).mockResolvedValue(mockBreweries);

test('MapPage ブルワリーマップが表示される', async () => {
  render(<MapPage />);
  await waitFor(() => expect(screen.getByTestId('brewery-map')).toBeInTheDocument());
});
