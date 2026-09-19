const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeBySlug,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite
} = require('../controllers/recipeController');
const { getRecipeReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getRecipes);
router.get('/slug/:slug', getRecipeBySlug);
router.get('/:id', getRecipeById);

router.post('/', protect, upload.single('image'), createRecipe);
router.put('/:id', protect, upload.single('image'), updateRecipe);
router.delete('/:id', protect, deleteRecipe);

router.post('/:id/favorite', protect, toggleFavorite);

// Reviews sub-route
router.get('/:id/reviews', getRecipeReviews);
router.post('/:id/reviews', protect, createReview);

module.exports = router;
