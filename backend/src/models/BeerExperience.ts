import mongoose, { Document, Schema } from 'mongoose';

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

export interface IContext {
  weather?: string;         // sunny, cloudy, rainy, etc.
  temperature?: number;     // In Fahrenheit
  occasion?: string;        // celebration, casual, business, etc.
  companions?: number;      // Number of people drinking with
  mood?: string;           // happy, relaxed, excited, etc.
  foodPairing?: string;    // What food was paired with the beer
}

export interface IServingInfo {
  glassType?: string;       // pint, snifter, tulip, etc.
  temperature?: string;     // cold, cool, cellar, room
  carbonation?: string;     // low, medium, high
  appearance?: string;      // clear, hazy, opaque
  foam?: string;           // none, light, medium, thick
}

export interface IBeerExperience extends Document {
  user: mongoose.Types.ObjectId;
  beer: mongoose.Types.ObjectId;
  brewery: mongoose.Types.ObjectId;
  timestamp: Date;
  rating?: number;          // 1-5 scale (decimal allowed)
  comment?: string;
  photos?: string[];        // Array of photo URLs
  flavorProfile?: IFlavorProfile;
  context?: IContext;
  servingInfo?: IServingInfo;
  wouldRecommend?: boolean;
  wouldOrderAgain?: boolean;
  isFirstTime?: boolean;    // First time trying this beer
  location?: {              // Where the beer was consumed
    latitude?: number;
    longitude?: number;
    name?: string;          // Custom location name
  };
  tags?: string[];          // User-defined tags
  createdAt: Date;
  updatedAt: Date;
}

const flavorProfileSchema = new Schema<IFlavorProfile>({
  hoppy: { 
    type: Number, 
    min: 1, 
    max: 10,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 1 && v <= 10);
      },
      message: 'Flavor profile values must be between 1 and 10'
    }
  },
  malty: { 
    type: Number, 
    min: 1, 
    max: 10,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 1 && v <= 10);
      },
      message: 'Flavor profile values must be between 1 and 10'
    }
  },
  bitter: { 
    type: Number, 
    min: 1, 
    max: 10,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 1 && v <= 10);
      },
      message: 'Flavor profile values must be between 1 and 10'
    }
  },
  sweet: { 
    type: Number, 
    min: 1, 
    max: 10,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 1 && v <= 10);
      },
      message: 'Flavor profile values must be between 1 and 10'
    }
  },
  sour: { 
    type: Number, 
    min: 1, 
    max: 10,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 1 && v <= 10);
      },
      message: 'Flavor profile values must be between 1 and 10'
    }
  },
  roasted: { 
    type: Number, 
    min: 1, 
    max: 10,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 1 && v <= 10);
      },
      message: 'Flavor profile values must be between 1 and 10'
    }
  },
  fruity: { 
    type: Number, 
    min: 1, 
    max: 10,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 1 && v <= 10);
      },
      message: 'Flavor profile values must be between 1 and 10'
    }
  },
  smoky: { 
    type: Number, 
    min: 1, 
    max: 10,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 1 && v <= 10);
      },
      message: 'Flavor profile values must be between 1 and 10'
    }
  }
});

const contextSchema = new Schema<IContext>({
  weather: { 
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy', 'foggy', 'windy'],
    lowercase: true
  },
  temperature: { 
    type: Number,
    min: -20,
    max: 120  // Fahrenheit range
  },
  occasion: { 
    type: String,
    enum: ['casual', 'celebration', 'business', 'date', 'social', 'alone', 'meal', 'tasting'],
    lowercase: true
  },
  companions: { 
    type: Number,
    min: 0,
    max: 100  // Reasonable upper limit
  },
  mood: { 
    type: String,
    enum: ['happy', 'relaxed', 'excited', 'stressed', 'tired', 'curious', 'adventurous'],
    lowercase: true
  },
  foodPairing: { 
    type: String,
    maxLength: 200
  }
});

