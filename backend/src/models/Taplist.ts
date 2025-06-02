import mongoose, { Document, Schema } from 'mongoose';

export interface IExtractedBeer {
  name: string;
  style?: string;
  abv?: number;
  ibu?: number;
  price?: string;
  description?: string;
  tapNumber?: number;
  isAvailable?: boolean;
}

export interface IVerificationVote {
  user: mongoose.Types.ObjectId;
  isAccurate: boolean;
  timestamp: Date;
  comment?: string;
}

export interface ITaplist extends Document {
  brewery: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  timestamp: Date;
  photoUrl: string;
  beers: mongoose.Types.ObjectId[];      // Referenced Beer documents
  extractedBeers: IExtractedBeer[];      // OCR extracted beer info (before matching to Beer docs)
  ocrText?: string;                      // Raw OCR text
  ocrProcessed: boolean;
  ocrConfidence?: number;                // 0-1 confidence score
  verificationVotes: IVerificationVote[];
  isActive: boolean;                     // Whether this is the current taplist
  notes?: string;                        // User notes about the taplist
  source: 'photo' | 'manual' | 'api';   // How the taplist was created
  createdAt: Date;
  updatedAt: Date;

  // Methods
  getReliabilityScore(): number;
  isFresh(hoursThreshold?: number): boolean;
  getAgeInHours(): number;
}

const extractedBeerSchema = new Schema<IExtractedBeer>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: 100
  },
  style: { 
    type: String,
    trim: true,
    maxLength: 50
  },
  abv: { 
    type: Number,
    min: 0,
    max: 20
  },
  ibu: { 
    type: Number,
    min: 0,
    max: 120
  },
  price: { 
    type: String,
    maxLength: 20
  },
  description: { 
    type: String,
    maxLength: 200
  },
  tapNumber: { 
    type: Number,
    min: 1,
    max: 100
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  }
});

const verificationVoteSchema = new Schema<IVerificationVote>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isAccurate: { 
    type: Boolean, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  comment: { 
    type: String,
    maxLength: 200,
    trim: true
  }
});

