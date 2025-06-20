// colocated test for ai.js
const request = require('supertest');
const express = require('express');
const aiRouter = require('./ai');

describe('AI Router', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/ai', aiRouter);
  });

  it('rejects invalid summarize requests', async () => {
    const res = await request(app)
      .post('/api/ai/summarize')
      .send({ text: 'short' }); // too short
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('rejects unknown provider', async () => {
    const res = await request(app)
      .post('/api/ai/summarize')
      .send({ text: 'This is a long enough text for summarization.', provider: 'notreal' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('rate limits excessive requests', async () => {
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post('/api/ai/summarize')
        .send({ text: 'This is a long enough text for summarization.', provider: 'openai' });
    }
    const res = await request(app)
      .post('/api/ai/summarize')
      .send({ text: 'This is a long enough text for summarization.', provider: 'openai' });
    expect(res.status).toBe(429);
    expect(res.body.error).toMatch(/Too many requests/i);
  });
});
