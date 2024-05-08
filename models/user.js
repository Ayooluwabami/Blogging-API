const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,

  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

// Define Joi validation schema for user creation
const userValidationSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Function to validate user data using Joi
const validateUser = (userData) => {
  return userValidationSchema.validate(userData);
};

module.exports = {
  User,
  validateUser
};