const taplistSchema = new Schema<ITaplist>({
  brewery: { 
    type: Schema.Types.ObjectId, 
    ref: 'Brewery', 
    required: true 
  },
  uploadedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    validate: {
      validator: function(v: Date) {
        return v <= new Date(); // Cannot be in the future
      },
      message: 'Taplist timestamp cannot be in the future'
    }
  },
  photoUrl: { 
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(v);
      },
      message: 'Photo URL must be a valid image URL'
    }
  },
  beers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Beer' 
  }],
  extractedBeers: [extractedBeerSchema],
  ocrText: { 
    type: String,
    maxLength: 5000
  },
  ocrProcessed: { 
    type: Boolean, 
    default: false 
  },
  ocrConfidence: { 
    type: Number,
    min: 0,
    max: 1,
    validate: {
      validator: function(v: number) {
        return v == null || (v >= 0 && v <= 1);
      },
      message: 'OCR confidence must be between 0 and 1'
    }
  },
  verificationVotes: [verificationVoteSchema],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  notes: { 
    type: String,
    maxLength: 500,
    trim: true
  },
  source: { 
    type: String, 
    enum: ['photo', 'manual', 'api'],
    default: 'photo'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
taplistSchema.index({ brewery: 1, timestamp: -1 });
taplistSchema.index({ uploadedBy: 1, timestamp: -1 });
taplistSchema.index({ isActive: 1, timestamp: -1 });
taplistSchema.index({ timestamp: -1 });
taplistSchema.index({ ocrProcessed: 1 });

// Compound index for finding latest active taplist per brewery
taplistSchema.index({ brewery: 1, isActive: 1, timestamp: -1 });

// Text index for searching OCR text and notes
taplistSchema.index({ 
  ocrText: 'text', 
  notes: 'text',
  'extractedBeers.name': 'text',
  'extractedBeers.description': 'text'
});

// Validation: Limit number of beers
taplistSchema.path('beers').validate(function(beers: mongoose.Types.ObjectId[]) {
  return beers.length <= 50; // Reasonable limit for most taprooms
}, 'Too many beers in taplist (maximum 50)');

// Validation: Limit number of extracted beers
taplistSchema.path('extractedBeers').validate(function(extractedBeers: IExtractedBeer[]) {
  return extractedBeers.length <= 50;
}, 'Too many extracted beers (maximum 50)');

// Methods
taplistSchema.methods.getReliabilityScore = function(): number {
  if (this.verificationVotes.length === 0) {
    return 0.5; // Neutral score when no votes
  }

  const positiveVotes = this.verificationVotes.filter((vote: IVerificationVote) => vote.isAccurate).length;
  return positiveVotes / this.verificationVotes.length;
};

taplistSchema.methods.isFresh = function(hoursThreshold: number = 24): boolean {
  const ageInMs = Date.now() - this.timestamp.getTime();
  const ageInHours = ageInMs / (1000 * 60 * 60);
  return ageInHours <= hoursThreshold;
};

taplistSchema.methods.getAgeInHours = function(): number {
  const ageInMs = Date.now() - this.timestamp.getTime();
  return Math.round((ageInMs / (1000 * 60 * 60)) * 10) / 10; // Round to 1 decimal
};

// Virtual for getting reliability score as a percentage
taplistSchema.virtual('reliabilityPercentage').get(function() {
  return Math.round(this.getReliabilityScore() * 100);
});

// Virtual for getting verification vote count
taplistSchema.virtual('verificationVoteCount').get(function() {
  return this.verificationVotes.length;
});

// Virtual for getting positive vote count
taplistSchema.virtual('positiveVoteCount').get(function() {
  return this.verificationVotes.filter((vote: IVerificationVote) => vote.isAccurate).length;
});

// Virtual for beer count
taplistSchema.virtual('beerCount').get(function() {
  return this.beers.length + this.extractedBeers.length;
});

// Pre-save middleware to ensure only one active taplist per brewery
taplistSchema.pre('save', async function(next) {
  if (this.isNew && this.isActive) {
    // Deactivate other active taplists for this brewery
    await (this.constructor as any).updateMany(
      { 
        brewery: this.brewery, 
        isActive: true,
        _id: { $ne: this._id }
      },
      { isActive: false }
    );
  }
  next();
});

// Pre-save middleware to update brewery's last taplist update
taplistSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Update brewery's lastTaplistUpdate field if it exists
    const Brewery = mongoose.model('Brewery');
    await Brewery.findByIdAndUpdate(this.brewery, {
      lastTaplistUpdate: this.timestamp
    });
  }
  next();
});

// Static method to find latest taplist for a brewery
taplistSchema.statics.findLatestForBrewery = function(breweryId: mongoose.Types.ObjectId) {
  return this.findOne({ brewery: breweryId, isActive: true })
    .sort({ timestamp: -1 })
    .populate('beers')
    .populate('uploadedBy', 'username');
};

// Static method to find fresh taplists (within specified hours)
taplistSchema.statics.findFresh = function(hoursThreshold: number = 24) {
  const cutoff = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000);
  return this.find({ 
    timestamp: { $gte: cutoff },
    isActive: true
  })
    .sort({ timestamp: -1 })
    .populate('brewery', 'name address')
    .populate('uploadedBy', 'username');
};

// Static method to get taplist statistics
taplistSchema.statics.getStatistics = async function(breweryId?: mongoose.Types.ObjectId) {
  const matchStage = breweryId ? { brewery: breweryId } : {};
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalTaplists: { $sum: 1 },
        activeTaplists: {
          $sum: { $cond: ['$isActive', 1, 0] }
        },
        ocrProcessedCount: {
          $sum: { $cond: ['$ocrProcessed', 1, 0] }
        },
        averageReliability: {
          $avg: {
            $cond: [
              { $gt: [{ $size: '$verificationVotes' }, 0] },
              {
                $divide: [
                  {
                    $size: {
                      $filter: {
                        input: '$verificationVotes',
                        cond: '$$this.isAccurate'
                      }
                    }
                  },
                  { $size: '$verificationVotes' }
                ]
              },
              0.5
            ]
          }
        },
        latestUpdate: { $max: '$timestamp' }
      }
    }
  ]);

  return stats[0] || {
    totalTaplists: 0,
    activeTaplists: 0,
    ocrProcessedCount: 0,
    averageReliability: 0,
    latestUpdate: null
  };
};

export const Taplist = mongoose.model<ITaplist>('Taplist', taplistSchema);