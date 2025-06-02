import { Request, Response, NextFunction } from 'express';
import { CheckinService } from '../../services/CheckinService';
import { logger } from '../../utils/logger';
import { AppError, ErrorCodes } from '../../utils/AppError';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

const checkinService = new CheckinService();

export const createCheckin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    const { breweryId, beerId, rating, notes, flavorProfile, photoUrl } = req.body;
    
    if (!breweryId) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Brewery ID is required');
    }
    
    if (!rating || rating < 1 || rating > 5) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Rating must be between 1 and 5');
    }
    
    const checkin = await checkinService.createCheckin(userId, {
      breweryId,
      beerId,
      rating,
      notes,
      flavorProfile,
      photoUrl
    });
    
    res.status(201).json({
      status: 'success',
      data: checkin
    });
  } catch (error) {
    logger.error('Error creating checkin:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to create checkin'));
  }
};

export const getCheckins = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string;
    const breweryId = req.query.breweryId as string;
    const beerId = req.query.beerId as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    const sortBy = (req.query.sortBy as 'timestamp' | 'rating') || 'timestamp';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    
    const result = await checkinService.findCheckins(
      { userId, breweryId, beerId, startDate, endDate },
      { sortBy, sortOrder },
      { page, limit }
    );
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('Error fetching checkins:', error);
    next(new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch checkins'));
  }
};

export const getCheckinById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const checkin = await checkinService.findCheckinById(id);
    
    if (!checkin) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Checkin not found');
    }
    
    res.json({
      status: 'success',
      data: checkin
    });
  } catch (error) {
    logger.error('Error fetching checkin:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch checkin'));
  }
};

export const updateCheckin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    const { rating, notes, flavorProfile, photoUrl } = req.body;
    
    const checkin = await checkinService.updateCheckin(id, userId, {
      rating,
      notes,
      flavorProfile,
      photoUrl
    });
    
    res.json({
      status: 'success',
      data: checkin
    });
  } catch (error) {
    logger.error('Error updating checkin:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to update checkin'));
  }
};

export const deleteCheckin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    await checkinService.deleteCheckin(id, userId);
    
    res.json({
      status: 'success',
      message: 'Checkin deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting checkin:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to delete checkin'));
  }
};

export const getUserStatistics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId || req.user?.id;
    const timeframe = (req.query.timeframe as 'week' | 'month' | 'year' | 'all') || 'all';
    
    if (!userId) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'User ID required');
    }
    
    const statistics = await checkinService.getUserStatistics(userId, timeframe);
    
    res.json({
      status: 'success',
      data: statistics
    });
  } catch (error) {
    logger.error('Error fetching user statistics:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch statistics'));
  }
};

export const getBreweryCheckins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { breweryId } = req.params;
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    
    const result = await checkinService.getBreweryCheckins(breweryId, { page, limit });
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('Error fetching brewery checkins:', error);
    next(new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch brewery checkins'));
  }
};

export const getBeerCheckins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { beerId } = req.params;
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    
    const result = await checkinService.getBeerCheckins(beerId, { page, limit });
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('Error fetching beer checkins:', error);
    next(new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch beer checkins'));
  }
};

export const getFriendsActivity = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User authentication required');
    }
    
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    
    const result = await checkinService.getFriendsActivity(userId, { page, limit });
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('Error fetching friends activity:', error);
    next(error instanceof AppError ? error : new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch friends activity'));
  }
};

