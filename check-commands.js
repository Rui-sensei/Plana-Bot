require('dotenv').config();
const { REST, Routes } = require('discord.js');

const TOKEN  = process.env.TOKEN;
const APP_ID = process.env.APP_ID;

async function checkCommands() {
  if (!TOKEN || !APP_ID) {
    console.error('❌ Missing TOKEN or APP_ID in .env file');
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  
  try {
    console.log('🔍 Fetching currently registered commands...\n');

    const commands = await rest.get(
      Routes.applicationCommands(APP_ID)
    );

    if (commands.length === 0) {
      console.log('⚠️  No commands are currently registered!');
      console.log('💡 Run: node register-commands.js');
    } else {
      console.log(`✅ Found ${commands.length} registered commands:\n`);
      commands.forEach((cmd, i) => {
        console.log(`${i + 1}. /${cmd.name} - ${cmd.description}`);
      });
      
      // Check if profile exists
      const profileExists = commands.some(c => c.name === 'profile');
      console.log(`\n🔍 Profile command status: ${profileExists ? '✅ REGISTERED' : '❌ NOT FOUND'}`);
    }
  } catch (error) {
    console.error('❌ Failed to fetch commands:', error.message);
    
    if (error.code === 401) {
      console.error('\n🔑 Invalid Token: Check your TOKEN in the .env file');
    }
    
    process.exit(1);
  }
}

checkCommands();
