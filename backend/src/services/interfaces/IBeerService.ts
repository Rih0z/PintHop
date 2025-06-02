import { Types } from 'mongoose';
import { IBeer } from '../../models/Beer';
import { IBeerExperience } from '../../models/BeerExperience';

export interface BeerFilter {
  style?: string;
  minRating?: number;
  maxRating?: number;
  awardWinning?: boolean;
  search?: string;
  brewery?: string;
}

export interface BeerSort {
  sortBy?: 'name' | 'rating' | 'averageRating' | 'awards';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
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

export interface BeerDetails {
  beer: IBeer;
  userExperience?: IBeerExperience;
  recentExperiences: IBeerExperience[];
  communityRating: {
    average: number;
    total: number;
    distribution: { [key: number]: number };
  };
}

export interface BeerRecommendation {
  beer: Partial<IBeer>;
  score: number;
  reasons: string[];
}

export interface TrendingBeer {
  beer: Partial<IBeer>;
  trendingScore: number;
  recentExperiences: number;
  averageRecentRating: number;
}

export interface BeerStyleStatistics {
  style: string;
  totalBeers: number;
  averageABV: number;
  averageIBU: number;
  maxRating: number;
  awardWinners: number;
  awardPercentage: number;
  userExperience?: {
    experiences: number;
    averageRating: number;
    lastTried: Date;
  };
}

export interface IBeerService {
  // Query operations
  findBeers(
    filter: BeerFilter, 
    sort: BeerSort, 
    pagination: PaginationOptions
  ): Promise<PaginationResult<IBeer>>;
  
  findBeerById(id: string | Types.ObjectId): Promise<IBeer | null>;
  
  getBeerDetails(
    beerId: string | Types.ObjectId, 
    userId?: string | Types.ObjectId
  ): Promise<BeerDetails>;
  
  // Experience operations
  createOrUpdateExperience(
    beerId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    experienceData: Partial<IBeerExperience>
  ): Promise<IBeerExperience>;
  
  // Analytics operations
  getRecommendations(
    userId: string | Types.ObjectId,
    limit?: number
  ): Promise<BeerRecommendation[]>;
  
  getTrendingBeers(
    timeframe: '1d' | '7d' | '30d',
    limit?: number
  ): Promise<TrendingBeer[]>;
  
  getBeerStyles(userId?: string | Types.ObjectId): Promise<BeerStyleStatistics[]>;
}