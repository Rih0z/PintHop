import request from 'supertest';
import app from '../src/app';
import Brewery from '../src/models/Brewery';
import Presence from '../src/models/Presence';

jest.mock('../src/models/Brewery');
jest.mock('../src/models/Presence');

const mockBreweries = [{ name: 'Test Brewery', _id: 'b1' }];
(Brewery.find as jest.Mock).mockResolvedValue(mockBreweries);
(Brewery.aggregate as jest.Mock).mockResolvedValue([mockBreweries[0]]);

const mockPresence = [{ user: 'u1', status: 'online', brewery: 'b1' }];
(Presence.find as jest.Mock).mockResolvedValue(mockPresence);

describe('GET /api/v1/breweries', () => {
  it('should return breweries list', async () => {
    const res = await request(app).get('/api/v1/breweries');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockBreweries);
  });
});

describe('GET /api/v1/breweries/random', () => {
  it('should return a random brewery', async () => {
    const res = await request(app).get('/api/v1/breweries/random');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockBreweries[0]);
  });
});

describe('GET /api/v1/breweries/:id/presence', () => {
  it('should return presence list for brewery', async () => {
    const res = await request(app).get('/api/v1/breweries/b1/presence');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPresence);
  });
});
