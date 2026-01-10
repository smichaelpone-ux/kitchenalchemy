const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Stripe webhooks send POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    // Verify webhook signature (optional but recommended for production)
    // For now, we'll just parse the event
    stripeEvent = JSON.parse(event.body);

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        console.log('Checkout completed:', {
          userId: session.client_reference_id,
          customerId: session.customer,
          subscriptionId: session.subscription,
        });
        
        // Note: In a real implementation, you would update Firestore here
        // For now, we're doing it client-side for simplicity
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = stripeEvent.data.object;
        console.log('Subscription event:', {
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer,
        });
        break;

      case 'invoice.payment_succeeded':
        const invoice = stripeEvent.data.object;
        console.log('Payment succeeded:', {
          customerId: invoice.customer,
          subscriptionId: invoice.subscription,
        });
        break;

      case 'invoice.payment_failed':
        const failedInvoice = stripeEvent.data.object;
        console.log('Payment failed:', {
          customerId: failedInvoice.customer,
          subscriptionId: failedInvoice.subscription,
        });
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
