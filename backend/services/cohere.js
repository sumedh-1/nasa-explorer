const axios = require('axios');

// Cohere API summarization (free tier available, requires API key)
module.exports = async function summarizeWithCohere(text, apiKey) {
  if (!apiKey) throw new Error('Missing Cohere API key');
  const response = await axios.post(
    'https://api.cohere.ai/v1/summarize',
    {
      text,
      length: 'medium',
      format: 'paragraph',
      model: 'command',
      additional_command: '',
      temperature: 0.3
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    }
  );
  if (response.data && response.data.summary) {
    return response.data.summary;
  }
  throw new Error('Cohere summarization failed');
};
