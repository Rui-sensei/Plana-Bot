const { MongoClient } = require('mongodb');

let client = null;
let db = null;
let isConnected = false;

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDatabase() {
  if (isConnected && client) {
    return db;
  }

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('⚠️  Falling back to local JSON file storage (data will be lost on restart)');
    return null;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Test the connection
    await client.db('admin').command({ ping: 1 });
    
    db = client.db('planabot');
    isConnected = true;
    console.log('✅ Successfully connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.log('⚠️  Falling back to local JSON file storage (data will be lost on restart)');
    return null;
  }
}

function getDatabase() {
  if (!isConnected || !db) {
    return null;
  }
  return db;
}

async function closeDatabase() {
  if (client) {
    await client.close();
    isConnected = false;
    console.log('🔌 MongoDB connection closed');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});

module.exports = {
  connectDatabase,
  getDatabase,
  closeDatabase
};
