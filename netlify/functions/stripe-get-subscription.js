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

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                status: subscription.status,
                current_period_end: subscription.current_period_end,
                cancel_at_period_end: subscription.cancel_at_period_end
            })
        };
    } catch (error) {
        console.error('Get subscription error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
