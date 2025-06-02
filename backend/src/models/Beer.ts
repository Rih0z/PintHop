import mongoose, { Document, Schema } from 'mongoose';

export interface IAward {
  name: string;
  year: number;
  category: string;
  level: 'local' | 'regional' | 'national' | 'international';
}

export interface IRatings {
  untappd?: number;
  rateBeer?: number;
  beerConnoisseur?: number;
  theBreweryDB?: number;
}

export interface IHopComposition {
  citrus?: number;      // 1-10 scale
  floral?: number;      // 1-10 scale
  piney?: number;       // 1-10 scale
  earthy?: number;      // 1-10 scale
  spicy?: number;       // 1-10 scale
  tropical?: number;    // 1-10 scale
  herbal?: number;      // 1-10 scale
  resinous?: number;    // 1-10 scale
}

export interface IFlavorProfile {
  hoppy?: number;       // 1-10 scale
  malty?: number;       // 1-10 scale
  bitter?: number;      // 1-10 scale
  sweet?: number;       // 1-10 scale
  sour?: number;        // 1-10 scale
  roasted?: number;     // 1-10 scale
  fruity?: number;      // 1-10 scale
  smoky?: number;       // 1-10 scale
}

export interface IBeer extends Document {
  name: string;
  brewery: mongoose.Types.ObjectId;
  style: string;
  substyle?: string;    // More specific style classification
  abv?: number;         // Alcohol by volume (0-20%)
  ibu?: number;         // International Bitterness Units (0-120)
  srm?: number;         // Standard Reference Method for color (1-40)
  description?: string;
  ratings: IRatings;
  awards: IAward[];
  hopComposition?: IHopComposition;
  flavorProfile?: IFlavorProfile;
  hopVarieties?: string[];        // Array of hop variety names
  maltTypes?: string[];           // Array of malt type names
  yeastStrain?: string;
  fermentationTemperature?: number;
  seasonal: boolean;
  limitedRelease: boolean;
  coreBeers: boolean;             // Is this a core/flagship beer?
  tapRoomOnly: boolean;
  bottled: boolean;
  canned: boolean;
  kegged: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  getAverageRating(): number;
  hasAwards(): boolean;
  getAwardCount(): number;
  isHighlyRated(threshold?: number): boolean;
}

const awardSchema = new Schema<IAward>({
  name: { type: String, required: true },
  year: { 
    type: Number, 
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  category: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['local', 'regional', 'national', 'international'],
    required: true 
  }
});

const ratingsSchema = new Schema<IRatings>({
  untappd: { 
    type: Number, 
    min: 0, 
    max: 5,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 0 && v <= 5);
      },
      message: 'Untappd rating must be between 0 and 5'
    }
  },
  rateBeer: { 
    type: Number, 
    min: 0, 
    max: 5,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 0 && v <= 5);
      },
      message: 'RateBeer rating must be between 0 and 5'
    }
  },
  beerConnoisseur: { 
    type: Number, 
    min: 0, 
    max: 5,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 0 && v <= 5);
      },
      message: 'Beer Connoisseur rating must be between 0 and 5'
    }
  },
  theBreweryDB: { 
    type: Number, 
    min: 0, 
    max: 5,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 0 && v <= 5);
      },
      message: 'The Brewery DB rating must be between 0 and 5'
    }
  }
});

const hopCompositionSchema = new Schema<IHopComposition>({
  citrus: { type: Number, min: 1, max: 10 },
  floral: { type: Number, min: 1, max: 10 },
  piney: { type: Number, min: 1, max: 10 },
  earthy: { type: Number, min: 1, max: 10 },
  spicy: { type: Number, min: 1, max: 10 },
  tropical: { type: Number, min: 1, max: 10 },
  herbal: { type: Number, min: 1, max: 10 },
  resinous: { type: Number, min: 1, max: 10 }
});

