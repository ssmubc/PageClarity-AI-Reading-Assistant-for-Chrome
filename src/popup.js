// AI Helper Functions (Hybrid: Chrome AI + Gemini API fallback)

// Gemini API configuration
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent';

// Gemini API fallback function
async function callGeminiAPI(prompt) {
  console.log('=== GEMINI API CALL ===');
  console.log('API Key:', GEMINI_API_KEY.substring(0, 10) + '...');
  console.log('Prompt length:', prompt.length);
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Gemini API key not configured');
  }
  
  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  console.log('Calling URL:', url.substring(0, 80) + '...');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  
  console.log('Response status:', response.status);
  const data = await response.json();
  console.log('Response data:', data);
  
  if (!response.ok) {
    throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
  }
  
  return data.candidates[0].content.parts[0].text;
}

// Summarizer API wrapper (Hybrid)
async function summarizeText(text) {
  console.log('=== SUMMARIZE DEBUG ===');
  console.log('Text length:', text.length);
  
  try {
    // Try Chrome AI first (updated API structure)
    console.log('Checking Chrome AI...');
    if (self.ai && self.ai.summarizer) {
      console.log('Chrome AI available, using it');
      const summarizer = await self.ai.summarizer.create({
        type: 'tl;dr',
        format: 'markdown',
        length: 'medium'
      });
      const summary = await summarizer.summarize(text);
      summarizer.destroy();
      return `[Chrome AI] ${summary}`;
    }
    console.log('Chrome AI not available, trying Gemini...');
    throw new Error('Chrome AI not available');
  } catch (error) {
    console.log('Chrome AI error:', error.message);
    // Fallback to Gemini API
    try {
      console.log('Calling Gemini API...');
      const prompt = `Summarize this text in 3-4 bullet points:\n\n${text}`;
      const summary = await callGeminiAPI(prompt);
      console.log('Gemini API success!');
      return `[Gemini API] ${summary}`;
    } catch (geminiError) {
      console.log('Gemini API error:', geminiError);
      return `[DEMO MODE] Summary of text (${text.length} chars):\n\n• Main topic identified\n• Important details highlighted\n• Concise overview provided\n\n(Configure Gemini API key for real AI)`;
    }
  }
}

// Rewriter API wrapper (Hybrid)
async function rewriteText(text, style = 'plain') {
  try {
    // Try Chrome AI first (updated API structure)
    if (self.ai && self.ai.rewriter) {
      const styleMap = {
        'plain': { tone: 'neutral', format: 'plain' },
        'friendly': { tone: 'casual', format: 'plain' },
        'shorter': { tone: 'neutral', format: 'plain', length: 'shorter' }
      };
      const options = styleMap[style] || styleMap['plain'];
      const rewriter = await self.ai.rewriter.create(options);
      const rewritten = await rewriter.rewrite(text);
      rewriter.destroy();
      return `[Chrome AI] ${rewritten}`;
    }
    throw new Error('Chrome AI not available');
  } catch (error) {
    // Fallback to Gemini API
    try {
      const stylePrompts = {
        'plain': 'Rewrite this text in simple, clear language:',
        'friendly': 'Rewrite this text in a warm, conversational tone:',
        'shorter': 'Rewrite this text to be more concise:'
      };
      const prompt = `${stylePrompts[style]}\n\n${text}`;
      const rewritten = await callGeminiAPI(prompt);
      return `[Gemini API] ${rewritten}`;
    } catch (geminiError) {
      const styleDescriptions = {
        'plain': 'simplified and clear',
        'friendly': 'warm and conversational',
        'shorter': 'concise and brief'
      };
      return `[DEMO MODE] Text rewritten in ${styleDescriptions[style]} style:\n\n${text}\n\n(Configure Gemini API key for real AI)`;
    }
  }
}

