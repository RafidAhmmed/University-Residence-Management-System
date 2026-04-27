const mongoose = require('mongoose');
const { ADMIN_DESIGNATIONS } = require('../utils/adminDesignations');
const { ADMIN_HALLS } = require('../utils/adminHalls');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin'],
  },
  designation: {
    type: String,
    required: true,
    enum: ADMIN_DESIGNATIONS,
  },
  hall: {
    type: String,
    required: true,
    enum: ADMIN_HALLS,
  },
  department: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  tokens: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Admin', adminSchema);
