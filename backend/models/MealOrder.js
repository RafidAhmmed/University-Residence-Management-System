const mongoose = require('mongoose');

const mealOrderSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mealDate: {
    type: Date,
    required: true,
  },
  hall: {
    type: String,
    required: true,
    trim: true,
  },
  meals: [
    {
      mealType: {
        type: String,
        enum: ['lunch', 'dinner'],
        required: true,
      },
      mealOption: {
        type: String,
        enum: ['chicken', 'fish', 'special'],
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      token: {
        type: String,
        required: true,
        unique: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['deposit', 'bkash', 'nagad', 'rocket'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  transactionId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for faster queries
mealOrderSchema.index({ student: 1, mealDate: 1 });
mealOrderSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('MealOrder', mealOrderSchema);
