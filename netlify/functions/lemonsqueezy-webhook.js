const crypto = require('crypto');

// Initialize Firebase Admin with base64 encoded service account
let admin;
let db;

try {
  admin = require('firebase-admin');
  
  if (!admin.apps.length) {
    // Decode base64 service account
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    
    if (!serviceAccountBase64) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 not found');
    }
    
    // Decode from base64
    const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  
  db = admin.firestore();
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-Signature',
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
    // Verify webhook signature (security)
    const signature = event.headers['x-signature'];
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    
    if (secret && signature) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = hmac.update(event.body).digest('hex');
      
      if (signature !== digest) {
        console.error('Invalid webhook signature');
        return {
          statusCode: 401,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Invalid signature' }),
        };
      }
    }

    const payload = JSON.parse(event.body);
    console.log('Lemon Squeezy webhook event:', payload.meta?.event_name);

    const eventName = payload.meta?.event_name;
    const attributes = payload.data?.attributes;

    // Handle subscription created
    if (eventName === 'subscription_created') {
      const userEmail = attributes?.user_email;
      const customerId = payload.data?.id;
      const customerData = attributes?.customer;
      
      console.log('New subscription for:', userEmail);

      if (!userEmail) {
        console.error('No user email in webhook payload');
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Missing user email' }),
        };
      }

      // Find user by email in Firestore
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', userEmail).get();

      if (snapshot.empty) {
        console.log('User not found with email:', userEmail);
        return {
          statusCode: 404,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'User not found' }),
        };
      }

      // Update user to premium
      const userDoc = snapshot.docs[0];
      await userDoc.ref.update({
        subscriptionStatus: 'premium',
        lemonSqueezyCustomerId: customerId,
        lemonSqueezyCustomerData: customerData,
        upgradedAt: new Date().toISOString(),
        lastWebhookEvent: eventName,
        lastWebhookAt: new Date().toISOString(),
      });

      console.log('User upgraded to premium:', userEmail);

      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true, message: 'User upgraded to premium' }),
      };
    }

    // Handle subscription cancelled
    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      const userEmail = attributes?.user_email;
      
      console.log('Subscription cancelled for:', userEmail);

      if (!userEmail) {
        console.error('No user email in webhook payload');
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Missing user email' }),
        };
      }

      // Find user by email
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', userEmail).get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({
          subscriptionStatus: 'free',
          cancelledAt: new Date().toISOString(),
          lastWebhookEvent: eventName,
          lastWebhookAt: new Date().toISOString(),
        });

        console.log('User downgraded to free:', userEmail);
      }

      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true, message: 'User downgraded to free' }),
      };
    }

    // Handle subscription updated/renewed
    if (eventName === 'subscription_updated' || eventName === 'subscription_resumed') {
      const userEmail = attributes?.user_email;
      const status = attributes?.status;
      
      console.log('Subscription updated for:', userEmail, 'Status:', status);

      if (userEmail) {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', userEmail).get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          
          // Update subscription status based on Lemon Squeezy status
          const isPremium = status === 'active' || status === 'on_trial';
          
          await userDoc.ref.update({
            subscriptionStatus: isPremium ? 'premium' : 'free',
            lemonSqueezyStatus: status,
            lastWebhookEvent: eventName,
            lastWebhookAt: new Date().toISOString(),
          });

          console.log('User subscription updated:', userEmail, isPremium ? 'premium' : 'free');
        }
      }

      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true, message: 'Subscription updated' }),
      };
    }

    // Log other events but don't process them
    console.log('Unhandled webhook event:', eventName);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, message: 'Event received' }),
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
};
