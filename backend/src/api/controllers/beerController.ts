import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BeerService } from '../../services/BeerService';
import { logger } from '../../utils/logger';
import { AppError, ErrorCodes } from '../../utils/AppError';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

// Initialize service
const beerService = new BeerService();

// GET /api/beers - Get all beers with filtering and sorting
export const getBeers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      style,
      minRating,
      maxRating,
      awardWinning,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 20,
      brewery
    } = req.query;

    const filter = {
      style: style as string,
      minRating: minRating ? Number(minRating) : undefined,
      maxRating: maxRating ? Number(maxRating) : undefined,
      awardWinning: awardWinning === 'true',
      search: search as string,
      brewery: brewery as string
    };

    const sort = {
      sortBy: sortBy as any,
      sortOrder: sortOrder as any
    };

    const pagination = {
      page: Number(page),
      limit: Number(limit)
    };

    const result = await beerService.findBeers(filter, sort, pagination);

    res.json({
      beers: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    logger.error('Error fetching beers:', error);
    throw new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch beers');
  }
};

// GET /api/beers/:id - Get beer details by ID
export const getBeerById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid beer ID');
    }

    const beerDetails = await beerService.getBeerDetails(id, userId);
    res.json(beerDetails);

  } catch (error) {
    logger.error('Error fetching beer details:', error);
    if (error instanceof AppError) throw error;
    throw new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch beer details');
  }
};

// POST /api/beers/:id/experience - Create or update beer experience
export const createBeerExperience = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid beer ID');
    }

    const experience = await beerService.createOrUpdateExperience(
      id,
      userId,
      req.body
    );

    const isUpdate = !experience.isNew;
    const statusCode = isUpdate ? 200 : 201;
    const message = isUpdate 
      ? 'Beer experience updated successfully'
      : 'Beer experience created successfully';

    res.status(statusCode).json({
      message,
      experience
    });

  } catch (error) {
    logger.error('Error creating/updating beer experience:', error);
    if (error instanceof AppError) throw error;
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid experience data');
    }
    throw new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to save beer experience');
  }
};

// GET /api/beers/recommendations - Get personalized beer recommendations
export const getBeerRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { limit = 10 } = req.query;

    if (!userId) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
    }

    const recommendations = await beerService.getRecommendations(
      userId,
      Number(limit)
    );

    res.json({ recommendations });

  } catch (error) {
    logger.error('Error generating beer recommendations:', error);
    if (error instanceof AppError) throw error;
    throw new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to generate recommendations');
  }
};

// GET /api/beers/trending - Get trending beers
export const getTrendingBeers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { limit = 10, timeframe = '7d' } = req.query;

    const trending = await beerService.getTrendingBeers(
      timeframe as '1d' | '7d' | '30d',
      Number(limit)
    );

    res.json({
      trending,
      timeframe,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error fetching trending beers:', error);
    throw new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch trending beers');
  }
};

// GET /api/beers/styles - Get beer styles with statistics
export const getBeerStyles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const styles = await beerService.getBeerStyles(userId);

    res.json({
      styles,
      totalStyles: styles.length
    });

  } catch (error) {
    logger.error('Error fetching beer styles:', error);
    throw new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Failed to fetch beer styles');
  }
};