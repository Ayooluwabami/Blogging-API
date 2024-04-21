const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.secretKey, { expiresIn: '1h' });
};

module.exports = {
  generateToken
};
