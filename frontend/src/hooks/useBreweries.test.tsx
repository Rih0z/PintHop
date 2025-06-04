/**
 * useBreweries hook tests
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useBreweries } from './useBreweries';
import * as breweriesService from '../services/breweries';

jest.mock('../services/breweries');

describe('useBreweries', () => {
  const mockBreweries = [
    {
      _id: '1',
      breweryId: 'test-brewery-1',
      name: 'Test Brewery 1',
      slug: 'test-brewery-1',
      breweryType: 'brewpub',
      city: 'Seattle',
      state: 'Washington',
      country: 'United States',
      location: {
        type: 'Point' as const,
        coordinates: [-122.3321, 47.6062]
      }
    },
    {
      _id: '2',
      breweryId: 'test-brewery-2',
      name: 'Test Brewery 2',
      slug: 'test-brewery-2',
      breweryType: 'micro',
      city: 'Portland',
      state: 'Oregon',
      country: 'United States',
      location: {
        type: 'Point' as const,
        coordinates: [-122.6765, 45.5152]
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch breweries on mount', async () => {
    (breweriesService.fetchBreweries as jest.Mock).mockResolvedValue(mockBreweries);

    const { result } = renderHook(() => useBreweries());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.breweries).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.breweries).toEqual(mockBreweries);
    expect(result.current.error).toBeNull();
    expect(breweriesService.fetchBreweries).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Failed to fetch breweries');
    (breweriesService.fetchBreweries as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useBreweries());

    // Wait for error state
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.breweries).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to fetch breweries');
  });

  it('should only fetch once on multiple renders', async () => {
    (breweriesService.fetchBreweries as jest.Mock).mockResolvedValue(mockBreweries);

    const { result, rerender } = renderHook(() => useBreweries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Rerender the hook
    rerender();

    // Should not fetch again
    expect(breweriesService.fetchBreweries).toHaveBeenCalledTimes(1);
    expect(result.current.breweries).toEqual(mockBreweries);
  });
});