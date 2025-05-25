import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PresenceProvider, usePresence } from './PresenceContext';
import * as presenceService from '../services/presence';

jest.mock('../services/presence');

const TestComponent: React.FC = () => {
  const { presence } = usePresence();
  return <span data-testid="status">{presence?.status}</span>;
};

test('test_presenceContext_initial_fetch', async () => {
  (presenceService.fetchMyPresence as jest.Mock).mockResolvedValue({
    user: '1',
    status: 'online'
  });

  render(
    <PresenceProvider>
      <TestComponent />
    </PresenceProvider>
  );

  await waitFor(() =>
    expect(screen.getByTestId('status')).toHaveTextContent('online')
  );
});

