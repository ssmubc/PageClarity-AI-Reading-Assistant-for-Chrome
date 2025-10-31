// Configuration for PageClarity Extension
// Copy this file to config.js and add your actual API key

// Gemini API Configuration
// Get your free API key from: https://aistudio.google.com/app/apikey
const CONFIG = {
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}