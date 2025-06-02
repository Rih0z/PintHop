import { Types } from 'mongoose';
import Presence, { IPresence } from '../models/Presence';
import User from '../models/User';
import Brewery from '../models/Brewery';
import { logger } from '../utils/logger';
import { AppError, ErrorCodes } from '../utils/AppError';
import {
  IPresenceService,
  PresenceFilter,
  PresenceSort,
  CreatePresenceData,
  UpdatePresenceData,
  PresenceStatistics,
  PaginationOptions,
  PaginationResult,
  NearbyPresence
} from './interfaces/IPresenceService';

export class PresenceService implements IPresenceService {
  async createPresence(
    userId: string | Types.ObjectId,
    data: CreatePresenceData
  ): Promise<IPresence> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    const breweryObjectId = typeof data.breweryId === 'string' 
      ? new Types.ObjectId(data.breweryId) 
      : data.breweryId;

    // End any existing active presence for this user
    await this.endActivePresence(userObjectId);

    const presenceData = {
      user: userObjectId,
      brewery: breweryObjectId,
      status: data.status,
      visibility: data.visibility,
      location: data.location,
      estimatedDuration: data.estimatedDuration,
      notes: data.notes,
      timestamp: new Date(),
      isActive: data.status !== 'departed'
    };

    const presence = new Presence(presenceData);
    await presence.save();

    // Populate the references
    await presence.populate([
      { path: 'user', select: 'username' },
      { path: 'brewery', select: 'name address location' }
    ]);

    logger.info(`User ${userObjectId} created presence at brewery ${data.breweryId}`);

    // Notify nearby users if presence is public
    if (data.visibility === 'public') {
      await this.notifyNearbyUsers(presence.toObject() as IPresence);
    }
    
