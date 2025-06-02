import { Request, Response, NextFunction } from 'express';
import { PresenceService } from '../../services/PresenceService';
import { logger } from '../../utils/logger';
import { AppError, ErrorCodes } from '../../utils/AppError';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

const presenceService = new PresenceService();

export const createPresence = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    const { breweryId, status, visibility, location, estimatedDuration, notes } = req.body;
    
    if (!breweryId) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Brewery ID is required');
    }
    
    if (!['arrived', 'at_brewery', 'departed'].includes(status)) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid status. Must be: arrived, at_brewery, or departed');
    }
    
    if (!['public', 'friends', 'private'].includes(visibility)) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid visibility. Must be: public, friends, or private');
    }
    
    const presence = await presenceService.createPresence(userId, {
      breweryId,
      status,
      visibility,
      location,
      estimatedDuration,
      notes
    });
    
    res.status(201).json({
      status: 'success',
      data: presence
    });
  } catch (error) {
    logger.error('Error creating presence:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to create presence'));
  }
};

export const getPresences = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string;
    const breweryId = req.query.breweryId as string;
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    const sortBy = (req.query.sortBy as 'timestamp' | 'distance') || 'timestamp';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    
    // Handle nearby location filter
    let nearLocation;
    if (req.query.latitude && req.query.longitude && req.query.radius) {
      nearLocation = {
        latitude: parseFloat(req.query.latitude as string),
        longitude: parseFloat(req.query.longitude as string),
        radiusKm: parseFloat(req.query.radius as string)
      };
    }
    
    const result = await presenceService.findPresences(
      { userId, breweryId, isActive, startDate, endDate, nearLocation },
      { sortBy, sortOrder },
      { page, limit }
    );
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('Error fetching presences:', error);
    next(new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch presences'));
  }
};

export const getPresenceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const presence = await presenceService.findPresenceById(id);
    
    if (!presence) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Presence not found');
    }
    
    res.json({
      status: 'success',
      data: presence
    });
  } catch (error) {
    logger.error('Error fetching presence:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch presence'));
  }
};

export const updatePresence = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    const { status, visibility, location, estimatedDuration, notes } = req.body;
    
    const presence = await presenceService.updatePresence(id, userId, {
      status,
      visibility,
      location,
      estimatedDuration,
      notes
    });
    
    res.json({
      status: 'success',
      data: presence
    });
  } catch (error) {
    logger.error('Error updating presence:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to update presence'));
  }
};

export const deletePresence = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    await presenceService.deletePresence(id, userId);
    
    res.json({
      status: 'success',
      message: 'Presence deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting presence:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to delete presence'));
  }
};

export const getMyPresence = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    const presence = await presenceService.getUserActivePresence(userId);
    
    res.json({
      status: 'success',
      data: presence
    });
  } catch (error) {
    logger.error('Error fetching user presence:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch user presence'));
  }
};

export const endMyPresence = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    await presenceService.endActivePresence(userId);
    
    res.json({
      status: 'success',
      message: 'Active presence ended successfully'
    });
  } catch (error) {
    logger.error('Error ending presence:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to end presence'));
  }
};

export const getNearbyPresences = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);
    const radius = parseFloat(req.query.radius as string) || 5; // Default 5km
    const excludeMe = req.query.excludeMe === 'true';
    
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Valid latitude and longitude are required');
    }
    
    const excludeUserId = excludeMe ? req.user?.id : undefined;
    
    const presences = await presenceService.findNearbyPresences(
      latitude,
      longitude,
      radius,
      excludeUserId
    );
    
    res.json({
      status: 'success',
      data: presences
    });
  } catch (error) {
    logger.error('Error fetching nearby presences:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch nearby presences'));
  }
};

export const getBreweryPresences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { breweryId } = req.params;
    
    const presences = await presenceService.getBreweryActivePresences(breweryId);
    
    res.json({
      status: 'success',
      data: presences
    });
  } catch (error) {
    logger.error('Error fetching brewery presences:', error);
    next(new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch brewery presences'));
  }
};

export const getFriendsPresences = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    
    const result = await presenceService.getFriendsPresences(userId, { page, limit });
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('Error fetching friends presences:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch friends presences'));
  }
};

export const getFriendsActivePresences = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    const presences = await presenceService.getFriendsActivePresences(userId);
    
    res.json({
      status: 'success',
      data: presences
    });
  } catch (error) {
    logger.error('Error fetching friends active presences:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch friends active presences'));
  }
};

export const getUserStatistics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId || req.user?.id;
    const timeframe = (req.query.timeframe as 'week' | 'month' | 'year' | 'all') || 'all';
    
    if (!userId) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'User ID required');
    }
    
    const statistics = await presenceService.getUserStatistics(userId, timeframe);
    
    res.json({
      status: 'success',
      data: statistics
    });
  } catch (error) {
    logger.error('Error fetching user statistics:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch statistics'));
  }
};

export const getBreweryVisitHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { breweryId } = req.params;
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    
    const result = await presenceService.getBreweryVisitHistory(breweryId, { page, limit });
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('Error fetching brewery visit history:', error);
    next(new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch brewery visit history'));
  }
};

export const getPresenceByBrewery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { breweryId } = req.params;
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    
    const result = await presenceService.findPresences(
      { breweryId, isActive: true },
      { sortBy: 'timestamp', sortOrder: 'desc' },
      { page, limit }
    );
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('Error fetching brewery presence:', error);
    next(new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch brewery presence'));
  }
};

