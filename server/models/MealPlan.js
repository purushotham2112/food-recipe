const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'snack', 'dinner'],
      required: true
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    servings: {
      type: Number,
      default: 2
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

mealPlanSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
