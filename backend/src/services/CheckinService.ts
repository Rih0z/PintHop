import { Types } from 'mongoose';
import Checkin, { ICheckin } from '../models/Checkin';
import User from '../models/User';
import { logger } from '../utils/logger';
import { AppError, ErrorCodes } from '../utils/AppError';
import {
  ICheckinService,
  CheckinFilter,
  CheckinSort,
  CreateCheckinData,
  CheckinStatistics,
  PaginationOptions,
  PaginationResult
} from './interfaces/ICheckinService';

export class CheckinService implements ICheckinService {
  async createCheckin(
    userId: string | Types.ObjectId,
    data: CreateCheckinData
  ): Promise<ICheckin> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    
    const checkinData = {
      user: userObjectId,
      brewery: typeof data.breweryId === 'string' ? new Types.ObjectId(data.breweryId) : data.breweryId,
      beer: data.beerId ? (typeof data.beerId === 'string' ? new Types.ObjectId(data.beerId) : data.beerId) : undefined,
      rating: data.rating,
      notes: data.notes,
      flavorProfile: data.flavorProfile,
      photoUrl: data.photoUrl,
      timestamp: new Date()
    };

    const checkin = new Checkin(checkinData);
    await checkin.save();

    // Populate the references
    await checkin.populate([
      { path: 'user', select: 'username' },
      { path: 'brewery', select: 'name address' },
      { path: 'beer', select: 'name style abv' }
    ]);

    logger.info(`User ${userObjectId} created checkin at brewery ${data.breweryId}`);
    
