const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const primaryModel = decoded.role === 'admin' ? Admin : User;
    const fallbackModel = decoded.role === 'admin' ? User : Admin;
    const user = await primaryModel.findById(decoded.id) || await fallbackModel.findById(decoded.id);
    if (!user || !user.tokens.includes(token)) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;