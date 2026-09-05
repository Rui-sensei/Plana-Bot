const { EmbedBuilder } = require('discord.js');
const path = require('path');
const cfg = require('../config');
const { buildPlanaInteraction, build8BallEmbed } = require('../commands/interactions');
const { buildHelpEmbed, buildHelpRow } = require('../commands/help');
const { runTrivia } = require('../commands/trivia');
const { getShipPercentage, buildShipEmbed } = require('../commands/ship');
const { buildProfileEmbed } = require('../commands/birthday');
const { saveConfigDebounced } = cfg;

const PREFIX = "!";
const AUDIO_BASE       = path.join(__dirname, '..', 'audio');
const IMAGE_BASE       = path.join(__dirname, '..', 'images');
const DEAD_CHAT_PATH   = path.join(AUDIO_BASE, "When Dead Chat");
const PLANA_MENTION_PATH = path.join(AUDIO_BASE, "Plana_Mentions");
const COLOR_PATH       = path.join(IMAGE_BASE, "Plana Colors");
const DISAPPEAR_PATH   = path.join(IMAGE_BASE, "Disappear", "Plana-disappear.gif");
const STARE_PATH       = path.join(IMAGE_BASE, "Disappear", "stare.jpg");

// mention streak tracker: userId -> { count, lastChannel }
const mentionStreaks  = new Map();
// cooldown tracker: userId -> { endsAt }
const mentionCooldowns = new Map();

