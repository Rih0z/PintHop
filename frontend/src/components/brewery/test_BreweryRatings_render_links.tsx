import React from 'react';
import { render, screen } from '@testing-library/react';
import BreweryRatings from './BreweryRatings';

test('BreweryRatings レビューサイトリンクが正しく表示される', () => {
  const ratings = {
    untappd: { score: 4.1, url: 'https://untappd.com/brewery/1' },
    rateBeer: { score: 92, url: 'https://www.ratebeer.com/brewery/1' },
    beerAdvocate: { score: 88, url: 'https://www.beeradvocate.com/brewery/1' }
  };
  render(<BreweryRatings ratings={ratings} />);
  const link = screen.getByTestId('untappd-link');
  expect(link).toHaveAttribute('href', ratings.untappd.url);
});
