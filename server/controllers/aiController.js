const { generateAIRecipe, getFridgeMatches, getIngredientSubstitution } = require('../services/aiService');
const Recipe = require('../models/Recipe');

// @desc    Generate AI recipe
// @route   POST /api/ai/generate-recipe
// @access  Public / Private
const generateRecipeEndpoint = async (req, res, next) => {
  try {
    const { prompt, cuisine, diet, maxTime } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Please provide ingredients or a dish prompt' });
    }

    const aiRecipe = await generateAIRecipe({ prompt, cuisine, diet, maxTime });

    res.json({
      success: true,
      message: 'AI recipe generated successfully',
      data: aiRecipe,
      disclaimer: 'AI-generated recipe output. Please verify ingredients for dietary requirements and allergen safety.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Fridge Assistant (what can I cook with ingredients)
// @route   POST /api/ai/fridge
// @access  Public / Private
const fridgeAssistantEndpoint = async (req, res, next) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of available ingredients' });
    }

    const matches = await getFridgeMatches(ingredients);

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Ingredient Substitution
// @route   POST /api/ai/substitution
// @access  Public / Private
const substitutionEndpoint = async (req, res, next) => {
  try {
    const { recipeTitle, missingIngredient } = req.body;

    if (!missingIngredient) {
      return res.status(400).json({ success: false, message: 'Please specify the missing ingredient' });
    }

    const result = await getIngredientSubstitution(recipeTitle, missingIngredient);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Personalized Recommendations
// @route   POST /api/ai/recommendations
// @access  Private / Optional Public
const getRecommendations = async (req, res, next) => {
  try {
    const user = req.user;
    const favoriteCuisines = user ? user.favoriteCuisines : ['Italian', 'Indian'];
    const dietaryPreferences = user ? user.dietaryPreferences : [];

    const query = { status: 'published' };
    if (favoriteCuisines.length > 0) {
      query.cuisine = { $in: favoriteCuisines };
    }

    let recommendations = await Recipe.find(query)
      .populate('author', 'name profileImage')
      .sort({ ratingAverage: -1, favoriteCount: -1 })
      .limit(6);

    if (recommendations.length < 4) {
      recommendations = await Recipe.find({ status: 'published' })
        .populate('author', 'name profileImage')
        .sort({ ratingAverage: -1 })
        .limit(6);
    }

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateRecipeEndpoint,
  fridgeAssistantEndpoint,
  substitutionEndpoint,
  getRecommendations
};
