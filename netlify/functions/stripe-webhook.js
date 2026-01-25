const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const sig = event.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let stripeEvent;

    try {
        // Verify webhook signature
        stripeEvent = stripe.webhooks.constructEvent(
            event.body,
            sig,
            webhookSecret
        );
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return { 
            statusCode: 400, 
            body: `Webhook Error: ${err.message}` 
        };
    }

    console.log(`✅ Received event: ${stripeEvent.type}`);

    try {
        switch (stripeEvent.type) {
            // Payment successful - activate premium
            case 'checkout.session.completed': {
                const session = stripeEvent.data.object;
                const userId = session.metadata.firebaseUserId;
                const customerId = session.customer;
                const subscriptionId = session.subscription;

                console.log(`Activating premium for user: ${userId}`);

                await db.collection('users').doc(userId).set({
                    isPremium: true,
                    stripeCustomerId: customerId,
                    stripeSubscriptionId: subscriptionId,
                    subscriptionStatus: 'active',
                    upgradedAt: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });

                console.log(`✅ User ${userId} activated as premium`);
                break;
            }

            // Subscription updated (renewed, past_due, etc.)
            case 'customer.subscription.updated': {
                const subscription = stripeEvent.data.object;
                
                // Find user by Stripe customer ID
                const usersRef = db.collection('users');
                const snapshot = await usersRef
                    .where('stripeCustomerId', '==', subscription.customer)
                    .limit(1)
                    .get();

                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    await userDoc.ref.update({
                        subscriptionStatus: subscription.status,
                        subscriptionRenewsAt: new Date(subscription.current_period_end * 1000),
                        isPremium: subscription.status === 'active'
                    });
                    console.log(`✅ Updated subscription for user ${userDoc.id}: ${subscription.status}`);
                }
                break;
            }

            // Subscription canceled/ended
            case 'customer.subscription.deleted': {
                const subscription = stripeEvent.data.object;
                
                const usersRef = db.collection('users');
                const snapshot = await usersRef
                    .where('stripeCustomerId', '==', subscription.customer)
                    .limit(1)
                    .get();

                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    await userDoc.ref.update({
                        isPremium: false,
                        subscriptionStatus: 'canceled',
                        canceledAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                    console.log(`✅ Canceled subscription for user ${userDoc.id}`);
                }
                break;
            }

            // Payment failed
            case 'invoice.payment_failed': {
                const invoice = stripeEvent.data.object;
                
                const usersRef = db.collection('users');
                const snapshot = await usersRef
                    .where('stripeCustomerId', '==', invoice.customer)
                    .limit(1)
                    .get();

                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    await userDoc.ref.update({
                        subscriptionStatus: 'past_due'
                    });
                    console.log(`⚠️ Payment failed for user ${userDoc.id}`);
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${stripeEvent.type}`);
        }

        return { 
            statusCode: 200, 
            body: JSON.stringify({ received: true }) 
        };
        
    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        return { 
            statusCode: 500, 
            body: `Webhook Error: ${error.message}` 
        };
    }
};
