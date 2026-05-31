const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100, // percentage
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Burgers',
          'Pizza',
          'Pasta',
          'Indian',
          'Sandwiches',
          'Asian',
          'Healthy',
          'Desserts',
          'Drinks',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    image: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    tag: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      default: 15, // minutes
      min: 0,
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    spicyLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 3, // 0: Not spicy, 1: Mild, 2: Medium, 3: Hot
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
