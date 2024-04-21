const mongoose = require('mongoose');

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

module.exports = Blog;
