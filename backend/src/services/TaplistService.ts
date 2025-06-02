import { Types } from 'mongoose';
import { Taplist, ITaplist } from '../models/Taplist';
import { logger } from '../utils/logger';
import { AppError, ErrorCodes } from '../utils/AppError';
import {
  ITaplistService,
  TaplistFilter,
  TaplistSort,
  CreateTaplistData,
  BeerMapping,
  TaplistStatistics
} from './interfaces/ITaplistService';

export class TaplistService implements ITaplistService {
  async createTaplist(
    userId: string | Types.ObjectId,
    data: CreateTaplistData
  ): Promise<ITaplist> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    const breweryObjectId = typeof data.breweryId === 'string' 
      ? new Types.ObjectId(data.breweryId) 
      : data.breweryId;

    // Deactivate previous taplists for this brewery
    await this.deactivateOldTaplists(breweryObjectId);

    const taplistData = {
      brewery: breweryObjectId,
      uploadedBy: userObjectId,
      photoUrl: data.photoUrl,
      notes: data.notes,
      extractedBeers: data.extractedBeers || [],
      ocrText: data.ocrText,
      ocrProcessed: data.ocrProcessed || false,
      ocrConfidence: data.ocrConfidence,
      source: 'photo' as const,
      isActive: true
    };

    const taplist = new Taplist(taplistData);
    await taplist.save();

    logger.info(`Created new taplist for brewery ${breweryObjectId} by user ${userObjectId}`);
    
    return taplist;
  }

  async findTaplists(
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
  }> {
    const { page = 1, limit = 20 } = pagination;
    const { sortBy = 'timestamp', sortOrder = 'desc' } = sort;

    // Build query
    const query: any = {};

    if (filter.brewery) {
      query.brewery = filter.brewery;
    }

    if (filter.activeOnly) {
      query.isActive = true;
    }

    if (filter.freshOnly) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      query.timestamp = { $gte: twentyFourHoursAgo };
    }

    if (filter.search) {
      query.$text = { $search: filter.search };
    }

    // Count total documents
    const total = await Taplist.countDocuments(query);

    // Calculate pagination
    const skip = (page - 1) * limit;
    const pages = Math.ceil(total / limit);

    // Build sort object
    const sortObject: any = {};
    if (sortBy === 'reliability') {
      // For reliability, we'd need to use aggregation
      // For now, just sort by timestamp
      sortObject.timestamp = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortObject[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Execute query
    const taplists = await Taplist.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .populate('brewery', 'name address')
      .populate('uploadedBy', 'username')
      .populate('beers')
      .lean();

    return {
      taplists,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  }

  async findTaplistById(id: string | Types.ObjectId): Promise<ITaplist | null> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    
    return Taplist.findById(objectId)
      .populate('brewery')
      .populate('uploadedBy', 'username')
      .populate('beers')
      .lean();
  }

  async addVerification(
    taplistId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    isAccurate: boolean,
    comment?: string
  ): Promise<ITaplist> {
    const taplistObjectId = typeof taplistId === 'string' 
      ? new Types.ObjectId(taplistId) 
      : taplistId;
    const userObjectId = typeof userId === 'string' 
      ? new Types.ObjectId(userId) 
      : userId;

    const taplist = await Taplist.findById(taplistObjectId);
    if (!taplist) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Taplist not found');
    }

    // Check if user is trying to verify their own taplist
    if (taplist.uploadedBy.toString() === userObjectId.toString()) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Cannot verify your own taplist');
    }

    // Check if user already voted
    const existingVoteIndex = taplist.verificationVotes.findIndex(
      vote => vote.user.toString() === userObjectId.toString()
    );

    if (existingVoteIndex >= 0) {
      // Update existing vote
      taplist.verificationVotes[existingVoteIndex] = {
        user: userObjectId,
        isAccurate,
        timestamp: new Date(),
        comment
      };
    } else {
      // Add new vote
      taplist.verificationVotes.push({
        user: userObjectId,
        isAccurate,
        timestamp: new Date(),
        comment
      });
    }

    await taplist.save();
    
    logger.info(`User ${userObjectId} verified taplist ${taplistObjectId} as ${isAccurate ? 'accurate' : 'inaccurate'}`);
    
    return taplist;
  }

  async mapExtractedBeers(
    taplistId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    mappings: BeerMapping[]
  ): Promise<ITaplist> {
    const taplistObjectId = typeof taplistId === 'string' 
      ? new Types.ObjectId(taplistId) 
      : taplistId;
    const userObjectId = typeof userId === 'string' 
      ? new Types.ObjectId(userId) 
      : userId;

    const taplist = await Taplist.findById(taplistObjectId);
    if (!taplist) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Taplist not found');
    }

    // Verify user is the uploader
    if (taplist.uploadedBy.toString() !== userObjectId.toString()) {
      throw new AppError(403, ErrorCodes.UNAUTHORIZED, 'Only the uploader can map beers');
    }

    // Map extracted beers to beer documents
    const beerIds = new Set<string>();
    
    for (const mapping of mappings) {
      if (mapping.extractedBeerIndex >= 0 && 
          mapping.extractedBeerIndex < taplist.extractedBeers.length) {
        const beerId = typeof mapping.beerId === 'string' 
          ? mapping.beerId 
          : mapping.beerId.toString();
        beerIds.add(beerId);
      }
    }

    taplist.beers = Array.from(beerIds).map(id => new Types.ObjectId(id));
    await taplist.save();

    logger.info(`Mapped ${beerIds.size} beers to taplist ${taplistObjectId}`);
    
    return taplist;
  }

  async getStatistics(breweryId?: string | Types.ObjectId): Promise<TaplistStatistics> {
    const matchStage = breweryId 
      ? { brewery: typeof breweryId === 'string' ? new Types.ObjectId(breweryId) : breweryId }
      : {};

    const stats = await Taplist.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalTaplists: { $sum: 1 },
          activeTaplists: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          ocrProcessedCount: {
            $sum: { $cond: ['$ocrProcessed', 1, 0] }
          },
          averageReliability: {
            $avg: {
              $cond: [
                { $gt: [{ $size: '$verificationVotes' }, 0] },
                {
                  $divide: [
                    {
                      $size: {
                        $filter: {
                          input: '$verificationVotes',
                          cond: '$$this.isAccurate'
                        }
                      }
                    },
                    { $size: '$verificationVotes' }
                  ]
                },
                0.5
              ]
            }
          },
          latestUpdate: { $max: '$timestamp' }
        }
      }
    ]);

    return stats[0] || {
      totalTaplists: 0,
      activeTaplists: 0,
      ocrProcessedCount: 0,
      averageReliability: 0,
      latestUpdate: null
    };
  }

  async deactivateOldTaplists(breweryId: string | Types.ObjectId): Promise<void> {
    const breweryObjectId = typeof breweryId === 'string' 
      ? new Types.ObjectId(breweryId) 
      : breweryId;

    await Taplist.updateMany(
      { 
        brewery: breweryObjectId,
        isActive: true
      },
      { 
        isActive: false 
      }
    );
  }
}