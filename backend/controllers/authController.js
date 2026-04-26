const authService = require('../services/authService');

class AuthController {
  async getRegisterOptions(req, res) {
    try {
      const options = await authService.getRegisterOptions();
      res.json(options);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async requestRegisterOtp(req, res) {
    try {
      await authService.requestRegistrationOtp(req.body);
      res.json({ message: 'OTP sent to email for registration verification' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async verifyRegisterOtp(req, res) {
    try {
      const { email, otp } = req.body;
      const user = await authService.verifyRegistrationOtp(email, otp);
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).json({ message: 'Registration successful', user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { studentId, password } = req.body;
      const result = await authService.login(studentId, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req, res) {
    try {
      await authService.logout(req.user.id, req.token);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async requestPasswordResetOtp(req, res) {
    try {
      const { email } = req.body;
      await authService.requestPasswordResetOtp(email);
      res.json({ message: 'Password reset OTP sent to email' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async verifyPasswordResetOtp(req, res) {
    try {
      const { email, otp } = req.body;
      await authService.verifyPasswordResetOtp(email, otp);
      res.json({ message: 'OTP verified successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;
      await authService.resetPasswordWithOtp(email, otp, newPassword);
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();