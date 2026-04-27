const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { normalizeStudentEmail } = require('../utils/studentAccount');

class UserService {
  async createUser(userData) {
    const { password, ...otherData } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...otherData, password: hashedPassword });
    return await user.save();
  }

  async getUserById(id) {
    const user = await User.findById(id);
    if (user) {
      return user;
    }

    return await Admin.findById(id);
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async getAdminByEmail(email) {
    return await Admin.findOne({ email });
  }

  async getUserByStudentId(studentId) {
    return await User.findOne({ studentId });
  }

  async updateUser(id, updateData) {
    const user = await User.findById(id);
    if (user) {
      return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    return await Admin.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteUser(id) {
    const user = await User.findById(id);
    if (user) {
      return await User.findByIdAndDelete(id);
    }

    return await Admin.findByIdAndDelete(id);
  }

  async getAllUsers() {
    const [users, admins] = await Promise.all([User.find(), Admin.find()]);
    return [...users, ...admins];
  }

  async login(email, password) {
    const normalizedEmail = normalizeStudentEmail(email);
    const studentUser = await this.getUserByEmail(normalizedEmail);
    const adminUser = studentUser ? null : await this.getAdminByEmail(normalizedEmail);
    const user = studentUser || adminUser;

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

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        designation: user.designation,
        hall: user.hall,
        role: user.role,
      },
      token,
    };
  }

  async updateUserProfile(id, profileData) {
    // Define allowed profile fields
    const baseAllowedFields = [
      'name', 'email', 'gender', 'phone', 'dateOfBirth', 'session', 'department',
      'bloodGroup', 'homeTown', 'profilePicture', 'designation'
    ];

    const existingUser = await User.findById(id);
    const isAdminAccount = !existingUser;
    const allowedFields = isAdminAccount
      ? ['name', 'email', 'gender', 'phone', 'department', 'designation', 'hall', 'profilePicture']
      : baseAllowedFields;

    // Filter out only allowed fields
    const filteredData = {};
    Object.keys(profileData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = profileData[key];
      }
    });

    // Update the user profile
    if (existingUser) {
      return await User.findByIdAndUpdate(id, filteredData, { new: true });
    }

    return await Admin.findByIdAndUpdate(id, filteredData, { new: true });
  }
}

module.exports = new UserService();