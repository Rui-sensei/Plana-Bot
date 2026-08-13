# Complete Setup Guide - Deploy Your Bot to Render.com

## ✅ Your Bot is Ready for Deployment!

I've prepared your bot with:
- ✅ Health check endpoint (prevents Render from thinking bot is down)
- ✅ Updated package.json with start script
- ✅ Added render.yaml configuration
- ✅ Proper .gitignore to protect secrets

## 🚀 Quick Start (3 Main Steps)

### Step 1: Install Git (if you don't have it)
1. Download Git: https://git-scm.com/download/win
2. Install with default settings
3. Restart your computer or open a new terminal

### Step 2: Push to GitHub
Open a new terminal/PowerShell in this folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Ready for Render deployment"

# Create GitHub repo and push
# (You'll need to create a repo on GitHub first at https://github.com/new)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Render
1. Go to https://render.com and sign up (use GitHub login)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: randombot
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variable:
   - **Key**: `TOKEN`
   - **Value**: (Your Discord bot token from .env file)
6. Click "Create Web Service"

## ⚠️ IMPORTANT: Free Tier Limitation

**Render's free tier sleeps after 15 minutes of inactivity!**

Your bot will:
- ✅ Work perfectly when active
- ❌ Go offline after 15 minutes of no activity
- 🔄 Take ~30 seconds to wake up when someone uses it

### Solutions:

**Option A: Keep Free Bot Awake (90% uptime)**
Use UptimeRobot to ping your bot every 5 minutes:
1. Sign up at https://uptimerobot.com (free)
2. Add monitor with your Render URL: `https://your-bot.onrender.com/health`
3. Set interval to 5 minutes

**Option B: Upgrade to Paid ($7/month)**
- Go to your Render dashboard
- Upgrade to paid plan
- Your bot stays online 24/7 with no sleep

**Option C: Switch to Railway.app**
- $5 trial credit (lasts ~1 month)
- Then ~$5/month
- No sleep, easier setup
- (Let me know if you want Railway instructions instead)

## 📋 Checklist Before Deploying

- [ ] Git installed
- [ ] GitHub account created
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Render.com account created
- [ ] Discord bot token ready
- [ ] Environment variable added on Render

## 🔧 Files I Added/Modified

1. **package.json** - Added start script and Node version
2. **index.js** - Added health check server for Render
3. **render.yaml** - Configuration for Render deployment
4. **.dockerignore** - Excludes unnecessary files
5. **DEPLOYMENT.md** - Detailed deployment guide
6. **SETUP_GUIDE.md** - This file!

## 💡 Quick Commands Reference

```bash
# Check if Git is installed
git --version

# View your Discord bot token (if needed)
type .env

# Test bot locally before deploying
npm start

# Check Git status
git status

# Push updates after making changes
git add .
git commit -m "Update bot"
git push
```

## 🆘 Need Help?

**Common Issues:**

1. **"git: command not found"**
   - Install Git from https://git-scm.com/download/win
   - Restart terminal/computer

2. **"Permission denied (publickey)"**
   - Set up GitHub SSH keys or use HTTPS instead
   - https://docs.github.com/en/authentication

3. **Bot shows offline on Discord**
   - Check Render logs in dashboard
   - Verify TOKEN environment variable is correct
   - Wait 2-3 minutes for deployment to complete

4. **Free tier keeps sleeping**
   - Set up UptimeRobot (see Option A above)
   - Or upgrade to paid plan

## 🎯 Next Steps

1. Follow Step 1-3 above
2. Wait 2-5 minutes for deployment
3. Check your Discord - bot should be online!
4. (Optional) Set up UptimeRobot to prevent sleeping

**Your bot uses only ~74MB RAM, so it will run perfectly on Render's free tier!** 🎉

---

Need help with any step? Just ask! 😊
