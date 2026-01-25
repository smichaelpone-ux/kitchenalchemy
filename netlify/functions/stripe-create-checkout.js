const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { userId, email } = JSON.parse(event.body);

        if (!userId || !email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing userId or email' })
            };
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer_email: email,
            client_reference_id: userId,
            line_items: [{
                price: process.env.STRIPE_PRICE_ID,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.URL || 'https://kitchen-alchemy.org'}?success=true`,
            cancel_url: `${process.env.URL || 'https://kitchen-alchemy.org'}?canceled=true`,
            metadata: {
                firebaseUserId: userId
            },
            subscription_data: {
                metadata: {
                    firebaseUserId: userId
                }
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ sessionId: session.id })
        };
        
    } catch (error) {
        console.error('Checkout creation error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
