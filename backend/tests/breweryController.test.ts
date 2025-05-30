/**
 * Brewery controller tests
 */

import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import breweryRoutes from '../src/api/routes/breweryRoutes';
import Brewery from '../src/models/Brewery';
import { AppError } from '../src/utils/AppError';

const app = express();
app.use(express.json());
app.use('/api/v1/breweries', breweryRoutes);

// Error handler for tests
app.use((err: Error | AppError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message
    });
  }
  res.status(500).json({ status: 'error', message: err.message });
});

let mongoServer: MongoMemoryServer;

describe('Brewery Controller', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Brewery.deleteMany({});
  });

  const createTestBrewery = async () => {
    return await Brewery.create({
      breweryId: 'test-brewery-1',
      name: 'Test Brewery',
      slug: 'test-brewery',
      breweryType: 'brewpub',
      address: '123 Test St',
      city: 'Seattle',
      state: 'Washington',
      postalCode: '98101',
      country: 'United States',
      location: {
        type: 'Point',
        coordinates: [-122.3321, 47.6062]
      },
      phone: '206-555-0123',
      websiteUrl: 'https://testbrewery.com',
      region: {
        name: 'Seattle',
        state: 'Washington',
        country: 'USA'
      }
    });
  };

  describe('GET /api/v1/breweries', () => {
    it('should return all breweries', async () => {
      await createTestBrewery();
      await Brewery.create({
        breweryId: 'test-brewery-2',
        name: 'Another Test Brewery',
        slug: 'another-test-brewery',
        city: 'Seattle',
        state: 'Washington'
      });

      const res = await request(app).get('/api/v1/breweries');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].name).toBe('Another Test Brewery');
      expect(res.body.data[1].name).toBe('Test Brewery');
    });

    it('should return empty array when no breweries', async () => {
      const res = await request(app).get('/api/v1/breweries');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual([]);
    });
  });

  describe('GET /api/v1/breweries/:id', () => {
    it('should return brewery by id', async () => {
      const brewery = await createTestBrewery();

      const res = await request(app).get(`/api/v1/breweries/${brewery._id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.name).toBe('Test Brewery');
      expect(res.body.data.breweryId).toBe('test-brewery-1');
    });

    it('should return 404 for non-existent brewery', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/v1/breweries/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.code).toBe('BREWERY_NOT_FOUND');
    });

    it('should return 500 for invalid id format', async () => {
      const res = await request(app).get('/api/v1/breweries/invalid-id');

      expect(res.status).toBe(500);
      expect(res.body.code).toBe('DATABASE_ERROR');
    });
  });

  describe('GET /api/v1/breweries/random', () => {
    it('should return a random brewery', async () => {
      await createTestBrewery();
      await Brewery.create({
        breweryId: 'test-brewery-2',
        name: 'Another Test Brewery',
        slug: 'another-test-brewery',
        city: 'Seattle',
        state: 'Washington'
      });

      const res = await request(app).get('/api/v1/breweries/random');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(['Test Brewery', 'Another Test Brewery']).toContain(res.body.data.name);
    });

    it('should return 404 when no breweries exist', async () => {
      const res = await request(app).get('/api/v1/breweries/random');

      expect(res.status).toBe(404);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /api/v1/breweries/nearby', () => {
    beforeEach(async () => {
      // Create 2D sphere index for location queries
      await Brewery.collection.createIndex({ location: '2dsphere' });
    });

    it('should return nearby breweries', async () => {
      await createTestBrewery();
      await Brewery.create({
        breweryId: 'far-brewery',
        name: 'Far Away Brewery',
        slug: 'far-away-brewery',
        city: 'Portland',
        state: 'Oregon',
        location: {
          type: 'Point',
          coordinates: [-122.6765, 45.5152] // Portland coordinates
        }
      });

      const res = await request(app)
        .get('/api/v1/breweries/nearby')
        .query({
          longitude: -122.3321,
          latitude: 47.6062,
          maxDistance: 5000 // 5km
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('Test Brewery');
    });

    it('should return 400 for missing coordinates', async () => {
      const res = await request(app)
        .get('/api/v1/breweries/nearby')
        .query({ maxDistance: 5000 });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.message).toContain('Longitude and latitude are required');
    });

    it('should return 400 for invalid coordinates', async () => {
      const res = await request(app)
        .get('/api/v1/breweries/nearby')
        .query({
          longitude: 'invalid',
          latitude: 'invalid',
          maxDistance: 5000
        });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.message).toContain('Invalid coordinate');
    });
  });

  describe('GET /api/v1/breweries/region/:region', () => {
    it('should return breweries by region', async () => {
      await createTestBrewery();
      await Brewery.create({
        breweryId: 'portland-brewery',
        name: 'Portland Brewery',
        slug: 'portland-brewery',
        city: 'Portland',
        state: 'Oregon',
        region: {
          name: 'Portland',
          state: 'Oregon',
          country: 'USA'
        }
      });

      const res = await request(app).get('/api/v1/breweries/region/Seattle');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('Test Brewery');
    });

    it('should return empty array for non-existent region', async () => {
      const res = await request(app).get('/api/v1/breweries/region/NonExistent');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual([]);
    });
  });
});