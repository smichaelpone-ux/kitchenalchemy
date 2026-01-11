const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { searchTerm } = JSON.parse(event.body);

    if (!searchTerm) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Search term is required' }),
      };
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    // If no API key, return null (frontend will fallback to opening YouTube)
    if (!apiKey) {
      console.log('No YouTube API key configured, using fallback');
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: null }),
      };
    }

    // Search YouTube for videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm)}&type=video&maxResults=1&key=${apiKey}`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.error('YouTube API error:', response.status);
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: null }),
      };
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      const thumbnails = data.items[0].snippet.thumbnails;
      
      // Get the best available thumbnail (prefer maxres, then high, then medium)
      let thumbnailUrl = null;
      if (thumbnails.maxres) {
        thumbnailUrl = thumbnails.maxres.url;
      } else if (thumbnails.high) {
        thumbnailUrl = thumbnails.high.url;
      } else if (thumbnails.medium) {
        thumbnailUrl = thumbnails.medium.url;
      } else if (thumbnails.default) {
        thumbnailUrl = thumbnails.default.url;
      }
      
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          videoId,
          thumbnailUrl 
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: null, thumbnailUrl: null }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId: null }),
    };
  }
};
