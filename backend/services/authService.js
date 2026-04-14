const userService = require('./userService');

class AuthService {
  async register(userData) {
    const user = await userService.createUser(userData);
    return user;
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