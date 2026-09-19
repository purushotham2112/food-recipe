const express = require('express');
const router = express.Router();
const { getUserFavorites } = require('../controllers/recipeController');
const { toggleFollow, getFollowers, getFollowing } = require('../controllers/followController');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/authMiddleware');

// Get user favorites
router.get('/favorites', protect, getUserFavorites);

// Get list of chefs
router.get('/chefs', async (req, res, next) => {
  try {
    const chefs = await User.find({ role: { $in: ['chef', 'admin'] } })
      .select('-password')
      .sort({ followers: -1 });

    const chefsWithCounts = await Promise.all(
      chefs.map(async (chef) => {
        const recipeCount = await Recipe.countDocuments({ author: chef._id, status: 'published' });
        return {
          ...chef._doc,
          recipeCount
        };
      })
    );

    res.json({ success: true, data: chefsWithCounts });
  } catch (error) {
    next(error);
  }
});

// Get single chef profile
router.get('/chefs/:id', async (req, res, next) => {
  try {
    const chef = await User.findById(req.params.id).select('-password');
    if (!chef) {
      return res.status(404).json({ success: false, message: 'Chef not found' });
    }

    const recipes = await Recipe.find({ author: chef._id, status: 'published' })
      .populate('category', 'name slug')
      .sort({ ratingAverage: -1 });

    res.json({
      success: true,
      data: {
        chef,
        recipes,
        recipeCount: recipes.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Follow / Unfollow
router.post('/:id/follow', protect, toggleFollow);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

module.exports = router;
