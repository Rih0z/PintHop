import mongoose from 'mongoose';
import { BeerExperience } from '../../src/models/BeerExperience';
import { Beer } from '../../src/models/Beer';
import Brewery from '../../src/models/Brewery';
import User from '../../src/models/User';

describe('BeerExperience Model', () => {
  let testUser: any;
  let testBrewery: any;
  let testBeer: any;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/pinthop-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await BeerExperience.deleteMany({});
    await Beer.deleteMany({});
    await Brewery.deleteMany({});
    await User.deleteMany({});

    // Create test data
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword'
    });

    testBrewery = await Brewery.create({
      name: 'Test Brewery',
      address: '123 Test St',
      city: 'Seattle',
      state: 'WA',
      latitude: 47.6062,
      longitude: -122.3321
    });

    testBeer = await Beer.create({
      name: 'Test IPA',
      brewery: testBrewery._id,
      style: 'IPA',
      abv: 6.5,
      ibu: 60
    });
  });

  describe('BeerExperience creation', () => {
    it('should create a beer experience with required fields', async () => {
      const experienceData = {
        user: testUser._id,
        beer: testBeer._id,
        brewery: testBrewery._id,
        rating: 4.5,
        comment: 'Great hoppy beer!'
      };

      const experience = await BeerExperience.create(experienceData);

      expect(experience.user.toString()).toBe(testUser._id.toString());
      expect(experience.beer.toString()).toBe(testBeer._id.toString());
      expect(experience.brewery.toString()).toBe(testBrewery._id.toString());
      expect(experience.rating).toBe(4.5);
      expect(experience.comment).toBe('Great hoppy beer!');
      expect(experience.timestamp).toBeDefined();
    });

    it('should require user, beer, and brewery', async () => {
      try {
        await BeerExperience.create({
          rating: 4.0,
          comment: 'Test comment'
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors.user).toBeDefined();
        expect(error.errors.beer).toBeDefined();
        expect(error.errors.brewery).toBeDefined();
      }
    });

    it('should validate rating range (1-5)', async () => {
      try {
        await BeerExperience.create({
          user: testUser._id,
          beer: testBeer._id,
          brewery: testBrewery._id,
          rating: 6.0 // Invalid rating
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors.rating).toBeDefined();
      }
    });

    it('should create experience without rating and comment', async () => {
      const experience = await BeerExperience.create({
        user: testUser._id,
        beer: testBeer._id,
        brewery: testBrewery._id
      });

      expect(experience.user.toString()).toBe(testUser._id.toString());
      expect(experience.rating).toBeUndefined();
      expect(experience.comment).toBeUndefined();
    });
  });

  describe('Flavor profile recording', () => {
    it('should store detailed flavor profile', async () => {
      const experience = await BeerExperience.create({
        user: testUser._id,
        beer: testBeer._id,
        brewery: testBrewery._id,
        rating: 4.2,
        flavorProfile: {
          hoppy: 9,
          malty: 3,
          bitter: 8,
          sweet: 2,
          sour: 1,
          fruity: 6,
          roasted: 1,
          smoky: 1
        }
      });

      expect(experience.flavorProfile.hoppy).toBe(9);
      expect(experience.flavorProfile.bitter).toBe(8);
      expect(experience.flavorProfile.fruity).toBe(6);
    });

    it('should validate flavor profile values (1-10)', async () => {
      try {
        await BeerExperience.create({
          user: testUser._id,
          beer: testBeer._id,
          brewery: testBrewery._id,
          flavorProfile: {
            hoppy: 15 // Invalid value
          }
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors['flavorProfile.hoppy']).toBeDefined();
      }
    });
  });

  describe('Photos and additional data', () => {
    it('should store photo URLs', async () => {
      const experience = await BeerExperience.create({
        user: testUser._id,
        beer: testBeer._id,
        brewery: testBrewery._id,
        photos: [
          'https://example.com/photo1.jpg',
          'https://example.com/photo2.jpg'
        ]
      });

      expect(experience.photos).toHaveLength(2);
      expect(experience.photos[0]).toBe('https://example.com/photo1.jpg');
    });

    it('should store contextual information', async () => {
      const experience = await BeerExperience.create({
        user: testUser._id,
        beer: testBeer._id,
        brewery: testBrewery._id,
        context: {
          weather: 'sunny',
          temperature: 75,
          occasion: 'celebration',
          companions: 3
        },
        servingInfo: {
          glassType: 'pint',
          temperature: 'cold',
          carbonation: 'medium'
        }
      });

      expect(experience.context.weather).toBe('sunny');
      expect(experience.context.companions).toBe(3);
      expect(experience.servingInfo.glassType).toBe('pint');
    });
  });

  describe('Experience queries', () => {
    beforeEach(async () => {
      // Create multiple experiences for testing
      const user2 = await User.create({
        username: 'user2',
        email: 'user2@example.com',
        password: 'hashedpassword'
      });

      const beer2 = await Beer.create({
        name: 'Test Stout',
        brewery: testBrewery._id,
        style: 'Stout',
        abv: 8.0
      });

      await BeerExperience.create([
        {
          user: testUser._id,
          beer: testBeer._id,
          brewery: testBrewery._id,
          rating: 4.5,
          timestamp: new Date('2023-01-01')
        },
        {
          user: testUser._id,
          beer: beer2._id,
          brewery: testBrewery._id,
          rating: 3.8,
          timestamp: new Date('2023-01-02')
        },
        {
          user: user2._id,
          beer: testBeer._id,
          brewery: testBrewery._id,
          rating: 4.2,
          timestamp: new Date('2023-01-03')
        }
      ]);
    });

    it('should find experiences by user', async () => {
      const userExperiences = await BeerExperience.find({ user: testUser._id });
      expect(userExperiences).toHaveLength(2);
      expect(userExperiences.every(exp => exp.user.toString() === testUser._id.toString())).toBe(true);
    });

    it('should find experiences by beer', async () => {
      const beerExperiences = await BeerExperience.find({ beer: testBeer._id });
      expect(beerExperiences).toHaveLength(2);
      expect(beerExperiences.every(exp => exp.beer.toString() === testBeer._id.toString())).toBe(true);
    });

    it('should find high-rated experiences', async () => {
      const highRated = await BeerExperience.find({ rating: { $gte: 4.0 } });
      expect(highRated).toHaveLength(2);
      expect(highRated.every(exp => exp.rating >= 4.0)).toBe(true);
    });

    it('should sort experiences by timestamp', async () => {
      const experiences = await BeerExperience.find({}).sort({ timestamp: -1 });
      expect(experiences).toHaveLength(3);
      expect(experiences[0].timestamp.getTime()).toBeGreaterThan(experiences[1].timestamp.getTime());
    });
  });

  describe('Experience analytics', () => {
    it('should calculate user preference trends', async () => {
      // Create experiences with different styles
      const stout = await Beer.create({
        name: 'Test Stout',
        brewery: testBrewery._id,
        style: 'Stout'
      });

      const lager = await Beer.create({
        name: 'Test Lager',
        brewery: testBrewery._id,
        style: 'Lager'
      });

      await BeerExperience.create([
        { user: testUser._id, beer: testBeer._id, brewery: testBrewery._id, rating: 4.5 }, // IPA
        { user: testUser._id, beer: testBeer._id, brewery: testBrewery._id, rating: 4.2 }, // IPA
        { user: testUser._id, beer: stout._id, brewery: testBrewery._id, rating: 3.0 }, // Stout
        { user: testUser._id, beer: lager._id, brewery: testBrewery._id, rating: 3.5 } // Lager
      ]);

      // Query to find user's preferred styles (this would typically be in a service/controller)
      const pipeline = [
        { $match: { user: testUser._id, rating: { $exists: true } } },
        { $lookup: { from: 'beers', localField: 'beer', foreignField: '_id', as: 'beerInfo' } },
        { $unwind: '$beerInfo' },
        { $group: { _id: '$beerInfo.style', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        { $sort: { avgRating: -1 } }
      ];

      const preferences = await BeerExperience.aggregate(pipeline);
      expect(preferences[0]._id).toBe('IPA'); // Highest rated style
      expect(preferences[0].avgRating).toBe(4.35); // (4.5 + 4.2) / 2
    });
  });
});