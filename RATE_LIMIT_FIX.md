# 🚨 API Rate Limit Error - Quick Fix

## The Problem
You're seeing a **429 error** because the NASA DEMO API key has hit its rate limit. This is shared by all users worldwide, so it gets overused quickly.

## ✅ Quick Solution (2 minutes)

### Get Your FREE NASA API Key:

1. **Visit**: https://api.nasa.gov/
2. **Click**: "Generate API Key" 
3. **Fill out the simple form** (just name and email)
4. **Copy your new API key** (looks like: `abc123def456ghi789`)

### Update Your App:

1. **Open**: `config.js` in your astronomy-apod folder
2. **Find this line**:
   ```javascript
   apiKey: 'DEMO_KEY',
   ```
3. **Replace with your key**:
   ```javascript
   apiKey: 'your-actual-api-key-here',
   ```
4. **Save the file** and refresh your browser

## 🎯 Alternative: Test with Local Images

If you want to test the app immediately without waiting for an API key, you can temporarily use a local fallback by modifying the error handling.

## 📞 Rate Limits
- **DEMO_KEY**: 30 requests per hour (shared globally)
- **Your API Key**: 1,000 requests per hour (just for you!)

Your NASA API key is completely **FREE** and gives you much higher limits for personal use.

---
*This fix should resolve your 429 error immediately!*