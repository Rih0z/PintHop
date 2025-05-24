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

export interface PresenceDocument extends Document {
  user: mongoose.Types.ObjectId;
  status: 'online' | 'away' | 'offline';
  location?: {
    type: string;
    coordinates: [number, number];
    accuracy?: number;
  };
  brewery?: mongoose.Types.ObjectId;
  visibility: 'everyone' | 'friends' | 'none';
  lastUpdated: Date;
  expiresAt?: Date;
}

const presenceSchema = new mongoose.Schema<PresenceDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['online', 'away', 'offline'],
      default: 'online'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number],
      accuracy: Number
    },
    brewery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brewery'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    visibility: {
      type: String,
      enum: ['everyone', 'friends', 'none'],
      default: 'friends'
    },
    expiresAt: {
      type: Date,
      expires: 3600
    }
  },
  { timestamps: true }
);

presenceSchema.index({ user: 1 }, { unique: true });
presenceSchema.index({ location: '2dsphere' });
presenceSchema.index({ brewery: 1 });
presenceSchema.index({ lastUpdated: 1 });
presenceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Presence: Model<PresenceDocument> = mongoose.model<PresenceDocument>(
  'Presence',
  presenceSchema
);

export default Presence;
