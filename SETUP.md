# PageClarity API Configuration

This guide will help you set up PageClarity to use real AI functionality. After following these steps, your extension will provide intelligent summaries, translations, and text improvements using Google's Gemini AI.

## Prerequisites

- PageClarity extension installed in Chrome
- Google account for API access

## API Key Setup

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### 2. Configure Extension

**Update API key in both files:**

1. **Copy the configuration template**:
   ```bash
   cp src/config.example.js src/config.js
   ```
   (On Windows, you can also copy the file manually in File Explorer)

2. **Edit config.js**:
   - Open `src/config.js` in any text editor (Notepad, VS Code, etc.)
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
   ```javascript
   const GEMINI_API_KEY = 'your-actual-api-key-here';
   ```

3. **Edit popup.js**:
   - Open `src/popup.js` in any text editor (Notepad, VS Code, etc.)
   - Find line 4: `const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';`
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key

4. **Save both files**

### 3. Reload Extension

1. Go to `chrome://extensions/`
2. Click the reload button on PageClarity
3. Test on any webpage

## Verification

After setup, you should see these response prefixes:
- `[Chrome AI] ...` - Chrome's built-in AI (requires Chrome Canary + special flags)
- `[Gemini API] ...` - **Normal operation** - Gemini 2.5 Pro providing real AI functionality
- `[DEMO MODE] ...` - No API key configured

**Expected Result**: You will typically see `[Gemini API]` responses, which is perfect - this means your extension is working with real AI.

## API Limits

- **Free tier**: 15 requests per minute
- **Cost**: Free for moderate usage
- **Rate limiting**: Automatic handling in extension

## Troubleshooting

- **Only seeing `[DEMO MODE]`**: Check API key in `src/config.js`
- **No responses**: Verify API key is correct and internet connection
- **Rate limits**: Wait a minute and try again
- **Not seeing `[Chrome AI]`**: This is normal - Chrome AI requires specific Chrome versions and flags

**Note**: Chrome AI is still in Early Preview. Gemini API responses indicate your extension is working perfectly.

For detailed installation instructions, see [README.md](README.md).