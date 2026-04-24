const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['maintenance', 'event', 'emergency', 'general'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hall: {
    type: String,
    default: null,
    trim: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  pdfUrl: {
    type: String,
    default: null,
  },
  googleFormUrl: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notice', noticeSchema);