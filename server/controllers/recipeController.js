const Recipe = require('../models/Recipe');
const Favorite = require('../models/Favorite');
const Category = require('../models/Category');
const RecipeView = require('../models/RecipeView');
const slugify = require('slugify');

// @desc    Get all recipes with search, pagination & filters
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res, next) => {
  try {
    const {
      search,
      category,
      cuisine,
      difficulty,
      diet,
      maxTime,
      minRating,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = { status: 'published' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { 'ingredients.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      const catObj = await Category.findOne({ slug: category });
      if (catObj) query.category = catObj._id;
    }

    if (cuisine) query.cuisine = { $regex: cuisine, $options: 'i' };
    if (difficulty) query.difficulty = difficulty;
    if (diet) query.dietTypes = { $in: [new RegExp(diet, 'i')] };
    if (maxTime) query.totalTime = { $lte: Number(maxTime) };
    if (minRating) query.ratingAverage = { $gte: Number(minRating) };

    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') sortOptions = { viewCount: -1, favoriteCount: -1 };
    if (sort === 'rating') sortOptions = { ratingAverage: -1 };
    if (sort === 'quickest') sortOptions = { totalTime: 1 };
    if (sort === 'trending') sortOptions = { ratingAverage: -1, createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('author', 'name profileImage bio role')
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: recipes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recipe by slug
// @route   GET /api/recipes/slug/:slug
// @access  Public
const getRecipeBySlug = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ slug: req.params.slug })
      .populate('author', 'name profileImage bio role followers')
      .populate('category', 'name slug');

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Increment view count
    recipe.viewCount += 1;
    await recipe.save();

    // Record view log
    await RecipeView.create({
      recipe: recipe._id,
      user: req.user ? req.user._id : null,
      ipHash: req.ip || ''
    });

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name profileImage bio role')
      .populate('category', 'name slug');

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private (Chef/User/Admin)
const createRecipe = async (req, res, next) => {
  try {
    const {
      title,
      description,
      image,
      videoUrl,
      category,
      cuisine,
      difficulty,
      preparationTime,
      cookingTime,
      servings,
      ingredients,
      instructions,
      nutrition,
      tags,
      dietTypes,
      status
    } = req.body;

    const baseSlug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await Recipe.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const prepTime = Number(preparationTime) || 0;
    const cookTime = Number(cookingTime) || 0;
    const totalTime = prepTime + cookTime;

    const recipe = await Recipe.create({
      title,
      slug: uniqueSlug,
      description,
      image: image || (req.file ? `/uploads/${req.file.filename}` : undefined),
      videoUrl: videoUrl || '',
      author: req.user._id,
      category,
      cuisine: cuisine || 'General',
      difficulty: difficulty || 'Medium',
      preparationTime: prepTime,
      cookingTime: cookTime,
      totalTime,
      servings: Number(servings) || 2,
      ingredients: ingredients || [],
      instructions: instructions || [],
      nutrition: nutrition || {},
      tags: tags || [],
      dietTypes: dietTypes || [],
      status: status || 'published'
    });

    // Update category recipe count
    await Category.findByIdAndUpdate(category, { $inc: { recipeCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private (Owner/Admin)
const updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this recipe' });
    }

    const updates = { ...req.body };
    if (updates.title && updates.title !== recipe.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);
    }
    if (updates.preparationTime !== undefined || updates.cookingTime !== undefined) {
      const pTime = updates.preparationTime !== undefined ? Number(updates.preparationTime) : recipe.preparationTime;
      const cTime = updates.cookingTime !== undefined ? Number(updates.cookingTime) : recipe.cookingTime;
      updates.totalTime = pTime + cTime;
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private (Owner/Admin)
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    await Category.findByIdAndUpdate(recipe.category, { $inc: { recipeCount: -1 } });

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Favorite / Unfavorite a recipe
// @route   POST /api/recipes/:id/favorite
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const existingFav = await Favorite.findOne({ user: userId, recipe: recipeId });

    if (existingFav) {
      await existingFav.deleteOne();
      recipe.favoriteCount = Math.max(0, recipe.favoriteCount - 1);
      await recipe.save();

      return res.json({
        success: true,
        isFavorite: false,
        message: 'Removed from favorites',
        favoriteCount: recipe.favoriteCount
      });
    } else {
      await Favorite.create({ user: userId, recipe: recipeId });
      recipe.favoriteCount += 1;
      await recipe.save();

      return res.json({
        success: true,
        isFavorite: true,
        message: 'Added to favorites',
        favoriteCount: recipe.favoriteCount
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user favorite recipes
// @route   GET /api/users/favorites
// @access  Private
const getUserFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate({
      path: 'recipe',
      populate: [
        { path: 'author', select: 'name profileImage' },
        { path: 'category', select: 'name slug' }
      ]
    });

    const recipes = favorites.map(fav => fav.recipe).filter(Boolean);

    res.json({
      success: true,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecipes,
  getRecipeBySlug,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
  getUserFavorites
};
