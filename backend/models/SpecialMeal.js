const mongoose = require('mongoose');

const specialMealSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
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
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

specialMealSchema.index({ date: 1, hall: 1, mealType: 1 }, { unique: true });

module.exports = mongoose.model('SpecialMeal', specialMealSchema);
