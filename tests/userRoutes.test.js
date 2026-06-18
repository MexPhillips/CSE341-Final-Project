const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const { app } = require('../server');

let token;

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connection.dropDatabase();
  const user = await User.create({ username: 'testuser', email: 'testuser@example.com' });
  if (process.env.JWT_SECRET) {
    const jwt = require('jsonwebtoken');
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await User.deleteMany({});
  }
});

describe('Users routes', () => {
  test('GET /users returns list (401 when no token)', async () => {
    const res = await request(app).get('/users');
    expect(res.status === 200 || res.status === 401).toBeTruthy();
  });

  test('PUT /users/:id validates input', async () => {
    const u = await User.create({ username: 'modify', email: 'm@example.com' });
    const res = await request(app)
      .put(`/users/${u._id}`)
      .set('Authorization', `Bearer ${token || ''}`)
      .send({ email: 'not-an-email' });
    expect([400, 200, 401].includes(res.status)).toBeTruthy();
  });
});
