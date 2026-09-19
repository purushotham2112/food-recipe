const MealPlan = require('../models/MealPlan');
const ShoppingList = require('../models/ShoppingList');

// @desc    Get user meal plans
// @route   GET /api/meal-plans
// @access  Private
const getMealPlans = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const mealPlans = await MealPlan.find(query)
      .populate({
        path: 'recipe',
        populate: { path: 'author', select: 'name' }
      })
      .sort({ date: 1, mealType: 1 });

    res.json({ success: true, data: mealPlans });
  } catch (error) {
    next(error);
  }
};

// @desc    Add meal plan item
// @route   POST /api/meal-plans
// @access  Private
const createMealPlan = async (req, res, next) => {
  try {
    const { date, mealType, recipe, servings, notes } = req.body;

    if (!date || !mealType || !recipe) {
      return res.status(400).json({ success: false, message: 'Date, mealType, and recipe are required' });
    }

    const mealPlan = await MealPlan.create({
      user: req.user._id,
      date,
      mealType,
      recipe,
      servings: Number(servings) || 2,
      notes: notes || ''
    });

    const populated = await MealPlan.findById(mealPlan._id).populate('recipe');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete meal plan item
// @route   DELETE /api/meal-plans/:id
// @access  Private
const deleteMealPlan = async (req, res, next) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ success: false, message: 'Meal plan not found' });
    }

    if (mealPlan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await mealPlan.deleteOne();
    res.json({ success: true, message: 'Meal plan item removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Shopping List from Meal Plans
// @route   POST /api/meal-plans/generate-shopping-list
// @access  Private
const generateShoppingListFromPlans = async (req, res, next) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user._id }).populate('recipe');

    if (!mealPlans.length) {
      return res.status(400).json({ success: false, message: 'No meal plans found to generate shopping list' });
    }

    const ingredientMap = {};

    mealPlans.forEach(plan => {
      if (!plan.recipe || !plan.recipe.ingredients) return;
      const originalServings = plan.recipe.servings || 2;
      const targetServings = plan.servings || 2;
      const ratio = targetServings / originalServings;

      plan.recipe.ingredients.forEach(ing => {
        const key = `${ing.name.toLowerCase().trim()}_${ing.unit.toLowerCase().trim()}`;
        const scaledQty = Math.round((ing.quantity * ratio) * 10) / 10;

        if (ingredientMap[key]) {
          ingredientMap[key].quantity += scaledQty;
        } else {
          ingredientMap[key] = {
            ingredient: ing.name,
            quantity: scaledQty,
            unit: ing.unit,
            checked: false
          };
        }
      });
    });

    const newItems = Object.values(ingredientMap);

    let shoppingList = await ShoppingList.findOne({ user: req.user._id });
    if (!shoppingList) {
      shoppingList = await ShoppingList.create({ user: req.user._id, items: newItems });
    } else {
      shoppingList.items = newItems;
      await shoppingList.save();
    }

    res.json({
      success: true,
      message: `Generated shopping list with ${newItems.length} ingredients from your meal plan.`,
      data: shoppingList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMealPlans,
  createMealPlan,
  deleteMealPlan,
  generateShoppingListFromPlans
};
