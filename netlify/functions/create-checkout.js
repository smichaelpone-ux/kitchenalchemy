const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { userId, userEmail } = JSON.parse(event.body);

    if (!userId || !userEmail) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing userId or userEmail' }),
      };
    }

    // Get the site URL from the request origin or default
    const origin = event.headers.origin || 'https://kitchen-alchemy.org';
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'], // GrabPay doesn't support subscriptions
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      client_reference_id: userId, // Links payment to Firebase user
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?canceled=true`,
      metadata: {
        userId: userId,
      },
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack
    });
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to create checkout session',
        details: error.message 
      }),
    };
  }
};
