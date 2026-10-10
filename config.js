const fs = require('fs');
const path = require('path');
const { getDatabase } = require('./database');
const { getSecondaryDatabase } = require('./database-secondary');

const CONFIG_FILE = path.join(__dirname, 'plana_config.json');

let deadChatConfig = new Map();
let randomConfig = { default: "You have been chosen randomly!" };
let mentionConfig = { threshold: 5, cooldown: 5 };
let useDatabase = false;

// Get appropriate database for configs (secondary preferred, primary fallback)
function getConfigDB() {
  const secondary = getSecondaryDatabase();
  if (secondary) return secondary;
  return getDatabase();
}

// Initialize configs from database or file
async function initConfigs() {
  const db = getConfigDB();
  
  if (db) {
    useDatabase = true;
    console.log('✅ Using MongoDB for config storage');
    await loadFromDatabase();
  } else {
    useDatabase = false;
    console.log('⚠️  Using local file for config storage (configs will reset on restart)');
    loadFromFile();
  }
}

function loadFromFile() {
  if (fs.existsSync(CONFIG_FILE)) {
    const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    if (raw.__deadchat) deadChatConfig = new Map(Object.entries(raw.__deadchat));
    if (raw.__random)   randomConfig   = { ...randomConfig, ...raw.__random };
    if (raw.__mention)  mentionConfig  = { ...mentionConfig, ...raw.__mention };
  }
}

async function loadFromDatabase() {
  const db = getConfigDB();
  if (!db) return;

  try {
    // Load dead chat configs
    const deadchatCol = db.collection('deadchat_configs');
    const deadchatDocs = await deadchatCol.find({}).toArray();
    deadChatConfig = new Map();
    deadchatDocs.forEach(doc => {
      deadChatConfig.set(doc.channelId, {
        enabled: doc.enabled,
        warning: doc.warning,
        dead: doc.dead,
        lastMessage: doc.lastMessage || Date.now(),
        warned: doc.warned || false,
        deadSent: doc.deadSent || false
      });
    });

    // Load random config
    const randomCol = db.collection('random_config');
    const randomDoc = await randomCol.findOne({ _id: 'global' });
    if (randomDoc) {
      randomConfig = { default: randomDoc.default };
    }

    // Load mention config
    const mentionCol = db.collection('mention_config');
    const mentionDoc = await mentionCol.findOne({ _id: 'global' });
    if (mentionDoc) {
      mentionConfig = { threshold: mentionDoc.threshold, cooldown: mentionDoc.cooldown };
    }

    console.log(`📊 Loaded ${deadchatDocs.length} deadchat configs, random and mention configs from database`);
  } catch (err) {
    console.error('Failed to load configs from database:', err.message);
    loadFromFile();
  }
}

async function saveConfig() {
  if (useDatabase) {
    await saveToDatabase();
  } else {
    saveToFile();
  }
}

function saveToFile() {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({
    __deadchat: Object.fromEntries(deadChatConfig),
    __random:   randomConfig,
    __mention:  mentionConfig
  }, null, 2));
}

async function saveToDatabase() {
  const db = getConfigDB();
  if (!db) {
    saveToFile();
    return;
  }

  try {
    // Save dead chat configs
    const deadchatCol = db.collection('deadchat_configs');
    const deadchatOps = [];
    for (const [channelId, config] of deadChatConfig.entries()) {
      deadchatOps.push({
        updateOne: {
          filter: { channelId },
          update: { 
            $set: { 
              channelId, 
              enabled: config.enabled,
              warning: config.warning,
              dead: config.dead,
              lastMessage: config.lastMessage,
              warned: config.warned,
              deadSent: config.deadSent
            } 
          },
          upsert: true
        }
      });
    }
    if (deadchatOps.length > 0) {
      await deadchatCol.bulkWrite(deadchatOps);
    }

    // Save random config
    const randomCol = db.collection('random_config');
    await randomCol.updateOne(
      { _id: 'global' },
      { $set: { default: randomConfig.default } },
      { upsert: true }
    );

    // Save mention config
    const mentionCol = db.collection('mention_config');
    await mentionCol.updateOne(
      { _id: 'global' },
      { $set: { threshold: mentionConfig.threshold, cooldown: mentionConfig.cooldown } },
      { upsert: true }
    );
  } catch (err) {
    console.error('Failed to save configs to database:', err.message);
    saveToFile();
  }
}

let saveTimer = null;
async function saveConfigDebounced() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(saveConfig, 2000);
}

async function resetConfig() {
  deadChatConfig = new Map();
  randomConfig   = { default: "You have been chosen randomly!" };
  mentionConfig  = { threshold: 5, cooldown: 5 };
  await saveConfig();
}

module.exports = { 
  deadChatConfig, 
  randomConfig, 
  mentionConfig, 
  initConfigs,
  saveConfig, 
  saveConfigDebounced, 
  resetConfig 
};
