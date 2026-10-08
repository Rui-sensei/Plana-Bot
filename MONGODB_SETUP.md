# MongoDB Setup Guide

This bot uses MongoDB Atlas for persistent data storage. Without MongoDB, birthday data will be lost every time the bot restarts.

## Why MongoDB?

- **Persistent Storage**: Data survives bot restarts and redeployments
- **Free Forever**: MongoDB Atlas free tier is perfect for Discord bots
- **Easy to Use**: Simple setup, no maintenance required
- **Scalable**: Handles thousands of birthdays with ease

## Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google, GitHub, or email
3. Answer the welcome questions (choose "Learn MongoDB")

### Step 2: Create a Free Cluster

1. Choose **M0 Sandbox** (FREE tier)
2. Select cloud provider: **AWS** (or any)
3. Select region: Choose closest to you
4. Cluster name: `PlanaBot` (or leave as `Cluster0`)
5. Click **"Create"** (takes 1-3 minutes)

### Step 3: Create Database User

1. **Security Quickstart** appears automatically
2. Choose **"Username and Password"**
3. Username: `planabot` (or any name)
4. Password: Click **"Autogenerate Secure Password"** and **SAVE IT**
5. Click **"Create User"**

### Step 4: Allow Network Access

1. Click **"Add IP Address"**
2. Choose **"Allow Access from Anywhere"** (enter `0.0.0.0/0`)
3. Click **"Add Entry"**
4. Click **"Finish and Close"**

### Step 5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Drivers"** or **"Connect your application"**
3. Select:
   - Driver: **Node.js** (NOT Java!)
   - Version: **6.0 or later**
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your actual credentials

**Example:**
```
mongodb+srv://planabot:MySecurePass123@cluster0.lbxkts.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Add to Render.com

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your bot service
3. Click **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Add:
   - **Key:** `MONGODB_URI`
   - **Value:** Paste your complete connection string
6. Click **"Save Changes"**
7. Render will automatically redeploy your bot

### Step 7: Verify

After deployment, check the Render logs for:
```
✅ Successfully connected to MongoDB
📊 Loaded X birthdays and Y channels from database
```

If you see this, you're done! 🎉

## Troubleshooting

### Error: "Failed to connect to MongoDB"

**Possible causes:**
1. **Wrong connection string**: Make sure you replaced `<username>` and `<password>`
2. **Network access not configured**: Go to "Network Access" and add `0.0.0.0/0`
3. **Wrong database user**: Create a new user in "Database Access"

### Error: "Authentication failed"

**Solution:** Your password is wrong. Either:
- Create a new database user
- Or reset the password for existing user in "Database Access"

### Warning: "Falling back to local file storage"

This means `MONGODB_URI` is not set in environment variables. The bot will work but birthdays will be lost on restart.

**Solution:** Add `MONGODB_URI` to Render environment variables

## Data Storage

The bot stores:
- **Collection: `birthdays`**: User birthdays (userId, month, day)
- **Collection: `birthday_channels`**: Server birthday announcement channels
- **Database name:** `planabot`

## Free Tier Limits

MongoDB Atlas M0 (Free) includes:
- ✅ 512 MB storage (enough for **500,000+ birthdays**)
- ✅ Shared RAM and CPU
- ✅ No credit card required
- ✅ Never expires

**You will never run out of space for birthday data!**

## Security Best Practices

1. ✅ **Never commit** your connection string to Git
2. ✅ **Use environment variables** (already configured)
3. ✅ **Use strong passwords** (auto-generated recommended)
4. ✅ **Limit network access** if possible (but `0.0.0.0/0` is fine for this bot)

## Alternative: Without MongoDB

If you don't want to use MongoDB:
- The bot will use local JSON file storage
- ⚠️ **Data will be lost** every time the bot restarts
- ⚠️ **Not recommended** for production use

## Need Help?

- **MongoDB Documentation**: https://docs.mongodb.com/
- **MongoDB Atlas Tutorial**: https://docs.atlas.mongodb.com/getting-started/
- **GitHub Issues**: https://github.com/Rui-sensei/Plana-Bot/issues

---

**Made with 💜 by Rui-sensei**
