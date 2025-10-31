// Rewriter API wrapper

export async function rewriteText(text, style = 'plain') {
  try {
    // Check if Chrome AI Rewriter API is available
    if (!window.ai || !window.ai.rewriter) {
      throw new Error('Chrome AI Rewriter API not available. Please enable Chrome AI Early Preview.');
    }
    
    // Map style options to API parameters
    const styleMap = {
      'plain': { tone: 'neutral', format: 'plain' },
      'friendly': { tone: 'casual', format: 'plain' },
      'shorter': { tone: 'neutral', format: 'plain', length: 'shorter' }
    };
    
    const options = styleMap[style] || styleMap['plain'];
    
    // Create rewriter session
    const rewriter = await window.ai.rewriter.create(options);
    
    // Generate rewritten text
    const rewritten = await rewriter.rewrite(text);
    
    // Clean up
    rewriter.destroy();
    
    return rewritten;
  } catch (error) {
    console.error('Rewriting error:', error);
    
    // Fallback for development/testing
    if (error.message.includes('not available')) {
      const styleDescriptions = {
        'plain': 'simplified and clear',
        'friendly': 'warm and conversational',
        'shorter': 'concise and brief'
      };
      
      return `[DEMO MODE] Text rewritten in ${styleDescriptions[style]} style:\n\n${text}\n\n(This is a placeholder. The actual Chrome AI Rewriter API will provide real rewrites when available.)`;
    }
    
    throw error;
  }
}