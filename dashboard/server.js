require('dotenv').config();
const express = require('express');
const path = require('path');
const open = require('open');
const { connectDatabase, getDatabase } = require('../database');
const { connectSecondaryDatabase, getSecondaryDatabase } = require('../database-secondary');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3001;
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'planabot';

let isAuthenticated = false;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Password check middleware
function requireAuth(req, res, next) {
  if (isAuthenticated || req.path === '/api/login') {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === DASHBOARD_PASSWORD) {
    isAuthenticated = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  isAuthenticated = false;
  res.json({ success: true });
});

// MongoDB Stats
app.get('/api/mongodb/stats', requireAuth, async (req, res) => {
  try {
    const primary = getDatabase();
    const secondary = getSecondaryDatabase();
    
    const stats = {
      primary: null,
      secondary: null
    };

    if (primary) {
      const dbStats = await primary.stats();
      const collections = await primary.listCollections().toArray();
      
      stats.primary = {
        connected: true,
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexSize: dbStats.indexSize,
        totalSize: dbStats.dataSize + dbStats.indexSize,
        collections: collections.length,
        objects: dbStats.objects
      };
    } else {
      stats.primary = { connected: false };
    }

    if (secondary) {
      const dbStats = await secondary.stats();
      const collections = await secondary.listCollections().toArray();
      
      stats.secondary = {
        connected: true,
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexSize: dbStats.indexSize,
        totalSize: dbStats.dataSize + dbStats.indexSize,
        collections: collections.length,
        objects: dbStats.objects
      };
    } else {
      stats.secondary = { connected: false };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Birthday Stats
app.get('/api/birthdays/stats', requireAuth, async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json({ error: 'Database not connected' });
    }

    const birthdaysCol = db.collection('birthdays');
    const totalBirthdays = await birthdaysCol.countDocuments();

    // Get upcoming birthdays (next 7 days)
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    const allBirthdays = await birthdaysCol.find({}).toArray();
    const upcoming = allBirthdays.filter(b => {
      const daysUntil = getDaysUntilBirthday(b.month, b.day, currentMonth, currentDay);
      return daysUntil >= 0 && daysUntil <= 7;
    }).sort((a, b) => {
      const daysA = getDaysUntilBirthday(a.month, a.day, currentMonth, currentDay);
      const daysB = getDaysUntilBirthday(b.month, b.day, currentMonth, currentDay);
      return daysA - daysB;
    });

    res.json({
      total: totalBirthdays,
      upcoming: upcoming.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server Opt-ins Stats
app.get('/api/servers/stats', requireAuth, async (req, res) => {
  try {
    const secondary = getSecondaryDatabase();
    const primary = getDatabase();
    const db = secondary || primary;

    if (!db) {
      return res.json({ error: 'Database not connected' });
    }

    const optInsCol = db.collection('server_opt_ins');
    const channelsCol = primary ? primary.collection('birthday_channels') : null;

    const totalOptIns = await optInsCol.countDocuments({ enabled: true });
    const totalServers = channelsCol ? await channelsCol.countDocuments() : 0;

    res.json({
      totalOptIns,
      totalServers,
      configuredServers: totalServers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Render Health Check
app.get('/api/render/health', requireAuth, async (req, res) => {
  try {
    // Check if bot is running by checking database connections
    const primary = getDatabase();
    const secondary = getSecondaryDatabase();

    const health = {
      status: 'unknown',
      primaryDB: !!primary,
      secondaryDB: !!secondary,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };

    if (primary || secondary) {
      health.status = 'healthy';
    } else {
      health.status = 'degraded';
    }

    res.json(health);
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'unhealthy' });
  }
});

// Helper function
function getDaysUntilBirthday(month, day, currentMonth, currentDay) {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  let birthdayThisYear = new Date(currentYear, month - 1, day);
  let today = new Date(currentYear, currentMonth - 1, currentDay);
  
  if (birthdayThisYear < today) {
    birthdayThisYear = new Date(currentYear + 1, month - 1, day);
  }
  
  const diffTime = birthdayThisYear - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Start server
async function startDashboard() {
  console.log('🔄 Connecting to databases...');
  await connectDatabase();
  await connectSecondaryDatabase();

  app.listen(PORT, async () => {
    const url = `http://localhost:${PORT}`;
    console.log(`\n✅ Dashboard running at: ${url}`);
    console.log(`🔐 Password: ${DASHBOARD_PASSWORD}\n`);
    
    // Auto-open browser
    try {
      await open(url);
      console.log('🌐 Browser opened automatically');
    } catch (err) {
      console.log('⚠️  Could not auto-open browser. Please open manually:', url);
    }
  });
}

startDashboard();
