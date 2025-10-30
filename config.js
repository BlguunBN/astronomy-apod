// API Configuration File
// Customize this file with your API settings

const API_CONFIGS = {
    // NASA APOD API (default)
    nasa: {
        baseUrl: 'https://api.nasa.gov/planetary/apod',
        apiKey: 'DEMO_KEY', // Replace with your free NASA API key from https://api.nasa.gov/
        dateParam: 'date',
        apiKeyParam: 'api_key',
        
        // Response field mapping
        responseMapping: {
            title: 'title',
            date: 'date', 
            explanation: 'explanation',
            url: 'url',
            hdurl: 'hdurl',
            mediaType: 'media_type',
            copyright: 'copyright'
        }
    },

    // Example custom API configuration
    custom: {
        baseUrl: 'https://your-api.com/astronomy',
        apiKey: 'your-api-key-here',
        dateParam: 'date',
        apiKeyParam: 'key',
        
        // Map your API response fields to expected format
        responseMapping: {
            title: 'picture_title',        // If your API uses 'picture_title'
            date: 'picture_date',          // If your API uses 'picture_date'
            explanation: 'description',    // If your API uses 'description'
            url: 'image_url',             // If your API uses 'image_url'
            hdurl: 'high_res_url',        // If your API uses 'high_res_url'
            mediaType: 'type',            // If your API uses 'type'
            copyright: 'credit'           // If your API uses 'credit'
        }
    },

    // Add more API configurations as needed
    // another_api: { ... }
};

// Active configuration - change this to switch APIs
const ACTIVE_API = 'nasa'; // Change to 'custom' or add your own

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIGS, ACTIVE_API };
}

// Instructions for using this config:
// 1. Update the 'custom' configuration with your API details
// 2. Change ACTIVE_API to 'custom' 
// 3. If your API has different response structure, update responseMapping
// 4. Add additional API configurations as needed
