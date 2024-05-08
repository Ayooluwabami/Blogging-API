require('dotenv').config();
const express = require('express');
const winston = require('winston');
const mongoose = require('mongoose');
const config = require('./config/config');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const { createBlogSchema } = require('./validators/blogValidator'); 

// Define the Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

const app = express();

// Connect to MongoDB
mongoose.connect(config.databaseURI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error);
  });

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    logger.info(`${req.method} ${req.url} - ${res.statusCode} - ${responseTime}ms`);
  });
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Define route for the root path ("/")
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Route for creating a new blog with Joi validation
app.post('/api/blogs', (req, res, next) => {
  const { error } = createBlogSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next(); // Proceed to the next middleware if validation passes
}, (req, res) => {
  // Handle creating a new blog
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;