// Translator API wrapper (Hybrid)
async function translateText(text, targetLang = 'es') {
  try {
    // Try Chrome AI first (updated API structure)
    if (self.ai && self.ai.translator) {
      const translator = await self.ai.translator.create({
        sourceLanguage: 'en',
        targetLanguage: targetLang
      });
      const translated = await translator.translate(text);
      translator.destroy();
      return `[Chrome AI] ${translated}`;
    }
    throw new Error('Chrome AI not available');
  } catch (error) {
    // Fallback to Gemini API
    try {
      const languageNames = {
        'es': 'Spanish', 'fr': 'French', 'de': 'German',
        'hi': 'Hindi', 'zh': 'Chinese', 'ja': 'Japanese'
      };
      const prompt = `Translate this text to ${languageNames[targetLang] || targetLang}:\n\n${text}`;
      const translated = await callGeminiAPI(prompt);
      return `[Gemini API] ${translated}`;
    } catch (geminiError) {
      const languageNames = {
        'es': 'Spanish', 'fr': 'French', 'de': 'German',
        'hi': 'Hindi', 'zh': 'Chinese', 'ja': 'Japanese'
      };
      return `[DEMO MODE] Translation to ${languageNames[targetLang] || targetLang}:\n\n"${text}"\n\n(Configure Gemini API key for real AI)`;
    }
  }
}

// Proofreader API wrapper (Hybrid)
async function proofreadText(text) {
  try {
    // Try Chrome AI first (updated API structure)
    if (self.ai && self.ai.proofreader) {
      const proofreader = await self.ai.proofreader.create();
      const proofread = await proofreader.proofread(text);
      proofreader.destroy();
      return `[Chrome AI] ${proofread}`;
    }
    throw new Error('Chrome AI not available');
  } catch (error) {
    // Fallback to Gemini API
    try {
      const prompt = `Proofread and correct any grammar, spelling, or punctuation errors in this text:\n\n${text}`;
      const proofread = await callGeminiAPI(prompt);
      return `[Gemini API] ${proofread}`;
    } catch (geminiError) {
      let corrected = text
        .replace(/\bi\b/g, 'I')
        .replace(/\bteh\b/g, 'the')
        .replace(/\brecieve\b/g, 'receive');
      return `[DEMO MODE] Proofread version:\n\n${corrected}\n\n(Configure Gemini API key for real AI)`;
    }
  }
}

// Prompt API wrapper (Hybrid)
async function askPage(context, userPrompt) {
  try {
    // Try Chrome AI first (updated API structure)
    if (self.ai && self.ai.languageModel) {
      const session = await self.ai.languageModel.create({
        temperature: 0.7,
        topK: 3
      });
      const fullPrompt = `Page Context:\nTitle: ${context.title || 'Unknown'}\nContent: ${context.topContent || 'No content'}\n\nUser Question: ${userPrompt}\n\nAnswer based on the page context:`;
      const response = await session.prompt(fullPrompt);
      session.destroy();
      return `[Chrome AI] ${response}`;
    }
    throw new Error('Chrome AI not available');
  } catch (error) {
    // Fallback to Gemini API
    try {
      const fullPrompt = `Based on this webpage context, answer the user's question:\n\nPage Title: ${context.title || 'Unknown'}\nPage Content: ${context.topContent || 'No content available'}\nSelected Text: ${context.selection || 'None'}\n\nUser Question: ${userPrompt}\n\nProvide a helpful answer based on the page context:`;
      const response = await callGeminiAPI(fullPrompt);
      return `[Gemini API] ${response}`;
    } catch (geminiError) {
      return `[DEMO MODE] Answer to "${userPrompt}":\n\nBased on the page "${context.title || 'this page'}", here would be an AI-generated response.\n\n(Configure Gemini API key for real AI)`;
    }
  }
}

let currentRewriteResult = '';
let currentProofreadResult = '';

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.dataset.tab;
    
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
  });
});

// Utility functions
function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.color = isError ? '#d93025' : '#666';
  setTimeout(() => status.textContent = '', 3000);
}

