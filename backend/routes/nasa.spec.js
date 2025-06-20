// colocated test for nasa.js
const request = require('supertest');
const express = require('express');
const nasaRouter = require('./nasa');

jest.mock('axios');
const axios = require('axios');

describe('NASA Router', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', nasaRouter);
  });

  it('returns APOD data', async () => {
    axios.get.mockResolvedValueOnce({ data: { title: 'APOD', url: 'http://apod.jpg' } });
    const res = await request(app).get('/api/apod');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('APOD');
  });

  it('returns Mars Rover photos', async () => {
    axios.get.mockResolvedValueOnce({ data: { photos: [{ id: 1, img_src: 'img.jpg' }] } });
    const res = await request(app).get('/api/mars-photos');
    expect(res.status).toBe(200);
    expect(res.body.photos.length).toBe(1);
  });

  it('returns NEO feed', async () => {
    axios.get.mockResolvedValueOnce({ data: { near_earth_objects: [] } });
    const res = await request(app).get('/api/neo');
    expect(res.status).toBe(200);
    expect(res.body.near_earth_objects).toBeDefined();
  });

  it('handles NASA API error', async () => {
    axios.get.mockRejectedValueOnce(new Error('fail'));
    const res = await request(app).get('/api/apod');
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Failed to fetch/);
  });
});
