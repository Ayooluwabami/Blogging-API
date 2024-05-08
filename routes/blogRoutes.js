const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const Blog = require('../models/blog');
const blogController = require('../controllers/blogController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { createBlogSchema, updateBlogSchema } = require('../validators/blogValidator'); 

// Middleware for logging route access
router.use((req, res, next) => {
  logger.info(`Accessing ${req.method} ${req.originalUrl}`);
  next();
});

// Route for fetching list of blogs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, author, title, tags, orderBy } = req.query;
    const query = { deleted: false };
    // Construct query based on request parameters
    // Fetch blogs from database and send response
  } catch (error) {
    logger.error('Error fetching list of blogs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for fetching a single blog by ID
router.get('/:id', blogController.getBlog);

// Protected routes requiring authentication
router.use(authenticateToken);

// Route for fetching user's own blogs
router.get('/my-blogs', authenticateToken, blogController.getMyBlogs);

// Route for creating a new blog
router.post('/', (req, res, next) => {
  const { error } = createBlogSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    // Call the createBlog function from the controller
    blogController.createBlog(req, res);
  }
});

// Route for updating a blog by ID
router.put('/:id', authenticateToken, (req, res, next) => {
  const { error } = updateBlogSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    // Call the updateBlog function from the controller
    blogController.updateBlog(req, res);
  }
});

// Route for deleting a blog by ID
router.delete('/:id', authenticateToken, blogController.deleteBlog);

module.exports = router;
