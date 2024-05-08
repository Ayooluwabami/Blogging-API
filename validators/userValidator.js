const Joi = require('joi');

// Define Joi schema for user signup
const signupSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Define Joi schema for user signin
const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  signupSchema,
  signinSchema
};
