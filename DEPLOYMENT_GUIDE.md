# 🚀 Kitchen Alchemy - Freemium Deployment Guide

Follow these steps carefully to deploy your freemium monetization system!

---

## ✅ Prerequisites Completed

You should have already completed:
- ✅ Firebase project created
- ✅ Google Sign-In enabled in Firebase
- ✅ Firestore database created
- ✅ Stripe account created
- ✅ Stripe product created (SGD 4.99/month)
- ✅ Firebase config copied
- ✅ Stripe API keys copied

---

## 📦 Step 1: Deploy to GitHub

```bash
cd ~/path/to/Kitchen-alchemy

# Add all new files
git add .

# Commit changes
git commit -m "Add freemium monetization with Firebase & Stripe"

# Push to GitHub
git push origin main
```

Wait 30 seconds for Netlify to start building...

---

## ⚙️ Step 2: Configure Netlify Environment Variables

### 2.1: Go to Netlify Dashboard

1. Visit: https://app.netlify.com
2. Click on your "kitchen-alchemy" site
3. Go to: **Site configuration** → **Environment variables**

### 2.2: Add New Variables

Click **"Add a variable"** for each of these:

#### Keep Existing Variables:
- `ANTHROPIC_API_KEY` (already set)
- `YOUTUBE_API_KEY` (already set)

#### Add New Stripe Variables:

**Variable 1:**
- Key: `STRIPE_SECRET_KEY`
- Value: `sk_test_...` (from Stripe → Developers → API keys)
- Scope: All scopes
- Click **Save**

**Variable 2:**
- Key: `STRIPE_PRICE_ID`
- Value: `price_...` (from Stripe → Products → your product)
- Scope: All scopes
- Click **Save**

#### Add New Firebase Variables:

**Variable 3:**
- Key: `FIREBASE_API_KEY`
- Value: (from your Firebase config)
- Scope: All scopes
- Click **Save**

**Variable 4:**
- Key: `FIREBASE_AUTH_DOMAIN`
- Value: (from your Firebase config - something like `yourproject.firebaseapp.com`)
- Scope: All scopes
- Click **Save**

**Variable 5:**
- Key: `FIREBASE_PROJECT_ID`
- Value: (from your Firebase config)
- Scope: All scopes
- Click **Save**

**Variable 6:**
- Key: `FIREBASE_STORAGE_BUCKET`
- Value: (from your Firebase config - something like `yourproject.appspot.com`)
- Scope: All scopes
- Click **Save**

**Variable 7:**
- Key: `FIREBASE_MESSAGING_SENDER_ID`
- Value: (from your Firebase config - numbers only)
- Scope: All scopes
- Click **Save**

**Variable 8:**
- Key: `FIREBASE_APP_ID`
- Value: (from your Firebase config - something like `1:123456:web:abcdef`)
- Scope: All scopes
- Click **Save**

---

## 🔄 Step 3: Trigger Redeploy

After adding all environment variables:

1. Go to: **Deploys** tab
2. Click: **Trigger deploy** → **Deploy site**
3. Wait 1-2 minutes for build to complete
4. Status should show: ✅ **Published**

---

## 🎯 Step 4: Authorize Your Domain in Firebase

### 4.1: Add Authorized Domain

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Left sidebar → **Build** → **Authentication**
4. Click **Settings** tab → **Authorized domains**
5. Click **Add domain**
6. Enter: `kitchen-alchemy.org`
7. Click **Add**

Also add (if testing):
- `localhost` (for local testing)
- Your Netlify domain: `yoursite.netlify.app`

---

## 🧪 Step 5: Test Everything!

### Test 1: Sign In
1. Visit: https://kitchen-alchemy.org
2. Click **"Sign In"** button (top right)
3. Sign in with Google
4. Should see your profile picture or credits badge

### Test 2: Free Tier Limits
1. Generate 5 recipes (credits should decrease)
2. Try to generate 6th → Should see upgrade modal
3. Save 5 recipes
4. Try to save 6th → Should see upgrade modal

### Test 3: Payment Flow (TEST MODE)
1. Click **"Upgrade to Premium"**
2. Should redirect to Stripe Checkout
3. Use test card: `4242 4242 4242 4242`
4. Expiry: Any future date (e.g., 12/30)
5. CVC: Any 3 digits (e.g., 123)
6. ZIP: Any 5 digits (e.g., 12345)
7. Click **Subscribe**
8. Should redirect back with "Premium" badge
9. Now have unlimited access!

### Test 4: Premium Features
1. Generate unlimited recipes (no limit prompt)
2. Save unlimited recipes (no limit prompt)
3. See "✨ Premium" badge instead of credits

---

## 🔍 Step 6: Verify Data in Firebase

### 6.1: Check Firestore

1. Firebase Console → **Firestore Database**
2. Click **"users"** collection
3. Should see your user document with:
   - email
   - subscriptionStatus: "free" or "premium"
   - creditsUsed: (number)
   - periodStart / periodEnd dates

