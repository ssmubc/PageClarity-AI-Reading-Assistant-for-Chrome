// Proofreader API wrapper

export async function proofreadText(text) {
  try {
    // Check if Chrome AI Proofreader API is available
    if (!window.ai || !window.ai.proofreader) {
      throw new Error('Chrome AI Proofreader API not available. Please enable Chrome AI Early Preview.');
    }
    
    // Create proofreader session
    const proofreader = await window.ai.proofreader.create();
    
    // Generate proofread text
    const proofread = await proofreader.proofread(text);
    
    // Clean up
    proofreader.destroy();
    
    return proofread;
  } catch (error) {
    console.error('Proofreading error:', error);
    
    // Fallback for development/testing
    if (error.message.includes('not available')) {
      // Simple demo corrections
      let corrected = text
        .replace(/\bi\b/g, 'I')
        .replace(/\bteh\b/g, 'the')
        .replace(/\brecieve\b/g, 'receive')
        .replace(/\byour\b(?=\s+(welcome|right))/g, "you're")
        .replace(/\bits\b(?=\s+(a|an|the))/g, "it's");
      
      return `[DEMO MODE] Proofread version:\n\n${corrected}\n\n(This is a placeholder with basic corrections. The actual Chrome AI Proofreader API will provide comprehensive proofreading when available.)`;
    }
    
    throw error;
  }
}