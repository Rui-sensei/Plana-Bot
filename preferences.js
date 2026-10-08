const { getDatabase } = require('./database');
const { getSecondaryDatabase } = require('./database-secondary');

// Get the appropriate database for preferences
// Priority: Secondary DB > Primary DB > null
function getPreferencesDB() {
  const secondary = getSecondaryDatabase();
  if (secondary) return secondary;
  
  // Fallback to primary database
  const primary = getDatabase();
  if (primary) {
    console.log('ℹ️  Using primary database for preferences (secondary not available)');
    return primary;
  }
  
  return null;
}

// Server Opt-In/Out Management
async function setServerOptIn(userId, guildId, enabled) {
  const db = getPreferencesDB();
  if (!db) {
    console.error('Cannot save opt-in preference: No database available');
    return false;
  }

  try {
    const collection = db.collection('server_opt_ins');
    await collection.updateOne(
      { userId, guildId },
      { 
        $set: { 
          userId, 
          guildId, 
          enabled,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.error('Failed to save opt-in preference:', err.message);
    return false;
  }
}

async function getServerOptIn(userId, guildId) {
  const db = getPreferencesDB();
  if (!db) return null;

  try {
    const collection = db.collection('server_opt_ins');
    const result = await collection.findOne({ userId, guildId });
    return result;
  } catch (err) {
    console.error('Failed to get opt-in preference:', err.message);
    return null;
  }
}

async function isServerEnabled(userId, guildId) {
  const optIn = await getServerOptIn(userId, guildId);
  
  // If no record exists, birthday announcements are disabled by default
  if (!optIn) return false;
  
  return optIn.enabled === true;
}

async function getUserEnabledServers(userId) {
  const db = getPreferencesDB();
  if (!db) return [];

  try {
    const collection = db.collection('server_opt_ins');
    const results = await collection.find({ 
      userId, 
      enabled: true 
    }).toArray();
    
    return results.map(r => r.guildId);
  } catch (err) {
    console.error('Failed to get enabled servers:', err.message);
    return [];
  }
}

async function removeUserOptIns(userId) {
  const db = getPreferencesDB();
  if (!db) return false;

  try {
    const collection = db.collection('server_opt_ins');
    await collection.deleteMany({ userId });
    return true;
  } catch (err) {
    console.error('Failed to remove opt-ins:', err.message);
    return false;
  }
}

// Admin Logs
async function logAdminAction(userId, guildId, command, details = {}) {
  const db = getPreferencesDB();
  if (!db) return;

  try {
    const collection = db.collection('admin_logs');
    await collection.insertOne({
      userId,
      guildId,
      command,
      details,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Failed to log admin action:', err.message);
  }
}

async function getRecentAdminLogs(guildId, limit = 10) {
  const db = getPreferencesDB();
  if (!db) return [];

  try {
    const collection = db.collection('admin_logs');
    const logs = await collection
      .find({ guildId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return logs;
  } catch (err) {
    console.error('Failed to get admin logs:', err.message);
    return [];
  }
}

// Initialization
async function initPreferences() {
  const db = getPreferencesDB();
  
  if (db) {
    const dbType = getSecondaryDatabase() ? 'secondary' : 'primary';
    console.log(`✅ Using ${dbType} database for preferences`);
    
    // Create indexes for performance
    try {
      await db.collection('server_opt_ins').createIndex({ userId: 1, guildId: 1 }, { unique: true });
      await db.collection('admin_logs').createIndex({ guildId: 1, timestamp: -1 });
      console.log('📊 Preferences indexes created');
    } catch (err) {
      console.error('Failed to create preference indexes:', err.message);
    }
  } else {
    console.warn('⚠️  No database available for preferences - features will be limited');
  }
}

module.exports = {
  setServerOptIn,
  getServerOptIn,
  isServerEnabled,
  getUserEnabledServers,
  removeUserOptIns,
  logAdminAction,
  getRecentAdminLogs,
  initPreferences
};
