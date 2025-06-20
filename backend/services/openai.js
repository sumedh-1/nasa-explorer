const axios = require('axios');

module.exports = async function summarizeWithOpenAI(text, apiKey) {
  if (!apiKey) throw new Error('Missing OpenAI API key');
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Summarize the following astronomy explanation in 2-3 sentences.' },
        { role: 'user', content: text }
      ],
      max_tokens: 100
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.choices[0].message.content.trim();
};
