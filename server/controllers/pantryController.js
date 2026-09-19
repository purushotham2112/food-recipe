const PantryItem = require('../models/PantryItem');

// @desc    Get user pantry items with expiry status
// @route   GET /api/pantry
// @access  Private
const getPantryItems = async (req, res, next) => {
  try {
    const items = await PantryItem.find({ user: req.user._id }).sort({ expiryDate: 1 });
    const now = new Date();

    const formatted = items.map(item => {
      let status = 'Available';
      if (item.quantity <= 2) status = 'Low Stock';

      if (item.expiryDate) {
        const daysLeft = Math.ceil((new Date(item.expiryDate) - now) / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) status = 'Expired';
        else if (daysLeft <= 3) status = 'Expiring Soon';
      }

      return {
        ...item._doc,
        status
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to pantry
// @route   POST /api/pantry
// @access  Private
const addPantryItem = async (req, res, next) => {
  try {
    const { ingredient, quantity, unit, expiryDate } = req.body;

    if (!ingredient || !quantity) {
      return res.status(400).json({ success: false, message: 'Ingredient name and quantity are required' });
    }

    const item = await PantryItem.create({
      user: req.user._id,
      ingredient,
      quantity: Number(quantity),
      unit: unit || 'g',
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pantry item
// @route   PUT /api/pantry/:id
// @access  Private
const updatePantryItem = async (req, res, next) => {
  try {
    const item = await PantryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Pantry item not found' });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { ingredient, quantity, unit, expiryDate } = req.body;
    if (ingredient) item.ingredient = ingredient;
    if (quantity !== undefined) item.quantity = Number(quantity);
    if (unit) item.unit = unit;
    if (expiryDate !== undefined) item.expiryDate = expiryDate ? new Date(expiryDate) : null;

    await item.save();
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pantry item
// @route   DELETE /api/pantry/:id
// @access  Private
const deletePantryItem = async (req, res, next) => {
  try {
    const item = await PantryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Pantry item not found' });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Pantry item removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPantryItems,
  addPantryItem,
  updatePantryItem,
  deletePantryItem
};
