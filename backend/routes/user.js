const express = require('express');
const router = express.Router();

// In-memory cache for demonstration (replace with Redis, etc. for real caching)
const cache = {
  favorites: {}, // { userId: [favoriteIds] }
  preferences: {}, // { userId: { theme: 'dark', ... } }
};

// --- FAVORITES API ---
// Each favorite is stored by category: 'mars', 'neo', 'apod', etc.
// GET /favorites?category=mars
router.get('/favorites', (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'Missing category (e.g., mars, neo, apod)' });
  }
  const favorites = cache.favorites[category] || [];
  res.json({ category, favorites });
});

// POST /favorites { category, favorites: [...] }
router.post('/favorites', (req, res) => {
  const { category, favorites } = req.body;
  if (!category) {
    return res.status(400).json({ error: 'Missing category (e.g., mars, neo, apod)' });
  }
  if (!Array.isArray(favorites)) {
    return res.status(400).json({ error: 'Favorites must be an array' });
  }
  cache.favorites[category] = favorites;
  res.json({ category, favorites });
});

// --- USER PREFERENCES API ---
// Get preferences (global)
router.get('/preferences', (req, res) => {
  const preferences = cache.preferences['default'] || { theme: 'light' };
  res.json({ preferences });
});

// Set preferences (global)
router.post('/preferences', (req, res) => {
  const { preferences } = req.body;
  if (!preferences || typeof preferences !== 'object') {
    return res.status(400).json({ error: 'Preferences must be an object' });
  }
  cache.preferences['default'] = preferences;
  res.json({ preferences });
});

module.exports = router;
