const { EmbedBuilder } = require('discord.js');
const fs   = require('fs');
const path = require('path');
const { getDatabase } = require('../database');

const BIRTHDAY_FILE = path.join(__dirname, '..', 'data', 'birthdays.json');

// In-memory cache
let birthdays = {};
let birthdayChannels = {};
let useDatabase = false;

async function initBirthdays() {
  const db = getDatabase();
  
  if (db) {
    useDatabase = true;
    console.log('✅ Using MongoDB for birthday storage');
    await loadFromDatabase();
  } else {
    useDatabase = false;
    console.log('⚠️  Using local file for birthday storage (data will be lost on restart)');
    loadFromFile();
  }
}

function loadFromFile() {
  if (fs.existsSync(BIRTHDAY_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(BIRTHDAY_FILE, 'utf8'));
      birthdays        = raw.birthdays        || {};
      birthdayChannels = raw.birthdayChannels || {};
    } catch (err) {
      console.error('Failed to load birthdays from file:', err.message);
    }
  }
}

function saveToFile() {
  try {
    const dir = path.dirname(BIRTHDAY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BIRTHDAY_FILE, JSON.stringify({ birthdays, birthdayChannels }, null, 2));
  } catch (err) {
    console.error('Failed to save birthdays to file:', err.message);
  }
}

async function loadFromDatabase() {
  const db = getDatabase();
  if (!db) return;

  try {
    const birthdaysCol = db.collection('birthdays');
    const channelsCol = db.collection('birthday_channels');

    // Load birthdays
    const birthdayDocs = await birthdaysCol.find({}).toArray();
    birthdays = {};
    birthdayDocs.forEach(doc => {
      birthdays[doc.userId] = { month: doc.month, day: doc.day };
    });

    // Load channels
    const channelDocs = await channelsCol.find({}).toArray();
    birthdayChannels = {};
    channelDocs.forEach(doc => {
      birthdayChannels[doc.guildId] = doc.channelId;
    });

    console.log(`📊 Loaded ${birthdayDocs.length} birthdays and ${channelDocs.length} channels from database`);
  } catch (err) {
    console.error('Failed to load from database:', err.message);
  }
}

async function saveBirthdays() {
  if (useDatabase) {
    await saveToDatabase();
  } else {
    saveToFile();
  }
}

async function saveToDatabase() {
  const db = getDatabase();
  if (!db) {
    saveToFile(); // Fallback
    return;
  }

  try {
    const birthdaysCol = db.collection('birthdays');
    const channelsCol = db.collection('birthday_channels');

    // Save all birthdays (upsert)
    const birthdayOps = Object.entries(birthdays).map(([userId, data]) => ({
      updateOne: {
        filter: { userId },
        update: { $set: { userId, month: data.month, day: data.day } },
        upsert: true
      }
    }));

    if (birthdayOps.length > 0) {
      await birthdaysCol.bulkWrite(birthdayOps);
    }

    // Save all channels (upsert)
    const channelOps = Object.entries(birthdayChannels).map(([guildId, channelId]) => ({
      updateOne: {
        filter: { guildId },
        update: { $set: { guildId, channelId } },
        upsert: true
      }
    }));

    if (channelOps.length > 0) {
      await channelsCol.bulkWrite(channelOps);
    }
  } catch (err) {
    console.error('Failed to save to database:', err.message);
    saveToFile(); // Fallback
  }
}

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_IN_MONTH = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

async function setBirthday(userId, month, day) {
  birthdays[userId] = { month, day };
  await saveBirthdays();
}

async function removeBirthday(userId) {
  delete birthdays[userId];
  
  if (useDatabase) {
    const db = getDatabase();
    if (db) {
      try {
        await db.collection('birthdays').deleteOne({ userId });
      } catch (err) {
        console.error('Failed to delete birthday from database:', err.message);
      }
    }
  }
  
  await saveBirthdays();
}

function getBirthday(userId) {
  return birthdays[userId] || null;
}

