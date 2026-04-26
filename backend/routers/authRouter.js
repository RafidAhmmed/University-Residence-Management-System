const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/register/options', authController.getRegisterOptions);
router.post('/register/request-otp', authController.requestRegisterOtp);
router.post('/register/verify-otp', authController.verifyRegisterOtp);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.post('/password/request-otp', authController.requestPasswordResetOtp);
router.post('/password/verify-otp', authController.verifyPasswordResetOtp);
router.post('/password/reset', authController.resetPassword);
router.post('/password/change', auth, authController.changePassword);

module.exports = router;