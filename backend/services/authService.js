const userService = require('./userService');
const User = require('../models/User');
const AuthOtp = require('../models/AuthOtp');
const emailService = require('./emailService');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const OTP_EXPIRY_MINUTES = 10;

const hashOtp = (otp) =>
  crypto.createHash('sha256').update(String(otp)).digest('hex');

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

class AuthService {
  async register(userData) {
    const user = await userService.createUser(userData);
    return user;
  }

  async requestRegistrationOtp(userData) {
    const requiredFields = [
      'name',
      'studentId',
      'email',
      'phone',
      'password',
      'dateOfBirth',
      'session',
      'department',
      'bloodGroup',
      'homeTown',
      'allocatedHall',
    ];

    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    const normalizedEmail = String(userData.email).trim().toLowerCase();
    const existingByEmail = await userService.getUserByEmail(normalizedEmail);
    if (existingByEmail) {
      throw new Error('Email is already registered');
    }

    const existingByStudentId = await userService.getUserByStudentId(
      String(userData.studentId).trim()
    );
    if (existingByStudentId) {
      throw new Error('Student ID is already registered');
    }

    const otp = generateOtp();
    const codeHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await AuthOtp.deleteMany({ email: normalizedEmail, purpose: 'register' });

    await AuthOtp.create({
      email: normalizedEmail,
      purpose: 'register',
      codeHash,
      expiresAt,
      payload: {
        ...userData,
        email: normalizedEmail,
        studentId: String(userData.studentId).trim(),
      },
    });

    await emailService.sendOtpEmail(normalizedEmail, otp, 'register');
  }

  async verifyRegistrationOtp(email, otp) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const record = await AuthOtp.findOne({
      email: normalizedEmail,
      purpose: 'register',
    }).sort({ createdAt: -1 });

    if (!record) {
      throw new Error('OTP not found. Request a new OTP.');
    }

    if (record.expiresAt < new Date()) {
      throw new Error('OTP expired. Request a new OTP.');
    }

    if (record.codeHash !== hashOtp(otp)) {
      throw new Error('Invalid OTP');
    }

    if (!record.payload) {
      throw new Error('Registration data not found. Please register again.');
    }

    const user = await userService.createUser(record.payload);
    await AuthOtp.deleteMany({ email: normalizedEmail, purpose: 'register' });
    return user;
  }

  async requestPasswordResetOtp(email) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await userService.getUserByEmail(normalizedEmail);
    if (!user) {
      throw new Error('No account found with this email');
    }

    const otp = generateOtp();
    const codeHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await AuthOtp.deleteMany({ email: normalizedEmail, purpose: 'reset' });
    await AuthOtp.create({
      email: normalizedEmail,
      purpose: 'reset',
      codeHash,
      expiresAt,
      verified: false,
    });

    await emailService.sendOtpEmail(normalizedEmail, otp, 'reset');
  }

  async verifyPasswordResetOtp(email, otp) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const record = await AuthOtp.findOne({
      email: normalizedEmail,
      purpose: 'reset',
    }).sort({ createdAt: -1 });

    if (!record) {
      throw new Error('OTP not found. Request a new OTP.');
    }

    if (record.expiresAt < new Date()) {
      throw new Error('OTP expired. Request a new OTP.');
    }

    if (record.codeHash !== hashOtp(otp)) {
      throw new Error('Invalid OTP');
    }

    record.verified = true;
    await record.save();
  }

  async resetPasswordWithOtp(email, otp, newPassword) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const record = await AuthOtp.findOne({
      email: normalizedEmail,
      purpose: 'reset',
    }).sort({ createdAt: -1 });

    if (!record) {
      throw new Error('OTP not found. Request a new OTP.');
    }

    if (record.expiresAt < new Date()) {
      throw new Error('OTP expired. Request a new OTP.');
    }

    if (record.codeHash !== hashOtp(otp)) {
      throw new Error('Invalid OTP');
    }

    if (!record.verified) {
      throw new Error('Please verify OTP first');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new Error('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await AuthOtp.deleteMany({ email: normalizedEmail, purpose: 'reset' });
  }

  async login(studentId, password) {
    const result = await userService.login(studentId, password);
    return result;
  }

  async logout(userId, token) {
    const user = await userService.getUserById(userId);
    user.tokens = user.tokens.filter(t => t !== token);
    await user.save();
  }
}

module.exports = new AuthService();