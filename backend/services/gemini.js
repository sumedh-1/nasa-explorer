const axios = require('axios');

// Gemini-pro summarization
module.exports = async function summarizeWithGemini(text, apiKey) {
  if (!apiKey) throw new Error('Missing Gemini API key');
  // See Google AI Studio for up-to-date endpoint and model
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      contents: [
        { parts: [ { text: `Summarize the following astronomy explanation in 2-3 sentences.\n${text}` } ] }
      ]
    }
  );
  if (response.data && response.data.candidates && response.data.candidates[0].content && response.data.candidates[0].content.parts[0].text) {
    return response.data.candidates[0].content.parts[0].text.trim();
  }
  throw new Error('Gemini summarization failed');
};
