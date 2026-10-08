# Plana Bot Dashboard

A local web dashboard for monitoring and managing your Plana Bot.

## Features

### 📊 Real-Time Monitoring:
- MongoDB Primary database status and storage
- MongoDB Secondary database status and storage
- Render deployment health
- Bot uptime and memory usage

### 🎂 Birthday Management:
- Total birthdays count
- Upcoming birthdays (next 7 days)
- Quick overview of birthday data

### 🔐 Security:
- Password protected access
- Session-based authentication
- No data exposed without login

### 🔄 Auto-Refresh:
- Dashboard updates every 30 seconds
- Manual refresh available
- Real-time status indicators

---

## Installation

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server
- `open` - Auto-open browser

### 2. Configure Password

Add to your `.env` file:

```env
DASHBOARD_PASSWORD=your_secure_password_here
DASHBOARD_PORT=3001
```

**Default password:** `planabot` (change this!)

---

## Usage

### Starting the Dashboard

```bash
npm run dashboard
```

This will:
1. Connect to your MongoDB databases
2. Start web server on port 3001
3. Automatically open your browser
4. Display login screen

### Login

Enter your dashboard password (from `.env` file).

**Default:** `planabot`

---

## Dashboard Sections

### 1. Status Cards

**Primary MongoDB:**
- Connection status
- Data size
- Number of objects
- Collections count

**Secondary MongoDB:**
- Connection status (or "Not Connected" if using fallback)
- Data size
- Number of objects
- Collections count

**Render Status:**
- Overall health (Healthy/Degraded/Unhealthy)
- Bot uptime
- Database connections

**Birthdays:**
- Total birthdays stored
- Upcoming birthdays count

### 2. Storage Usage

**Visual progress bars showing:**
- Used storage vs. 512 MB limit
- Percentage used
- Color-coded warnings:
  - Green: < 60%
  - Orange: 60-80%
  - Red: > 80%

### 3. Upcoming Birthdays

**Next 7 days:**
- User ID
- Birthday date (Month Day)
- Days until birthday
- Shows "Today!", "Tomorrow", or "in X days"

### 4. Bot Health

**Detailed metrics:**
- Bot status
- Uptime (days, hours, minutes)
- Memory usage (RSS and Heap)
- Database connection status

---

## Auto-Refresh

Dashboard automatically refreshes every **30 seconds** to show latest data.

---

## Security Best Practices

### 1. Change Default Password

In `.env`:
```env
DASHBOARD_PASSWORD=MyStr0ngP@ssw0rd123
```

### 2. Don't Expose Dashboard

**Dashboard runs locally only:**
- Only accessible on your PC
- Not accessible from internet
- URL: `http://localhost:3001`

**Never:**
- ❌ Deploy dashboard to Render
- ❌ Make dashboard public
- ❌ Share your password
- ❌ Commit `.env` to Git

### 3. Use Strong Password

✅ Mix of uppercase, lowercase, numbers, symbols
✅ At least 12 characters
✅ Unique password (not used elsewhere)

---

## Troubleshooting

### Dashboard Won't Start

**Error: "Cannot find module 'express'"**
```bash
npm install
```

**Error: "Port 3001 already in use"**

Change port in `.env`:
```env
DASHBOARD_PORT=3002
```

### Browser Doesn't Open Automatically

**Manually open:**
```
http://localhost:3001
```

### "Invalid Password" Error

Check your `.env` file:
```env
DASHBOARD_PASSWORD=your_password_here
```

Make sure there are no spaces before/after the password.

### Database Shows "Not Connected"

**Check:**
1. Is your bot running on Render?
2. Are MongoDB connection strings correct in `.env`?
3. Run `node index.js` first to test connections

**Fix:**
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas network access
- Restart dashboard: `npm run dashboard`

### "Secondary Database Not Connected"

**This is normal if:**
- You haven't set up a secondary database yet
- `MONGODB_URI_SECONDARY` not in `.env`

**Bot automatically falls back to primary database.**

---

## FAQ

**Q: Can I access dashboard from another device?**
A: No, it only runs on localhost (your PC). This is for security.

**Q: Can others access my dashboard?**
A: No, unless they have physical access to your PC and your password.

**Q: Does dashboard work when bot is offline?**
A: Yes! Dashboard connects directly to MongoDB, so you can check data even when bot is down.

**Q: How do I change the password?**
A: Edit `DASHBOARD_PASSWORD` in `.env` file and restart dashboard.

**Q: Can I run dashboard and bot at the same time?**
A: Yes! They're separate processes. Dashboard doesn't interfere with the bot.

**Q: Will dashboard use my MongoDB free tier quota?**
A: Very minimally. Dashboard only reads data, doesn't write. Negligible impact.

**Q: Can I customize the dashboard?**
A: Yes! Edit files in `dashboard/` folder:
  - `index.html` - Structure
  - `styles.css` - Appearance
  - `script.js` - Functionality
  - `server.js` - Backend

---

## Advanced Usage

### Custom Port

In `.env`:
```env
DASHBOARD_PORT=8080
```

Access at: `http://localhost:8080`

### Disable Auto-Open Browser

Edit `dashboard/server.js` and comment out:
```javascript
// await open(url);
```

### Add Custom Metrics

Edit `dashboard/server.js` and add new API endpoints:

```javascript
app.get('/api/custom/stats', requireAuth, async (req, res) => {
  // Your custom logic
  res.json({ myData: 'value' });
});
```

---

## Screenshots

### Login Screen
- Clean, simple password entry
- Error messages for invalid login

### Dashboard Overview
- 4 status cards at top
- Storage bars in middle
- Upcoming birthdays list
- Bot health metrics at bottom

### Color Scheme
- Purple theme (#8A2BE2)
- Green for success (✅)
- Red for errors (❌)
- Orange for warnings (⚠️)

---

## Technical Details

**Backend:**
- Express.js web server
- RESTful API
- MongoDB native driver

**Frontend:**
- Vanilla JavaScript (no frameworks)
- CSS Grid layout
- Responsive design

**Security:**
- Session-based auth
- No tokens/cookies needed
- Single-session limit

**Performance:**
- Minimal resource usage
- Efficient MongoDB queries
- Auto-refresh optimization

---

## Future Enhancements

Planned features:
- 🗑️ Cleanup tools (delete inactive users)
- 📊 Charts and graphs
- 📋 Admin logs viewer
- 💾 Export data to CSV
- 🔍 Search functionality
- 📱 Mobile-responsive improvements

---

**Made with 💜 by Rui-sensei**
