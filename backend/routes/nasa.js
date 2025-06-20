const express = require('express');
const axios = require('axios');
const router = express.Router();
const logger = require('../logger');

const NASA_API_KEY = process.env.NASA_API_KEY || "NuqugVhk76z5JGvZ0VvsPlRVlCrk28bqj5rPyVHY";

// Astronomy Picture of the Day (APOD)
router.get('/apod', async (req, res) => {
  logger.info('GET /api/apod called');
  try {
    const response = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: { api_key: NASA_API_KEY }
    });
    logger.info('APOD data fetched successfully');
    res.json(response.data);
  } catch (error) {
    logger.error(`APOD fetch failed: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch APOD from NASA' });
  }
});

// Mars Rover Photos (latest Curiosity photos)
router.get('/mars-photos', async (req, res) => {
  const sol = req.query.sol || 1000;
  logger.info(`GET /api/mars-photos called (sol=${sol})`);
  try {
    const response = await axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos', {
      params: {
        api_key: NASA_API_KEY,
        sol: sol,
        page: 1
      }
    });
    logger.info('Mars Rover photos fetched successfully');
    res.json(response.data);
  } catch (error) {
    logger.error(`Mars Rover photos fetch failed: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch Mars rover photos from NASA' });
  }
});

// Near Earth Object feed (today)
router.get('/neo', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  logger.info(`GET /api/neo called (date=${today})`);
  try {
    const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed', {
      params: {
        api_key: NASA_API_KEY,
        start_date: today,
        end_date: today
      }
    });
    logger.info('NEO feed fetched successfully');
    res.json(response.data);
  } catch (error) {
    logger.error(`NEO feed fetch failed: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch Near Earth Objects from NASA' });
  }
});

module.exports = router;
