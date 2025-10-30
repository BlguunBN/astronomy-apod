# Astronomy Picture of the Day Web App

A beautiful, responsive web application to display astronomy pictures with date selection functionality.

## Features

- 🌌 Display daily astronomy pictures
- 📅 Date picker to view historical images
- 📱 Fully responsive design
- 🎨 Beautiful dark space-themed UI
- 🖼️ Support for both images and videos
- ⚡ Fast loading with error handling
- 🔍 Click to view high-resolution images

## Getting Started

1. **Open the app**: Simply open `index.html` in any modern web browser
2. **No installation required**: This is a pure HTML/CSS/JavaScript application

## Customizing Your API

The app is designed to work with any astronomy picture API. To use your custom API:

### 1. Update API Configuration

Edit the `apiConfig` object in `app.js`:

```javascript
this.apiConfig = {
    baseUrl: 'https://your-api.com/endpoint',
    apiKey: 'your-api-key',
    dateParam: 'date',        // Parameter name for date
    apiKeyParam: 'api_key'    // Parameter name for API key
};
```

### 2. Modify Response Mapping

If your API has a different response structure, update the `displayPicture` method to map your API fields:

```javascript
// Example for custom API response
displayPicture(data) {
    this.elements.title.textContent = data.name || data.title;           // Your title field
    this.elements.explanation.textContent = data.desc || data.explanation; // Your description field
    // ... map other fields as needed
}
```

### 3. Common API Response Formats

The app expects these fields (customize as needed):

- `title` - Picture title
- `date` - Picture date
- `explanation` - Picture description
- `url` - Image URL
- `hdurl` - High-resolution image URL (optional)
- `media_type` - 'image' or 'video'
- `copyright` - Image credit (optional)

### 4. Example Custom API Integration

```javascript
// For a custom API with different field names
const customApiConfig = {
    baseUrl: 'https://my-space-api.com/pictures',
    apiKey: 'my-secret-key',
    dateParam: 'picture_date',
    apiKeyParam: 'auth_token'
};

// Update the app configuration
app.updateApiConfig(customApiConfig);
```

## API Requirements

Your API should:

1. **Accept date parameter**: To fetch pictures for specific dates
2. **Return JSON response**: With picture data
3. **Support CORS**: For browser requests (or serve from same domain)
4. **Include required fields**: At minimum `title` and `url`

## File Structure

```
astronomy-apod/
├── index.html          # Main HTML file
├── styles.css          # Styling and responsive design
├── app.js              # JavaScript functionality
└── README.md           # This file
```

## Customization

### Changing the Theme

Edit `styles.css` to customize:
- Colors: Update CSS custom properties
- Fonts: Change the `font-family` declarations
- Layout: Modify grid and flexbox properties

### Adding Features

The modular JavaScript structure makes it easy to add:
- Favorite pictures functionality
- Social sharing
- Picture categories
- Search functionality

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Serve the files from a local server
2. Use a CORS proxy for development
3. Ensure your API supports CORS headers

### API Key Security
- Never commit API keys to public repositories
- Consider using environment variables or server-side proxies for production

### Performance
- The app uses image lazy loading
- Consider implementing caching for better performance

## Contributing

Feel free to fork and customize this project for your needs!

## License

Open source - modify and use as needed.