const User = require('../models/User');

class UserService {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  async getAllUsers() {
    return await User.find();
  }
}

module.exports = new UserService();