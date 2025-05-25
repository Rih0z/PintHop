import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TimelinePage from './Timeline';
import * as presenceService from '../services/presence';
import { Presence } from '../types/presence';

jest.mock('../services/presence');

const mockPresence: Presence[] = [
  { user: 'u1', status: 'online' }
];
(presenceService.fetchFriendsPresence as jest.Mock).mockResolvedValue(mockPresence);

test('TimelinePage プレゼンスリストが表示される', async () => {
  render(<TimelinePage />);
  await waitFor(() => expect(screen.getByTestId('presence-list')).toBeInTheDocument());
});
