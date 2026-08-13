const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, 'plana_config.json');

let deadChatConfig = new Map();
let randomConfig = { default: "You have been chosen randomly!" };
let mentionConfig = { threshold: 5, cooldown: 5 };

if (fs.existsSync(CONFIG_FILE)) {
  const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  if (raw.__deadchat) deadChatConfig = new Map(Object.entries(raw.__deadchat));
  if (raw.__random)   randomConfig   = { ...randomConfig, ...raw.__random };
  if (raw.__mention)  mentionConfig  = { ...mentionConfig, ...raw.__mention };
}

function saveConfig() {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({
    __deadchat: Object.fromEntries(deadChatConfig),
    __random:   randomConfig,
    __mention:  mentionConfig
  }, null, 2));
}

let saveTimer = null;
function saveConfigDebounced() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(saveConfig, 2000);
}

function resetConfig() {
  deadChatConfig = new Map();
  randomConfig   = { default: "You have been chosen randomly!" };
  mentionConfig  = { threshold: 5, cooldown: 5 };
  saveConfig();
}

module.exports = { deadChatConfig, randomConfig, mentionConfig, saveConfig, saveConfigDebounced, resetConfig };
