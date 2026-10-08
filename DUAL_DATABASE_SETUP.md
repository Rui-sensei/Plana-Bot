# Dual Database Setup Guide

Plana Bot uses **two MongoDB databases** for data separation and improved organization:

## Database Architecture:

### **Primary Database** (MONGODB_URI)
- **Purpose:** Core birthday data
- **Database:** `planabot`
- **Collections:**
  - `birthdays` - User birthday information (userId, month, day)
  - `birthday_channels` - Server announcement channel configurations

### **Secondary Database** (MONGODB_URI_SECONDARY) - Optional
- **Purpose:** User preferences and audit logs
- **Database:** `planabot_preferences`
- **Collections:**
  - `server_opt_ins` - Server-specific birthday announcement preferences
  - `admin_logs` - Admin command audit trail

---

## Why Two Databases?

### Benefits:
- ✅ **Data Separation** - Birthday data isolated from preferences
- ✅ **Double Storage** - 512 MB × 2 = 1024 MB total (free tier)
- ✅ **Independent Scaling** - Upgrade one without affecting the other
- ✅ **Backup Redundancy** - If one fails, core features still work
- ✅ **Security Isolation** - Different credentials for each database

### Fallback Behavior:
If `MONGODB_URI_SECONDARY` is not configured:
- ⚠️ Preferences will use the primary database as fallback
- ✅ Bot continues to work normally
- ℹ️ All data stored in a single database

---

## Setup Instructions:

### Step 1: Create Primary Database (Required)

1. Follow the standard [MongoDB Setup Guide](MONGODB_SETUP.md)
2. Create cluster (e.g., `Cluster0` or `PlanaBot-Core`)
3. Add connection string to Render:
   - **Key:** `MONGODB_URI`
   - **Value:** Your primary connection string

### Step 2: Create Secondary Database (Optional but Recommended)

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com
2. **Create a new cluster:**
   - Click **"Create"** or **"Build a Database"**
   - Choose **M0 FREE** tier
   - Name: `PlanaBot-Preferences` or `Cluster1`
   - Same cloud provider and region as primary (recommended)

3. **Create Database User:**
   - Go to **"Database Access"**
   - Click **"Add New Database User"**
   - Username: `planabot-prefs` (or any name)
   - Password: Auto-generate or create custom
   - **SAVE THE PASSWORD!**
   - Built-in Role: **"Atlas admin"** or **"Read and write to any database"**

4. **Configure Network Access:**
   - Go to **"Network Access"**
   - Click **"Add IP Address"**
   - Choose **"Allow Access from Anywhere"** (`0.0.0.0/0`)
   - Comment: "Render deployment access"
   - **Uncheck "temporary"**
   - Click **"Confirm"**

5. **Get Connection String:**
   - Click **"Connect"** on your cluster
   - Choose **"Drivers"**
   - Select: **Node.js** (NOT Java!)
   - Version: **6.0 or later**
   - Copy connection string:
     ```
     mongodb+srv://<username>:<password>@cluster1.xxxxx.mongodb.net/?appName=Cluster1
     ```
   - Replace `<username>` and `<password>` with your actual credentials

6. **Add to Render:**
   - Go to Render dashboard
   - Click **"Environment"** tab
   - Click **"Add Environment Variable"**
   - **Key:** `MONGODB_URI_SECONDARY`
   - **Value:** Your secondary connection string
   - Click **"Save Changes"**

---

## Verification:

After deployment, check Render logs for:

```
✅ Successfully connected to MongoDB (Primary)
✅ Successfully connected to MongoDB Secondary (Preferences)
📊 Loaded X birthdays from database
✅ Using secondary database for preferences
📊 Preferences indexes created
```

If secondary database is not configured:
```
ℹ️  MONGODB_URI_SECONDARY not found - preferences will use primary database as fallback
ℹ️  Using primary database for preferences (secondary not available)
```

Both scenarios are valid and the bot will work correctly!

---

## How It Works:

### Birthday Announcements Flow:

1. **User sets birthday:**
   - `/birthday set month:11 day:8`
   - Saved to **Primary DB** (global)
   - Enabled for current server in **Secondary DB**

2. **User enables in another server:**
   - `/birthday enable`
   - Opt-in saved to **Secondary DB**

3. **Birthday announcement:**
   - Bot checks **Primary DB** for birthdays today
   - Bot checks **Secondary DB** for which servers are enabled
   - Announces only in enabled servers

### Data Isolation:

**Primary Database Always Contains:**
- User birthdays (permanent data)
- Server birthday channel configs

**Secondary Database Contains:**
- Server-specific opt-ins/outs
- Admin action logs (audit trail)

If secondary database fails:
- ✅ Birthdays still work (from primary)
- ⚠️ Opt-in preferences unavailable
- ⚠️ Admin logs not recorded

---

## Storage Estimates:

### Primary Database:
- **100,000 users:** ~5 MB
- **System overhead:** ~147 MB
- **Total:** ~152 MB / 512 MB (30%)

### Secondary Database:
- **100,000 users × 3 servers:** ~12 MB
- **Admin logs (1 year):** ~5 MB
- **System overhead:** ~147 MB
- **Total:** ~164 MB / 512 MB (32%)

**Combined:** ~316 MB used / 1024 MB available (31%)

---

## Maintenance:

### Monitoring Both Databases:

1. Go to MongoDB Atlas
2. Switch between clusters in the dropdown
3. Check storage usage for each

### Backing Up:

Both databases should be backed up separately:
- Export birthdays from primary
- Export preferences from secondary

### Upgrading:

You can upgrade either database independently:
- Upgrade primary for more birthday storage
- Upgrade secondary for more preference/log storage
- Or upgrade both

---

## Troubleshooting:

### Secondary Database Won't Connect:

**Check:**
1. Connection string is correct (no typos)
2. Username/password are correct
3. Network access allows `0.0.0.0/0`
4. Cluster is not paused/suspended

**Fix:**
- Bot will automatically fallback to primary database
- All features continue to work
- Fix connection string and redeploy

### Want to Switch Back to Single Database:

1. Remove `MONGODB_URI_SECONDARY` from Render
2. Redeploy
3. Bot uses primary database for everything

---

## Security Best Practices:

1. ✅ **Different Passwords** - Use different passwords for each database
2. ✅ **Environment Variables** - Never commit connection strings to Git
3. ✅ **Network Access** - `0.0.0.0/0` is fine for Discord bots
4. ✅ **User Permissions** - Use "Read and write to any database" role
5. ✅ **Regular Monitoring** - Check storage usage monthly

---

## FAQ:

**Q: Do I need two databases?**
A: No! Single database works fine. Two databases provide better organization and double storage.

**Q: Can I add the secondary database later?**
A: Yes! Just create it and add `MONGODB_URI_SECONDARY` to Render anytime.

**Q: What if I delete the secondary database?**
A: Bot automatically falls back to primary. No data loss for birthdays.

**Q: Can I use different MongoDB accounts?**
A: Yes, but same account with two clusters is easier to manage.

**Q: Will this cost money?**
A: No! Both can use free M0 tier (512 MB each).

---

**Made with 💜 by Rui-sensei**
