const mongoose = require('mongoose');

const mealClosureSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  hall: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

mealClosureSchema.index({ startDate: 1, endDate: 1, hall: 1 }, { unique: true });

module.exports = mongoose.model('MealClosure', mealClosureSchema);
