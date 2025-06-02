import { Types } from 'mongoose';
import { IPresence } from '../../models/Presence';

export interface PresenceFilter {
  userId?: string | Types.ObjectId;
  breweryId?: string | Types.ObjectId;
  isActive?: boolean;
  nearLocation?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  startDate?: Date;
  endDate?: Date;
}

export interface PresenceSort {
  sortBy?: 'timestamp' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

export interface CreatePresenceData {
  breweryId: string | Types.ObjectId;
  status: 'arrived' | 'at_brewery' | 'departed';
  visibility: 'public' | 'friends' | 'private';
  location?: {
    latitude: number;
    longitude: number;
  };
  estimatedDuration?: number;
  notes?: string;
}

export interface UpdatePresenceData {
  status?: 'arrived' | 'at_brewery' | 'departed';
  visibility?: 'public' | 'friends' | 'private';
  location?: {
    latitude: number;
    longitude: number;
  };
  estimatedDuration?: number;
  notes?: string;
}

export interface PresenceStatistics {
  totalVisits: number;
  uniqueBreweries: number;
  averageVisitDuration: number;
  favoriteBrewery?: {
    breweryId: string;
    breweryName: string;
    visitCount: number;
  };
  monthlyVisits: {
    month: string;
    count: number;
  }[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface NearbyPresence extends IPresence {
  distance?: number;
}

export interface IPresenceService {
  // CRUD operations
  createPresence(
    userId: string | Types.ObjectId,
    data: CreatePresenceData
  ): Promise<IPresence>;
  
  findPresences(
    filter: PresenceFilter,
    sort: PresenceSort,
    pagination: PaginationOptions
  ): Promise<PaginationResult<IPresence>>;
  
  findPresenceById(id: string | Types.ObjectId): Promise<IPresence | null>;
  
  updatePresence(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    data: UpdatePresenceData
  ): Promise<IPresence>;
  
  deletePresence(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<void>;
  
  // Active presence management
  getUserActivePresence(userId: string | Types.ObjectId): Promise<IPresence | null>;
  
  endActivePresence(userId: string | Types.ObjectId): Promise<void>;
  
  // Location-based queries
  findNearbyPresences(
    latitude: number,
    longitude: number,
    radiusKm: number,
    excludeUserId?: string | Types.ObjectId
  ): Promise<NearbyPresence[]>;
  
  getBreweryActivePresences(
    breweryId: string | Types.ObjectId
  ): Promise<IPresence[]>;
  
  // Friends and social features
  getFriendsPresences(
    userId: string | Types.ObjectId,
    pagination: PaginationOptions
  ): Promise<PaginationResult<IPresence>>;
  
  getFriendsActivePresences(
    userId: string | Types.ObjectId
  ): Promise<IPresence[]>;
  
  // Analytics
  getUserStatistics(
    userId: string | Types.ObjectId,
    timeframe?: 'week' | 'month' | 'year' | 'all'
  ): Promise<PresenceStatistics>;
  
  getBreweryVisitHistory(
    breweryId: string | Types.ObjectId,
    pagination: PaginationOptions
  ): Promise<PaginationResult<IPresence>>;
  
  // Real-time features
  notifyNearbyUsers(
    presence: IPresence,
    radiusKm?: number
  ): Promise<void>;
}