# YouTube API Setup Guide

To enable embedded YouTube videos in recipe cards, you'll need a YouTube Data API key.

## Quick Setup (5 minutes)

### Step 1: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **YouTube Data API v3**:
   - Click "Enable APIs and Services"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Click "Create Credentials" → "API Key"
   - Copy your API key

### Step 2: Add to Netlify

1. Go to your Netlify dashboard
2. Site Settings → Environment Variables
3. Add a new variable:
   - **Key**: `YOUTUBE_API_KEY`
   - **Value**: Your API key from Step 1
4. Save and redeploy your site

## Without YouTube API Key

If you don't set up the YouTube API key:
- Videos will still work!
- Clicking the video will open YouTube in a new tab
- Users can watch videos, just not embedded in the app

## API Quotas

YouTube Data API has a free quota:
- **10,000 units per day** (free tier)
- **Each search costs 100 units**
- That's **100 video searches per day** for free
- Perfect for most personal/small projects

## Troubleshooting

**Video says "unavailable"?**
- Check that YOUTUBE_API_KEY is set in Netlify
- Verify the API key is valid in Google Cloud Console
- Make sure YouTube Data API v3 is enabled

**Need more quota?**
- Free tier should be enough for most users
- If you need more, you can request quota increase in Google Cloud Console

---

**Optional but Recommended**: The YouTube API enhances the user experience by embedding videos directly in the app!
