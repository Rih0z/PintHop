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

export interface ICheckin {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  brewery: mongoose.Types.ObjectId;
  beer?: mongoose.Types.ObjectId;
  rating: number;
  notes?: string;
  flavorProfile?: {
    bitter: number;
    sweet: number;
    sour: number;
    malty: number;
    hoppy: number;
  };
  photoUrl?: string;
  timestamp: Date;
}

export interface CheckinDocument extends Document {
  user: mongoose.Types.ObjectId;
  brewery: mongoose.Types.ObjectId;
  beer?: mongoose.Types.ObjectId;
  rating: number;
  notes?: string;
  flavorProfile?: {
    bitter: number;
    sweet: number;
    sour: number;
    malty: number;
    hoppy: number;
  };
  photoUrl?: string;
  timestamp: Date;
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
    beer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Beer'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    notes: String,
    flavorProfile: {
      bitter: { type: Number, min: 0, max: 10 },
      sweet: { type: Number, min: 0, max: 10 },
      sour: { type: Number, min: 0, max: 10 },
      malty: { type: Number, min: 0, max: 10 },
      hoppy: { type: Number, min: 0, max: 10 }
    },
    photoUrl: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

checkinSchema.index({ user: 1, timestamp: -1 });
checkinSchema.index({ brewery: 1, timestamp: -1 });
checkinSchema.index({ beer: 1 });
checkinSchema.index({ status: 1 });

const Checkin: Model<CheckinDocument> = mongoose.model<CheckinDocument>(
  'Checkin',
  checkinSchema
);

export default Checkin;

