import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PresenceProvider, usePresence } from './PresenceContext';
import * as presenceService from '../services/presence';

jest.mock('../services/presence');

const TestComponent: React.FC = () => {
  const { presence, updatePresence } = usePresence();
  return (
    <div>
      <button onClick={() => updatePresence({ status: 'online' })}>Update</button>
      {presence && <span data-testid="status">{presence.status}</span>}
    </div>
  );
};

test('test_presenceContext_update_flow', async () => {
  (presenceService.updatePresence as jest.Mock).mockResolvedValue({
    user: '1',
    status: 'online'
  });

  render(
    <PresenceProvider>
      <TestComponent />
    </PresenceProvider>
  );

  fireEvent.click(screen.getByText('Update'));

  await waitFor(() => {
    expect(screen.getByTestId('status')).toHaveTextContent('online');
    expect(presenceService.updatePresence).toHaveBeenCalledWith({ status: 'online' });
  });
});
