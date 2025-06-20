const axios = require('axios');

// Hugging Face Inference API summarization (free tier available, requires API key)
module.exports = async function summarizeWithHuggingFace(text, apiKey) {
  if (!apiKey) throw new Error('Missing Hugging Face API key');
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
    { inputs: text },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  if (response.data && Array.isArray(response.data) && response.data[0].summary_text) {
    return response.data[0].summary_text;
  }
  throw new Error('Hugging Face summarization failed');
};
