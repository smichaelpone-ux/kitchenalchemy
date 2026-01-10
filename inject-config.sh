#!/bin/bash

# This script injects Firebase configuration from Netlify environment variables

echo "🔧 Injecting Firebase configuration..."

# Read the template file
INDEX_FILE="index.html"

# Replace placeholders with environment variables
sed -i "s/FIREBASE_API_KEY_PLACEHOLDER/${FIREBASE_API_KEY}/g" $INDEX_FILE
sed -i "s/FIREBASE_AUTH_DOMAIN_PLACEHOLDER/${FIREBASE_AUTH_DOMAIN}/g" $INDEX_FILE
sed -i "s/FIREBASE_PROJECT_ID_PLACEHOLDER/${FIREBASE_PROJECT_ID}/g" $INDEX_FILE
sed -i "s/FIREBASE_STORAGE_BUCKET_PLACEHOLDER/${FIREBASE_STORAGE_BUCKET}/g" $INDEX_FILE
sed -i "s/FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER/${FIREBASE_MESSAGING_SENDER_ID}/g" $INDEX_FILE
sed -i "s/FIREBASE_APP_ID_PLACEHOLDER/${FIREBASE_APP_ID}/g" $INDEX_FILE

echo "✅ Firebase configuration injected successfully!"
