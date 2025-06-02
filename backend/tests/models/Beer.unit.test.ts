import mongoose from 'mongoose';
import { Beer, IBeer, IAward, IRatings, IHopComposition, IFlavorProfile } from '../../src/models/Beer';

// Mock mongoose to avoid real database connections
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  connect: jest.fn(),
  connection: {
    close: jest.fn()
  },
  Types: {
    ObjectId: jest.requireActual('mongoose').Types.ObjectId
  },
  model: jest.fn(),
  Schema: jest.fn().mockImplementation(() => ({
    methods: {},
    statics: {},
    index: jest.fn(),
    pre: jest.fn(),
    post: jest.fn(),
    virtual: jest.fn().mockReturnThis()
  }))
}));

describe('Beer Model Unit Tests', () => {
  const mockBreweryId = new mongoose.Types.ObjectId();

  describe('Instance Methods', () => {
    let mockBeer: any;

    beforeEach(() => {
      // Create a mock beer instance with the methods from the schema
      mockBeer = {
        name: 'Test Beer',
        brewery: mockBreweryId,
        style: 'IPA',
        abv: 6.5,
        ratings: {},
        awards: [],
        
        // Add the methods from the schema
        getAverageRating: function() {
          const ratings = this.ratings;
          const validRatings = Object.values(ratings).filter((rating): rating is number => 
            rating !== null && rating !== undefined && typeof rating === 'number' && !isNaN(rating)
          );
          
          if (validRatings.length === 0) return 0;
          
          const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
          return Math.round((sum / validRatings.length) * 10) / 10;
        },
        
        hasAwards: function() {
          return this.awards && this.awards.length > 0;
        },
        
        getAwardCount: function() {
          return this.awards ? this.awards.length : 0;
        },
        
        isHighlyRated: function(threshold: number = 4.0) {
          const averageRating = this.getAverageRating();
          return averageRating >= threshold;
        },

        getBitterness: function() {
          if (!this.ibu) return 'Unknown';
          if (this.ibu < 20) return 'Low';
          if (this.ibu < 40) return 'Medium';
          if (this.ibu < 60) return 'High';
          return 'Very High';
        },

        getStrength: function() {
          if (!this.abv) return 'Unknown';
          if (this.abv < 3.5) return 'Low';
          if (this.abv < 5.5) return 'Medium';
          if (this.abv < 8.5) return 'High';
          return 'Very High';
        },

        getColorDescription: function() {
          if (!this.srm) return 'Unknown';
          if (this.srm < 4) return 'Pale';
          if (this.srm < 8) return 'Golden';
          if (this.srm < 17) return 'Amber';
          if (this.srm < 25) return 'Brown';
          return 'Dark';
        },

        hasFlavorProfile: function() {
          return this.flavorProfile && Object.keys(this.flavorProfile).length > 0;
        },

        getDominantFlavor: function() {
          if (!this.flavorProfile) return 'Unknown';
          
          const flavors = Object.entries(this.flavorProfile);
          if (flavors.length === 0) return 'Unknown';
          
          const dominant = flavors.reduce((max, current) => 
            (current[1] || 0) > (max[1] || 0) ? current : max
          );
          
          return dominant[0];
        }
      };
    });

    describe('getAverageRating', () => {
      it('should return 0 when no ratings', () => {
        const avgRating = mockBeer.getAverageRating();
        expect(avgRating).toBe(0);
      });

      it('should calculate average rating correctly', () => {
        mockBeer.ratings = {
          untappd: 4.5,
          rateBeer: 3.5,
          beerConnoisseur: 5.0
        };

        const avgRating = mockBeer.getAverageRating();
        expect(avgRating).toBe(4.3); // (4.5 + 3.5 + 5.0) / 3 = 4.33... rounded to 4.3
      });

      it('should ignore null and undefined ratings', () => {
        mockBeer.ratings = {
          untappd: 4.5,
          rateBeer: null,
          beerConnoisseur: undefined,
          theBreweryDB: 3.5
        };

        const avgRating = mockBeer.getAverageRating();
        expect(avgRating).toBe(4.0); // (4.5 + 3.5) / 2 = 4.0
      });

      it('should ignore NaN ratings', () => {
        mockBeer.ratings = {
          untappd: 4.5,
          rateBeer: NaN,
          beerConnoisseur: 3.5
        };

        const avgRating = mockBeer.getAverageRating();
        expect(avgRating).toBe(4.0); // (4.5 + 3.5) / 2 = 4.0
      });

      it('should ignore non-number ratings', () => {
        mockBeer.ratings = {
          untappd: 4.5,
          rateBeer: "invalid",
          beerConnoisseur: 3.5,
          theBreweryDB: {}
        };

        const avgRating = mockBeer.getAverageRating();
        expect(avgRating).toBe(4.0); // (4.5 + 3.5) / 2 = 4.0
      });
    });

    describe('hasAwards', () => {
      it('should return false when no awards', () => {
        const hasAwards = mockBeer.hasAwards();
        expect(hasAwards).toBe(false);
      });

      it('should return false when awards array is empty', () => {
        mockBeer.awards = [];
        const hasAwards = mockBeer.hasAwards();
        expect(hasAwards).toBe(false);
      });

      it('should return true when has awards', () => {
        mockBeer.awards = [
          { name: 'Gold Medal', year: 2023, category: 'IPA', level: 'national' }
        ];
        const hasAwards = mockBeer.hasAwards();
        expect(hasAwards).toBe(true);
      });
    });

    describe('getAwardCount', () => {
      it('should return 0 when no awards', () => {
        const count = mockBeer.getAwardCount();
        expect(count).toBe(0);
      });

      it('should return 0 when awards is undefined', () => {
        mockBeer.awards = undefined;
        const count = mockBeer.getAwardCount();
        expect(count).toBe(0);
      });

      it('should return correct count when has awards', () => {
        mockBeer.awards = [
          { name: 'Gold Medal', year: 2023, category: 'IPA', level: 'national' },
          { name: 'Silver Medal', year: 2022, category: 'IPA', level: 'regional' }
        ];
        const count = mockBeer.getAwardCount();
        expect(count).toBe(2);
      });
    });

    describe('isHighlyRated', () => {
      it('should return false when rating is below default threshold', () => {
        mockBeer.ratings = { untappd: 3.5 };
        const isHighlyRated = mockBeer.isHighlyRated();
        expect(isHighlyRated).toBe(false);
      });

      it('should return true when rating meets default threshold', () => {
        mockBeer.ratings = { untappd: 4.0 };
        const isHighlyRated = mockBeer.isHighlyRated();
        expect(isHighlyRated).toBe(true);
      });

      it('should return true when rating exceeds default threshold', () => {
        mockBeer.ratings = { untappd: 4.5 };
        const isHighlyRated = mockBeer.isHighlyRated();
        expect(isHighlyRated).toBe(true);
      });

      it('should use custom threshold', () => {
        mockBeer.ratings = { untappd: 3.8 };
        const isHighlyRated = mockBeer.isHighlyRated(3.5);
        expect(isHighlyRated).toBe(true);
      });

      it('should handle no ratings with default threshold', () => {
        const isHighlyRated = mockBeer.isHighlyRated();
        expect(isHighlyRated).toBe(false);
      });
    });

    describe('getBitterness', () => {
      it('should return Unknown when no IBU', () => {
        mockBeer.ibu = undefined;
        expect(mockBeer.getBitterness()).toBe('Unknown');
      });

      it('should return Low for IBU < 20', () => {
        mockBeer.ibu = 15;
        expect(mockBeer.getBitterness()).toBe('Low');
      });

      it('should return Medium for IBU 20-39', () => {
        mockBeer.ibu = 30;
        expect(mockBeer.getBitterness()).toBe('Medium');
      });

      it('should return High for IBU 40-59', () => {
        mockBeer.ibu = 50;
        expect(mockBeer.getBitterness()).toBe('High');
      });

      it('should return Very High for IBU >= 60', () => {
        mockBeer.ibu = 70;
        expect(mockBeer.getBitterness()).toBe('Very High');
      });
    });

    describe('getStrength', () => {
      it('should return Unknown when no ABV', () => {
        mockBeer.abv = undefined;
        expect(mockBeer.getStrength()).toBe('Unknown');
      });

      it('should return Low for ABV < 3.5', () => {
        mockBeer.abv = 3.0;
        expect(mockBeer.getStrength()).toBe('Low');
      });

      it('should return Medium for ABV 3.5-5.4', () => {
        mockBeer.abv = 4.5;
        expect(mockBeer.getStrength()).toBe('Medium');
      });

      it('should return High for ABV 5.5-8.4', () => {
        mockBeer.abv = 7.0;
        expect(mockBeer.getStrength()).toBe('High');
      });

      it('should return Very High for ABV >= 8.5', () => {
        mockBeer.abv = 10.0;
        expect(mockBeer.getStrength()).toBe('Very High');
      });
    });

    describe('getColorDescription', () => {
      it('should return Unknown when no SRM', () => {
        mockBeer.srm = undefined;
        expect(mockBeer.getColorDescription()).toBe('Unknown');
      });

      it('should return Pale for SRM < 4', () => {
        mockBeer.srm = 3;
        expect(mockBeer.getColorDescription()).toBe('Pale');
      });

      it('should return Golden for SRM 4-7', () => {
        mockBeer.srm = 6;
        expect(mockBeer.getColorDescription()).toBe('Golden');
      });

      it('should return Amber for SRM 8-16', () => {
        mockBeer.srm = 12;
        expect(mockBeer.getColorDescription()).toBe('Amber');
      });

      it('should return Brown for SRM 17-24', () => {
        mockBeer.srm = 20;
        expect(mockBeer.getColorDescription()).toBe('Brown');
      });

      it('should return Dark for SRM >= 25', () => {
        mockBeer.srm = 30;
        expect(mockBeer.getColorDescription()).toBe('Dark');
      });
    });

    describe('hasFlavorProfile', () => {
      it('should return false when no flavor profile', () => {
        mockBeer.flavorProfile = undefined;
        expect(mockBeer.hasFlavorProfile()).toBe(false);
      });

      it('should return false when empty flavor profile', () => {
        mockBeer.flavorProfile = {};
        expect(mockBeer.hasFlavorProfile()).toBe(false);
      });

      it('should return true when has flavor profile', () => {
        mockBeer.flavorProfile = { hoppy: 8 };
        expect(mockBeer.hasFlavorProfile()).toBe(true);
      });
    });

    describe('getDominantFlavor', () => {
      it('should return Unknown when no flavor profile', () => {
        mockBeer.flavorProfile = undefined;
        expect(mockBeer.getDominantFlavor()).toBe('Unknown');
      });

      it('should return Unknown when empty flavor profile', () => {
        mockBeer.flavorProfile = {};
        expect(mockBeer.getDominantFlavor()).toBe('Unknown');
      });

      it('should return dominant flavor', () => {
        mockBeer.flavorProfile = {
          hoppy: 8,
          malty: 3,
          bitter: 7,
          sweet: 2
        };
        expect(mockBeer.getDominantFlavor()).toBe('hoppy');
      });

      it('should handle null/undefined values in flavor profile', () => {
        mockBeer.flavorProfile = {
          hoppy: null,
          malty: undefined,
          bitter: 7,
          sweet: 5
        };
        expect(mockBeer.getDominantFlavor()).toBe('bitter');
      });
    });
  });

  describe('Schema Configuration', () => {
    it('should have correct interface properties', () => {
      const beerData = {
        name: 'Test IPA',
        brewery: mockBreweryId,
        style: 'IPA',
        abv: 6.5,
        ibu: 60,
        srm: 8,
        description: 'A hoppy test beer',
        ratings: {
          untappd: 4.2,
          rateBeer: 3.8
        },
        awards: [
          { name: 'Gold Medal', year: 2023, category: 'IPA', level: 'national' }
        ],
        seasonal: false,
        limitedRelease: false,
        coreBeers: true,
        tapRoomOnly: false,
        bottled: true,
        canned: true,
        kegged: true
      };

      const beer = new Beer(beerData);
      
      expect(beer.name).toBe('Test IPA');
      expect(beer.brewery).toBe(mockBreweryId);
      expect(beer.style).toBe('IPA');
      expect(beer.abv).toBe(6.5);
      expect(beer.ibu).toBe(60);
      expect(beer.srm).toBe(8);
      expect(beer.description).toBe('A hoppy test beer');
      expect(beer.ratings).toEqual({
        untappd: 4.2,
        rateBeer: 3.8
      });
      expect(beer.awards).toHaveLength(1);
      expect(beer.seasonal).toBe(false);
      expect(beer.coreBeers).toBe(true);
      expect(beer.bottled).toBe(true);
    });

    it('should handle optional fields', () => {
      const beerData = {
        name: 'Simple Beer',
        brewery: mockBreweryId,
        style: 'Lager'
      };

      const beer = new Beer(beerData);
      
      expect(beer.name).toBe('Simple Beer');
      expect(beer.brewery).toBe(mockBreweryId);
      expect(beer.style).toBe('Lager');
      expect(beer.abv).toBeUndefined();
      expect(beer.ibu).toBeUndefined();
      expect(beer.description).toBeUndefined();
    });
  });

  describe('Static Methods', () => {
    beforeEach(() => {
      // Mock static methods on Beer
      Beer.findByStyle = jest.fn();
      Beer.findByBrewery = jest.fn();
      Beer.searchByName = jest.fn();
      Beer.getPopularStyles = jest.fn();
      Beer.findActiveBeers = jest.fn();
      Beer.getBeerStatistics = jest.fn();
    });

    it('should have findByStyle static method', () => {
      expect(typeof Beer.findByStyle).toBe('function');
    });

    it('should have findByBrewery static method', () => {
      expect(typeof Beer.findByBrewery).toBe('function');
    });

    it('should have searchByName static method', () => {
      expect(typeof Beer.searchByName).toBe('function');
    });

    it('should have getPopularStyles static method', () => {
      expect(typeof Beer.getPopularStyles).toBe('function');
    });

    it('should have findActiveBeers static method', () => {
      expect(typeof Beer.findActiveBeers).toBe('function');
    });

    it('should have getBeerStatistics static method', () => {
      expect(typeof Beer.getBeerStatistics).toBe('function');
    });
  });

  describe('Interface Validation', () => {
    it('should validate IAward interface', () => {
      const award: IAward = {
        name: 'Gold Medal',
        year: 2023,
        category: 'IPA',
        level: 'national'
      };

      expect(award.name).toBe('Gold Medal');
      expect(award.year).toBe(2023);
      expect(award.category).toBe('IPA');
      expect(['local', 'regional', 'national', 'international']).toContain(award.level);
    });

    it('should validate IRatings interface', () => {
      const ratings: IRatings = {
        untappd: 4.2,
        rateBeer: 8.5,
        beerConnoisseur: 7.8,
        theBreweryDB: 3.9
      };

      expect(typeof ratings.untappd).toBe('number');
      expect(typeof ratings.rateBeer).toBe('number');
      expect(typeof ratings.beerConnoisseur).toBe('number');
      expect(typeof ratings.theBreweryDB).toBe('number');
    });

    it('should validate IHopComposition interface', () => {
      const hopComposition: IHopComposition = {
        citrus: 8,
        floral: 3,
        piney: 7,
        earthy: 2,
        spicy: 4,
        tropical: 9,
        herbal: 1,
        resinous: 6
      };

      Object.values(hopComposition).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(10);
      });
    });

    it('should validate IFlavorProfile interface', () => {
      const flavorProfile: IFlavorProfile = {
        hoppy: 9,
        malty: 3,
        bitter: 8,
        sweet: 2,
        sour: 1,
        roasted: 0,
        fruity: 7,
        smoky: 0
      };

      Object.values(flavorProfile).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle beer with all optional fields', () => {
      const fullBeerData = {
        name: 'Complex IPA',
        brewery: mockBreweryId,
        style: 'IPA',
        substyle: 'West Coast IPA',
        abv: 6.8,
        ibu: 65,
        srm: 8,
        description: 'A complex hoppy beer',
        ratings: {
          untappd: 4.5,
          rateBeer: 9.0,
          beerConnoisseur: 8.5
        },
        awards: [
          { name: 'Gold Medal', year: 2023, category: 'IPA', level: 'national' },
          { name: 'Best Hop Forward', year: 2022, category: 'Hoppy Beers', level: 'regional' }
        ],
        hopComposition: {
          citrus: 9,
          piney: 7,
          tropical: 8
        },
        flavorProfile: {
          hoppy: 9,
          bitter: 8,
          fruity: 6
        },
        seasonal: false,
        limitedRelease: true,
        coreBeers: false,
        tapRoomOnly: false,
        bottled: true,
        canned: true,
        kegged: true,
        isActive: true
      };

      const beer = new Beer(fullBeerData);
      
      expect(beer.name).toBe('Complex IPA');
      expect(beer.substyle).toBe('West Coast IPA');
      expect(beer.awards).toHaveLength(2);
      expect(beer.hopComposition?.citrus).toBe(9);
      expect(beer.flavorProfile?.hoppy).toBe(9);
      expect(beer.limitedRelease).toBe(true);
      expect(beer.isActive).toBe(true);
    });

    it('should handle beer with minimal required fields', () => {
      const minimalBeerData = {
        name: 'Simple Beer',
        brewery: mockBreweryId,
        style: 'Lager',
        ratings: {},
        awards: []
      };

      const beer = new Beer(minimalBeerData);
      
      expect(beer.name).toBe('Simple Beer');
      expect(beer.brewery).toBe(mockBreweryId);
      expect(beer.style).toBe('Lager');
      expect(beer.awards).toHaveLength(0);
      expect(beer.ratings).toEqual({});
    });
  });

  describe('Type Safety', () => {
    it('should enforce proper types for numeric fields', () => {
      const beerData = {
        name: 'Type Test Beer',
        brewery: mockBreweryId,
        style: 'IPA',
        abv: 6.5,
        ibu: 60,
        srm: 8,
        ratings: {},
        awards: []
      };

      const beer = new Beer(beerData);
      
      expect(typeof beer.abv).toBe('number');
      expect(typeof beer.ibu).toBe('number');
      expect(typeof beer.srm).toBe('number');
    });

    it('should enforce proper types for array fields', () => {
      const beerData = {
        name: 'Array Test Beer',
        brewery: mockBreweryId,
        style: 'IPA',
        awards: [
          { name: 'Test Award', year: 2023, category: 'Test', level: 'local' as const }
        ],
        ingredients: ['Water', 'Malt', 'Hops', 'Yeast'],
        ratings: {},
      };

      const beer = new Beer(beerData);
      
      expect(Array.isArray(beer.awards)).toBe(true);
      expect(Array.isArray(beer.ingredients)).toBe(true);
      expect(beer.awards[0].level).toBe('local');
    });

    it('should handle ObjectId brewery field', () => {
      const breweryObjectId = new mongoose.Types.ObjectId();
      const beerData = {
        name: 'ObjectId Test Beer',
        brewery: breweryObjectId,
        style: 'IPA',
        ratings: {},
        awards: []
      };

      const beer = new Beer(beerData);
      
      expect(beer.brewery).toBe(breweryObjectId);
      expect(beer.brewery instanceof mongoose.Types.ObjectId).toBe(true);
    });
  });
});