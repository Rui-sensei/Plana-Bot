# Deploy to Render.com - Step by Step Guide

## Prerequisites
- GitHub account
- Render.com account (free)
- Your Discord bot token

## Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Prepare for Render deployment"
   ```

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it `randombot` or whatever you prefer
   - DO NOT initialize with README (you already have files)
   - Click "Create repository"

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/randombot.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy on Render.com

1. **Sign up/Login to Render.com**:
   - Go to https://render.com
   - Sign up with your GitHub account (recommended)

2. **Create a New Web Service**:
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub repository
   - Select your `randombot` repository

3. **Configure the Service**:
   - **Name**: `randombot` (or your choice)
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select **Free**

4. **Add Environment Variables**:
   - Click "Advanced" or scroll down to "Environment Variables"
   - Add a new environment variable:
     - **Key**: `TOKEN`
     - **Value**: (Paste your Discord bot token here)
   - Click "Add Environment Variable"

5. **Deploy**:
   - Click "Create Web Service"
   - Wait 2-5 minutes for deployment to complete
   - Your bot should now be online 24/7! 🎉

## Step 3: Verify Your Bot is Running

1. Check the Render dashboard - it should show "Live"
2. Check your Discord server - your bot should be online
3. Try a command to verify functionality

## Important Notes

### Free Tier Limitations:
- ⚠️ **Render free tier spins down after 15 minutes of inactivity**
- This means your bot will go offline if no one uses it
- It takes ~30 seconds to wake up when someone tries to use it

### To Keep Your Bot Online 24/7:
You need one of these options:
1. **Upgrade to paid tier** (~$7/month) - Recommended
2. **Use a ping service** like UptimeRobot to ping your bot every 10 minutes
3. **Switch to Railway.app** ($5 trial credit, then ~$5/month, no sleep)

### Setting up UptimeRobot (to keep free bot awake):
1. Go to https://uptimerobot.com and sign up (free)
2. Create a new monitor:
   - Type: HTTP(s)
   - URL: Your Render.com URL (e.g., `https://randombot.onrender.com/health`)
   - Monitoring interval: 5 minutes
3. This will ping your bot every 5 minutes to keep it awake

## Troubleshooting

### Bot shows offline:
- Check Render logs for errors
- Verify TOKEN environment variable is set correctly
- Make sure your Discord bot token is valid

### Build failed:
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility

### Bot connects but commands don't work:
- Make sure you registered slash commands
- Check bot permissions in Discord Developer Portal

## Updating Your Bot

Whenever you make changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

Render will automatically redeploy your bot! 🚀

## Need Help?
- Check Render logs: Dashboard → Your service → Logs tab
- View Discord.js docs: https://discord.js.org
- Render support: https://render.com/docs
