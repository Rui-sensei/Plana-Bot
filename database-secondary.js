const { MongoClient } = require('mongodb');

let client = null;
let db = null;
let isConnected = false;

const MONGODB_URI_SECONDARY = process.env.MONGODB_URI_SECONDARY;

async function connectSecondaryDatabase() {
  if (isConnected && client) {
    return db;
  }

  if (!MONGODB_URI_SECONDARY) {
    console.log('ℹ️  MONGODB_URI_SECONDARY not found - preferences will use primary database as fallback');
    return null;
  }

  try {
    console.log('🔄 Connecting to MongoDB Secondary (Preferences)...');
    client = new MongoClient(MONGODB_URI_SECONDARY, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    await client.connect();
    
    // Test the connection
    await client.db('admin').command({ ping: 1 });
    
    db = client.db('planabot_preferences');
    isConnected = true;
    console.log('✅ Successfully connected to MongoDB Secondary (Preferences)');
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Secondary:', error.message);
    console.log('⚠️  Falling back to primary database for preferences');
    return null;
  }
}

function getSecondaryDatabase() {
  if (!isConnected || !db) {
    return null;
  }
  return db;
}

async function closeSecondaryDatabase() {
  if (client) {
    await client.close();
    isConnected = false;
    console.log('🔌 MongoDB Secondary connection closed');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeSecondaryDatabase();
});

process.on('SIGTERM', async () => {
  await closeSecondaryDatabase();
});

module.exports = {
  connectSecondaryDatabase,
  getSecondaryDatabase,
  closeSecondaryDatabase
};
