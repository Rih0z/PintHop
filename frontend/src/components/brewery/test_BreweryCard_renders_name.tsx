import React from 'react';
import { render, screen } from '@testing-library/react';
import { BreweryCard } from './BreweryCard';
import { Brewery } from '../../types/brewery';

test('BreweryCard 名前が表示される', () => {
  const brewery: Brewery = {
    breweryId: 'b1',
    name: 'Sample Brewery',
    slug: 'sample-brewery',
    address: {
      city: 'Seattle',
      state: 'Washington'
    },
    region: 'seattle',
    ratings: {
      untappd: { score: 4.0, url: null },
      rateBeer: { score: 90, url: null },
      beerAdvocate: { score: 85, url: null },
    },
  };
  render(<BreweryCard brewery={brewery} />);
  expect(screen.getByTestId('brewery-card')).toHaveTextContent('Sample Brewery');
});
