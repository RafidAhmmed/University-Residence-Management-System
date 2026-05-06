const mongoose = require('mongoose');

const hallMealPriceSchema = new mongoose.Schema({
  hall: {
    type: String,
    required: true,
    trim: true,
  },
  mealType: {
    type: String,
    enum: ['lunch', 'dinner'],
    required: true,
  },
  effectiveFrom: {
    type: Date,
    required: true,
  },
  chickenPrice: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  fishPrice: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

hallMealPriceSchema.index({ hall: 1, mealType: 1 }, { unique: true });
hallMealPriceSchema.index({ hall: 1, mealType: 1, effectiveFrom: -1 });

module.exports = mongoose.model('HallMealPrice', hallMealPriceSchema);
