const openaiSummarize = require('./openai');
const geminiSummarize = require('./gemini');
const ollamaSummarize = require('./ollama');
const huggingfaceSummarize = require('./huggingface');
const cohereSummarize = require('./cohere');

const providers = {
  openai: openaiSummarize,
  gemini: geminiSummarize,
  ollama: ollamaSummarize,
  huggingface: huggingfaceSummarize,
  cohere: cohereSummarize,
};

module.exports = (provider) => providers[provider];