function buildProfileEmbed(member) {
  const birthday = getBirthday(member.id);
  const embed = new EmbedBuilder()
    .setTitle(`${member.displayName || member.user.username}'s Profile`)
    .setThumbnail(member.user.displayAvatarURL())
    .setColor(0x8A2BE2)
    .addFields(
      { name: '👤 Username', value: member.user.username, inline: true },
      { name: '🆔 User ID', value: member.id, inline: true },
      { name: '📅 Joined Server', value: member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>` : 'Unknown', inline: true }
    );

  if (birthday) {
    const birthdayStr = `${MONTH_NAMES[birthday.month]} ${birthday.day}`;
    embed.addFields({ name: '🎂 Birthday', value: birthdayStr, inline: true });
  } else {
    embed.addFields({ name: '🎂 Birthday', value: 'Not set', inline: true });
  }

  embed.setFooter({ text: 'Set your birthday with /birthday set' });
  return embed;
}

async function setBirthdayChannel(guildId, channelId) {
  birthdayChannels[guildId] = channelId;
  await saveBirthdays();
}

function getTodayBirthdays() {
  const now   = new Date();
  const month = now.getMonth() + 1;
  const day   = now.getDate();
  return Object.entries(birthdays)
    .filter(([, b]) => b.month === month && b.day === day)
    .map(([userId]) => userId);
}

const BIRTHDAY_IMAGE = path.join(__dirname, '..', 'images', 'Birthday', '__plana_blue_archive_drawn_by_cinamon_cinamori__e696a3103f82d337441f8dbdd7001872.png');

function buildBirthdayEmbed(member) {
  const name = member.displayName || member.user.username;
  return new EmbedBuilder()
    .setTitle('🎂 Happy Birthday!')
    .setDescription(
      `Today is **${name}**'s birthday! 🎉\n\n` +
      `...Plana has prepared a small acknowledgment. Happy birthday, <@${member.id}>. ` +
      `Don't expect Plana to say it twice. (˶˃ ᵕ ˂˶)`
    )
    .setColor(0xff69b4)
    .setThumbnail(member.user.displayAvatarURL())
    .setImage('attachment://__plana_blue_archive_drawn_by_cinamon_cinamori__e696a3103f82d337441f8dbdd7001872.png')
    .setTimestamp();
}

// Called once a day — checks for birthdays and announces them
async function checkBirthdays(client) {
  const { isServerEnabled } = require('../preferences');
  const todayIds = getTodayBirthdays();
  if (todayIds.length === 0) return;

  for (const [guildId, channelId] of Object.entries(birthdayChannels)) {
    const channel = client.channels.cache.get(channelId);
    if (!channel) continue;

    for (const userId of todayIds) {
      try {
        // Check if user has enabled announcements in this server
        const enabled = await isServerEnabled(userId, guildId);
        if (!enabled) {
          console.log(`Skipping birthday announcement for ${userId} in ${guildId} (not enabled)`);
          continue;
        }

        const member = await channel.guild.members.fetch(userId).catch(() => null);
        if (!member) continue;
        
        await channel.send({
          embeds: [buildBirthdayEmbed(member)],
          files: [BIRTHDAY_IMAGE]
        });
        console.log(`✅ Birthday announced for ${userId} in ${guildId}`);
      } catch (err) {
        console.error(`Birthday announcement failed for ${userId}:`, err.message);
      }
    }
  }
}

// Schedule daily check at midnight
function scheduleBirthdayCheck(client) {
  function msUntilMidnight() {
    const now  = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 0);
    return next - now;
  }

  function scheduleNext() {
    setTimeout(async () => {
      await checkBirthdays(client);
      scheduleNext(); // reschedule for next midnight
    }, msUntilMidnight());
  }

  scheduleNext();
  console.log(`Birthday check scheduled. Next run in ${Math.round(msUntilMidnight() / 60000)} minutes.`);
}

module.exports = {
  initBirthdays,
  setBirthday,
  removeBirthday,
  getBirthday,
  setBirthdayChannel,
  scheduleBirthdayCheck,
  buildBirthdayEmbed,
  buildProfileEmbed,
  MONTH_NAMES,
  DAYS_IN_MONTH,
  BIRTHDAY_IMAGE
};
