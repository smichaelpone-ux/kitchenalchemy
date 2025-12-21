const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS preflight
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

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { ingredients } = JSON.parse(event.body);

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length < 2) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Please provide at least 2 ingredients' }),
      };
    }

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `I have these ingredients: ${ingredients.join(', ')}.

Please suggest 3 simple, delicious recipes I can make. For each recipe, provide:
1. Recipe name
2. Cooking time in minutes
3. Number of servings
4. Additional ingredients needed (keep minimal - max 5 items)
5. Step-by-step cooking instructions (5-7 clear, concise steps)
6. A short image search term (2-3 words) that would find a good photo of this dish (e.g., "grilled salmon plate", "pasta carbonara")

Format your response as a JSON array with this exact structure:
[{
  "name": "Recipe Name",
  "time": 25,
  "servings": 2,
  "additionalIngredients": ["ingredient1", "ingredient2"],
  "instructions": ["Step 1 description", "Step 2 description", ...],
  "imageSearch": "short search term"
}]

Return ONLY the JSON array, no other text or markdown formatting.`,
        }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();

    // Extract text from Claude's response
    let text = '';
    if (data.content && Array.isArray(data.content)) {
      for (const item of data.content) {
        if (item.type === 'text') {
          text += item.text;
        }
      }
    }

    if (!text) {
      throw new Error('No response text received from API');
    }

    // Clean and parse JSON
    let cleanJson = text.trim();
    
    // Remove markdown code blocks if present
    cleanJson = cleanJson.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to extract JSON array if there's extra text
    const jsonMatch = cleanJson.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    
    const recipes = JSON.parse(cleanJson);

    if (!Array.isArray(recipes) || recipes.length === 0) {
      throw new Error('Invalid recipe format received');
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipes }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: error.message || 'Failed to generate recipes',
      }),
    };
  }
};
