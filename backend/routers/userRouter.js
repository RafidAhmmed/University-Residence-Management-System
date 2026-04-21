const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Routes
router.get('/', auth, admin, userController.getAllUsers);
router.get('/:id', auth, userController.getUser);
router.put('/:id', auth, admin, userController.updateUser);
router.put('/:id/profile', auth, userController.uploadProfilePicture, userController.updateUserProfile);
router.delete('/:id', auth, admin, userController.deleteUser);

module.exports = router;