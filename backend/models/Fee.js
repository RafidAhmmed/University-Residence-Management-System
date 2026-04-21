const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  batchName: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  feeType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  lateFee: {
    type: Number,
    default: 0,
    min: 0,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid',
  },
  paymentMethod: {
    type: String,
    enum: ['bkash', 'nagad', 'sslcommerz', ''],
    default: '',
  },
  transactionId: {
    type: String,
    default: '',
  },
  paidAt: {
    type: Date,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  lateFeeApplied: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Fee', feeSchema);