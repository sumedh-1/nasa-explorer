// colocated test for user.js
const request = require('supertest');
const express = require('express');
const userRouter = require('./user');

describe('User Router', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/user', userRouter);
  });

  it('gets and sets favorites', async () => {
    let res = await request(app).get('/api/user/favorites?category=mars');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.favorites)).toBe(true);
    res = await request(app)
      .post('/api/user/favorites')
      .send({ category: 'mars', favorites: [1, 2] });
    expect(res.status).toBe(200);
    expect(res.body.favorites).toEqual([1, 2]);
  });

  it('rejects missing category or invalid favorites', async () => {
    let res = await request(app).post('/api/user/favorites').send({ favorites: [1] });
    expect(res.status).toBe(400);
    res = await request(app).post('/api/user/favorites').send({ category: 'mars', favorites: 'notarray' });
    expect(res.status).toBe(400);
  });

  it('gets and sets preferences', async () => {
    let res = await request(app).get('/api/user/preferences');
    expect(res.status).toBe(200);
    expect(res.body.preferences).toBeDefined();
    res = await request(app)
      .post('/api/user/preferences')
      .send({ preferences: { theme: 'dark' } });
    expect(res.status).toBe(200);
    expect(res.body.preferences.theme).toBe('dark');
  });

  it('rejects invalid preferences', async () => {
    const res = await request(app)
      .post('/api/user/preferences')
      .send({ preferences: 'notanobject' });
    expect(res.status).toBe(400);
  });
});
