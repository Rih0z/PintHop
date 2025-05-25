import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useBreweryPresence } from './useBreweryPresence';
import * as presenceService from '../services/presence';
import { Presence } from '../types/presence';

jest.mock('../services/presence');

const mockPresence: Presence[] = [{ user: 'u1', status: 'online', brewery: 'b1' }];
(presenceService.fetchBreweryPresence as jest.Mock).mockResolvedValue(mockPresence);

const TestComponent: React.FC = () => {
  const { presences, loading } = useBreweryPresence('b1');
  if (loading) return <div>loading</div>;
  return <span data-testid="count">{presences.length}</span>;
};

test('test_useBreweryPresence_fetches_data', async () => {
  render(<TestComponent />);
  await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1'));
});