const servingInfoSchema = new Schema<IServingInfo>({
  glassType: { 
    type: String,
    enum: ['pint', 'snifter', 'tulip', 'weizen', 'pilsner', 'mug', 'bottle', 'can', 'growler'],
    lowercase: true
  },
  temperature: { 
    type: String,
    enum: ['ice-cold', 'cold', 'cool', 'cellar', 'room'],
    lowercase: true
  },
  carbonation: { 
    type: String,
    enum: ['none', 'low', 'medium', 'high'],
    lowercase: true
  },
  appearance: { 
    type: String,
    enum: ['crystal-clear', 'clear', 'slightly-hazy', 'hazy', 'opaque'],
    lowercase: true
  },
  foam: { 
    type: String,
    enum: ['none', 'light', 'medium', 'thick', 'excessive'],
    lowercase: true
  }
});

const beerExperienceSchema = new Schema<IBeerExperience>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  beer: { 
    type: Schema.Types.ObjectId, 
    ref: 'Beer', 
    required: true 
  },
  brewery: { 
    type: Schema.Types.ObjectId, 
    ref: 'Brewery', 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    validate: {
      validator: function(v: Date) {
        return v <= new Date(); // Cannot be in the future
      },
      message: 'Experience timestamp cannot be in the future'
    }
  },
  rating: { 
    type: Number,
    min: 1,
    max: 5,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 1 && v <= 5);
      },
      message: 'Rating must be between 1 and 5'
    }
  },
  comment: { 
    type: String,
    maxLength: 1000,
    trim: true
  },
  photos: [{ 
    type: String,
    validate: {
      validator: function(v: string) {
        // Basic URL validation
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Photo must be a valid URL'
    }
  }],
  flavorProfile: flavorProfileSchema,
  context: contextSchema,
  servingInfo: servingInfoSchema,
  wouldRecommend: { type: Boolean },
  wouldOrderAgain: { type: Boolean },
  isFirstTime: { 
    type: Boolean, 
    default: true 
  },
  location: {
    latitude: { 
      type: Number,
      min: -90,
      max: 90
    },
    longitude: { 
      type: Number,
      min: -180,
      max: 180
    },
    name: { 
      type: String,
      maxLength: 100
    }
  },
  tags: [{ 
    type: String,
    trim: true,
    lowercase: true,
    maxLength: 50
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
beerExperienceSchema.index({ user: 1, timestamp: -1 });
beerExperienceSchema.index({ beer: 1 });
beerExperienceSchema.index({ brewery: 1 });
beerExperienceSchema.index({ rating: -1 });
beerExperienceSchema.index({ timestamp: -1 });
beerExperienceSchema.index({ user: 1, beer: 1 }); // Compound index for user's experiences with specific beer
beerExperienceSchema.index({ tags: 1 });

// Compound index for analytics queries
beerExperienceSchema.index({ user: 1, rating: -1, timestamp: -1 });

// Text index for searching comments
beerExperienceSchema.index({ comment: 'text', tags: 'text' });

// Virtual for getting the day of the experience
beerExperienceSchema.virtual('experienceDate').get(function() {
  return this.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD format
});

// Virtual for determining if this is a recent experience (within last 30 days)
beerExperienceSchema.virtual('isRecent').get(function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.timestamp >= thirtyDaysAgo;
});

// Virtual for getting overall flavor intensity
beerExperienceSchema.virtual('flavorIntensity').get(function() {
  if (!this.flavorProfile) return 0;
  
  const values = Object.values(this.flavorProfile).filter((v): v is number => 
    v !== null && v !== undefined && !isNaN(v)
  );
  
  if (values.length === 0) return 0;
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 10) / 10;
});

// Pre-save middleware to check if this is actually the first time trying this beer
beerExperienceSchema.pre('save', async function(next) {
  if (this.isNew && this.isFirstTime) {
    const existingExperience = await this.constructor.findOne({
      user: this.user,
      beer: this.beer,
      _id: { $ne: this._id }
    });
    
    if (existingExperience) {
      this.isFirstTime = false;
    }
  }
  next();
});

export const BeerExperience = mongoose.model<IBeerExperience>('BeerExperience', beerExperienceSchema);