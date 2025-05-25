import request from 'supertest';
import app from '../src/app';
import Checkin from '../src/models/Checkin';

jest.mock('../src/models/Checkin');

const mockCheckin = { id: 'c1', brewery: 'b1', status: 'active' };

(Checkin.create as jest.Mock).mockResolvedValue(mockCheckin);
(Checkin.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...mockCheckin, status: 'completed' });
(Checkin.find as jest.Mock).mockResolvedValue([mockCheckin]);

describe('POST /api/v1/checkins', () => {
  it('test_createCheckin_validData_returns201', async () => {
    const res = await request(app)
      .post('/api/v1/checkins')
      .send({ breweryId: 'b1' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockCheckin);
  });
});

describe('POST /api/v1/checkins/:checkinId/checkout', () => {
  it('test_checkout_validId_returnsCheckin', async () => {
    const res = await request(app).post('/api/v1/checkins/c1/checkout');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
  });
});

describe('GET /api/v1/checkins', () => {
  it('test_getCheckins_noParams_returnsList', async () => {
    const res = await request(app).get('/api/v1/checkins');
    expect(res.status).toBe(200);
    expect(res.body.checkins).toEqual([mockCheckin]);
  });
});

