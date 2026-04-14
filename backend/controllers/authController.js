const authService = require('../services/authService');

class AuthController {
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
}

module.exports = new AuthController();