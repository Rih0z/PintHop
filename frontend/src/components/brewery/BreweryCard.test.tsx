/**
 * BreweryCard component tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BreweryCard } from './BreweryCard';
import { Brewery } from '../../types/brewery';

describe('BreweryCard', () => {
  const mockBrewery: Brewery = {
    _id: '1',
    breweryId: 'test-brewery',
    name: 'Test Brewery',
    slug: 'test-brewery',
    breweryType: 'brewpub',
    address: {
      street: '123 Test St',
      city: 'Seattle',
      state: 'Washington',
      zipCode: '98101',
      country: 'United States',
      formattedAddress: '123 Test St'
    },
    location: {
      type: 'Point',
      coordinates: [-122.3321, 47.6062]
    },
    phone: '206-555-0123',
    websiteUrl: 'https://testbrewery.com',
    region: 'seattle',
    ratings: {
      untappd: { score: 4.5, url: 'https://untappd.com/test' },
      rateBeer: { score: 90, url: null },
      beerAdvocate: { score: 85, url: null },
      aggregateScore: 4.3
    }
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render brewery name and details', () => {
    render(<BreweryCard brewery={mockBrewery} />);

    expect(screen.getByText('Test Brewery')).toBeInTheDocument();
    expect(screen.getByText('brewpub')).toBeInTheDocument();
    expect(screen.getByText('Seattle, Washington')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
  });

  it('should handle click when onClick is provided', () => {
    render(<BreweryCard brewery={mockBrewery} onClick={mockOnClick} />);

    const card = screen.getByRole('article');
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledWith(mockBrewery);
  });

  it('should show cursor pointer when clickable', () => {
    const { container } = render(<BreweryCard brewery={mockBrewery} onClick={mockOnClick} />);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');
  });

  it('should not show cursor pointer when not clickable', () => {
    const { container } = render(<BreweryCard brewery={mockBrewery} />);
    
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass('cursor-pointer');
  });

  it('should handle missing optional fields gracefully', () => {
    const minimalBrewery: Brewery = {
      _id: '2',
      breweryId: 'minimal-brewery',
      name: 'Minimal Brewery',
      slug: 'minimal-brewery',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'United States'
      },
      region: 'portland',
      ratings: {
        untappd: { score: null, url: null },
        rateBeer: { score: null, url: null },
        beerAdvocate: { score: null, url: null }
      }
    };

    render(<BreweryCard brewery={minimalBrewery} />);

    expect(screen.getByText('Minimal Brewery')).toBeInTheDocument();
    expect(screen.getByText('Portland, Oregon')).toBeInTheDocument();
    expect(screen.queryByText('123 Test St')).not.toBeInTheDocument();
  });

  it('should show presence count when provided', () => {
    const breweryWithPresence = {
      ...mockBrewery,
      currentPresenceCount: 5
    };

    render(<BreweryCard brewery={breweryWithPresence} />);

    expect(screen.getByText('5 people here now')).toBeInTheDocument();
  });

  it('should not show presence count when zero', () => {
    const breweryWithNoPresence = {
      ...mockBrewery,
      currentPresenceCount: 0
    };

    render(<BreweryCard brewery={breweryWithNoPresence} />);

    expect(screen.queryByText(/people here now/)).not.toBeInTheDocument();
  });

  it('should show singular form for one person', () => {
    const breweryWithOnePresence = {
      ...mockBrewery,
      currentPresenceCount: 1
    };

    render(<BreweryCard brewery={breweryWithOnePresence} />);

    expect(screen.getByText('1 person here now')).toBeInTheDocument();
  });
});