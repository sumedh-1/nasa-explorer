const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const getProvider = require('../services/aiProviderFactory');
const logger = require('../logger');

// Rate limiter: 10 requests/min per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' }
});

// POST /api/ai/summarize
// Body: { text: string, provider?: 'openai'|'gemini'|'ollama'|'huggingface'|'cohere' }
router.post(
  '/summarize',
  limiter,
  body('text').isString().isLength({ min: 10, max: 4000 }),
  body('provider').optional().isIn(['openai', 'gemini', 'ollama', 'huggingface', 'cohere']),
  async (req, res) => {
    const errors = validationResult(req);
    console.log('[AI SUMMARY] Request body:', req.body);
    if (!errors.isEmpty()) {
      console.error('[AI SUMMARY] Validation failed:', errors.array());
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    const { text, provider = 'openai' } = req.body;
    const summarize = getProvider(provider);
    if (!summarize) {
      console.error(`[AI SUMMARY] Unknown provider: ${provider}`);
      return res.status(400).json({ error: 'Unknown provider' });
    }
    try {
      const apiKey = process.env[`${provider.toUpperCase()}_API_KEY`];
      const summary = await summarize(text, apiKey);
      console.log(`[AI SUMMARY] Provider: ${provider}, Summary:`, summary);
      res.json({ summary });
    } catch (err) {
      logger && logger.error ? logger.error(err) : console.error('[AI SUMMARY] Error:', err);
      res.status(500).json({ error: 'Failed to summarize', details: err.message });
    }
  }
);

module.exports = router;
