const express = require('express');
const router = express.Router();
const {
  generateRecipeEndpoint,
  fridgeAssistantEndpoint,
  substitutionEndpoint,
  getRecommendations
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-recipe', generateRecipeEndpoint);
router.post('/fridge', fridgeAssistantEndpoint);
router.post('/substitution', substitutionEndpoint);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
