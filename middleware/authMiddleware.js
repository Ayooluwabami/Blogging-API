const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Joi = require('joi');

// Define the Joi validation schema for the authentication token
const authTokenSchema = Joi.object({
  token: Joi.string().required()
});

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization').split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, config.secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};
