import { Types } from 'mongoose';
import { ITaplist, IExtractedBeer, IVerificationVote } from '../../models/Taplist';

export interface TaplistFilter {
  brewery?: string;
  activeOnly?: boolean;
  freshOnly?: boolean;
  search?: string;
}

export interface TaplistSort {
  sortBy?: 'timestamp' | 'reliability';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTaplistData {
  breweryId: string | Types.ObjectId;
  photoUrl: string;
  notes?: string;
  extractedBeers?: IExtractedBeer[];
  ocrText?: string;
  ocrProcessed?: boolean;
  ocrConfidence?: number;
}

export interface BeerMapping {
  extractedBeerIndex: number;
  beerId: string | Types.ObjectId;
}

export interface TaplistStatistics {
  totalTaplists: number;
  activeTaplists: number;
  ocrProcessedCount: number;
  averageReliability: number;
  latestUpdate: Date | null;
}

export interface ITaplistService {
  // CRUD operations
  createTaplist(
    userId: string | Types.ObjectId,
    data: CreateTaplistData
  ): Promise<ITaplist>;
  
  findTaplists(
    filter: TaplistFilter,
    sort: TaplistSort,
    pagination: { page: number; limit: number }
  ): Promise<{
    taplists: ITaplist[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>;
  
  findTaplistById(id: string | Types.ObjectId): Promise<ITaplist | null>;
  
  // Verification operations
  addVerification(
    taplistId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    isAccurate: boolean,
    comment?: string
  ): Promise<ITaplist>;
  
  // Beer mapping operations
  mapExtractedBeers(
    taplistId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    mappings: BeerMapping[]
  ): Promise<ITaplist>;
  
  // Analytics
  getStatistics(breweryId?: string | Types.ObjectId): Promise<TaplistStatistics>;
  
  // Utility
  deactivateOldTaplists(breweryId: string | Types.ObjectId): Promise<void>;
}