const axios = require('axios');

module.exports = async function summarizeWithOllama(text) {
  // Assumes Ollama is running locally with a model like llama3 or mistral
  const response = await axios.post(
    'http://localhost:11434/api/generate',
    {
      model: 'llama3',
      prompt: `Summarize the following astronomy explanation in 2-3 sentences:\n${text}`,
      stream: false
    }
  );
  return response.data.response.trim();
};
