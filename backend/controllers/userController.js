const userService = require('../services/userService');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

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
      // Return user with id instead of _id for consistency
      const userObj = user.toObject();
      userObj.id = userObj._id;
      delete userObj._id;
      delete userObj.password; // Don't send password
      res.json(userObj);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      const sanitizedUsers = users.map((user) => {
        const userObj = user.toObject();
        userObj.id = userObj._id;
        delete userObj._id;
        delete userObj.password;
        delete userObj.tokens;
        return userObj;
      });

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
        'phone',
        'role',
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

      const user = await userService.updateUser(req.params.id, filteredData);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userObj = user.toObject();
      userObj.id = userObj._id;
      delete userObj._id;
      delete userObj.password;
      delete userObj.tokens;

      res.json(userObj);
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
      const userObj = user.toObject();
      const { password, ...userWithoutPassword } = userObj;
      userWithoutPassword.id = userWithoutPassword._id;
      delete userWithoutPassword._id;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { studentId, password } = req.body;
      const result = await userService.login(studentId, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
module.exports.uploadProfilePicture = UserController.uploadProfilePicture;