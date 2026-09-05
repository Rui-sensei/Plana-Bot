const { EmbedBuilder } = require('discord.js');
const fs   = require('fs');
const path = require('path');

const BIRTHDAY_FILE = path.join(__dirname, '..', 'data', 'birthdays.json');

// { userId: { month, day } }
let birthdays = {};
// guildId -> channelId
let birthdayChannels = {};

function loadBirthdays() {
  if (fs.existsSync(BIRTHDAY_FILE)) {
    const raw = JSON.parse(fs.readFileSync(BIRTHDAY_FILE, 'utf8'));
    birthdays        = raw.birthdays        || {};
    birthdayChannels = raw.birthdayChannels || {};
  }
}

function saveBirthdays() {
  fs.writeFileSync(BIRTHDAY_FILE, JSON.stringify({ birthdays, birthdayChannels }, null, 2));
}

loadBirthdays();

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_IN_MONTH = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function setBirthday(userId, month, day) {
  birthdays[userId] = { month, day };
  saveBirthdays();
}

function removeBirthday(userId) {
  delete birthdays[userId];
  saveBirthdays();
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

function setBirthdayChannel(guildId, channelId) {
  birthdayChannels[guildId] = channelId;
  saveBirthdays();
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
  const todayIds = getTodayBirthdays();
  if (todayIds.length === 0) return;

  for (const [guildId, channelId] of Object.entries(birthdayChannels)) {
    const channel = client.channels.cache.get(channelId);
    if (!channel) continue;

    for (const userId of todayIds) {
      try {
        const member = await channel.guild.members.fetch(userId).catch(() => null);
        if (!member) continue;
        await channel.send({
          embeds: [buildBirthdayEmbed(member)],
          files: [BIRTHDAY_IMAGE]
        });
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
