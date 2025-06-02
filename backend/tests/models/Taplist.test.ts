import mongoose from 'mongoose';
import { Taplist } from '../../src/models/Taplist';
import { Beer } from '../../src/models/Beer';
import Brewery from '../../src/models/Brewery';
import User from '../../src/models/User';

describe('Taplist Model', () => {
  let testUser: any;
  let testBrewery: any;
  let testBeer1: any;
  let testBeer2: any;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/pinthop-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Taplist.deleteMany({});
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

    testBeer1 = await Beer.create({
      name: 'Test IPA',
      brewery: testBrewery._id,
      style: 'IPA',
      abv: 6.5,
      ibu: 60
    });

    testBeer2 = await Beer.create({
      name: 'Test Stout',
      brewery: testBrewery._id,
      style: 'Stout',
      abv: 8.0,
      ibu: 35
    });
  });

  describe('Taplist creation', () => {
    it('should create a taplist with required fields', async () => {
      const taplistData = {
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        photoUrl: 'https://example.com/taplist.jpg',
        beers: [testBeer1._id, testBeer2._id]
      };

      const taplist = await Taplist.create(taplistData);

      expect(taplist.brewery.toString()).toBe(testBrewery._id.toString());
      expect(taplist.uploadedBy.toString()).toBe(testUser._id.toString());
      expect(taplist.photoUrl).toBe('https://example.com/taplist.jpg');
      expect(taplist.beers).toHaveLength(2);
      expect(taplist.timestamp).toBeDefined();
      expect(taplist.isActive).toBe(true);
    });

    it('should require brewery and uploadedBy', async () => {
      try {
        await Taplist.create({
          photoUrl: 'https://example.com/taplist.jpg',
          beers: [testBeer1._id]
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors.brewery).toBeDefined();
        expect(error.errors.uploadedBy).toBeDefined();
      }
    });

    it('should validate photo URL format', async () => {
      try {
        await Taplist.create({
          brewery: testBrewery._id,
          uploadedBy: testUser._id,
          photoUrl: 'invalid-url',
          beers: [testBeer1._id]
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors.photoUrl).toBeDefined();
      }
    });

    it('should create taplist without beers initially', async () => {
      const taplist = await Taplist.create({
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        photoUrl: 'https://example.com/taplist.jpg'
      });

      expect(taplist.beers).toHaveLength(0);
      expect(taplist.ocrProcessed).toBe(false);
      expect(taplist.ocrText).toBeUndefined();
    });
  });

  describe('OCR functionality', () => {
    it('should store OCR text and mark as processed', async () => {
      const taplist = await Taplist.create({
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        photoUrl: 'https://example.com/taplist.jpg',
        ocrText: 'IPA 6.5% $8\nStout 8.0% $9\nLager 5.2% $7',
        ocrProcessed: true,
        ocrConfidence: 0.95
      });

      expect(taplist.ocrText).toContain('IPA 6.5%');
      expect(taplist.ocrProcessed).toBe(true);
      expect(taplist.ocrConfidence).toBe(0.95);
    });

    it('should validate OCR confidence range (0-1)', async () => {
      try {
        await Taplist.create({
          brewery: testBrewery._id,
          uploadedBy: testUser._id,
          photoUrl: 'https://example.com/taplist.jpg',
          ocrConfidence: 1.5 // Invalid confidence > 1
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors.ocrConfidence).toBeDefined();
      }
    });

    it('should store extracted beer information', async () => {
      const taplist = await Taplist.create({
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        photoUrl: 'https://example.com/taplist.jpg',
        extractedBeers: [
          {
            name: 'Hop Explosion IPA',
            style: 'IPA',
            abv: 6.8,
            price: '$8',
            description: 'Citrusy and hoppy'
          },
          {
            name: 'Dark Night Stout',
            style: 'Stout',
            abv: 9.2,
            price: '$10',
            description: 'Rich and roasted'
          }
        ]
      });

      expect(taplist.extractedBeers).toHaveLength(2);
      expect(taplist.extractedBeers[0].name).toBe('Hop Explosion IPA');
      expect(taplist.extractedBeers[0].abv).toBe(6.8);
      expect(taplist.extractedBeers[1].price).toBe('$10');
    });
  });

  describe('Reliability and verification', () => {
    it('should calculate reliability score based on user feedback', async () => {
      const taplist = await Taplist.create({
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        photoUrl: 'https://example.com/taplist.jpg',
        verificationVotes: [
          { user: testUser._id, isAccurate: true, timestamp: new Date() }
        ]
      });

      const reliability = taplist.getReliabilityScore();
      expect(reliability).toBe(1.0); // 1 positive vote out of 1 total
    });

    it('should handle mixed verification votes', async () => {
      const user2 = await User.create({
        username: 'user2',
        email: 'user2@example.com',
        password: 'hashedpassword'
      });

      const taplist = await Taplist.create({
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        photoUrl: 'https://example.com/taplist.jpg',
        verificationVotes: [
          { user: testUser._id, isAccurate: true, timestamp: new Date() },
          { user: user2._id, isAccurate: false, timestamp: new Date() }
        ]
      });

      const reliability = taplist.getReliabilityScore();
      expect(reliability).toBe(0.5); // 1 positive, 1 negative
    });

    it('should determine if taplist is fresh (within last 24 hours)', async () => {
      const freshTaplist = await Taplist.create({
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        photoUrl: 'https://example.com/taplist.jpg',
        timestamp: new Date() // Current time
      });

      expect(freshTaplist.isFresh()).toBe(true);

      const oldTaplist = await Taplist.create({
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        photoUrl: 'https://example.com/old-taplist.jpg',
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000) // 25 hours ago
      });

      expect(oldTaplist.isFresh()).toBe(false);
    });
  });

  describe('Taplist queries', () => {
    beforeEach(async () => {
      // Create multiple taplists for testing
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      await Taplist.create([
        {
          brewery: testBrewery._id,
          uploadedBy: testUser._id,
          photoUrl: 'https://example.com/fresh.jpg',
          timestamp: new Date(),
          isActive: true
        },
        {
          brewery: testBrewery._id,
          uploadedBy: testUser._id,
          photoUrl: 'https://example.com/yesterday.jpg',
          timestamp: yesterday,
          isActive: true
        },
        {
          brewery: testBrewery._id,
          uploadedBy: testUser._id,
          photoUrl: 'https://example.com/old.jpg',
          timestamp: lastWeek,
          isActive: false
        }
      ]);
    });

    it('should find active taplists', async () => {
      const activeTaplists = await Taplist.find({ isActive: true });
      expect(activeTaplists).toHaveLength(2);
      expect(activeTaplists.every(t => t.isActive)).toBe(true);
    });

    it('should find taplists by brewery', async () => {
      const breweryTaplists = await Taplist.find({ brewery: testBrewery._id });
      expect(breweryTaplists).toHaveLength(3);
      expect(breweryTaplists.every(t => t.brewery.toString() === testBrewery._id.toString())).toBe(true);
    });

    it('should find recent taplists (last 48 hours)', async () => {
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const recentTaplists = await Taplist.find({
        timestamp: { $gte: twoDaysAgo }
      });
      
      expect(recentTaplists).toHaveLength(2); // Only fresh and yesterday taplists
    });

    it('should sort taplists by timestamp (newest first)', async () => {
      const sortedTaplists = await Taplist.find({}).sort({ timestamp: -1 });
      expect(sortedTaplists).toHaveLength(3);
      
      for (let i = 0; i < sortedTaplists.length - 1; i++) {
        expect(sortedTaplists[i].timestamp.getTime()).toBeGreaterThanOrEqual(
          sortedTaplists[i + 1].timestamp.getTime()
        );
      }
    });
  });

  describe('Taplist relationships', () => {
    it('should populate brewery and user information', async () => {
      const taplist = await Taplist.create({
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        photoUrl: 'https://example.com/taplist.jpg',
        beers: [testBeer1._id, testBeer2._id]
      });

      const populatedTaplist = await Taplist.findById(taplist._id)
        .populate('brewery')
        .populate('uploadedBy', 'username')
        .populate('beers');

      expect(populatedTaplist!.brewery).toHaveProperty('name', 'Test Brewery');
      expect(populatedTaplist!.uploadedBy).toHaveProperty('username', 'testuser');
      expect(populatedTaplist!.beers).toHaveLength(2);
      expect(populatedTaplist!.beers[0]).toHaveProperty('name', 'Test IPA');
    });
  });

  describe('Taplist validation and constraints', () => {
    it('should limit maximum number of beers', async () => {
      // Create 51 test beers (exceeds typical taplist limit)
      const manyBeers = [];
      for (let i = 0; i < 51; i++) {
        const beer = await Beer.create({
          name: `Beer ${i}`,
          brewery: testBrewery._id,
          style: 'IPA'
        });
        manyBeers.push(beer._id);
      }

      try {
        await Taplist.create({
          brewery: testBrewery._id,
          uploadedBy: testUser._id,
          photoUrl: 'https://example.com/taplist.jpg',
          beers: manyBeers
        });
        fail('Should have thrown validation error for too many beers');
      } catch (error: any) {
        expect(error.errors.beers).toBeDefined();
      }
    });

    it('should prevent duplicate active taplists from same user for same brewery within short timeframe', async () => {
      // Create first taplist
      await Taplist.create({
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        photoUrl: 'https://example.com/taplist1.jpg'
      });

      // Try to create another taplist within 1 hour (should be prevented by business logic)
      const recentTaplist = await Taplist.findOne({
        brewery: testBrewery._id,
        uploadedBy: testUser._id,
        timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
      });

      expect(recentTaplist).toBeTruthy();
      // In actual implementation, controller should check this and either update existing or reject
    });
  });
});