    return presence.toObject() as IPresence;
  }

  async findPresences(
    filter: PresenceFilter,
    sort: PresenceSort,
    pagination: PaginationOptions
  ): Promise<PaginationResult<IPresence>> {
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

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    }

    if (filter.startDate || filter.endDate) {
      query.timestamp = {};
      if (filter.startDate) query.timestamp.$gte = filter.startDate;
      if (filter.endDate) query.timestamp.$lte = filter.endDate;
    }

    // Handle geospatial queries
    if (filter.nearLocation) {
      const { latitude, longitude, radiusKm } = filter.nearLocation;
      query['location'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusKm * 1000 // Convert km to meters
        }
      };
    }

    // Count total documents
    const total = await Presence.countDocuments(query);

    // Calculate pagination
    const skip = (page - 1) * limit;
    const pages = Math.ceil(total / limit);

    // Build sort object
    const sortObject: any = {};
    sortObject[sortBy === 'distance' ? 'location' : sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const presences = await Presence.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .populate('user', 'username')
      .populate('brewery', 'name address location')
      .lean();

    return {
      data: presences as IPresence[],
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  }

  async findPresenceById(id: string | Types.ObjectId): Promise<IPresence | null> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    
    return Presence.findById(objectId)
      .populate('user', 'username')
      .populate('brewery', 'name address location')
      .lean();
  }

  async updatePresence(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    data: UpdatePresenceData
  ): Promise<IPresence> {
    const presenceId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    const presence = await Presence.findById(presenceId);
    if (!presence) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Presence not found');
    }

    // Verify ownership
    if (presence.user.toString() !== userObjectId.toString()) {
      throw new AppError(403, ErrorCodes.UNAUTHORIZED, 'Not authorized to update this presence');
    }

    // Update fields
    const updateData: any = {};
    if (data.status !== undefined) {
      updateData.status = data.status;
      updateData.isActive = data.status !== 'departed';
      if (data.status === 'departed') {
        updateData.departureTime = new Date();
      }
    }
    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.estimatedDuration !== undefined) updateData.estimatedDuration = data.estimatedDuration;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const updatedPresence = await Presence.findByIdAndUpdate(
      presenceId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('user', 'username')
    .populate('brewery', 'name address location');

    if (!updatedPresence) {
      throw new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to update presence');
    }

    logger.info(`Updated presence ${presenceId} by user ${userObjectId}`);
    
    return updatedPresence.toObject() as IPresence;
  }

  async deletePresence(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<void> {
    const presenceId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    const presence = await Presence.findById(presenceId);
    if (!presence) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Presence not found');
    }

    // Verify ownership
    if (presence.user.toString() !== userObjectId.toString()) {
      throw new AppError(403, ErrorCodes.UNAUTHORIZED, 'Not authorized to delete this presence');
    }

    await Presence.findByIdAndDelete(presenceId);
    
    logger.info(`Deleted presence ${presenceId} by user ${userObjectId}`);
  }

  async getUserActivePresence(userId: string | Types.ObjectId): Promise<IPresence | null> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    return Presence.findOne({
      user: userObjectId,
      isActive: true
    })
    .populate('user', 'username')
    .populate('brewery', 'name address location')
    .lean();
  }

  async endActivePresence(userId: string | Types.ObjectId): Promise<void> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    await Presence.updateMany(
      {
        user: userObjectId,
        isActive: true
      },
      {
        isActive: false,
        status: 'departed',
        departureTime: new Date()
      }
    );
  }

  async findNearbyPresences(
    latitude: number,
    longitude: number,
    radiusKm: number,
    excludeUserId?: string | Types.ObjectId
  ): Promise<NearbyPresence[]> {
    const query: any = {
      isActive: true,
      visibility: { $in: ['public', 'friends'] },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusKm * 1000
        }
      }
    };

    if (excludeUserId) {
      const userObjectId = typeof excludeUserId === 'string' 
        ? new Types.ObjectId(excludeUserId) 
        : excludeUserId;
      query.user = { $ne: userObjectId };
    }

    const presences = await Presence.aggregate([
      { $match: query },
      {
        $addFields: {
          distance: {
            $divide: [
              {
                $multiply: [
                  {
                    $acos: {
                      $add: [
                        {
                          $multiply: [
                            { $sin: { $multiply: [{ $divide: [latitude, 180] }, Math.PI] } },
                            { $sin: { $multiply: [{ $divide: [{ $arrayElemAt: ['$location.coordinates', 1] }, 180] }, Math.PI] } }
                          ]
                        },
                        {
                          $multiply: [
                            { $cos: { $multiply: [{ $divide: [latitude, 180] }, Math.PI] } },
                            { $cos: { $multiply: [{ $divide: [{ $arrayElemAt: ['$location.coordinates', 1] }, 180] }, Math.PI] } },
                            { $cos: { $subtract: [{ $multiply: [{ $divide: [longitude, 180] }, Math.PI] }, { $multiply: [{ $divide: [{ $arrayElemAt: ['$location.coordinates', 0] }, 180] }, Math.PI] }] } }
                          ]
                        }
                      ]
                    }
                  },
                  6371
                ]
              },
              1
            ]
          }
        }
      },
      { $sort: { distance: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { username: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'breweries',
          localField: 'brewery',
          foreignField: '_id',
          as: 'brewery',
          pipeline: [{ $project: { name: 1, address: 1, location: 1 } }]
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$user', 0] },
          brewery: { $arrayElemAt: ['$brewery', 0] }
        }
      }
    ]);

    return presences;
  }

  async getBreweryActivePresences(
    breweryId: string | Types.ObjectId
  ): Promise<IPresence[]> {
    const breweryObjectId = typeof breweryId === 'string' 
      ? new Types.ObjectId(breweryId) 
      : breweryId;

    return Presence.find({
      brewery: breweryObjectId,
      isActive: true,
      visibility: { $in: ['public', 'friends'] }
    })
    .populate('user', 'username')
    .populate('brewery', 'name address location')
    .sort({ timestamp: -1 })
    .lean();
  }

  async getFriendsPresences(
    userId: string | Types.ObjectId,
    pagination: PaginationOptions
  ): Promise<PaginationResult<IPresence>> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    // Get user's friends
    const user = await User.findById(userObjectId).select('friends');
    if (!user) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'User not found');
    }

    const friendIds = user.friends || [];

    return this.findPresences(
      { userId: { $in: friendIds } as any },
      { sortBy: 'timestamp', sortOrder: 'desc' },
      pagination
    );
  }

  async getFriendsActivePresences(
    userId: string | Types.ObjectId
  ): Promise<IPresence[]> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    // Get user's friends
    const user = await User.findById(userObjectId).select('friends');
    if (!user) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'User not found');
    }

    const friendIds = user.friends || [];

    return Presence.find({
      user: { $in: friendIds },
      isActive: true,
      visibility: { $in: ['public', 'friends'] }
    })
    .populate('user', 'username')
    .populate('brewery', 'name address location')
    .sort({ timestamp: -1 })
    .lean();
  }

  async getUserStatistics(
    userId: string | Types.ObjectId,
    timeframe: 'week' | 'month' | 'year' | 'all' = 'all'
  ): Promise<PresenceStatistics> {
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

    const stats = await Presence.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'breweries',
          localField: 'brewery',
          foreignField: '_id',
          as: 'breweryData'
        }
      },
      {
        $group: {
          _id: null,
          totalVisits: { $sum: 1 },
          uniqueBreweries: { $addToSet: '$brewery' },
          breweryVisits: {
            $push: {
              brewery: '$brewery',
              breweryName: { $arrayElemAt: ['$breweryData.name', 0] },
              duration: {
                $cond: [
                  { $and: ['$departureTime', '$timestamp'] },
                  { $subtract: ['$departureTime', '$timestamp'] },
                  null
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          totalVisits: 1,
          uniqueBreweries: { $size: '$uniqueBreweries' },
          breweryVisits: 1,
          averageVisitDuration: {
            $avg: {
              $filter: {
                input: '$breweryVisits.duration',
                cond: { $ne: ['$$this', null] }
              }
            }
          }
        }
      }
    ]);

    // Get monthly visits for the last 12 months
    const monthlyStats = await Presence.aggregate([
      {
        $match: {
          user: userObjectId,
          timestamp: { $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Find favorite brewery
    let favoriteBrewery: any = undefined;
    if (stats[0] && stats[0].breweryVisits) {
      const breweryCounts = stats[0].breweryVisits.reduce((acc: any, visit: any) => {
        const breweryId = visit.brewery.toString();
        if (!acc[breweryId]) {
          acc[breweryId] = {
            breweryId,
            breweryName: visit.breweryName,
            count: 0
          };
        }
        acc[breweryId].count++;
        return acc;
      }, {});

      const sortedBreweries = Object.values(breweryCounts)
        .sort((a: any, b: any) => b.count - a.count);

      if (sortedBreweries.length > 0) {
        const fav = sortedBreweries[0] as any;
        favoriteBrewery = {
          breweryId: fav.breweryId,
          breweryName: fav.breweryName,
          visitCount: fav.count
        };
      }
    }

    return {
      totalVisits: stats[0]?.totalVisits || 0,
      uniqueBreweries: stats[0]?.uniqueBreweries || 0,
      averageVisitDuration: stats[0]?.averageVisitDuration || 0,
      favoriteBrewery,
      monthlyVisits: monthlyStats.map(stat => ({
        month: `${stat._id.year}-${stat._id.month.toString().padStart(2, '0')}`,
        count: stat.count
      }))
    };
  }

  async getBreweryVisitHistory(
    breweryId: string | Types.ObjectId,
    pagination: PaginationOptions
  ): Promise<PaginationResult<IPresence>> {
    return this.findPresences(
      { breweryId },
      { sortBy: 'timestamp', sortOrder: 'desc' },
      pagination
    );
  }

  async notifyNearbyUsers(
    presence: IPresence,
    radiusKm: number = 1
  ): Promise<void> {
    if (!presence.location) {
      return;
    }

    const { latitude, longitude } = presence.location;
    
    // This would integrate with Socket.IO or push notification service
    // For now, just log the notification
    logger.info(`Notifying users within ${radiusKm}km of brewery ${presence.brewery} about new presence from user ${presence.user}`);
    
    // TODO: Implement actual notification system
    // - Find users within radius
    // - Send real-time notifications via Socket.IO
    // - Send push notifications to mobile apps
  }
}