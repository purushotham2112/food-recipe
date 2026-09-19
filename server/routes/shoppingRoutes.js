const express = require('express');
const router = express.Router();
const {
  getShoppingList,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  clearShoppingList
} = require('../controllers/shoppingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getShoppingList);
router.post('/', protect, addShoppingItem);
router.put('/:itemId', protect, updateShoppingItem);
router.delete('/:itemId', protect, deleteShoppingItem);
router.delete('/', protect, clearShoppingList);

module.exports = router;
