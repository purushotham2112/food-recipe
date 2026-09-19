const mongoose = require('mongoose');

const shoppingItemSchema = new mongoose.Schema({
  ingredient: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'g' },
  checked: { type: Boolean, default: false },
  category: { type: String, default: 'General' }
});

const shoppingListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [shoppingItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
