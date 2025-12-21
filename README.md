# Kitchen Alchemy - AI Recipe Finder 🧪👨‍🍳

Transform your ingredients into delicious possibilities with AI-powered recipe suggestions!

## Features ✨

- 🤖 **AI-Powered**: Uses Claude AI to generate custom recipes for ANY ingredient combination
- 📱 **Mobile-Optimized**: Beautiful, responsive design that works on all devices
- 🎨 **Elegant UI**: Warm editorial aesthetic with smooth animations
- ⚡ **Instant Results**: Get 3 personalized recipes in seconds
- 🔒 **Secure**: API keys stored safely in Netlify environment variables

## Live Demo

Once deployed, your app will generate unique recipes like:
- "Honey Garlic Chicken Stir-Fry" from chicken + soy sauce
- "Creamy Tomato Pasta" from pasta + tomatoes + cream
- "Mediterranean Rice Bowl" from rice + olives + feta

## Quick Deploy to Netlify (5 minutes) 🚀

### Prerequisites
- A [GitHub](https://github.com) account
- A [Netlify](https://netlify.com) account (free)
- An [Anthropic API key](https://console.anthropic.com/) (free tier available)

### Step 1: Get Your Anthropic API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy your API key (keep it safe!)

### Step 2: Deploy to Netlify

#### Option A: One-Click Deploy (Easiest)

1. Click this button: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=YOUR_REPO_URL)

2. Connect your GitHub account

3. Netlify will ask for your `ANTHROPIC_API_KEY`
   - Paste your API key from Step 1
   - Click "Save & Deploy"

4. Done! Your site will be live at `https://your-site-name.netlify.app`

#### Option B: Manual Deploy

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Netlify**:
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Netlify will auto-detect the settings from `netlify.toml`
   - Click "Deploy site"

3. **Add Environment Variable**:
   - In your Netlify dashboard, go to "Site settings" → "Environment variables"
   - Click "Add a variable"
   - Key: `ANTHROPIC_API_KEY`
   - Value: Your API key from Step 1
   - Click "Save"

4. **Trigger Redeploy**:
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

5. Done! Your site is live! 🎉

## Project Structure

```
kitchen-alchemy/
├── index.html              # Frontend UI
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies
├── .env.example           # Example environment variables
└── netlify/
    └── functions/
        └── generate-recipes.js  # Serverless function for AI recipes
```

## How It Works

1. **User Input**: Add ingredients using the beautiful web interface
2. **Frontend**: HTML/JavaScript sends ingredients to serverless function
3. **Backend**: Netlify function calls Anthropic's Claude AI
4. **AI Magic**: Claude generates 3 custom recipes with instructions
5. **Display**: Recipes appear with cooking time, servings, and step-by-step instructions

## Local Development

Want to test locally before deploying?

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

4. **Run locally**:
   ```bash
   netlify dev
   ```

5. Open `http://localhost:8888` in your browser

## Customization Ideas

- **Add more ingredients**: The AI can handle ANY ingredients!
- **Change cuisine styles**: Modify the AI prompt for Italian, Asian, Mexican, etc.
- **Adjust recipe count**: Generate more or fewer recipes
- **Add dietary filters**: Vegetarian, vegan, gluten-free, etc.
- **Save favorites**: Add local storage to save favorite recipes
- **Share recipes**: Add social sharing buttons

## Cost Estimates

- **Netlify Hosting**: FREE (up to 100GB bandwidth/month)
- **Netlify Functions**: FREE (up to 125,000 function calls/month)
- **Anthropic API**: 
  - Free tier: $5 credit (enough for ~1,000 recipe generations)
  - After: ~$0.003 per recipe generation (very affordable!)

## Troubleshooting

**Recipes not generating?**
- Check that your `ANTHROPIC_API_KEY` is set correctly in Netlify
- Check the Function logs in Netlify dashboard
- Make sure you have API credits remaining

**Site not loading?**
- Check that `index.html` is in the root directory
- Verify `netlify.toml` configuration is correct

**Need help?**
- Check Netlify docs: [https://docs.netlify.com/](https://docs.netlify.com/)
- Check Anthropic docs: [https://docs.anthropic.com/](https://docs.anthropic.com/)

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Netlify Serverless Functions (Node.js)
- **AI**: Anthropic Claude Sonnet 4
- **Hosting**: Netlify
- **Font**: Crimson Pro (Google Fonts)

## License

MIT License - Feel free to use this for personal or commercial projects!

## Credits

Built with ❤️ using Claude AI

---

**Enjoy your AI-powered cooking companion! 🧑‍🍳✨**
