// Prompt API wrapper

export async function askPage(context, userPrompt) {
  try {
    // Check if Chrome AI Prompt API is available
    if (!window.ai || !window.ai.languageModel) {
      throw new Error('Chrome AI Prompt API not available. Please enable Chrome AI Early Preview.');
    }
    
    // Create language model session
    const session = await window.ai.languageModel.create({
      temperature: 0.7,
      topK: 3
    });
    
    // Construct the full prompt with context
    const fullPrompt = `
Page Context:
Title: ${context.title || 'Unknown'}
URL: ${context.url || 'Unknown'}
Selected Text: ${context.selection || 'None'}
Page Content: ${context.topContent || 'No content available'}

User Question: ${userPrompt}

Please answer the user's question based on the page context provided above. Be concise and helpful.
`;
    
    // Generate response
    const response = await session.prompt(fullPrompt);
    
    // Clean up
    session.destroy();
    
    return response;
  } catch (error) {
    console.error('Prompt API error:', error);
    
    // Fallback for development/testing
    if (error.message.includes('not available')) {
      return `[DEMO MODE] Answer to "${userPrompt}":\n\nBased on the page "${context.title || 'this page'}", here would be an AI-generated response to your question.\n\nThe actual Chrome AI Prompt API will provide intelligent answers when available.\n\nPage context received:\n- Title: ${context.title || 'N/A'}\n- Has selection: ${context.selection ? 'Yes' : 'No'}\n- Content length: ${context.topContent?.length || 0} chars`;
    }
    
    throw error;
  }
}