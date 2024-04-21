const crypto = require('crypto');

// Generate a random string of bytes
const generateSecretKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate a secret key with a specific length (e.g., 32 bytes for a 256-bit key)
const secretKey = generateSecretKey(32);
console.log('Generated Secret Key:', secretKey);
