const Review = require('../models/Review');
const Recipe = require('../models/Recipe');

// Recalculate average rating for a recipe
const updateRecipeRatingStats = async (recipeId) => {
  const reviews = await Review.find({ recipe: recipeId });
  const reviewCount = reviews.length;
  const ratingCount = reviewCount;

  let ratingAverage = 0;
  if (reviewCount > 0) {
    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
    ratingAverage = parseFloat((totalRating / reviewCount).toFixed(1));
  }

  await Recipe.findByIdAndUpdate(recipeId, {
    ratingAverage,
    ratingCount,
    reviewCount
  });
};

// @desc    Get reviews for a recipe
// @route   GET /api/recipes/:id/reviews
// @access  Public
const getRecipeReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ recipe: req.params.id })
      .populate('user', 'name profileImage role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review
// @route   POST /api/recipes/:id/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const recipeId = req.params.id;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    if (!comment) {
      return res.status(400).json({ success: false, message: 'Comment is required' });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const existingReview = await Review.findOne({ user: userId, recipe: recipeId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this recipe' });
    }

    const review = await Review.create({
      user: userId,
      recipe: recipeId,
      rating: Number(rating),
      comment
    });

    await updateRecipeRatingStats(recipeId);

    const populatedReview = await Review.findById(review._id).populate('user', 'name profileImage role');

    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner/Admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const recipeId = review.recipe;
    await review.deleteOne();
    await updateRecipeRatingStats(recipeId);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecipeReviews,
  createReview,
  deleteReview
};
