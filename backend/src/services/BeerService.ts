import { Types } from 'mongoose';
import { Beer, IBeer } from '../models/Beer';
import { BeerExperience, IBeerExperience } from '../models/BeerExperience';
import User from '../models/User';
import { logger } from '../utils/logger';
import { AppError, ErrorCodes } from '../utils/AppError';
import {
  IBeerService,
  BeerFilter,
  BeerSort,
  PaginationOptions,
  PaginationResult,
  BeerDetails,
  BeerRecommendation,
  TrendingBeer,
  BeerStyleStatistics
} from './interfaces/IBeerService';

export class BeerService implements IBeerService {
  async findBeers(
    filter: BeerFilter,
    sort: BeerSort,
    pagination: PaginationOptions
  ): Promise<PaginationResult<IBeer>> {
    const { page = 1, limit = 20 } = pagination;
    const { sortBy = 'name', sortOrder = 'asc' } = sort;

    // Build MongoDB filter
    const mongoFilter: any = {};

    if (filter.style) {
      mongoFilter.style = { $regex: filter.style, $options: 'i' };
    }

    if (filter.brewery) {
      mongoFilter.brewery = filter.brewery;
    }

    if (filter.awardWinning === true) {
      mongoFilter.awards = { $exists: true, $ne: [] };
    }

    if (filter.search) {
      mongoFilter.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
        { style: { $regex: filter.search, $options: 'i' } }
      ];
    }

    // Build aggregation pipeline
    const pipeline: any[] = [
      { $match: mongoFilter },
      {
        $lookup: {
          from: 'breweries',
          localField: 'brewery',
          foreignField: '_id',
          as: 'breweryInfo'
        }
      },
      { $unwind: '$breweryInfo' }
    ];

    // Add rating filter if specified
    if (filter.minRating || filter.maxRating) {
      const ratingMatch: any = {};
      
      if (filter.minRating) {
        ratingMatch.$or = [
          { 'ratings.untappd': { $gte: filter.minRating } },
          { 'ratings.rateBeer': { $gte: filter.minRating } },
          { 'ratings.beerConnoisseur': { $gte: filter.minRating } }
        ];
      }
      
      if (filter.maxRating) {
        const maxRatingConditions = [
          { 'ratings.untappd': { $lte: filter.maxRating } },
          { 'ratings.rateBeer': { $lte: filter.maxRating } },
          { 'ratings.beerConnoisseur': { $lte: filter.maxRating } }
        ];
        
        if (ratingMatch.$or) {
          ratingMatch.$and = [
            { $or: ratingMatch.$or },
            { $or: maxRatingConditions }
          ];
          delete ratingMatch.$or;
        } else {
          ratingMatch.$or = maxRatingConditions;
        }
      }
      
      pipeline.push({ $match: ratingMatch });
    }

    // Add calculated fields for sorting
    pipeline.push({
      $addFields: {
        averageRating: {
          $avg: {
            $filter: {
              input: [
                '$ratings.untappd',
                '$ratings.rateBeer',
                '$ratings.beerConnoisseur'
              ],
              cond: { $ne: ['$$this', null] }
            }
          }
        },
        maxRating: {
          $max: [
            { $ifNull: ['$ratings.untappd', 0] },
            { $ifNull: ['$ratings.rateBeer', 0] },
            { $ifNull: ['$ratings.beerConnoisseur', 0] }
          ]
        },
        awardCount: { $size: { $ifNull: ['$awards', []] } }
      }
    });

    // Add sorting
    const sortField = sortBy === 'rating' ? 'maxRating' : 
                     sortBy === 'averageRating' ? 'averageRating' :
                     sortBy === 'awards' ? 'awardCount' : sortBy;
    
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    pipeline.push({ $sort: { [sortField]: sortDirection } });

    // Execute count pipeline
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Beer.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Execute main pipeline
    const beers = await Beer.aggregate(pipeline);

    return {
      data: beers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findBeerById(id: string | Types.ObjectId): Promise<IBeer | null> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    return Beer.findById(objectId).populate('brewery').lean();
  }

  async getBeerDetails(
    beerId: string | Types.ObjectId,
    userId?: string | Types.ObjectId
  ): Promise<BeerDetails> {
    const objectId = typeof beerId === 'string' ? new Types.ObjectId(beerId) : beerId;
    
    const beer = await this.findBeerById(objectId);
    if (!beer) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Beer not found');
    }

