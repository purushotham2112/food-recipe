const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ingredient: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: 'g'
    },
    expiryDate: {
      type: Date
    }
  },
  { timestamps: true }
);

pantryItemSchema.index({ user: 1, ingredient: 1 });

module.exports = mongoose.model('PantryItem', pantryItemSchema);
