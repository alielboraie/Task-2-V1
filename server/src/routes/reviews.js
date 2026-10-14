import { Router } from 'express';

import {
  getAllReviews,
  getReview,
  createReview,
  getTopMeals
} from '../controllers/reviewController.js';

const router = Router();

router.get('/', getAllReviews);
router.post('/', createReview);

// This must appear before /:id.
router.get('/top', getTopMeals);

router.get('/:id', getReview);

export default router;