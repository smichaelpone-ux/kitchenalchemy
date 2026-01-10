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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { image } = JSON.parse(event.body);

    if (!image) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Image is required' }),
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'API key not configured' }),
      };
    }

    // Call Claude Vision API to detect ingredients
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image,
              },
            },
            {
              type: 'text',
              text: `Analyze this image and identify all food ingredients you can see. 

IMPORTANT RULES:
- Only list actual food ingredients (no cooking utensils, plates, or non-food items)
- Be specific (e.g., "chicken breast" not just "chicken")
- List individual ingredients separately
- Only include ingredients you can clearly see
- Return as a simple JSON array of strings

Format your response as:
["ingredient1", "ingredient2", "ingredient3"]

Return ONLY the JSON array, no other text.`,
            },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Failed to analyze image' }),
      };
    }

    const data = await response.json();
    
    // Extract text from Claude's response
    let ingredientsText = '';
    if (data.content && data.content.length > 0) {
      ingredientsText = data.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('');
    }

    // Parse the JSON array from Claude's response
    let ingredients = [];
    try {
      // Remove markdown code blocks if present
      ingredientsText = ingredientsText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      ingredients = JSON.parse(ingredientsText);
    } catch (parseError) {
      console.error('Failed to parse ingredients:', parseError, ingredientsText);
      // Fallback: try to extract ingredients from text
      const lines = ingredientsText.split('\n').filter(line => line.trim());
      ingredients = lines
        .map(line => line.replace(/^[-*]\s*/, '').replace(/^"\s*/, '').replace(/\s*"$/, '').trim())
        .filter(line => line.length > 0 && line.length < 50);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
