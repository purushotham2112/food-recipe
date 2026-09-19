const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'g' },
  optional: { type: Boolean, default: false }
});

const instructionSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, default: '' },
  description: { type: String, required: true },
  duration: { type: Number, default: 0 } // minutes
});

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbohydrates: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 }
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
    },
    videoUrl: {
      type: String,
      default: ''
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    cuisine: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    preparationTime: {
      type: Number,
      required: true
    },
    cookingTime: {
      type: Number,
      required: true
    },
    totalTime: {
      type: Number,
      required: true
    },
    servings: {
      type: Number,
      default: 2
    },
    ingredients: [ingredientSchema],
    instructions: [instructionSchema],
    nutrition: nutritionSchema,
    tags: [{ type: String }],
    dietTypes: [{ type: String }], // Vegetarian, Vegan, Gluten-Free, Keto, etc.
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    favoriteCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'published'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Indexes for fast searching and filtering
recipeSchema.index({ title: 'text', description: 'text' });
recipeSchema.index({ tags: 1, cuisine: 1 });
recipeSchema.index({ category: 1, status: 1, ratingAverage: -1 });

module.exports = mongoose.model('Recipe', recipeSchema);
