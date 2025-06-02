import { Router } from 'express';
import {
  getBeers,
  getBeerById,
  createBeerExperience,
  getBeerRecommendations,
  getTrendingBeers,
  getBeerStyles
} from '../controllers/beerController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @route   GET /api/beers
 * @desc    Get all beers with filtering, sorting, and pagination
 * @access  Public (but enhanced with auth)
 * @query   {string} style - Filter by beer style
 * @query   {number} minRating - Minimum rating filter
 * @query   {number} maxRating - Maximum rating filter
 * @query   {boolean} awardWinning - Filter for award-winning beers
 * @query   {string} search - Search in name, description, style
 * @query   {string} sortBy - Sort field (name, rating, averageRating, awards)
 * @query   {string} sortOrder - Sort direction (asc, desc)
 * @query   {number} page - Page number for pagination
 * @query   {number} limit - Items per page
 * @query   {string} brewery - Filter by brewery ID
 */
router.get('/', getBeers);

/**
 * @route   GET /api/beers/recommendations
 * @desc    Get personalized beer recommendations
 * @access  Private
 * @query   {number} limit - Number of recommendations to return
 */
router.get('/recommendations', authenticateToken, getBeerRecommendations);

/**
 * @route   GET /api/beers/trending
 * @desc    Get trending beers based on recent activity
 * @access  Public (but enhanced with auth)
 * @query   {number} limit - Number of trending beers to return
 * @query   {string} timeframe - Time period (1d, 7d, 30d)
 */
router.get('/trending', getTrendingBeers);

/**
 * @route   GET /api/beers/styles
 * @desc    Get beer styles with statistics and user experience data
 * @access  Public (but enhanced with auth)
 */
router.get('/styles', getBeerStyles);

/**
 * @route   GET /api/beers/:id
 * @desc    Get beer details by ID
 * @access  Public (but enhanced with auth)
 * @param   {string} id - Beer ObjectId
 */
router.get('/:id', getBeerById);

/**
 * @route   POST /api/beers/:id/experience
 * @desc    Create or update beer experience/rating
 * @access  Private
 * @param   {string} id - Beer ObjectId
 * @body    {object} experience - Beer experience data
 */
router.post('/:id/experience', authenticateToken, createBeerExperience);

export default router;