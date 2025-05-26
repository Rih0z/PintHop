import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useCheckins } from './useCheckins';
import * as checkinService from '../services/checkins';
import { Checkin } from '../types/checkin';

jest.mock('../services/checkins');

const mockCheckins: Checkin[] = [{ _id: 'c1', brewery: 'b1', status: 'active' }];
(checkinService.fetchCheckins as jest.Mock).mockResolvedValue(mockCheckins);

const TestComponent: React.FC = () => {
  const { checkins, loading } = useCheckins();
  if (loading) return <div>loading</div>;
  return <span data-testid="count">{checkins.length}</span>;
};

test('test_useCheckins_fetches_data', async () => {
  render(<TestComponent />);
  await waitFor(() =>
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  );
});
