const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { subscriptionId } = JSON.parse(event.body);

        if (!subscriptionId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing subscriptionId' })
            };
        }

        // Cancel at period end (user keeps access until billing cycle ends)
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                cancel_at: subscription.current_period_end
            })
        };
    } catch (error) {
        console.error('Cancel subscription error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
