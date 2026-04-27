const userService = require('../services/userService');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const Admin = require('../models/Admin');
const DirectoryOption = require('../models/DirectoryOption');
const { isValidSession } = require('../utils/sessionOptions');
const { normalizeDepartmentName } = require('../utils/directoryNormalization');
const { ADMIN_DESIGNATIONS, normalizeDesignation } = require('../utils/adminDesignations');
const { ADMIN_HALLS, normalizeAdminHall } = require('../utils/adminHalls');
const {
  buildStudentEmail,
  normalizeStudentEmail,
  normalizeStudentId,
} = require('../utils/studentAccount');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

const validateFixedFields = async (payload) => {
  if (payload.session !== undefined && payload.session !== null && String(payload.session).trim() !== '') {
    payload.session = String(payload.session).trim();
    if (!isValidSession(payload.session)) {
      throw new Error('Invalid session');
    }
  }

  if (payload.department !== undefined && payload.department !== null && String(payload.department).trim() !== '') {
    payload.department = normalizeDepartmentName(payload.department);
    const exists = await DirectoryOption.exists({
      kind: 'department',
      isActive: true,
      name: payload.department,
    });

    if (!exists) {
      throw new Error('Invalid department');
    }
  }

  if (payload.allocatedHall !== undefined && payload.allocatedHall !== null && String(payload.allocatedHall).trim() !== '') {
    payload.allocatedHall = String(payload.allocatedHall).trim();
    const exists = await DirectoryOption.exists({
      kind: 'hall',
      isActive: true,
      name: payload.allocatedHall,
    });

    if (!exists) {
      throw new Error('Invalid hall');
    }
  }
};

const validateStudentAccountEmail = async (userData) => {
  if (userData.role !== 'user') {
    return;
  }

  const studentId = normalizeStudentId(userData.studentId);
  const email = normalizeStudentEmail(userData.email);
  const department = normalizeDepartmentName(userData.department);

  if (!/^\d{6,8}$/.test(studentId)) {
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

  const expectedEmail = buildStudentEmail(studentId, departmentOption.code);
  if (email !== expectedEmail) {
    throw new Error(`Student email must be ${expectedEmail}`);
  }
};

const validateAdminFields = (userData) => {
  if (userData.role !== 'admin') {
    return;
  }

  const designation = normalizeDesignation(userData.designation);
  const hall = normalizeAdminHall(userData.hall);
  if (!designation) {
    throw new Error('Designation is required for admin');
  }
  if (!hall) {
    throw new Error('Hall is required for admin');
  }

  if (!ADMIN_DESIGNATIONS.includes(designation)) {
    throw new Error('Invalid designation');
  }
  if (!ADMIN_HALLS.includes(hall)) {
    throw new Error('Invalid hall for admin');
  }

  userData.designation = designation;
  userData.hall = hall;
};

const sanitizeUserResponse = (doc) => {
  const userObj = doc.toObject();
  userObj.id = userObj._id;
  delete userObj._id;
  delete userObj.password;
  delete userObj.tokens;
  return userObj;
};

class UserController {
  // Static method for multer middleware
  static uploadProfilePicture = upload.single('profilePicture');
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(sanitizeUserResponse(user));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      const sanitizedUsers = users.map((user) => sanitizeUserResponse(user));

      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const allowedFields = [
        'name',
        'studentId',
        'email',
        'gender',
        'phone',
        'role',
        'designation',
        'hall',
        'dateOfBirth',
        'session',
        'department',
        'bloodGroup',
        'homeTown',
        'allocatedHall',
        'allocatedRoom',
      ];

      const filteredData = {};
      Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
          filteredData[key] = req.body[key];
        }
      });

      await validateFixedFields(filteredData);

      const existingUser = await userService.getUserById(req.params.id);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isExistingAdmin = existingUser.role === 'admin';

      if (isExistingAdmin && filteredData.role === 'user') {
        return res.status(400).json({ error: 'Cannot convert admin to user without student profile data' });
      }

      if (!isExistingAdmin && filteredData.role === 'admin') {
        const promotedAdminData = {
          name: String(filteredData.name || existingUser.name || '').trim(),
          email: normalizeStudentEmail(filteredData.email || existingUser.email),
          phone: String(filteredData.phone || existingUser.phone || '').trim(),
          gender: filteredData.gender || existingUser.gender,
          department: filteredData.department || existingUser.department,
          designation: normalizeDesignation(filteredData.designation),
          hall: normalizeAdminHall(filteredData.hall || existingUser.allocatedHall),
          password: existingUser.password,
          role: 'admin',
          profilePicture: filteredData.profilePicture || existingUser.profilePicture,
          tokens: existingUser.tokens || [],
        };

        validateAdminFields(promotedAdminData);

        const admin = await Admin.create(promotedAdminData);
        await userService.deleteUser(req.params.id);
        return res.json(sanitizeUserResponse(admin));
      }

      if (isExistingAdmin) {
        delete filteredData.studentId;
        delete filteredData.session;
        delete filteredData.allocatedRoom;
        filteredData.hall = normalizeAdminHall(filteredData.hall || existingUser.hall);
        filteredData.role = 'admin';
      }

      const nextUserData = {
        ...existingUser.toObject(),
        ...filteredData,
        role: filteredData.role || existingUser.role,
      };

      await validateStudentAccountEmail(nextUserData);
      validateAdminFields(nextUserData);

      if (isExistingAdmin) {
        filteredData.designation = nextUserData.designation;
        filteredData.hall = nextUserData.hall;
      }

      const user = await userService.updateUser(req.params.id, filteredData);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(sanitizeUserResponse(user));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await userService.deleteUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const userId = req.params.id;
      const requestingUser = req.user;

      // Check if user is updating their own profile or is an admin
      if (requestingUser.id !== userId && requestingUser.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this profile' });
      }

      let profileData = { ...req.body };

      await validateFixedFields(profileData);

      const existingUser = await userService.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      await validateStudentAccountEmail({
        ...existingUser.toObject(),
        ...profileData,
      });

      validateAdminFields({
        ...existingUser.toObject(),
        ...profileData,
      });

      // Handle profile picture upload to Cloudinary
      if (req.file) {
        try {
          // Upload to Cloudinary
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'profile-pictures',
                public_id: `user_${userId}_${Date.now()}`,
                transformation: [
                  { width: 300, height: 300, crop: 'fill' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(req.file.buffer);
          });

          profileData.profilePicture = result.secure_url;
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ error: 'Failed to upload profile picture' });
        }
      }

      const user = await userService.updateUserProfile(userId, profileData);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return user without password and with id instead of _id
      res.json(sanitizeUserResponse(user));
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
module.exports.uploadProfilePicture = UserController.uploadProfilePicture;