### 6.2: Check Authentication

1. Firebase Console → **Authentication**
2. Click **"Users"** tab
3. Should see your account listed

---

## 💰 Step 7: Monitor Stripe

### 7.1: Check Test Payments

1. Stripe Dashboard: https://dashboard.stripe.com/
2. Make sure **"Test mode"** is ON
3. Click **"Customers"**
4. Should see your test subscription
5. Click **"Subscriptions"**
6. Should see active test subscription

---

## ⚠️ Troubleshooting

### Issue: "Sign in not working"
**Solution:**
- Check Firebase authorized domains include your domain
- Check browser console (F12) for errors
- Verify Firebase Auth is enabled
- Check Firebase config in Netlify env vars

### Issue: "Payment failed"
**Solution:**
- Make sure Stripe is in TEST mode
- Use test card: 4242 4242 4242 4242
- Check STRIPE_SECRET_KEY in Netlify env vars
- Check browser console for errors

### Issue: "Credits not showing"
**Solution:**
- Hard refresh page (Ctrl + Shift + R)
- Check Firestore user document exists
- Sign out and sign back in
- Check browser console for errors

### Issue: "Build failed"
**Solution:**
- Check Netlify build logs
- Verify all environment variables are set
- Make sure inject-config.sh has execute permissions
- Try re-deploying

### Issue: "Premium not activating after payment"
**Solution:**
- Wait 30 seconds and refresh
- Check Firestore - should see subscriptionStatus: "premium"
- Check Netlify function logs
- Try signing out and back in

---

## 🎉 Step 8: You're Live!

Your freemium system is now fully operational!

**What users can do:**

**Free Tier:**
- ✅ Sign in with Google (1 click)
- ✅ Generate 5 recipes per month
- ✅ Save up to 5 recipes
- ✅ Upload photos (counts as 1 credit)

**Premium (SGD 4.99/month):**
- ✅ Unlimited recipe generations
- ✅ Unlimited saved recipes
- ✅ Unlimited photo uploads
- ✅ Cancel anytime

---

## 🚀 Step 9: Go Live (When Ready)

When you're ready to accept real payments:

### 9.1: Switch Stripe to Live Mode

1. Stripe Dashboard → Toggle **"Test mode"** to OFF
2. Complete Stripe onboarding (verify business)
3. Get LIVE API keys:
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`

### 9.2: Create Live Product

1. Products → Add product
2. Name: Kitchen Alchemy Premium
3. Price: SGD 4.99/month
4. Copy new LIVE `price_...` ID

### 9.3: Update Netlify Variables

1. Update `STRIPE_SECRET_KEY` with LIVE key
2. Update `STRIPE_PRICE_ID` with LIVE price ID
3. Trigger redeploy

### 9.4: Test with Real Card

1. Use your own credit card (will charge SGD 4.99)
2. Verify payment goes through
3. Check Stripe dashboard for real payment
4. Cancel test subscription

---

## 📊 Monitoring & Analytics

### Where to Check:

**User Activity (Firebase):**
- Firestore Database → users collection
- See: credits used, subscription status, etc.

**Payments (Stripe):**
- Customers → see all subscribers
- Subscriptions → manage subscriptions
- Revenue → track earnings

**Site Traffic (Netlify):**
- Analytics tab
- See: visitors, function calls, bandwidth

**Function Logs (Netlify):**
- Functions tab
- See: errors, execution times

---

## 💡 Tips for Success

1. **Start in test mode** - Don't go live until fully tested
2. **Monitor Firebase** - Check Firestore for user data
3. **Watch Stripe** - Monitor test subscriptions
4. **Check logs** - Netlify function logs show errors
5. **Hard refresh** - Use Ctrl+Shift+R to clear cache
6. **Test thoroughly** - Try all user flows before launch

---

## 🎯 Next Steps

Your freemium system is complete! Now you can:

1. **Market your app** - Share on social media
2. **Get users** - Post on Product Hunt, Reddit, etc.
3. **Monitor growth** - Track signups and conversions
4. **Iterate** - Add features based on user feedback
5. **Scale up** - All infrastructure scales automatically!

---

## 🆘 Need Help?

Check these resources:
- Firebase Console: https://console.firebase.google.com/
- Stripe Dashboard: https://dashboard.stripe.com/
- Netlify Logs: https://app.netlify.com/sites/YOUR-SITE/logs
- Browser Console: Press F12

---

## ✅ Deployment Checklist

- [ ] Pushed code to GitHub
- [ ] Added all 8 environment variables to Netlify
- [ ] Triggered redeploy on Netlify
- [ ] Authorized domain in Firebase
- [ ] Tested sign in
- [ ] Tested free tier limits
- [ ] Tested payment flow
- [ ] Verified data in Firestore
- [ ] Checked Stripe dashboard
- [ ] All features working!

---

**Congratulations! Your freemium system is live!** 🎉🚀

Users can now sign in, use the free tier, and upgrade to premium for unlimited access!
