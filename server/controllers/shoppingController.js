const ShoppingList = require('../models/ShoppingList');

// @desc    Get user shopping list
// @route   GET /api/shopping-list
// @access  Private
const getShoppingList = async (req, res, next) => {
  try {
    let list = await ShoppingList.findOne({ user: req.user._id });
    if (!list) {
      list = await ShoppingList.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to shopping list
// @route   POST /api/shopping-list
// @access  Private
const addShoppingItem = async (req, res, next) => {
  try {
    const { ingredient, quantity, unit } = req.body;

    if (!ingredient) {
      return res.status(400).json({ success: false, message: 'Ingredient name is required' });
    }

    let list = await ShoppingList.findOne({ user: req.user._id });
    if (!list) {
      list = await ShoppingList.create({ user: req.user._id, items: [] });
    }

    const existingIdx = list.items.findIndex(
      item => item.ingredient.toLowerCase() === ingredient.toLowerCase() && item.unit === (unit || 'g')
    );

    if (existingIdx > -1) {
      list.items[existingIdx].quantity += Number(quantity) || 1;
    } else {
      list.items.push({
        ingredient,
        quantity: Number(quantity) || 1,
        unit: unit || 'g',
        checked: false
      });
    }

    await list.save();
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle check item or edit quantity
// @route   PUT /api/shopping-list/:itemId
// @access  Private
const updateShoppingItem = async (req, res, next) => {
  try {
    const { checked, quantity } = req.body;
    const list = await ShoppingList.findOne({ user: req.user._id });

    if (!list) {
      return res.status(404).json({ success: false, message: 'Shopping list not found' });
    }

    const item = list.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in shopping list' });
    }

    if (checked !== undefined) item.checked = checked;
    if (quantity !== undefined) item.quantity = Number(quantity);

    await list.save();
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item from shopping list
// @route   DELETE /api/shopping-list/:itemId
// @access  Private
const deleteShoppingItem = async (req, res, next) => {
  try {
    const list = await ShoppingList.findOne({ user: req.user._id });
    if (!list) {
      return res.status(404).json({ success: false, message: 'Shopping list not found' });
    }

    list.items = list.items.filter(item => item._id.toString() !== req.params.itemId);
    await list.save();

    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire shopping list
// @route   DELETE /api/shopping-list
// @access  Private
const clearShoppingList = async (req, res, next) => {
  try {
    const list = await ShoppingList.findOne({ user: req.user._id });
    if (list) {
      list.items = [];
      await list.save();
    }
    res.json({ success: true, message: 'Shopping list cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShoppingList,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  clearShoppingList
};
