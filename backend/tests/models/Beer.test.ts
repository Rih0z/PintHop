import mongoose from 'mongoose';
import { Beer } from '../../src/models/Beer';
import Brewery from '../../src/models/Brewery';

describe('Beer Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/pinthop-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Beer.deleteMany({});
    await Brewery.deleteMany({});
  });

  describe('Beer creation', () => {
    it('should create a beer with basic information', async () => {
      const brewery = await Brewery.create({
        breweryId: 'test-brewery-001',
        name: 'Test Brewery',
        slug: 'test-brewery',
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });

      const beerData = {
        name: 'Test IPA',
        brewery: brewery._id,
        style: 'IPA',
        abv: 6.5,
        ibu: 60,
        description: 'A hoppy test beer'
      };

      const beer = await Beer.create(beerData);

      expect(beer.name).toBe('Test IPA');
      expect(beer.style).toBe('IPA');
      expect(beer.abv).toBe(6.5);
      expect(beer.ibu).toBe(60);
      expect(beer.brewery.toString()).toBe(brewery._id.toString());
    });

    it('should require name and brewery', async () => {
      try {
        await Beer.create({
          style: 'IPA',
          abv: 6.5
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors.name).toBeDefined();
        expect(error.errors.brewery).toBeDefined();
      }
    });

    it('should validate ABV range (0-20)', async () => {
      const brewery = await Brewery.create({
        breweryId: 'test-brewery-001',
        name: 'Test Brewery',
        slug: 'test-brewery',
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });

      try {
        await Beer.create({
          name: 'Invalid Beer',
          brewery: brewery._id,
          abv: 25 // Invalid ABV
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors.abv).toBeDefined();
      }
    });

    it('should validate IBU range (0-120)', async () => {
      const brewery = await Brewery.create({
        breweryId: 'test-brewery-001',
        name: 'Test Brewery',
        slug: 'test-brewery',
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });

      try {
        await Beer.create({
          name: 'Invalid Beer',
          brewery: brewery._id,
          ibu: 150 // Invalid IBU
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors.ibu).toBeDefined();
      }
    });
  });

  describe('Beer ratings', () => {
    it('should store multiple review site ratings', async () => {
      const brewery = await Brewery.create({
        breweryId: 'test-brewery-001',
        name: 'Test Brewery',
        slug: 'test-brewery',
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });

      const beer = await Beer.create({
        name: 'Rated Beer',
        brewery: brewery._id,
        style: 'IPA',
        ratings: {
          untappd: 4.2,
          rateBeer: 3.8,
          beerConnoisseur: 4.0
        }
      });

      expect(beer.ratings.untappd).toBe(4.2);
      expect(beer.ratings.rateBeer).toBe(3.8);
      expect(beer.ratings.beerConnoisseur).toBe(4.0);
    });

    it('should calculate average rating', async () => {
      const brewery = await Brewery.create({
        breweryId: 'test-brewery-001',
        name: 'Test Brewery',
        slug: 'test-brewery',
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });

      const beer = await Beer.create({
        name: 'Rated Beer',
        brewery: brewery._id,
        style: 'IPA',
        ratings: {
          untappd: 4.0,
          rateBeer: 3.5,
          beerConnoisseur: 4.5
        }
      });

      console.log('Beer ratings:', beer.ratings);
      console.log('Beer toJSON:', beer.toJSON());
      const averageRating = beer.getAverageRating();
      console.log('Average rating:', averageRating);
      expect(averageRating).toBe(4.0);
    });
  });

  describe('Beer awards', () => {
    it('should store award information', async () => {
      const brewery = await Brewery.create({
        breweryId: 'award-winning-brewery-001',
        name: 'Award Winning Brewery',
        slug: 'award-winning-brewery',
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });

      const beer = await Beer.create({
        name: 'Award Winner',
        brewery: brewery._id,
        style: 'IPA',
        awards: [
          {
            name: 'GABF Gold Medal',
            year: 2023,
            category: 'American IPA',
            level: 'national'
          },
          {
            name: 'World Beer Cup Silver',
            year: 2022,
            category: 'American IPA',
            level: 'international'
          }
        ]
      });

      expect(beer.awards).toHaveLength(2);
      expect(beer.awards[0].name).toBe('GABF Gold Medal');
      expect(beer.awards[0].level).toBe('national');
      expect(beer.awards[1].level).toBe('international');
    });

    it('should validate award level enum', async () => {
      const brewery = await Brewery.create({
        breweryId: 'test-brewery-001',
        name: 'Test Brewery',
        slug: 'test-brewery',
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });

      try {
        await Beer.create({
          name: 'Invalid Award Beer',
          brewery: brewery._id,
          awards: [
            {
              name: 'Test Award',
              year: 2023,
              category: 'IPA',
              level: 'invalid' // Invalid level
            }
          ]
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors['awards.0.level']).toBeDefined();
      }
    });
  });

  describe('Beer flavor profile', () => {
    it('should store hop composition analysis', async () => {
      const brewery = await Brewery.create({
        breweryId: 'hoppy-brewery-001',
        name: 'Hoppy Brewery',
        slug: 'hoppy-brewery',
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });

      const beer = await Beer.create({
        name: 'Hoppy IPA',
        brewery: brewery._id,
        style: 'IPA',
        hopComposition: {
          citrus: 8,
          floral: 3,
          piney: 6,
          earthy: 2,
          spicy: 4,
          tropical: 7
        },
        flavorProfile: {
          hoppy: 9,
          malty: 3,
          bitter: 8,
          sweet: 2,
          sour: 1,
          roasted: 1
        }
      });

      expect(beer.hopComposition?.citrus).toBe(8);
      expect(beer.hopComposition?.tropical).toBe(7);
      expect(beer.flavorProfile?.hoppy).toBe(9);
      expect(beer.flavorProfile?.bitter).toBe(8);
    });

    it('should validate flavor profile values (1-10)', async () => {
      const brewery = await Brewery.create({
        breweryId: 'test-brewery-001',
        name: 'Test Brewery',
        slug: 'test-brewery',
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });

      try {
        await Beer.create({
          name: 'Invalid Flavor Beer',
          brewery: brewery._id,
          flavorProfile: {
            hoppy: 15, // Invalid value > 10
            malty: 3
          }
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors['flavorProfile.hoppy']).toBeDefined();
      }
    });
  });

  describe('Beer search and filtering', () => {
    beforeEach(async () => {
      const brewery = await Brewery.create({
        breweryId: 'test-brewery-001',
        name: 'Test Brewery',
        slug: 'test-brewery',
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });

      await Beer.create([
        {
          name: 'IPA 1',
          brewery: brewery._id,
          style: 'IPA',
          abv: 6.5,
          ratings: { untappd: 4.2 },
          awards: [{ name: 'Gold Medal', year: 2023, category: 'IPA', level: 'national' }]
        },
        {
          name: 'Stout 1',
          brewery: brewery._id,
          style: 'Stout',
          abv: 8.0,
          ratings: { untappd: 3.8 }
        },
        {
          name: 'IPA 2',
          brewery: brewery._id,
          style: 'IPA',
          abv: 7.2,
          ratings: { untappd: 4.0 }
        }
      ]);
    });

    it('should find beers by style', async () => {
      const ipas = await Beer.find({ style: 'IPA' });
      expect(ipas).toHaveLength(2);
      expect(ipas.every(beer => beer.style === 'IPA')).toBe(true);
    });

    it('should find high-rated beers', async () => {
      const highRated = await Beer.find({ 'ratings.untappd': { $gte: 4.0 } });
      expect(highRated).toHaveLength(2);
      expect(highRated.every(beer => beer.ratings.untappd! >= 4.0)).toBe(true);
    });

    it('should find award-winning beers', async () => {
      const awardWinners = await Beer.find({ awards: { $exists: true, $ne: [] } });
      expect(awardWinners).toHaveLength(1);
      expect(awardWinners[0].name).toBe('IPA 1');
    });
  });

  describe('Beer methods', () => {
    let brewery: any;

    beforeEach(async () => {
      const timestamp = Date.now() + Math.random();
      brewery = await Brewery.create({
        breweryId: `test-brewery-${timestamp}`,
        name: 'Test Brewery',
        slug: `test-brewery-${timestamp}`,
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });
    });

    describe('getAverageRating', () => {
      it('should return 0 when no ratings exist', async () => {
        const beer = await Beer.create({
          name: 'No Ratings Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {}
        });

        expect(beer.getAverageRating()).toBe(0);
      });

      it('should handle null and undefined ratings', async () => {
        const beer = await Beer.create({
          name: 'Partial Ratings Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: 4.0,
            rateBeer: null,
            beerConnoisseur: undefined
          }
        });

        expect(beer.getAverageRating()).toBe(4.0);
      });

      it('should handle NaN ratings', async () => {
        const beer = await Beer.create({
          name: 'Mixed Ratings Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: 4.0,
            rateBeer: 3.5
          }
        });

        // Manually add NaN value to test filtering
        beer.ratings.beerConnoisseur = NaN;
        expect(beer.getAverageRating()).toBe(3.8);
      });

      it('should round to 1 decimal place', async () => {
        const beer = await Beer.create({
          name: 'Precise Rating Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: 4.33,
            rateBeer: 3.67,
            beerConnoisseur: 4.15
          }
        });

        expect(beer.getAverageRating()).toBe(4.1);
      });
    });

    describe('hasAwards', () => {
      it('should return true when awards exist', async () => {
        const beer = await Beer.create({
          name: 'Award Winner',
          brewery: brewery._id,
          style: 'IPA',
          awards: [{ name: 'Gold Medal', year: 2023, category: 'IPA', level: 'national' }]
        });

        expect(beer.hasAwards()).toBe(true);
      });

      it('should return false when no awards exist', async () => {
        const beer = await Beer.create({
          name: 'No Awards Beer',
          brewery: brewery._id,
          style: 'IPA',
          awards: []
        });

        expect(beer.hasAwards()).toBe(false);
      });

      it('should return false when awards is null/undefined', async () => {
        const beer = await Beer.create({
          name: 'Null Awards Beer',
          brewery: brewery._id,
          style: 'IPA'
        });

        (beer as any).awards = null;
        expect(beer.hasAwards()).toBe(false);

        (beer as any).awards = undefined;
        expect(beer.hasAwards()).toBe(false);
      });
    });

    describe('getAwardCount', () => {
      it('should return correct count when awards exist', async () => {
        const beer = await Beer.create({
          name: 'Multi Award Beer',
          brewery: brewery._id,
          style: 'IPA',
          awards: [
            { name: 'Gold Medal', year: 2023, category: 'IPA', level: 'national' },
            { name: 'Silver Medal', year: 2022, category: 'IPA', level: 'regional' },
            { name: 'Bronze Medal', year: 2021, category: 'IPA', level: 'local' }
          ]
        });

        expect(beer.getAwardCount()).toBe(3);
      });

      it('should return 0 when no awards exist', async () => {
        const beer = await Beer.create({
          name: 'No Awards Beer',
          brewery: brewery._id,
          style: 'IPA',
          awards: []
        });

        expect(beer.getAwardCount()).toBe(0);
      });

      it('should return 0 when awards is null/undefined', async () => {
        const beer = await Beer.create({
          name: 'Null Awards Beer',
          brewery: brewery._id,
          style: 'IPA'
        });

        (beer as any).awards = null;
        expect(beer.getAwardCount()).toBe(0);

        (beer as any).awards = undefined;
        expect(beer.getAwardCount()).toBe(0);
      });
    });

    describe('isHighlyRated', () => {
      it('should use default threshold of 4.0', async () => {
        const highRatedBeer = await Beer.create({
          name: 'High Rated Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: 4.2,
            rateBeer: 4.0,
            beerConnoisseur: 4.1
          }
        });

        const lowRatedBeer = await Beer.create({
          name: 'Low Rated Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: 3.8,
            rateBeer: 3.5
          }
        });

        expect(highRatedBeer.isHighlyRated()).toBe(true);
        expect(lowRatedBeer.isHighlyRated()).toBe(false);
      });

      it('should use custom threshold', async () => {
        const beer = await Beer.create({
          name: 'Medium Rated Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: 3.8,
            rateBeer: 3.7
          }
        });

        expect(beer.isHighlyRated(3.5)).toBe(true);
        expect(beer.isHighlyRated(4.0)).toBe(false);
      });

      it('should handle edge case where average equals threshold', async () => {
        const beer = await Beer.create({
          name: 'Edge Case Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: 4.0,
            rateBeer: 4.0
          }
        });

        expect(beer.isHighlyRated(4.0)).toBe(true);
      });
    });
  });

  describe('Beer virtuals', () => {
    let brewery: any;

    beforeEach(async () => {
      const timestamp = Date.now() + Math.random();
      brewery = await Brewery.create({
        breweryId: `test-brewery-${timestamp}`,
        name: 'Test Brewery',
        slug: `test-brewery-${timestamp}`,
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });
    });

    describe('highestRating virtual', () => {
      it('should return highest rating when ratings exist', async () => {
        const beer = await Beer.create({
          name: 'Mixed Ratings Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: 4.2,
            rateBeer: 3.8,
            beerConnoisseur: 4.5,
            theBreweryDB: 3.9
          }
        });

        expect((beer as any).highestRating).toBe(4.5);
      });

      it('should return 0 when no valid ratings exist', async () => {
        const beer = await Beer.create({
          name: 'No Ratings Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {}
        });

        expect((beer as any).highestRating).toBe(0);
      });

      it('should filter out null and undefined ratings', async () => {
        const beer = await Beer.create({
          name: 'Partial Ratings Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: 4.0,
            rateBeer: null,
            beerConnoisseur: undefined,
            theBreweryDB: 3.5
          }
        });

        expect((beer as any).highestRating).toBe(4.0);
      });

      it('should filter out NaN ratings', async () => {
        const beer = await Beer.create({
          name: 'NaN Ratings Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: 4.0,
            rateBeer: 3.5
          }
        });

        beer.ratings.beerConnoisseur = NaN;
        expect((beer as any).highestRating).toBe(4.0);
      });
    });

    describe('availabilityTypes virtual', () => {
      it('should return all availability types when all are true', async () => {
        const beer = await Beer.create({
          name: 'All Available Beer',
          brewery: brewery._id,
          style: 'IPA',
          bottled: true,
          canned: true,
          kegged: true
        });

        expect((beer as any).availabilityTypes).toEqual(['bottle', 'can', 'tap']);
      });

      it('should return only selected availability types', async () => {
        const beer = await Beer.create({
          name: 'Partial Available Beer',
          brewery: brewery._id,
          style: 'IPA',
          bottled: true,
          canned: false,
          kegged: true
        });

        expect((beer as any).availabilityTypes).toEqual(['bottle', 'tap']);
      });

      it('should return empty array when no availability types are true', async () => {
        const beer = await Beer.create({
          name: 'Not Available Beer',
          brewery: brewery._id,
          style: 'IPA',
          bottled: false,
          canned: false,
          kegged: false
        });

        expect((beer as any).availabilityTypes).toEqual([]);
      });

      it('should handle default kegged value', async () => {
        const beer = await Beer.create({
          name: 'Default Kegged Beer',
          brewery: brewery._id,
          style: 'IPA'
        });

        expect((beer as any).availabilityTypes).toEqual(['tap']);
      });
    });
  });

  describe('Beer validation edge cases', () => {
    let brewery: any;

    beforeEach(async () => {
      const timestamp = Date.now() + Math.random();
      brewery = await Brewery.create({
        breweryId: `test-brewery-${timestamp}`,
        name: 'Test Brewery',
        slug: `test-brewery-${timestamp}`,
        region: 'Pacific Northwest',
        location: {
          coordinates: [-122.3321, 47.6062]
        },
        address: {
          street: '123 Test St',
          city: 'Seattle',
          state: 'WA'
        }
      });
    });

    describe('SRM validation', () => {
      it('should validate SRM range (1-40)', async () => {
        try {
          await Beer.create({
            name: 'Invalid SRM Beer',
            brewery: brewery._id,
            style: 'IPA',
            srm: 50 // Invalid SRM > 40
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors.srm).toBeDefined();
        }
      });

      it('should reject SRM less than 1', async () => {
        try {
          await Beer.create({
            name: 'Invalid SRM Beer',
            brewery: brewery._id,
            style: 'IPA',
            srm: 0 // Invalid SRM < 1
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors.srm).toBeDefined();
        }
      });

      it('should accept valid SRM values', async () => {
        const beer = await Beer.create({
          name: 'Valid SRM Beer',
          brewery: brewery._id,
          style: 'IPA',
          srm: 20
        });

        expect(beer.srm).toBe(20);
      });
    });

    describe('Award year validation', () => {
      it('should reject years before 1900', async () => {
        try {
          await Beer.create({
            name: 'Invalid Year Beer',
            brewery: brewery._id,
            style: 'IPA',
            awards: [{
              name: 'Ancient Award',
              year: 1800, // Invalid year < 1900
              category: 'IPA',
              level: 'local'
            }]
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors['awards.0.year']).toBeDefined();
        }
      });

      it('should reject years too far in the future', async () => {
        const futureYear = new Date().getFullYear() + 5;
        try {
          await Beer.create({
            name: 'Future Year Beer',
            brewery: brewery._id,
            style: 'IPA',
            awards: [{
              name: 'Future Award',
              year: futureYear,
              category: 'IPA',
              level: 'local'
            }]
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors['awards.0.year']).toBeDefined();
        }
      });

      it('should accept current year', async () => {
        const currentYear = new Date().getFullYear();
        const beer = await Beer.create({
          name: 'Current Year Beer',
          brewery: brewery._id,
          style: 'IPA',
          awards: [{
            name: 'Current Award',
            year: currentYear,
            category: 'IPA',
            level: 'local'
          }]
        });

        expect(beer.awards[0].year).toBe(currentYear);
      });
    });

    describe('Rating validation', () => {
      it('should validate untappd rating range (0-5)', async () => {
        try {
          await Beer.create({
            name: 'Invalid Untappd Beer',
            brewery: brewery._id,
            style: 'IPA',
            ratings: {
              untappd: 6.0 // Invalid > 5
            }
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors['ratings.untappd']).toBeDefined();
        }
      });

      it('should validate rateBeer rating range (0-5)', async () => {
        try {
          await Beer.create({
            name: 'Invalid RateBeer Beer',
            brewery: brewery._id,
            style: 'IPA',
            ratings: {
              rateBeer: -1.0 // Invalid < 0
            }
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors['ratings.rateBeer']).toBeDefined();
        }
      });

      it('should validate beerConnoisseur rating range (0-5)', async () => {
        try {
          await Beer.create({
            name: 'Invalid Beer Connoisseur Beer',
            brewery: brewery._id,
            style: 'IPA',
            ratings: {
              beerConnoisseur: 7.0 // Invalid > 5
            }
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors['ratings.beerConnoisseur']).toBeDefined();
        }
      });

      it('should validate theBreweryDB rating range (0-5)', async () => {
        try {
          await Beer.create({
            name: 'Invalid Brewery DB Beer',
            brewery: brewery._id,
            style: 'IPA',
            ratings: {
              theBreweryDB: 5.5 // Invalid > 5
            }
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors['ratings.theBreweryDB']).toBeDefined();
        }
      });

      it('should accept null ratings', async () => {
        const beer = await Beer.create({
          name: 'Null Ratings Beer',
          brewery: brewery._id,
          style: 'IPA',
          ratings: {
            untappd: null,
            rateBeer: null,
            beerConnoisseur: null,
            theBreweryDB: null
          }
        });

        expect(beer.ratings.untappd).toBeNull();
        expect(beer.ratings.rateBeer).toBeNull();
        expect(beer.ratings.beerConnoisseur).toBeNull();
        expect(beer.ratings.theBreweryDB).toBeNull();
      });
    });

    describe('Hop composition and flavor profile validation', () => {
      it('should validate hop composition values (1-10)', async () => {
        try {
          await Beer.create({
            name: 'Invalid Hop Beer',
            brewery: brewery._id,
            style: 'IPA',
            hopComposition: {
              citrus: 15 // Invalid > 10
            }
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors['hopComposition.citrus']).toBeDefined();
        }
      });

      it('should validate hop composition minimum values', async () => {
        try {
          await Beer.create({
            name: 'Invalid Hop Beer',
            brewery: brewery._id,
            style: 'IPA',
            hopComposition: {
              piney: 0 // Invalid < 1
            }
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors['hopComposition.piney']).toBeDefined();
        }
      });

      it('should validate flavor profile values (1-10)', async () => {
        try {
          await Beer.create({
            name: 'Invalid Flavor Beer',
            brewery: brewery._id,
            style: 'IPA',
            flavorProfile: {
              hoppy: 0 // Invalid < 1
            }
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors['flavorProfile.hoppy']).toBeDefined();
        }
      });
    });

    describe('String length validation', () => {
      it('should validate name length (max 100)', async () => {
        const longName = 'a'.repeat(101);
        try {
          await Beer.create({
            name: longName,
            brewery: brewery._id,
            style: 'IPA'
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors.name).toBeDefined();
        }
      });

      it('should validate description length (max 1000)', async () => {
        const longDescription = 'a'.repeat(1001);
        try {
          await Beer.create({
            name: 'Test Beer',
            brewery: brewery._id,
            style: 'IPA',
            description: longDescription
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors.description).toBeDefined();
        }
      });
    });

    describe('Required field validation', () => {
      it('should require style field', async () => {
        try {
          await Beer.create({
            name: 'No Style Beer',
            brewery: brewery._id
            // Missing style
          });
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.errors.style).toBeDefined();
        }
      });
    });
  });
});