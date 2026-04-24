const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['maintenance', 'cleaning', 'security', 'facilities', 'other'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sourceHall: {
    type: String,
    default: null,
    trim: true,
  },
  sourceRoom: {
    type: String,
    default: null,
    trim: true,
  },
  adminResponse: {
    type: String,
    default: '',
  },
  responseDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Complaint', complaintSchema);