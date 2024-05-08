const mongoose = require('mongoose');
const Joi = require('joi');

const blogSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,

  title: {
    type: String,
    required: true,
    unique: true,
    index: true 
  },
  description: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true 
  },
  state: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  read_count: {
    type: Number,
    default: 0
  },
  reading_time: {
    type: Number,
    min: 40 
  },
  tags: [String],
  body: {
    type: String,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', blogSchema);

// Define Joi validation schema for blog creation
const blogValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  author: Joi.string().required(), // Assuming author ID is a string
  state: Joi.string().valid('draft', 'published').default('draft'),
  read_count: Joi.number().default(0),
  reading_time: Joi.number().min(40),
  tags: Joi.array().items(Joi.string()),
  body: Joi.string().required(),
  deleted: Joi.boolean().default(false),
  timestamp: Joi.date().default(Date.now)
});

// Function to validate blog data using Joi
const validateBlog = (blogData) => {
  return blogValidationSchema.validate(blogData);
};

module.exports = {
  Blog,
  validateBlog
};