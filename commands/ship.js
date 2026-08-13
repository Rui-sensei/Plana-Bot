const { EmbedBuilder } = require('discord.js');

// Deterministic percentage based on both user IDs so the same pair always gets the same result
function getShipPercentage(id1, id2) {
  const combined = [id1, id2].sort().join('');
  let hash = 0;
  for (const char of combined) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 101; // 0–100
}

function getShipName(name1, name2) {
  const half1 = name1.slice(0, Math.ceil(name1.length / 2));
  const half2 = name2.slice(Math.floor(name2.length / 2));
  return half1 + half2;
}

function getShipBar(percent) {
  const filled = Math.round(percent / 10);
  return '💜'.repeat(filled) + '🤍'.repeat(10 - filled);
}

function getPlanaComment(percent) {
  if (percent === 100) return "...A perfect match. Even Plana's calculations couldn't have predicted this. (˶˃ ᵕ ˂˶)";
  if (percent >= 90)  return "Plana's data shows an exceptional compatibility. How embarrassing for both of you.";
  if (percent >= 75)  return "...The numbers don't lie, Sensei. This is a strong match.";
  if (percent >= 60)  return "Plana supposes this could work out. Don't get too excited.";
  if (percent >= 50)  return "Fifty-fifty. Plana recommends more data before drawing conclusions.";
  if (percent >= 35)  return "...It's not impossible. Just unlikely. (｀・ω・´)";
  if (percent >= 20)  return "Plana has seen better compatibility between a desk and a chair.";
  if (percent >= 10)  return "...This is awkward. Even for Plana to report.";
  if (percent > 0)    return "Plana strongly advises against this. The data is clear.";
  return "Zero percent. Plana is sorry. (｡•́︿•̀｡)";
}

function buildShipEmbed(user1, user2, percent) {
  const name1 = user1.displayName || user1.username;
  const name2 = user2.displayName || user2.username;
  const shipName = getShipName(name1, name2);

  return new EmbedBuilder()
    .setTitle(`💘 Ship Results`)
    .setColor(percent >= 50 ? 0xff69b4 : 0x8A2BE2)
    .setDescription(
      `**${name1}** 💗 **${name2}**\n` +
      `\n**Ship name:** ${shipName}` +
      `\n\n${getShipBar(percent)} **${percent}%**` +
      `\n\n*${getPlanaComment(percent)}*`
    );
}

module.exports = { getShipPercentage, buildShipEmbed };
