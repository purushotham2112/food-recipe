const mongoose = require('mongoose');

const recipeViewSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ipHash: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

recipeViewSchema.index({ recipe: 1, createdAt: -1 });

module.exports = mongoose.model('RecipeView', recipeViewSchema);
