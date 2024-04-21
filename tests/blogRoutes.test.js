const request = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

describe('Blog Routes', () => {
  beforeEach(async () => {
    // Insert test data into the database before each test
    await Blog.create({ title: 'Test Blog 1', body: 'Test body 1' });
    await Blog.create({ title: 'Test Blog 2', body: 'Test body 2' });
  });

  describe('GET /api/blogs', () => {
    it('should fetch a list of blogs', async () => {
      const response = await request(app)
        .get('/api/blogs')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0].title).toBe('Test Blog 1');
      expect(response.body[1].title).toBe('Test Blog 2');
    });
  });

  describe('POST /api/blogs', () => {
    it('should create a new blog', async () => {
      const newBlogData = {
        title: 'New Test Blog',
        body: 'New test body content'
      };

      const response = await request(app)
        .post('/api/blogs')
        .send(newBlogData)
        .expect(201);

      expect(response.body.title).toBe('New Test Blog');

      const newBlog = await Blog.findOne({ title: 'New Test Blog' });
      expect(newBlog).toBeTruthy();
      expect(newBlog.body).toBe('New test body content');
    });
  });

  describe('PUT /api/blogs/:id', () => {
    it('should update an existing blog', async () => {
      const blogToUpdate = await Blog.findOne({ title: 'Test Blog 1' });

      const updatedBlogData = {
        title: 'Updated Test Blog',
        body: 'Updated test body content'
      };

      const response = await request(app)
        .put(`/api/blogs/${blogToUpdate._id}`)
        .send(updatedBlogData)
        .expect(200);

      expect(response.body.title).toBe('Updated Test Blog');

      const updatedBlog = await Blog.findById(blogToUpdate._id);
      expect(updatedBlog).toBeTruthy();
      expect(updatedBlog.title).toBe('Updated Test Blog');
      expect(updatedBlog.body).toBe('Updated test body content');
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    it('should delete an existing blog', async () => {
      const blogToDelete = await Blog.findOne({ title: 'Test Blog 2' });

      await request(app)
        .delete(`/api/blogs/${blogToDelete._id}`)
        .expect(204);

      const deletedBlog = await Blog.findById(blogToDelete._id);
      expect(deletedBlog).toBeNull();
    });
  });

  describe('GET /api/blogs/:id', () => {
    it('should fetch a single blog by ID', async () => {
      const blogToFetch = await Blog.findOne({ title: 'Test Blog 1' });

      const response = await request(app)
        .get(`/api/blogs/${blogToFetch._id}`)
        .expect(200);

      expect(response.body.title).toBe('Test Blog 1');
      expect(response.body.body).toBe('Test body 1');
    });

    it('should return 404 if blog ID is invalid', async () => {
      await request(app)
        .get('/api/blogs/invalid-id')
        .expect(404);
    });
  });
});
