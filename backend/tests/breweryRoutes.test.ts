import request from 'supertest';
import app from '../src/app';
import Brewery from '../src/models/Brewery';

jest.mock('../src/models/Brewery');

const mockBreweries = [{ name: 'Test Brewery' }];
(Brewery.find as jest.Mock).mockResolvedValue(mockBreweries);
(Brewery.aggregate as jest.Mock).mockResolvedValue([mockBreweries[0]]);

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
