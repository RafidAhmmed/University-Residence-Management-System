const userService = require('./userService');
const User = require('../models/User');
const Admin = require('../models/Admin');
const AuthOtp = require('../models/AuthOtp');
const emailService = require('./emailService');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const DirectoryOption = require('../models/DirectoryOption');
const { isValidSession, getSessionOptions } = require('../utils/sessionOptions');
const { normalizeDepartmentName } = require('../utils/directoryNormalization');
const {
  buildStudentEmail,
  normalizeStudentEmail,
  normalizeStudentId,
} = require('../utils/studentAccount');

const OTP_EXPIRY_MINUTES = 10;

const hashOtp = (otp) =>
  crypto.createHash('sha256').update(String(otp)).digest('hex');

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

class AuthService {
  async getRegisterOptions() {
    const [departments, halls] = await Promise.all([
      DirectoryOption.find({ kind: 'department', isActive: true })
        .sort({ displayOrder: 1, name: 1 })
        .select('name code -_id'),
      DirectoryOption.find({ kind: 'hall', isActive: true })
        .sort({ displayOrder: 1, name: 1 })
        .select('name code -_id'),
    ]);

    return {
      sessions: getSessionOptions(),
      departments: departments.map((item) => ({ name: item.name, code: item.code || '' })),
      halls: halls.map((item) => ({ name: item.name, code: item.code || '' })),
    };
  }

  async validateDirectoryFields(userData) {
    const department = normalizeDepartmentName(userData.department);
    const hall = String(userData.allocatedHall || '').trim();
    const session = String(userData.session || '').trim();

    if (!isValidSession(session)) {
      throw new Error('Invalid session');
    }

    const [departmentExists, hallExists] = await Promise.all([
      DirectoryOption.exists({ kind: 'department', isActive: true, name: department }),
      DirectoryOption.exists({ kind: 'hall', isActive: true, name: hall }),
    ]);

    if (!departmentExists) {
      throw new Error('Invalid department');
    }

    if (!hallExists) {
      throw new Error('Invalid hall');
    }

    userData.department = department;
    userData.allocatedHall = hall;
    userData.session = session;
  }

  async validateStudentAccountEmail(userData) {
    const normalizedStudentId = normalizeStudentId(userData.studentId);
    const normalizedEmail = normalizeStudentEmail(userData.email);
    const department = normalizeDepartmentName(userData.department);

    if (!/^\d{6,8}$/.test(normalizedStudentId)) {
      throw new Error('Student ID must be 6-8 digits');
    }

    const departmentOption = await DirectoryOption.findOne({
      kind: 'department',
      isActive: true,
      name: department,
    }).select('code');

    if (!departmentOption || !departmentOption.code) {
      throw new Error('Department code not found');
    }

    const expectedEmail = buildStudentEmail(normalizedStudentId, departmentOption.code);

    if (normalizedEmail !== expectedEmail) {
      throw new Error(`Student email must be ${expectedEmail}`);
    }

    userData.studentId = normalizedStudentId;
    userData.email = normalizedEmail;
  }

  async validateStudentRegistration(userData) {
    await this.validateDirectoryFields(userData);
    await this.validateStudentAccountEmail(userData);
  }

  async register(userData) {
    const requiredFields = [
      'name',
      'studentId',
      'email',
      'gender',
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

    await this.validateStudentRegistration(userData);
    const user = await userService.createUser(userData);
    return user;
  }

  async requestRegistrationOtp(userData) {
    const requiredFields = [
      'name',
      'studentId',
      'email',
      'gender',
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

    await this.validateStudentRegistration(userData);

    const normalizedEmail = normalizeStudentEmail(userData.email);
    const existingByEmail = await userService.getUserByEmail(normalizedEmail);
    if (existingByEmail) {
      throw new Error('Email is already registered');
    }

    const existingByStudentId = await userService.getUserByStudentId(
      normalizeStudentId(userData.studentId)
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
        studentId: normalizeStudentId(userData.studentId),
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
    const [student, admin] = await Promise.all([
      userService.getUserByEmail(normalizedEmail),
      userService.getAdminByEmail(normalizedEmail),
    ]);
    const user = student || admin;
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

    const user = await User.findOne({ email: normalizedEmail }) || await Admin.findOne({ email: normalizedEmail });
    if (!user) {
      throw new Error('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await AuthOtp.deleteMany({ email: normalizedEmail, purpose: 'reset' });
  }

  async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword) {
      throw new Error('Current password is required');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error('New password must be different from current password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  async login(email, password) {
    const result = await userService.login(email, password);
    return result;
  }

  async logout(userId, token) {
    const user = await userService.getUserById(userId);
    user.tokens = user.tokens.filter(t => t !== token);
    await user.save();
  }
}

module.exports = new AuthService();