// Simple markdown renderer
function renderMarkdown(text) {
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // **bold**
    .replace(/\*([a-zA-Z][^*]*?)\*/g, '<em>$1</em>')     // *italic* (letters only, no quotes)
    .replace(/### (.*?)$/gm, '<h3>$1</h3>')           // ### headers
    .replace(/## (.*?)$/gm, '<h2>$1</h2>')            // ## headers
    .replace(/# (.*?)$/gm, '<h1>$1</h1>')             // # headers
    .replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>')     // - or * bullet points
    .replace(/\n/g, '<br>');                          // line breaks
  
  // Wrap consecutive <li> elements in <ul>
  formatted = formatted.replace(/(<li>.*?<\/li>(?:<br>)*)+/g, (match) => {
    return '<ul>' + match.replace(/<br>/g, '') + '</ul>';
  });
  
  return formatted;
}

// Display loading indicator
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  element.innerHTML = '<div class="loading">Generating response...</div>';
}

// Display formatted result
function displayResult(elementId, text) {
  const element = document.getElementById(elementId);
  element.innerHTML = renderMarkdown(text);
}

// Copy rich text with formatting to clipboard
async function copyRichText(text) {
  // Clean prefix
  const cleanText = text.replace(/^\[.*?\]\s*/, '');
  
  // Convert to HTML
  const htmlText = renderMarkdown(cleanText);
  
  // Create plain text version
  const plainText = cleanText
    .replace(/\*\*(.*?)\*\*/g, '$1')      // Removes **bold** markers
    .replace(/\*([^*]+?)\*/g, '$1')       // Removes *italic* markers
    .replace(/### (.*?)$/gm, '$1')        // Removes ### headers
    .replace(/## (.*?)$/gm, '$1')         // Removes ## headers
    .replace(/# (.*?)$/gm, '$1')          // Removes # headers
    .replace(/^\s*[-*]\s+/gm, '• ')       // Converts - or * to bullet
    .replace(/\n\n+/g, '\n\n')           // Cleans up extra line breaks
    .trim();
  
  try {
    // Copy both HTML and plain text
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([htmlText], { type: 'text/html' }),
        'text/plain': new Blob([plainText], { type: 'text/plain' })
      })
    ]);
    return true;
  } catch (error) {
    // Fallback to plain text only
    await navigator.clipboard.writeText(plainText);
    return false;
  }
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function getSelectedText() {
  const tab = await getCurrentTab();
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTION' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Content script not ready:', chrome.runtime.lastError.message);
        resolve('');
      } else {
        resolve(response?.text || '');
      }
    });
  });
}

async function getPageContent() {
  const tab = await getCurrentTab();
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_CONTENT' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Content script not ready:', chrome.runtime.lastError.message);
        resolve('');
      } else {
        resolve(response?.text || '');
      }
    });
  });
}

async function replaceInPage(text) {
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, { type: 'REPLACE_IN_INPUT', text }, (response) => {
    if (chrome.runtime.lastError) {
      console.log('Content script not ready:', chrome.runtime.lastError.message);
      showStatus('Please refresh the page and try again', true);
    }
  });
}

// Summary tab
document.getElementById('summarize-page').addEventListener('click', async () => {
  showStatus('Summarizing page...');
  showLoading('summary-output');
  try {
    let content = await getPageContent();
    if (!content) {
      // Fallback: use current tab title and URL as context
      const tab = await getCurrentTab();
      content = `Page: ${tab.title}\nURL: ${tab.url}\n\nContent extraction not available for this page. Please select text manually for better results.`;
    }
    const result = await summarizeText(content);
    displayResult('summary-output', result);
    showStatus('Summary complete');
  } catch (error) {
    displayResult('summary-output', 'Error: ' + error.message);
    showStatus('Error: ' + error.message, true);
  }
});

document.getElementById('summarize-selection').addEventListener('click', async () => {
  showStatus('Summarizing selection...');
  showLoading('summary-output');
  try {
    let selection = await getSelectedText();
    if (!selection) {
      // Fallback: ask user to paste text
      selection = prompt('🔒 For your security, this site restricts text access. Please paste the text you\'d like to summarize:');
      if (!selection) {
        showStatus('No text provided', true);
        return;
      }
    }
    const result = await summarizeText(selection);
    displayResult('summary-output', result);
    showStatus('Summary complete');
  } catch (error) {
    displayResult('summary-output', 'Error: ' + error.message);
    showStatus('Error: ' + error.message, true);
  }
});

