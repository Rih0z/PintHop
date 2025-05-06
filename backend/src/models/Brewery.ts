/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/models/Brewery.ts
 * 
 * 作成者: Koki Riho
 * 作成日: 2025-05-04 00:00:00
 * 
 * 更新履歴:
 * - 2025-05-04 00:00:00 Koki Riho 初期作成
 * - 2025-05-05 12:00:00 Koki Riho 仕様書に合わせてモデルを更新
 *
 * 説明:
 * ブルワリーデータのMongooseモデル定義
 */

import mongoose from 'mongoose';

// ブルワリーレビューサイトの評価スキーマ
const ratingSchema = new mongoose.Schema({
  score: {
    type: Number,
    default: null
  },
  url: {
    type: String,
    default: null
  }
}, { _id: false });

// 専門スタイルスキーマ
const specialtyStyleSchema = new mongoose.Schema({
  style: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  }
}, { _id: false });

// 受賞歴スキーマ
const awardSchema = new mongoose.Schema({
  name: String,
  year: Number,
  category: String,
  beerName: String,
  medal: {
    type: String,
    enum: ['Gold', 'Silver', 'Bronze', 'Honorable Mention', 'Other']
  }
}, { _id: false });

// ブルワリースキーマ定義
const brewerySchema = new mongoose.Schema({
  breweryId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    },
    formattedAddress: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  region: {
    type: String,
    required: true,
    index: true
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      untappd: String
    }
  },
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  description: String,
  ratings: {
    untappd: ratingSchema,
    rateBeer: ratingSchema,
    beerAdvocate: ratingSchema,
    aggregateScore: Number
  },
  specialtyStyles: [specialtyStyleSchema],
  signatureBeers: [String],
  awards: [awardSchema],
  photos: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  flags: {
    isMicrobrewery: Boolean,
    isBrewpub: Boolean,
    hasFood: Boolean,
    familyFriendly: Boolean,
    dogFriendly: Boolean
  }
}, {
  timestamps: true
});

// インデックスの設定
brewerySchema.index({ name: 1 });
brewerySchema.index({ region: 1 });
brewerySchema.index({ 'ratings.aggregateScore': -1 });
brewerySchema.index({ 'specialtyStyles.style': 1 });
brewerySchema.index({ location: '2dsphere' });

const Brewery = mongoose.model('Brewery', brewerySchema);

export default Brewery;