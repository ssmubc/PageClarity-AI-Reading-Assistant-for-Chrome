// Translator API wrapper

export async function translateText(text, targetLang = 'es') {
  try {
    // Check if Chrome AI Translator API is available
    if (!window.ai || !window.ai.translator) {
      throw new Error('Chrome AI Translator API not available. Please enable Chrome AI Early Preview.');
    }
    
    // Create translator session
    const translator = await window.ai.translator.create({
      sourceLanguage: 'en',
      targetLanguage: targetLang
    });
    
    // Generate translation
    const translated = await translator.translate(text);
    
    // Clean up
    translator.destroy();
    
    return translated;
  } catch (error) {
    console.error('Translation error:', error);
    
    // Fallback for development/testing
    if (error.message.includes('not available')) {
      const languageNames = {
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'hi': 'Hindi',
        'zh': 'Chinese',
        'ja': 'Japanese'
      };
      
      return `[DEMO MODE] Translation to ${languageNames[targetLang] || targetLang}:\n\n"${text}"\n\n(This is a placeholder. The actual Chrome AI Translator API will provide real translations when available.)`;
    }
    
    throw error;
  }
}