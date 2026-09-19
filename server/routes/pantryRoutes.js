const express = require('express');
const router = express.Router();
const {
  getPantryItems,
  addPantryItem,
  updatePantryItem,
  deletePantryItem
} = require('../controllers/pantryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPantryItems);
router.post('/', protect, addPantryItem);
router.put('/:id', protect, updatePantryItem);
router.delete('/:id', protect, deletePantryItem);

module.exports = router;
