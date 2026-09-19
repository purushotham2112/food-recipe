const express = require('express');
const router = express.Router();
const {
  getMealPlans,
  createMealPlan,
  deleteMealPlan,
  generateShoppingListFromPlans
} = require('../controllers/mealPlanController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMealPlans);
router.post('/', protect, createMealPlan);
router.delete('/:id', protect, deleteMealPlan);
router.post('/generate-shopping-list', protect, generateShoppingListFromPlans);

module.exports = router;
