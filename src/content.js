// Content script for PageClarity extension

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_SELECTION':
      handleGetSelection(sendResponse);
      break;
    case 'GET_PAGE_CONTENT':
      handleGetPageContent(sendResponse);
      break;
    case 'GET_PAGE_CONTEXT':
      handleGetPageContext(sendResponse);
      break;
    case 'REPLACE_IN_INPUT':
      handleReplaceInInput(message.text);
      sendResponse({ success: true });
      break;
  }
  return true; // Keep message channel open for async response
});

function handleGetSelection(sendResponse) {
  const selection = window.getSelection().toString().trim();
  sendResponse({ text: selection });
}

function handleGetPageContent(sendResponse) {
  let content = '';
  
  // Try to get main article content first
  const article = document.querySelector('article');
  if (article) {
    content = article.innerText;
  } else {
    // Fallback to common content selectors
    const selectors = [
      'main',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        content = element.innerText;
        break;
      }
    }
    
    // Final fallback to body text (filtered)
    if (!content) {
      content = document.body.innerText;
      // Remove navigation, footer, sidebar content
      content = content.replace(/^.*?(Navigation|Menu|Header).*$/gim, '');
      content = content.replace(/^.*?(Footer|Copyright|©).*$/gim, '');
    }
  }
  
  // Clean up the content
  content = content.replace(/\s+/g, ' ').trim();
  
  // Limit content length for API calls
  if (content.length > 10000) {
    content = content.substring(0, 10000) + '...';
  }
  
  sendResponse({ text: content });
}

function handleGetPageContext(sendResponse) {
  const title = document.title;
  const url = window.location.href;
  const selection = window.getSelection().toString().trim();
  
  // Get first few paragraphs as context
  const paragraphs = Array.from(document.querySelectorAll('p'))
    .slice(0, 3)
    .map(p => p.innerText.trim())
    .filter(text => text.length > 50)
    .join('\n\n');
  
  const context = {
    title,
    url,
    selection,
    topContent: paragraphs.substring(0, 2000)
  };
  
  sendResponse(context);
}

function handleReplaceInInput(newText) {
  // Find the currently focused input element
  let activeElement = document.activeElement;
  
  // If no active element, try to find the most recently focused input
  if (!activeElement || (activeElement.tagName !== 'TEXTAREA' && activeElement.tagName !== 'INPUT' && !activeElement.contentEditable)) {
    // Look for common input selectors
    const inputSelectors = [
      'textarea:focus',
      'input[type="text"]:focus',
      '[contenteditable="true"]:focus',
      'textarea',
      'input[type="text"]',
      '[contenteditable="true"]'
    ];
    
    for (const selector of inputSelectors) {
      activeElement = document.querySelector(selector);
      if (activeElement) break;
    }
  }
  
  if (activeElement) {
    if (activeElement.contentEditable === 'true') {
      // Handle contenteditable elements
      activeElement.innerText = newText;
    } else {
      // Handle input/textarea elements
      activeElement.value = newText;
      
      // Trigger input event to notify any listeners
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Focus the element
    activeElement.focus();
  }
}