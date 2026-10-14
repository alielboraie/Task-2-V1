import { Review } from '../models/Review.js';

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const review = await Review.create(req.body);

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/top?limit=3
export async function getTopMeals(req, res, next) {
  try {
    const rawLimit = req.query.limit;

    let limit = 5;

    if (rawLimit !== undefined) {
      if (!/^[1-9]\d*$/.test(rawLimit)) {
        return res.status(400).json({
          message: 'limit must be a positive integer'
        });
      }

      limit = Number(rawLimit);
    }

    const top = await Review.aggregate([
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      },
      {
        $sort: {
          averageRating: -1
        }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 0,
          mealCode: '$_id',
          averageRating: 1,
          reviewCount: 1
        }
      }
    ]);

    res.status(200).json({ top });
  } catch (err) {
    next(err);
  }
}