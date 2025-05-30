import React from 'react';
import { render, screen } from '@testing-library/react';
import BreweryMap from './BreweryMap';
import { Brewery } from '../../types/brewery';

test('BreweryMap マーカーが表示される', () => {
  const breweries: Brewery[] = [
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
  render(<BreweryMap breweries={breweries} />);
  const mapElement = screen.getByTestId('brewery-map');
  expect(mapElement).toBeInTheDocument();
});
