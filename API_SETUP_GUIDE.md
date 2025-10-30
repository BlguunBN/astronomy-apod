# API Setup Guide for Your Astronomy Picture App

## Quick Start with Your Custom API

### Step 1: Update API Configuration

Edit the `config.js` file to use your custom API:

```javascript
// In config.js, update the 'custom' configuration:
custom: {
    baseUrl: 'https://your-api-endpoint.com/pictures',
    apiKey: 'your-actual-api-key',
    dateParam: 'date',          // Parameter name your API expects for date
    apiKeyParam: 'api_key',     // Parameter name your API expects for API key
    
    // Map your API response fields to what the app expects
    responseMapping: {
        title: 'picture_title',        // If your API returns 'picture_title'
        date: 'picture_date',          // If your API returns 'picture_date'  
        explanation: 'description',    // If your API returns 'description'
        url: 'image_url',             // If your API returns 'image_url'
        hdurl: 'high_res_url',        // If your API returns 'high_res_url'
        mediaType: 'content_type',    // If your API returns 'content_type'
        copyright: 'image_credit'     // If your API returns 'image_credit'
    }
}
```

### Step 2: Activate Your API

In `config.js`, change this line:
```javascript
const ACTIVE_API = 'custom'; // Change from 'nasa' to 'custom'
```

### Step 3: Test Your API

1. Run the app using `start-server.bat`
2. Open http://localhost:8080 in your browser
3. Check the browser console (F12) for any API errors

## API Requirements

Your API should:

1. **Accept HTTP GET requests** with date and API key parameters
2. **Return JSON responses** with picture data
3. **Support CORS** for browser requests (or serve from same domain)
4. **Include required fields** at minimum: title and image URL

## Example API Response Formats

### Format 1: Standard NASA-like Response
```json
{
    "title": "Galaxy in Andromeda",
    "date": "2025-01-15",
    "explanation": "The Andromeda Galaxy is...",
    "url": "https://example.com/image.jpg",
    "hdurl": "https://example.com/image_hd.jpg",
    "media_type": "image",
    "copyright": "NASA/ESA"
}
```

### Format 2: Custom API Response
```json
{
    "picture_title": "Galaxy in Andromeda",
    "picture_date": "2025-01-15", 
    "description": "The Andromeda Galaxy is...",
    "image_url": "https://example.com/image.jpg",
    "high_res_url": "https://example.com/image_hd.jpg",
    "content_type": "image",
    "image_credit": "NASA/ESA"
}
```

## Common API Patterns

### Authentication Methods

**API Key in URL Parameters:**
```javascript
baseUrl: 'https://api.example.com/pictures',
apiKeyParam: 'api_key'
```

**API Key in Headers:**
If your API requires headers, modify `fetchPictureData()` in app.js:
```javascript
const response = await fetch(url, {
    headers: {
        'Authorization': `Bearer ${this.apiConfig.apiKey}`,
        'X-API-Key': this.apiConfig.apiKey
    }
});
```

### Date Formats

**YYYY-MM-DD (default):**
```javascript
dateParam: 'date'
```

**Unix timestamp:**
```javascript
// Modify buildApiUrl() method to convert date format
buildApiUrl(date) {
    const timestamp = new Date(date).getTime() / 1000;
    params.append(this.apiConfig.dateParam, timestamp);
    // ... rest of method
}
```

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:

1. **Development Solution:** Use a CORS proxy
2. **Production Solution:** Configure your API server to send CORS headers
3. **Alternative:** Serve the web app from the same domain as your API

### API Key Issues
- Double-check your API key is correct
- Verify the parameter name your API expects
- Check if your API requires specific headers

### Missing Fields
If you get "missing required fields" errors:
- Check the browser network tab to see the actual API response
- Update the `responseMapping` in config.js to match your API's field names
- Ensure your API returns at least `title` and `url` fields

### Testing Your API Separately
Test your API directly first:
```
https://your-api.com/pictures?date=2025-01-15&api_key=your-key
```

## Need Help?

1. Check the browser console (F12) for detailed error messages
2. Look at the Network tab to see actual API requests and responses
3. The app object is available as `window.astronomyApp` for debugging
4. You can call `astronomyApp.updateApiConfig({...})` to test different configurations

## Security Note

Never commit real API keys to public repositories. Consider using:
- Environment variables
- Server-side proxy
- Config files excluded from version control