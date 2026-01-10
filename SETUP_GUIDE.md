# Kitchen Alchemy - Freemium Setup Guide

This guide will walk you through setting up authentication, payment, and usage limits.

## 📋 What You'll Need

- ✅ Firebase project (free)
- ✅ Stripe account (free)
- ✅ 30-60 minutes

---

## 🔥 Part 1: Firebase Setup (Already Completed Above)

You should have:
- ✅ Firebase project created
- ✅ Google Sign-In enabled
- ✅ Firestore database enabled
- ✅ Firebase config copied

---

## 💳 Part 2: Stripe Setup (Already Completed Above)

You should have:
- ✅ Stripe account created
- ✅ Premium product created (SGD 4.99/month)
- ✅ API keys copied
- ✅ Price ID copied

---

## ⚙️ Part 3: Configure Netlify Environment Variables

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/sites/YOUR-SITE-NAME/configuration/env

2. **Add Environment Variables**
   
   Click "Add a variable" for each of these:

   **Existing Variables** (keep these):
   - `ANTHROPIC_API_KEY` = (your existing value)
   - `YOUTUBE_API_KEY` = (your existing value)

   **New Variables** (add these):
   
   **Stripe Variables:**
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_test_...` (from Stripe dashboard)
   
   - Key: `STRIPE_PRICE_ID`
   - Value: `price_...` (from Stripe product)

   **Firebase Variables:**
   - Key: `FIREBASE_API_KEY`
   - Value: (from Firebase config)
   
   - Key: `FIREBASE_AUTH_DOMAIN`
   - Value: (from Firebase config)
   
   - Key: `FIREBASE_PROJECT_ID`
   - Value: (from Firebase config)
   
   - Key: `FIREBASE_STORAGE_BUCKET`
   - Value: (from Firebase config)
   
   - Key: `FIREBASE_MESSAGING_SENDER_ID`
   - Value: (from Firebase config)
   
   - Key: `FIREBASE_APP_ID`
   - Value: (from Firebase config)

3. **Save and Redeploy**
   - After adding all variables, trigger a redeploy

---

## 🧪 Part 4: Testing (After Deployment)

### Test Free Tier:
1. Visit your site
2. Click "Sign in with Google"
3. Generate 5 recipes
4. Try to generate 6th → Should see upgrade prompt
5. Save 5 recipes
6. Try to save 6th → Should see upgrade prompt

### Test Payment:
1. Click "Upgrade to Premium"
2. Use Stripe test card: `4242 4242 4242 4242`
3. Expiry: Any future date
4. CVC: Any 3 digits
5. Complete payment
6. Should now have unlimited access!

### Test Limits Reset:
1. Free users' credits reset monthly automatically
2. Check Firestore to see usage data

---

## 🚀 Part 5: Go Live (When Ready)

### Switch Stripe to Live Mode:
1. Stripe Dashboard → Toggle "Test mode" to OFF
2. Complete Stripe onboarding (business verification)
3. Get LIVE API keys (starts with `pk_live_` and `sk_live_`)
4. Update Netlify environment variables with LIVE keys
5. Create LIVE product (SGD 4.99/month)
6. Update `STRIPE_PRICE_ID` with live price ID

### Firebase (Already Live):
- Firebase works in production by default
- No changes needed

---

## 💰 Pricing Summary

**Free Tier:**
- 5 recipe generations per month
- 5 saved recipes maximum
- Photo upload (counts as 1 generation)

**Premium (SGD 4.99/month):**
- Unlimited recipe generations
- Unlimited saved recipes
- Unlimited photo uploads
- Cancel anytime

---

## 📊 Where to Monitor

### User Data (Firebase):
- https://console.firebase.google.com/
- Firestore Database → users collection
- See credits used, recipes saved

### Payments (Stripe):
- https://dashboard.stripe.com/
- Customers → See all subscribers
- Subscriptions → Manage subscriptions
- Revenue → Track earnings

### Analytics (Netlify):
- https://app.netlify.com/sites/YOUR-SITE/analytics
- See traffic, function calls

---

## 🔧 Troubleshooting

### "Payment failed"
- Make sure Stripe is in test mode
- Use test card: 4242 4242 4242 4242

### "Credits not resetting"
- Check Firestore `periodStart` field
- Should reset when current month passes

### "Sign in not working"
- Check Firebase Auth is enabled
- Verify domain is authorized in Firebase

### "Stripe webhook failing"
- Check Netlify function logs
- Verify STRIPE_SECRET_KEY is set

---

## 📞 Support

If you need help:
1. Check Netlify function logs
2. Check browser console (F12)
3. Check Firebase console for errors
4. Check Stripe dashboard for payment errors

---

## 🎉 You're Done!

Your freemium system is now live! Users can:
- ✅ Sign in with Google
- ✅ Use 5 free credits
- ✅ Save 5 recipes
- ✅ Upgrade to unlimited for SGD 4.99/month
- ✅ Pay with Google Pay, cards, etc.

**Congratulations!** 🚀