    // Get user's experience if authenticated
    let userExperience: IBeerExperience | undefined;
    if (userId) {
      const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
      const experience = await BeerExperience.findOne({
        user: userObjectId,
        beer: objectId
      }).lean();
      
      if (experience) {
        userExperience = experience;
      }
    }

    // Get recent experiences from other users
    const recentExperiences = await BeerExperience.find({
      beer: objectId,
      user: { $ne: userId },
      rating: { $exists: true }
    })
      .populate('user', 'username')
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    // Calculate community rating
    const communityStats = await this.calculateCommunityRating(objectId);

    return {
      beer,
      userExperience,
      recentExperiences,
      communityRating: communityStats
    };
  }

  async createOrUpdateExperience(
    beerId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    experienceData: Partial<IBeerExperience>
  ): Promise<IBeerExperience> {
    const beerObjectId = typeof beerId === 'string' ? new Types.ObjectId(beerId) : beerId;
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    // Verify beer exists
    const beer = await Beer.findById(beerObjectId).populate('brewery');
    if (!beer) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Beer not found');
    }

    // Check if user already has an experience with this beer
    let experience = await BeerExperience.findOne({
      user: userObjectId,
      beer: beerObjectId
    });

    const data = {
      ...experienceData,
      user: userObjectId,
      beer: beerObjectId,
      brewery: beer.brewery._id,
      timestamp: new Date()
    };

    if (experience) {
      // Update existing experience
      Object.assign(experience, data);
      experience.isFirstTime = false;
      await experience.save();
      
      logger.info(`Updated beer experience for user ${userId} and beer ${beerId}`);
    } else {
      // Create new experience
      experience = new BeerExperience(data);
      await experience.save();
      
      logger.info(`Created new beer experience for user ${userId} and beer ${beerId}`);
    }

    return experience;
  }

  async getRecommendations(
    userId: string | Types.ObjectId,
    limit: number = 10
  ): Promise<BeerRecommendation[]> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    // Get user's beer experiences
    const userExperiences = await BeerExperience.find({
      user: userObjectId,
      rating: { $exists: true }
    }).populate('beer');

    if (userExperiences.length === 0) {
      // No experiences yet, return high-rated beers
      return this.getDefaultRecommendations(limit);
    }

    // Analyze user preferences
    const preferences = this.analyzeUserPreferences(userExperiences);
    
    // Get candidate beers
    const triedBeerIds = userExperiences.map(exp => exp.beer._id);
    const candidateBeers = await this.getCandidateBeers(
      triedBeerIds,
      preferences.preferredStyles,
      limit * 2
    );

    // Score and sort recommendations
    const scoredRecommendations = this.scoreRecommendations(
      candidateBeers,
      preferences
    );

    return scoredRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getTrendingBeers(
    timeframe: '1d' | '7d' | '30d',
    limit: number = 10
  ): Promise<TrendingBeer[]> {
    const timeframeMs = timeframe === '1d' ? 24 * 60 * 60 * 1000 :
                      timeframe === '7d' ? 7 * 24 * 60 * 60 * 1000 :
                      30 * 24 * 60 * 60 * 1000;

    const startDate = new Date(Date.now() - timeframeMs);

    const trendingPipeline = [
      {
        $match: {
          timestamp: { $gte: startDate },
          rating: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$beer',
          recentExperiences: { $sum: 1 },
          averageRecentRating: { $avg: '$rating' },
          totalRating: { $sum: '$rating' }
        }
      },
      {
        $lookup: {
          from: 'beers',
          localField: '_id',
          foreignField: '_id',
          as: 'beerInfo'
        }
      },
      { $unwind: '$beerInfo' },
      {
        $lookup: {
          from: 'breweries',
          localField: 'beerInfo.brewery',
          foreignField: '_id',
          as: 'breweryInfo'
        }
      },
      { $unwind: '$breweryInfo' },
      {
        $addFields: {
          trendingScore: {
            $multiply: [
              '$recentExperiences',
              { $divide: ['$averageRecentRating', 5] }
            ]
          }
        }
      },
      { $sort: { trendingScore: -1 } },
      { $limit: limit },
      {
        $project: {
          beer: {
            _id: '$beerInfo._id',
            name: '$beerInfo.name',
            style: '$beerInfo.style',
            abv: '$beerInfo.abv',
            ibu: '$beerInfo.ibu',
            ratings: '$beerInfo.ratings',
            brewery: '$breweryInfo'
          },
          trendingScore: 1,
          recentExperiences: 1,
          averageRecentRating: { $round: ['$averageRecentRating', 1] }
        }
      }
    ];

    return BeerExperience.aggregate(trendingPipeline);
  }

  async getBeerStyles(userId?: string | Types.ObjectId): Promise<BeerStyleStatistics[]> {
    // Get all beer styles with statistics
    const stylesPipeline = [
      {
        $group: {
          _id: '$style',
          totalBeers: { $sum: 1 },
          averageABV: { $avg: '$abv' },
          averageIBU: { $avg: '$ibu' },
          maxRating: {
            $max: {
              $max: [
                { $ifNull: ['$ratings.untappd', 0] },
                { $ifNull: ['$ratings.rateBeer', 0] },
                { $ifNull: ['$ratings.beerConnoisseur', 0] }
              ]
            }
          },
          awardWinners: {
            $sum: {
              $cond: [
                { $gt: [{ $size: { $ifNull: ['$awards', []] } }, 0] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          style: '$_id',
          totalBeers: 1,
          averageABV: { $round: ['$averageABV', 1] },
          averageIBU: { $round: ['$averageIBU', 0] },
          maxRating: { $round: ['$maxRating', 1] },
          awardWinners: 1,
          awardPercentage: {
            $round: [
              { $multiply: [{ $divide: ['$awardWinners', '$totalBeers'] }, 100] },
              1
            ]
          }
        }
      },
      { $sort: { totalBeers: -1 } }
    ];

    const styles = await Beer.aggregate(stylesPipeline);

    // Get user's experience with each style if authenticated
    if (userId) {
      const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
      const userStyleData = await this.getUserStyleExperiences(userObjectId);
      
      // Merge user data with style statistics
      return styles.map(style => ({
        ...style,
        userExperience: userStyleData[style.style] || undefined
      }));
    }

    return styles;
  }

  // Private helper methods
  private async calculateCommunityRating(beerId: Types.ObjectId) {
    const communityStats = await BeerExperience.aggregate([
      { $match: { beer: beerId, rating: { $exists: true } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          ratingDistribution: { $push: '$rating' }
        }
      }
    ]);

    const stats = communityStats[0] || {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: []
    };

    // Calculate distribution
    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats.ratingDistribution?.forEach((rating: number) => {
      const rounded = Math.round(rating);
      if (rounded >= 1 && rounded <= 5) {
        distribution[rounded]++;
      }
    });

    return {
      average: Math.round((stats.averageRating || 0) * 10) / 10,
      total: stats.totalRatings,
      distribution
    };
  }

  private async getDefaultRecommendations(limit: number): Promise<BeerRecommendation[]> {
    const highRatedBeers = await Beer.find({
      $or: [
        { 'ratings.untappd': { $gte: 4.0 } },
        { 'ratings.rateBeer': { $gte: 4.0 } },
        { 'ratings.beerConnoisseur': { $gte: 4.0 } }
      ]
    })
      .populate('brewery')
      .limit(limit)
      .lean();

    return highRatedBeers.map(beer => ({
      beer: {
        _id: beer._id,
        name: beer.name,
        style: beer.style,
        abv: beer.abv,
        ibu: beer.ibu,
        ratings: beer.ratings,
        awards: beer.awards,
        brewery: beer.brewery
      },
      score: 0.8,
      reasons: ['Highly rated by the community', 'Popular choice for beginners']
    }));
  }

  private analyzeUserPreferences(experiences: IBeerExperience[]) {
    const stylePreferences: { [key: string]: { totalRating: number; count: number } } = {};
    const breweryPreferences: { [key: string]: { totalRating: number; count: number } } = {};
    let averageUserRating = 0;
    let totalRatings = 0;

    experiences.forEach(exp => {
      const beer = exp.beer as any;
      const rating = exp.rating!;
      
      // Track style preferences
      if (!stylePreferences[beer.style]) {
        stylePreferences[beer.style] = { totalRating: 0, count: 0 };
      }
      stylePreferences[beer.style].totalRating += rating;
      stylePreferences[beer.style].count++;

      // Track brewery preferences
      const breweryId = beer.brewery.toString();
      if (!breweryPreferences[breweryId]) {
        breweryPreferences[breweryId] = { totalRating: 0, count: 0 };
      }
      breweryPreferences[breweryId].totalRating += rating;
      breweryPreferences[breweryId].count++;

      averageUserRating += rating;
      totalRatings++;
    });

    averageUserRating /= totalRatings;

    // Calculate preferred styles
    const preferredStyles = Object.entries(stylePreferences)
      .filter(([_, data]) => data.totalRating / data.count >= averageUserRating)
      .map(([style, _]) => style);

    return {
      stylePreferences,
      breweryPreferences,
      preferredStyles,
      averageUserRating
    };
  }

  private async getCandidateBeers(
    excludeBeerIds: Types.ObjectId[],
    preferredStyles: string[],
    limit: number
  ) {
    const pipeline = [
      {
        $match: {
          _id: { $nin: excludeBeerIds },
          style: { $in: preferredStyles.length > 0 ? preferredStyles : ['IPA', 'Stout', 'Lager'] }
        }
      },
      {
        $lookup: {
          from: 'breweries',
          localField: 'brewery',
          foreignField: '_id',
          as: 'breweryInfo'
        }
      },
      { $unwind: '$breweryInfo' },
      {
        $addFields: {
          maxRating: {
            $max: [
              { $ifNull: ['$ratings.untappd', 0] },
              { $ifNull: ['$ratings.rateBeer', 0] },
              { $ifNull: ['$ratings.beerConnoisseur', 0] }
            ]
          },
          awardCount: { $size: { $ifNull: ['$awards', []] } }
        }
      },
      { $sort: { maxRating: -1, awardCount: -1 } },
      { $limit: limit }
    ];

    return Beer.aggregate(pipeline);
  }

  private scoreRecommendations(candidateBeers: any[], preferences: any): BeerRecommendation[] {
    return candidateBeers.map(beer => {
      let score = 0;
      const reasons: string[] = [];

      // Style preference score
      const stylePreference = preferences.stylePreferences[beer.style];
      if (stylePreference && stylePreference.totalRating / stylePreference.count >= preferences.averageUserRating) {
        score += 0.4;
        reasons.push(`You rated other ${beer.style} beers highly`);
      }

      // Brewery preference score
      const breweryPreference = preferences.breweryPreferences[beer.brewery.toString()];
      if (breweryPreference && breweryPreference.totalRating / breweryPreference.count >= preferences.averageUserRating) {
        score += 0.3;
        reasons.push(`You enjoyed other beers from ${beer.breweryInfo.name}`);
      }

      // High rating score
      if (beer.maxRating >= 4.0) {
        score += 0.2;
        reasons.push('Highly rated by the community');
      }

      // Award winner score
      if (beer.awardCount > 0) {
        score += 0.1;
        reasons.push('Award-winning beer');
      }

      return {
        beer: {
          _id: beer._id,
          name: beer.name,
          style: beer.style,
          abv: beer.abv,
          ibu: beer.ibu,
          ratings: beer.ratings,
          awards: beer.awards,
          brewery: beer.breweryInfo
        },
        score: Math.round(score * 100) / 100,
        reasons
      };
    });
  }

  private async getUserStyleExperiences(userId: Types.ObjectId) {
    const userExperiencesPipeline = [
      { $match: { user: userId } },
      {
        $lookup: {
          from: 'beers',
          localField: 'beer',
          foreignField: '_id',
          as: 'beerInfo'
        }
      },
      { $unwind: '$beerInfo' },
      {
        $group: {
          _id: '$beerInfo.style',
          experiences: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          lastTried: { $max: '$timestamp' }
        }
      }
    ];

    const userExperiences = await BeerExperience.aggregate(userExperiencesPipeline);
    
    return userExperiences.reduce((acc: any, exp: any) => {
      acc[exp._id] = {
        experiences: exp.experiences,
        averageRating: exp.averageRating ? Math.round(exp.averageRating * 10) / 10 : null,
        lastTried: exp.lastTried
      };
      return acc;
    }, {});
  }
}