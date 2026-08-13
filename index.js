require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommands }           = require('./commands/slashCommands');
const { loadStudentData }            = require('./commands/trivia');
const { scheduleBirthdayCheck }      = require('./commands/birthday');
const registerMessageHandler         = require('./handlers/messages');
const registerInteractionHandler     = require('./handlers/interactions');

// Health check server for Render.com
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!');
  } else {
    res.writeHead(404);
    res.end();
  }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
  scheduleBirthdayCheck(client);
});

client.on('error', (err) => {
  console.error('Client error:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

registerMessageHandler(client);
registerInteractionHandler(client);

registerCommands();
loadStudentData().catch(err => console.error('Failed to load student data:', err.message));

client.login(process.env.TOKEN);