    return checkin.toObject() as ICheckin;
  }

  async findCheckins(
    filter: CheckinFilter,
    sort: CheckinSort,
    pagination: PaginationOptions
  ): Promise<PaginationResult<ICheckin>> {
    const { page = 1, limit = 20 } = pagination;
    const { sortBy = 'timestamp', sortOrder = 'desc' } = sort;

    // Build query
    const query: any = {};

    if (filter.userId) {
      query.user = typeof filter.userId === 'string' 
        ? new Types.ObjectId(filter.userId) 
        : filter.userId;
    }

    if (filter.breweryId) {
      query.brewery = typeof filter.breweryId === 'string' 
        ? new Types.ObjectId(filter.breweryId) 
        : filter.breweryId;
    }

    if (filter.beerId) {
      query.beer = typeof filter.beerId === 'string' 
        ? new Types.ObjectId(filter.beerId) 
        : filter.beerId;
    }

    if (filter.startDate || filter.endDate) {
      query.timestamp = {};
      if (filter.startDate) query.timestamp.$gte = filter.startDate;
      if (filter.endDate) query.timestamp.$lte = filter.endDate;
    }

    // Count total documents
    const total = await Checkin.countDocuments(query);

    // Calculate pagination
    const skip = (page - 1) * limit;
    const pages = Math.ceil(total / limit);

    // Build sort object
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const checkins = await Checkin.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .populate('user', 'username')
      .populate('brewery', 'name address')
      .populate('beer', 'name style abv')
      .lean();

    return {
      data: checkins as ICheckin[],
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  }

  async findCheckinById(id: string | Types.ObjectId): Promise<ICheckin | null> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    
    return Checkin.findById(objectId)
      .populate('user', 'username')
      .populate('brewery', 'name address')
      .populate('beer', 'name style abv')
      .lean();
  }

  async updateCheckin(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    data: Partial<CreateCheckinData>
  ): Promise<ICheckin> {
    const checkinId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    const checkin = await Checkin.findById(checkinId);
    if (!checkin) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Checkin not found');
    }

    // Verify ownership
    if (checkin.user.toString() !== userObjectId.toString()) {
      throw new AppError(403, ErrorCodes.UNAUTHORIZED, 'Not authorized to update this checkin');
    }

    // Update fields
    const updateData: any = {};
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.flavorProfile !== undefined) updateData.flavorProfile = data.flavorProfile;
    if (data.photoUrl !== undefined) updateData.photoUrl = data.photoUrl;

    const updatedCheckin = await Checkin.findByIdAndUpdate(
      checkinId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('user', 'username')
    .populate('brewery', 'name address')
    .populate('beer', 'name style abv');

    if (!updatedCheckin) {
      throw new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to update checkin');
    }

    logger.info(`Updated checkin ${checkinId} by user ${userObjectId}`);
    
    return updatedCheckin.toObject() as ICheckin;
  }

  async deleteCheckin(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<void> {
    const checkinId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    const checkin = await Checkin.findById(checkinId);
    if (!checkin) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Checkin not found');
    }

    // Verify ownership
    if (checkin.user.toString() !== userObjectId.toString()) {
      throw new AppError(403, ErrorCodes.UNAUTHORIZED, 'Not authorized to delete this checkin');
    }

    await Checkin.findByIdAndDelete(checkinId);
    
    logger.info(`Deleted checkin ${checkinId} by user ${userObjectId}`);
  }

  async getUserStatistics(
    userId: string | Types.ObjectId,
    timeframe: 'week' | 'month' | 'year' | 'all' = 'all'
  ): Promise<CheckinStatistics> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    // Calculate date range
    const now = new Date();
    let startDate: Date | undefined;

    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const matchStage: any = { user: userObjectId };
    if (startDate) {
      matchStage.timestamp = { $gte: startDate };
    }

    const stats = await Checkin.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'beers',
          localField: 'beer',
          foreignField: '_id',
          as: 'beerData'
        }
      },
      {
        $group: {
          _id: null,
          totalCheckins: { $sum: 1 },
          uniqueBeers: { $addToSet: '$beer' },
          uniqueBreweries: { $addToSet: '$brewery' },
          averageRating: { $avg: '$rating' },
          styles: { $push: { $arrayElemAt: ['$beerData.style', 0] } }
        }
      },
      {
        $project: {
          totalCheckins: 1,
          uniqueBeers: { $size: { $ifNull: ['$uniqueBeers', []] } },
          uniqueBreweries: { $size: { $ifNull: ['$uniqueBreweries', []] } },
          averageRating: { $round: ['$averageRating', 2] },
          styles: 1
        }
      }
    ]);

    // Get checkins this month
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const checkinsThisMonth = await Checkin.countDocuments({
      user: userObjectId,
      timestamp: { $gte: thisMonthStart }
    });

    // Calculate favorite style
    let favoriteStyle: string | undefined;
    if (stats[0] && stats[0].styles) {
      const styleCounts = stats[0].styles.reduce((acc: any, style: string) => {
        if (style) {
          acc[style] = (acc[style] || 0) + 1;
        }
        return acc;
      }, {});

      const sortedStyles = Object.entries(styleCounts)
        .sort(([, a]: any, [, b]: any) => b - a);

      if (sortedStyles.length > 0) {
        favoriteStyle = sortedStyles[0][0];
      }
    }

    return {
      totalCheckins: stats[0]?.totalCheckins || 0,
      uniqueBeers: stats[0]?.uniqueBeers || 0,
      uniqueBreweries: stats[0]?.uniqueBreweries || 0,
      averageRating: stats[0]?.averageRating || 0,
      favoriteStyle,
      checkinsThisMonth
    };
  }

  async getBreweryCheckins(
    breweryId: string | Types.ObjectId,
    pagination: PaginationOptions
  ): Promise<PaginationResult<ICheckin>> {
    return this.findCheckins(
      { breweryId },
      { sortBy: 'timestamp', sortOrder: 'desc' },
      pagination
    );
  }

  async getBeerCheckins(
    beerId: string | Types.ObjectId,
    pagination: PaginationOptions
  ): Promise<PaginationResult<ICheckin>> {
    return this.findCheckins(
      { beerId },
      { sortBy: 'timestamp', sortOrder: 'desc' },
      pagination
    );
  }

  async getFriendsActivity(
    userId: string | Types.ObjectId,
    pagination: PaginationOptions
  ): Promise<PaginationResult<ICheckin>> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    // Get user's friends
    const user = await User.findById(userObjectId).select('friends');
    if (!user) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'User not found');
    }

    const friendIds = user.friends || [];
    
    // Include user's own checkins
    friendIds.push(userObjectId);

    return this.findCheckins(
      { userId: { $in: friendIds } as any },
      { sortBy: 'timestamp', sortOrder: 'desc' },
      pagination
    );
  }
}