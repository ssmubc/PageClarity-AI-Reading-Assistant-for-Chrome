// Summarizer API wrapper

export async function summarizeText(text) {
  try {
    // Check if Chrome AI Summarizer API is available
    if (!window.ai || !window.ai.summarizer) {
      throw new Error('Chrome AI Summarizer API not available. Please enable Chrome AI Early Preview.');
    }
    
    // Create summarizer session
    const summarizer = await window.ai.summarizer.create({
      type: 'tl;dr',
      format: 'markdown',
      length: 'medium'
    });
    
    // Generate summary
    const summary = await summarizer.summarize(text);
    
    // Clean up
    summarizer.destroy();
    
    return summary;
  } catch (error) {
    console.error('Summarization error:', error);
    
    // Fallback for development/testing
    if (error.message.includes('not available')) {
      return `[DEMO MODE] Summary of text (${text.length} chars):\n\nThis is a simulated summary. The actual Chrome AI Summarizer API will provide real summaries when available.\n\nKey points:\n• Main topic identified\n• Important details extracted\n• Concise overview provided`;
    }
    
    throw error;
  }
}