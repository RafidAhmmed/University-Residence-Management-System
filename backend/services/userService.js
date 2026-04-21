const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  async createUser(userData) {
    const { password, ...otherData } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...otherData, password: hashedPassword });
    return await user.save();
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async getUserByStudentId(studentId) {
    return await User.findOne({ studentId });
  }

  async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  async getAllUsers() {
    return await User.find();
  }

  async login(studentId, password) {
    const user = await this.getUserByStudentId(studentId);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ id: user._id, studentId: user.studentId, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    user.tokens = user.tokens || [];
    user.tokens.push(token);
    await user.save();

    return { user: { id: user._id, name: user.name, studentId: user.studentId, role: user.role }, token };
  }

  async updateUserProfile(id, profileData) {
    // Define allowed profile fields
    const allowedFields = [
      'name', 'email', 'phone', 'dateOfBirth', 'session', 'department',
      'bloodGroup', 'homeTown', 'profilePicture'
    ];

    // Filter out only allowed fields
    const filteredData = {};
    Object.keys(profileData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = profileData[key];
      }
    });

    // Update the user profile
    return await User.findByIdAndUpdate(id, filteredData, { new: true });
  }
}

module.exports = new UserService();