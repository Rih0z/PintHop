import request from 'supertest';
import app from '../src/app';
import Presence from '../src/models/Presence';

jest.mock('../src/models/Presence');

const mockPresence = { user: 'u1', status: 'online' };

(Presence.findOneAndUpdate as jest.Mock).mockResolvedValue(mockPresence);
(Presence.find as jest.Mock).mockResolvedValue([mockPresence]);
(Presence.findOne as jest.Mock).mockResolvedValue(mockPresence);

describe('POST /api/v1/presence', () => {
  it('test_updatePresence_validData_returnsPresence', async () => {
    const res = await request(app)
      .post('/api/v1/presence')
      .send({ userId: 'u1', status: 'online' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPresence);
  });
});

describe('GET /api/v1/presence/friends', () => {
  it('test_getFriendsPresence_returnsList', async () => {
    const res = await request(app).get('/api/v1/presence/friends');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockPresence]);
  });
});

describe('GET /api/v1/presence/me', () => {
  it('test_getMyPresence_returnsPresence', async () => {
    const res = await request(app).get('/api/v1/presence/me');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPresence);
  });
});
