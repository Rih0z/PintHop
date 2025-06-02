import { Types } from 'mongoose';
import { ICheckin } from '../../models/Checkin';

export interface CheckinFilter {
  userId?: string | Types.ObjectId;
  breweryId?: string | Types.ObjectId;
  beerId?: string | Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
}

export interface CheckinSort {
  sortBy?: 'timestamp' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCheckinData {
  breweryId: string | Types.ObjectId;
  beerId?: string | Types.ObjectId;
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
}

export interface CheckinStatistics {
  totalCheckins: number;
  uniqueBeers: number;
  uniqueBreweries: number;
  averageRating: number;
  favoriteStyle?: string;
  checkinsThisMonth: number;
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

export interface ICheckinService {
  // CRUD operations
  createCheckin(
    userId: string | Types.ObjectId,
    data: CreateCheckinData
  ): Promise<ICheckin>;
  
  findCheckins(
    filter: CheckinFilter,
    sort: CheckinSort,
    pagination: PaginationOptions
  ): Promise<PaginationResult<ICheckin>>;
  
  findCheckinById(id: string | Types.ObjectId): Promise<ICheckin | null>;
  
  updateCheckin(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    data: Partial<CreateCheckinData>
  ): Promise<ICheckin>;
  
  deleteCheckin(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<void>;
  
  // Analytics
  getUserStatistics(
    userId: string | Types.ObjectId,
    timeframe?: 'week' | 'month' | 'year' | 'all'
  ): Promise<CheckinStatistics>;
  
  getBreweryCheckins(
    breweryId: string | Types.ObjectId,
    pagination: PaginationOptions
  ): Promise<PaginationResult<ICheckin>>;
  
  getBeerCheckins(
    beerId: string | Types.ObjectId,
    pagination: PaginationOptions
  ): Promise<PaginationResult<ICheckin>>;
  
  // Activity feed
  getFriendsActivity(
    userId: string | Types.ObjectId,
    pagination: PaginationOptions
  ): Promise<PaginationResult<ICheckin>>;
}