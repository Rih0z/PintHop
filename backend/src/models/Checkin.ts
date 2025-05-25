/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/models/Checkin.ts
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * チェックイン情報のMongooseモデル定義
 */

import mongoose, { Document, Model } from 'mongoose';

export interface CheckinDocument extends Document {
  user: mongoose.Types.ObjectId;
  brewery: mongoose.Types.ObjectId;
  checkinTime: Date;
  checkoutTime?: Date;
  status: 'active' | 'completed' | 'cancelled';
  visibility: 'public' | 'friends' | 'private';
  location?: {
    type: string;
    coordinates: [number, number];
  };
  beers: Array<{
    beer: {
      name: string;
      style: string;
    };
    rating?: number;
    comment?: string;
    photo?: string;
    timestamp: Date;
  }>;
}

const checkinSchema = new mongoose.Schema<CheckinDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    brewery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brewery',
      required: true
    },
    checkinTime: {
      type: Date,
      default: Date.now,
      required: true
    },
    checkoutTime: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'friends'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    beers: [
      {
        beer: {
          name: String,
          style: String
        },
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        comment: String,
        photo: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

checkinSchema.index({ user: 1, checkinTime: -1 });
checkinSchema.index({ brewery: 1, checkinTime: -1 });
checkinSchema.index({ location: '2dsphere' });
checkinSchema.index({ status: 1 });

const Checkin: Model<CheckinDocument> = mongoose.model<CheckinDocument>(
  'Checkin',
  checkinSchema
);

export default Checkin;

