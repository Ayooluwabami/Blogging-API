const Joi = require('joi');

// Define Joi schema for creating a new blog
const createBlogSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  author: Joi.string().optional()
});

// Define Joi schema for updating an existing blog
const updateBlogSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

module.exports = {
  createBlogSchema,
  updateBlogSchema
};
