const Blog = require('../models/blog');
const Joi = require('joi');

// Joi validation schema for createBlog endpoint
const createBlogSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  state: Joi.string().valid('draft', 'published').optional(),
  body: Joi.string().required()
});

// Function to calculate reading time based on content length
function calculateReadingTime(body) {
  // Assume average reading speed of 200 words per minute
  const wordsPerMinute = 200;
  // Calculate number of words in content
  const wordCount = body.split(/\s+/).length;
  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { error } = createBlogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, tags, state, body } = req.body;
    const { userId: author } = req.user;
    const timestamp = new Date();
    const read_count = 0; // Initial read count
    const reading_time = calculateReadingTime(body);

    const newBlog = new Blog({ title, description, tags, author, timestamp, state, read_count, reading_time, body });
    await newBlog.save();

    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, body, state } = req.body;
    const { userId: author } = req.user;

    const updatedBlog = await Blog.findOneAndUpdate({ _id: id, author }, { title, description, body, state }, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId: author } = req.user;

    const deletedBlog = await Blog.findOneAndUpdate({ _id: id, author }, { deleted: true });
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single blog by ID
exports.getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOneAndUpdate({ _id: id, deleted: false }, { $inc: { read_count: 1 } }, { new: true })
      .populate('author', { _id: 1, first_name: 1, last_name: 1, email: 1 });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a list of blogs
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, author, title, tags, orderBy } = req.query;
    const query = { deleted: false };
  
    if (author) {
      query.author = author;
    }
    if (title) {
      query.title = { $regex: title, $options: 'i' }; 
    }
    if (tags) {
      query.tags = { $in: tags.split(',') }; 
    }

    let sortOptions = { timestamp: 'desc' }; 

    if (orderBy) {
      switch (orderBy) {
        case 'read_count':
          sortOptions = { read_count: 'desc' };
          break;
        case 'reading_time':
          sortOptions = { reading_time: 'asc' }; 
          order
          break;
        case 'timestamp':
          sortOptions = { timestamp: 'desc' };
          break;
        default:
          break;
      }
    }

    const totalBlogs = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      blogs,
      meta: {
        total: totalBlogs,
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(totalBlogs / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get blogs authored by the current user
exports.getMyBlogs = async (req, res) => {
  try {
    const { userId: author } = req.user;
    const { state, page, limit, orderBy } = req.query;
    const _limit = Number(limit) || 20;
    const _page = Number(page) || 1;

    const order = orderBy
      ? orderBy
      : { timestamp: 'desc' }

    const query = {
      author,
      deleted: false,
    }

    if (state) {
      Object.assign(query, {
        state
      }) 
    }
    const blogs = await Blog.find(query)
      .skip((_page - 1) * _limit || 0)
      .sort(order)
      .limit(_limit);
    
    const total = await Blog.countDocuments(query);

    res.json({ blogs, meta: {
      total,
      limit: _limit,
      page: _page,
      totalPage: Math.ceil(total / _limit)
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
