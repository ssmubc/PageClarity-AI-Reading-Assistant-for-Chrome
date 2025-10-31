// Service worker for PageClarity extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('PageClarity extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // The popup will open automatically due to manifest configuration
  console.log('Extension icon clicked on tab:', tab.url);
});

// Optional: Handle messages between popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // This can be used for coordinating between popup and content scripts if needed
  console.log('Service worker received message:', message);
  return true;
});