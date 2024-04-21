const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('User Controller', () => {
  describe('POST /api/users/signup', () => {
    it('should successfully create a new user', async () => {
      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password'
      };

      const response = await request(app)
        .post('/api/users/signup')
        .send(userData)
        .expect(201);

      expect(response.body.message).toEqual('User created successfully');

      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
    });

    it('should return an error if user already exists', async () => {
      const existingUser = new User({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: 'password'
      });
      await existingUser.save();

      const userData = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: 'password'
      };

      const response = await request(app)
        .post('/api/users/signup')
        .send(userData)
        .expect(400);

      expect(response.body.message).toEqual('User already exists');
    });
  });

  describe('POST /api/users/signin', () => {
    it('should successfully sign in an existing user', async () => {
      const response = await request(app)
        .post('/api/users/signin')
        .send({
          email: 'john@example.com',
          password: 'password'
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/signin')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword'
        })
        .catch((err) => {
          // Handle potential errors
          throw err;
        });
      expect(response.status).toBe(401);
    });
  });
});
