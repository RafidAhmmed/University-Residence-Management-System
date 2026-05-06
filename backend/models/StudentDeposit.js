const mongoose = require('mongoose');

const studentDepositSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  totalPaid: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  remainingBalance: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  transactionHistory: [
    {
      type: {
        type: String,
        enum: ['deposit', 'meal_charge', 'refund'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      paymentMethod: {
        type: String,
        enum: ['bkash', 'nagad', 'rocket'],
        sparse: true,
      },
      description: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('StudentDeposit', studentDepositSchema);
