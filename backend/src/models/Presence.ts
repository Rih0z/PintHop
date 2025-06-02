/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/models/Presence.ts
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-24 00:00:00
 *
 * 更新履歴:
 * - 2025-05-24 00:00:00 AI Assistant 新規作成
 *
 * 説明:
 * プレゼンス情報のMongooseモデル定義
 */

import mongoose, { Document, Model } from 'mongoose';

export interface IPresence {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  brewery: mongoose.Types.ObjectId;
  status: 'arrived' | 'at_brewery' | 'departed';
  visibility: 'public' | 'friends' | 'private';
  location?: {
    latitude: number;
    longitude: number;
  };
  estimatedDuration?: number;
  notes?: string;
  timestamp: Date;
  departureTime?: Date;
  isActive: boolean;
}

export interface PresenceDocument extends Document {
  user: mongoose.Types.ObjectId;
  brewery: mongoose.Types.ObjectId;
  status: 'arrived' | 'at_brewery' | 'departed';
  visibility: 'public' | 'friends' | 'private';
  location?: {
    latitude: number;
    longitude: number;
  };
  estimatedDuration?: number;
  notes?: string;
  timestamp: Date;
  departureTime?: Date;
  isActive: boolean;
}

const presenceSchema = new mongoose.Schema<PresenceDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    brewery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brewery',
      required: true
    },
    status: {
      type: String,
      enum: ['arrived', 'at_brewery', 'departed'],
      required: true
    },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'friends'
    },
    location: {
      latitude: Number,
      longitude: Number
    },
    estimatedDuration: Number,
    notes: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    departureTime: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

presenceSchema.index({ user: 1 });
presenceSchema.index({ brewery: 1 });
presenceSchema.index({ timestamp: 1 });
presenceSchema.index({ isActive: 1 });
presenceSchema.index({ status: 1 });

const Presence: Model<PresenceDocument> = mongoose.model<PresenceDocument>(
  'Presence',
  presenceSchema
);

export default Presence;