// Simplify tab
document.getElementById('rewrite-selection').addEventListener('click', async () => {
  showStatus('Rewriting text...');
  showLoading('rewrite-output');
  try {
    let selection = await getSelectedText();
    if (!selection) {
      selection = prompt('🔒 For your security, this site restricts text access. Please paste the text you\'d like to rewrite:');
      if (!selection) {
        showStatus('No text provided', true);
        return;
      }
    }
    const style = document.getElementById('rewrite-style').value;
    const result = await rewriteText(selection, style);
    currentRewriteResult = result;
    displayResult('rewrite-output', result);
    showStatus('Rewrite complete');
  } catch (error) {
    displayResult('rewrite-output', 'Error: ' + error.message);
    showStatus('Error: ' + error.message, true);
  }
});

document.getElementById('copy-rewrite').addEventListener('click', async () => {
  if (currentRewriteResult) {
    const success = await copyRichText(currentRewriteResult);
    showStatus(success ? 'Copied with formatting!' : 'Copied as plain text');
  }
});

// Translate tab
document.getElementById('translate-selection').addEventListener('click', async () => {
  showStatus('Translating text...');
  showLoading('translate-output');
  try {
    let selection = await getSelectedText();
    if (!selection) {
      selection = prompt('🔒 For your security, this site restricts text access. Please paste the text you\'d like to translate:');
      if (!selection) {
        showStatus('No text provided', true);
        return;
      }
    }
    const targetLang = document.getElementById('target-language').value;
    const result = await translateText(selection, targetLang);
    displayResult('translate-output', `**Original:** ${selection}\n\n**Translated:** ${result}`);
    showStatus('Translation complete');
  } catch (error) {
    displayResult('translate-output', 'Error: ' + error.message);
    showStatus('Error: ' + error.message, true);
  }
});

// Proofread tab
document.getElementById('proofread-selection').addEventListener('click', async () => {
  showStatus('Proofreading text...');
  showLoading('proofread-output');
  try {
    let selection = await getSelectedText();
    if (!selection) {
      selection = prompt('🔒 For your security, this site restricts text access. Please paste the text you\'d like to proofread:');
      if (!selection) {
        showStatus('No text provided', true);
        return;
      }
    }
    const result = await proofreadText(selection);
    currentProofreadResult = result;
    displayResult('proofread-output', `**Original:** ${selection}\n\n**Corrected:** ${result}`);
    showStatus('Proofreading complete');
  } catch (error) {
    displayResult('proofread-output', 'Error: ' + error.message);
    showStatus('Error: ' + error.message, true);
  }
});

document.getElementById('copy-proofread').addEventListener('click', async () => {
  if (currentProofreadResult) {
    const success = await copyRichText(currentProofreadResult);
    showStatus(success ? 'Copied with formatting!' : 'Copied as plain text');
  }
});

// Ask tab
document.getElementById('ask-page').addEventListener('click', async () => {
  const question = document.getElementById('user-question').value.trim();
  if (!question) {
    showStatus('Please enter a question', true);
    return;
  }
  
  showStatus('Getting answer...');
  try {
    const tab = await getCurrentTab();
    let context = await new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_CONTEXT' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Content script not ready:', chrome.runtime.lastError.message);
          resolve(null);
        } else {
          resolve(response || {});
        }
      });
    });
    
    if (!context) {
      // Fallback context when content script unavailable
      context = {
        title: tab.title || 'Unknown Page',
        url: tab.url,
        topContent: 'Content extraction not available for this page. Question will be answered based on page title and URL only.',
        selection: 'None'
      };
    }
    
    showLoading('ask-output');
    const result = await askPage(context, question);
    displayResult('ask-output', result);
    showStatus('Answer complete');
  } catch (error) {
    displayResult('ask-output', 'Error: ' + error.message);
    showStatus('Error: ' + error.message, true);
  }
});