const flavorProfileSchema = new Schema<IFlavorProfile>({
  hoppy: { type: Number, min: 1, max: 10 },
  malty: { type: Number, min: 1, max: 10 },
  bitter: { type: Number, min: 1, max: 10 },
  sweet: { type: Number, min: 1, max: 10 },
  sour: { type: Number, min: 1, max: 10 },
  roasted: { type: Number, min: 1, max: 10 },
  fruity: { type: Number, min: 1, max: 10 },
  smoky: { type: Number, min: 1, max: 10 }
});

const beerSchema = new Schema<IBeer>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: 100
  },
  brewery: { 
    type: Schema.Types.ObjectId, 
    ref: 'Brewery', 
    required: true 
  },
  style: { 
    type: String, 
    required: true,
    trim: true
  },
  substyle: { 
    type: String,
    trim: true
  },
  abv: { 
    type: Number,
    min: 0,
    max: 20,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 0 && v <= 20);
      },
      message: 'ABV must be between 0 and 20'
    }
  },
  ibu: { 
    type: Number,
    min: 0,
    max: 120,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 0 && v <= 120);
      },
      message: 'IBU must be between 0 and 120'
    }
  },
  srm: { 
    type: Number,
    min: 1,
    max: 40,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 1 && v <= 40);
      },
      message: 'SRM must be between 1 and 40'
    }
  },
  description: { 
    type: String,
    maxLength: 1000
  },
  ratings: {
    type: ratingsSchema,
    default: {}
  },
  awards: [awardSchema],
  hopComposition: hopCompositionSchema,
  flavorProfile: flavorProfileSchema,
  hopVarieties: [{ type: String, trim: true }],
  maltTypes: [{ type: String, trim: true }],
  yeastStrain: { type: String, trim: true },
  fermentationTemperature: { type: Number },
  seasonal: { type: Boolean, default: false },
  limitedRelease: { type: Boolean, default: false },
  coreBeers: { type: Boolean, default: false },
  tapRoomOnly: { type: Boolean, default: false },
  bottled: { type: Boolean, default: false },
  canned: { type: Boolean, default: false },
  kegged: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
beerSchema.index({ brewery: 1 });
beerSchema.index({ style: 1 });
beerSchema.index({ 'ratings.untappd': -1 });
beerSchema.index({ 'ratings.rateBeer': -1 });
beerSchema.index({ awards: 1 });
beerSchema.index({ seasonal: 1 });
beerSchema.index({ coreBeers: 1 });

// Methods
beerSchema.methods.getAverageRating = function(): number {
  const ratings = this.ratings;
  const ratingValues = [
    ratings.untappd,
    ratings.rateBeer,
    ratings.beerConnoisseur,
    ratings.theBreweryDB
  ].filter((rating): rating is number => 
    rating !== null && rating !== undefined && typeof rating === 'number' && !isNaN(rating)
  );
  
  if (ratingValues.length === 0) return 0;
  
  const sum = ratingValues.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratingValues.length) * 10) / 10; // Round to 1 decimal
};

beerSchema.methods.hasAwards = function(): boolean {
  return !!(this.awards && this.awards.length > 0);
};

beerSchema.methods.getAwardCount = function(): number {
  return this.awards ? this.awards.length : 0;
};

beerSchema.methods.isHighlyRated = function(threshold: number = 4.0): boolean {
  const averageRating = this.getAverageRating();
  return averageRating >= threshold;
};

// Virtual for getting the highest rating
beerSchema.virtual('highestRating').get(function() {
  const ratings = this.ratings;
  const ratingValues = [
    ratings.untappd,
    ratings.rateBeer,
    ratings.beerConnoisseur,
    ratings.theBreweryDB
  ].filter((rating): rating is number => 
    rating !== null && rating !== undefined && typeof rating === 'number' && !isNaN(rating)
  );
  
  return ratingValues.length > 0 ? Math.max(...ratingValues) : 0;
});

// Virtual for beer availability summary
beerSchema.virtual('availabilityTypes').get(function() {
  const types = [];
  if (this.bottled) types.push('bottle');
  if (this.canned) types.push('can');
  if (this.kegged) types.push('tap');
  return types;
});

export const Beer = mongoose.model<IBeer>('Beer', beerSchema);