module.exports = function registerMessageHandler(client) {
  client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const channelId = message.channel.id;

    // 🧠 DEAD CHAT TRACKING
    if (cfg.deadChatConfig.has(channelId)) {
      const c = cfg.deadChatConfig.get(channelId);
      if (c.enabled) {
        c.lastMessage = Date.now();
        c.warned = false;
        c.deadSent = false;
        cfg.deadChatConfig.set(channelId, c);
        saveConfigDebounced();
      }
    }

    // 🔵 PLANA MENTION
    // Only trigger on direct mentions, not @everyone, @here, or replies
    if (message.mentions.users.has(client.user.id) && !message.mentions.everyone && message.type === 0) {
      const userId = message.author.id;

      if (mentionCooldowns.has(userId)) {
        const { endsAt } = mentionCooldowns.get(userId);
        const remaining = Math.ceil((endsAt - Date.now()) / 1000);
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
        message.author.send({
          embeds: [new EmbedBuilder()
            .setDescription(`🔕 Plana is currently unavailable for you. She'll be back in **${timeStr}**.`)
            .setColor(0x8A2BE2)]
        }).catch(() => {});
        return;
      }

      const streak = mentionStreaks.get(userId) || { count: 0 };
      streak.count++;
      streak.lastChannel = message.channel.id;
      mentionStreaks.set(userId, streak);

      if (streak.count >= cfg.mentionConfig.threshold) {
        mentionStreaks.delete(userId);
        const endsAt = Date.now() + cfg.mentionConfig.cooldown * 60 * 1000;
        mentionCooldowns.set(userId, { endsAt });

        await message.channel.send({
          embeds: [new EmbedBuilder()
            .setDescription(`...I need some time alone, ${message.author}. Sensei. (｡•́︿•̀｡)`)
            .setImage('attachment://Plana-disappear.gif')
            .setColor(0x8A2BE2)],
          files: [DISAPPEAR_PATH]
        });

        setTimeout(() => {
          mentionCooldowns.delete(userId);
          const ch = client.channels.cache.get(streak.lastChannel);
          if (ch) ch.send({
            embeds: [new EmbedBuilder()
              .setDescription(`...Plana has returned. Please don't overdo it again, <@${userId}> Sensei. (˶˃ ᵕ ˂˶)`)
              .setImage('attachment://stare.jpg')
              .setColor(0x8A2BE2)],
            files: [STARE_PATH]
          });
        }, cfg.mentionConfig.cooldown * 60 * 1000);

        return;
      }

      const voices = ["Plana1.mp3", "Plana2.mp3", "Plana3.mp3", "Plana4.mp3"];
      const file = voices[Math.floor(Math.random() * voices.length)];
      return message.channel.send({
        content: "🔵 Plana responds:",
        files: [path.join(PLANA_MENTION_PATH, file)]
      });
    }

    if (!message.content.startsWith(PREFIX)) return;

    const args    = message.content.slice(PREFIX.length).trim().toLowerCase().split(/\s+/);
    const command = args[0];
    const sub     = args[1];

    // 🎲 RANDOM
    if (command === "random") {
      try {
        const members = await message.guild.members.fetch();
        const array = [...members.filter(m => !m.user.bot).values()];
        return message.channel.send(`${array[Math.floor(Math.random() * array.length)]}`);
      } catch {
        try {
          const cached = message.guild.members.cache.filter(m => !m.user.bot);
          if (cached.size === 0) return message.reply("Couldn't fetch members right now, try again later.");
          const array = [...cached.values()];
          return message.channel.send(`${array[Math.floor(Math.random() * array.length)]}`);
        } catch {
          return message.reply("Couldn't fetch members right now, try again later.");
        }
      }
    }

    // 💘 SHIP
    if (command === "ship") {
      const mentions = message.mentions.members;
      if (!mentions || mentions.size < 2) {
        return message.reply("Mention two members! e.g. `!ship @user1 @user2`");
      }
      const [member1, member2] = [...mentions.values()];
      const percent = getShipPercentage(member1.id, member2.id);
      return message.channel.send({ embeds: [buildShipEmbed(member1, member2, percent)] });
    }

    // 📚 TRIVIA
    if (command === "trivia") {
      return runTrivia(message.channel, (content) => {
        if (typeof content === 'string') return message.reply(content);
        return message.channel.send(content);
      });
    }

    // 💖 PLANA
    if (command === "plana") {
      if (sub === "8ball") {
        const question = message.content.slice(PREFIX.length).trim().slice("plana".length).trim().slice("8ball".length).trim();
        if (!question) return message.reply("Ask Plana a question! e.g. `!plana 8ball Will I win today?`");
        return message.channel.send({ embeds: [build8BallEmbed(question)] });
      }
      if (sub === "profile") {
        const mentions = message.mentions.members;
        const target = mentions && mentions.size > 0 ? mentions.first() : message.member;
        return message.channel.send({ embeds: [buildProfileEmbed(target)] });
      }
      if (sub && require('../commands/interactions').planaInteractions[sub]) {
        return sendPlanaInteraction(message.channel, sub);
      }
      return message.reply("Unknown Plana action. Try: touch, blush, kiss, lick, spin, pat, stop, pinch, cry, 8ball, profile");
    }

    // 📖 HELP
    if (command === "help") {
      return message.channel.send({ embeds: [buildHelpEmbed("main")], components: [buildHelpRow("main")] });
    }

    // 🎲 PULL
    if (command === "pull") {
      const roll = Math.random();
      let file, text, credit;
      if (roll < 0.5)       { file = "blue.png";   text = "Sorry sensei, Arona forced me to give this ૮(˶ㅠ︿ㅠ)ა"; credit = "Art: @bbbb1123112 (Twitter)"; }
      else if (roll < 0.75) { file = "yellow.png"; text = "Not bad sensei! (˶ᵔ ᵕ ᵔ˶)";                              credit = "Art: Qri (Pixiv)"; }
      else                  { file = "purple.png"; text = "Congratulations sensei! ꉂ(˵˃ ᗜ ˂˵)";                    credit = "Art: @Shiro17_Da (Twitter)"; }

      return message.channel.send({
        embeds: [new EmbedBuilder().setDescription(text).setImage(`attachment://${file}`).setFooter({ text: credit }).setColor(0x8A2BE2)],
        files: [path.join(COLOR_PATH, file)]
      });
    }
  });

  // ⏱ DEAD CHAT INTERVAL
  setInterval(() => {
    const now = Date.now();
    for (const [id, c] of cfg.deadChatConfig.entries()) {
      if (!c.enabled) continue;
      const channel = client.channels.cache.get(id);
      if (!channel) continue;
      const diff = now - c.lastMessage;
      if (!c.warned && diff >= c.warning) {
        c.warned = true;
        channel.send({ content: "💤 Are you sleeping?", files: [path.join(DEAD_CHAT_PATH, "Are_you_sleeping.mp3")] });
      }
      if (!c.deadSent && diff >= c.dead) {
        c.deadSent = true;
        channel.send({ content: "💀 Chat is really sleeping...", files: [path.join(DEAD_CHAT_PATH, "Chat_is_really_sleeping.mp3")] });
      }
    }
  }, 5000);
};
