const { EmbedBuilder } = require('discord.js');
const path = require('path');
const cfg = require('../config');
const { sendPlanaInteraction, build8BallEmbed } = require('../commands/interactions');
const { buildHelpEmbed, buildHelpRow } = require('../commands/help');
const { runTrivia } = require('../commands/trivia');
const { setBirthday, removeBirthday, getBirthday, setBirthdayChannel, MONTH_NAMES, DAYS_IN_MONTH } = require('../commands/birthday');

const IMAGE_BASE = path.join(__dirname, '..', 'images');
const COLOR_PATH = path.join(IMAGE_BASE, "Plana Colors");

const helpSectionMap = {
  help_main:         "main",
  help_interactions: "interactions",
  help_gacha:        "gacha",
  help_configs:      "configs",
  help_general:      "general"
};

module.exports = function registerInteractionHandler(client) {
  client.on('interactionCreate', async (interaction) => {

    // 🔘 BUTTON — help navigation
    if (interaction.isButton()) {
      const section = helpSectionMap[interaction.customId];
      if (!section) return;
      return interaction.update({ embeds: [buildHelpEmbed(section)], components: [buildHelpRow(section)] });
    }

    if (!interaction.isChatInputCommand()) return;

    // 🎂 /birthday
    if (interaction.commandName === "birthday") {
      const sub = interaction.options.getSubcommand();

      if (sub === "set") {
        const month = interaction.options.getInteger('month');
        const day   = interaction.options.getInteger('day');

        if (day > DAYS_IN_MONTH[month]) {
          return interaction.reply({ content: `❌ ${MONTH_NAMES[month]} doesn't have ${day} days.`, flags: 64 });
        }

        setBirthday(interaction.user.id, month, day);
        return interaction.reply({
          content: `✅ Birthday set to **${MONTH_NAMES[month]} ${day}**. Plana will remember, Sensei. (˶˃ ᵕ ˂˶)`,
          flags: 64
        });
      }

      if (sub === "remove") {
        removeBirthday(interaction.user.id);
        return interaction.reply({ content: "✅ Your birthday has been removed.", flags: 64 });
      }

      if (sub === "check") {
        const bd = getBirthday(interaction.user.id);
        if (!bd) return interaction.reply({ content: "You haven't set a birthday yet. Use `/birthday set`.", flags: 64 });
        return interaction.reply({
          content: `🎂 Your birthday is set to **${MONTH_NAMES[bd.month]} ${bd.day}**.`,
          flags: 64
        });
      }
    }

    // 📖 /help
    if (interaction.commandName === "help") {
      return interaction.reply({ embeds: [buildHelpEmbed("main")], components: [buildHelpRow("main")] });
    }

    // 🎲 /random
    if (interaction.commandName === "random") {
      try {
        const members = await interaction.guild.members.fetch();
        const array = [...members.filter(m => !m.user.bot).values()];
        return interaction.reply(`${array[Math.floor(Math.random() * array.length)]}`);
      } catch {
        try {
          const cached = interaction.guild.members.cache.filter(m => !m.user.bot);
          if (cached.size === 0) return interaction.reply({ content: "Couldn't fetch members right now.", flags: 64 });
          const array = [...cached.values()];
          return interaction.reply(`${array[Math.floor(Math.random() * array.length)]}`);
        } catch {
          return interaction.reply({ content: "Couldn't fetch members right now.", flags: 64 });
        }
      }
    }

    // 🎲 /pull
    if (interaction.commandName === "pull") {
      const roll = Math.random();
      let file, text, credit;
      if (roll < 0.5)       { file = "blue.png";   text = "Sorry sensei, Arona forced me to give this ૮(˶ㅠ︿ㅠ)ა"; credit = "Art: @bbbb1123112 (Twitter)"; }
      else if (roll < 0.75) { file = "yellow.png"; text = "Not bad sensei! (˶ᵔ ᵕ ᵔ˶)";                              credit = "Art: Qri (Pixiv)"; }
      else                  { file = "purple.png"; text = "Congratulations sensei! ꉂ(˵˃ ᗜ ˂˵)";                    credit = "Art: @Shiro17_Da (Twitter)"; }
      return interaction.reply({
        embeds: [new EmbedBuilder().setDescription(text).setImage(`attachment://${file}`).setFooter({ text: credit }).setColor(0x8A2BE2)],
        files: [path.join(COLOR_PATH, file)]
      });
    }

    // 🎱 /8ball
    if (interaction.commandName === "8ball") {
      return interaction.reply({ embeds: [build8BallEmbed(interaction.options.getString('question'))] });
    }

    // 📚 /trivia
    if (interaction.commandName === "trivia") {
      return runTrivia(interaction.channel, (content) => {
        if (typeof content === 'string') return interaction.reply({ content, flags: 64 });
        return interaction.reply(content);
      });
    }

    // 💖 /plana interact
    if (interaction.commandName === "plana" && interaction.options.getSubcommand() === "interact") {
      const action = interaction.options.getString('action');
      const data = require('../commands/interactions').planaInteractions[action];
      if (!data) return interaction.reply({ content: "Unknown interaction.", flags: 64 });
      const embed = new EmbedBuilder()
        .setDescription(data.description)
        .setImage(`attachment://${data.file}`)
        .setColor(0x8A2BE2);
      if (data.footer) embed.setFooter({ text: data.footer });
      return interaction.reply({ embeds: [embed], files: [path.join(data.basePath, data.file)] });
    }

    if (interaction.commandName === "plana") {
      const group = interaction.options.getSubcommandGroup();
      const sub   = interaction.options.getSubcommand();

      // 🧪 /plana test birthday
      if (group === "test" && sub === "birthday") {
        const { buildBirthdayEmbed, BIRTHDAY_IMAGE } = require('../commands/birthday');
        const member = interaction.member;
        return interaction.reply({
          embeds: [buildBirthdayEmbed(member)],
          files: [BIRTHDAY_IMAGE]
        });
      }

      // ⚙️ /plana birthday config
      if (group === "birthday" && sub === "config") {
        const channel = interaction.options.getChannel('channel');
        setBirthdayChannel(interaction.guild.id, channel.id);
        return interaction.reply({ content: `✅ Birthday announcements will be sent to <#${channel.id}>.`, flags: 64 });
      }

      // ⚙️ /plana mention config
      if (group === "mention" && sub === "config") {
        const threshold = interaction.options.getInteger('threshold');
        const cooldown  = interaction.options.getInteger('cooldown');
        if (!threshold && !cooldown) {
          return interaction.reply({ content: `📋 Current mention config:\n• **Threshold:** ${cfg.mentionConfig.threshold} mentions\n• **Cooldown:** ${cfg.mentionConfig.cooldown} minute(s)`, flags: 64 });
        }
        if (threshold) cfg.mentionConfig.threshold = threshold;
        if (cooldown)  cfg.mentionConfig.cooldown  = cooldown;
        cfg.saveConfig();
        return interaction.reply({ content: `✅ Mention config updated:\n• **Threshold:** ${cfg.mentionConfig.threshold} mentions\n• **Cooldown:** ${cfg.mentionConfig.cooldown} minute(s)`, flags: 64 });
      }

      // ⚙️ /plana random config
      if (group === "random" && sub === "config") {
        const newDefault = interaction.options.getString('default');
        if (!newDefault) return interaction.reply({ content: `📋 Current random config:\n• **Default message:** ${cfg.randomConfig.default}`, flags: 64 });
        cfg.randomConfig.default = newDefault;
        cfg.saveConfig();
        return interaction.reply({ content: `✅ Random config updated:\n• **Default message:** ${cfg.randomConfig.default}`, flags: 64 });
      }

      // ⚙️ /plana config reset
      if (group === "config" && sub === "reset") {
        cfg.resetConfig();
        return interaction.reply({ content: "✅ All bot configuration has been reset to defaults.", flags: 64 });
      }

      // ⚙️ /plana deadchat config
      if (group === "deadchat" && sub === "config") {
        const enabled  = interaction.options.getBoolean('value');
        const channel  = interaction.options.getChannel('channel');
        const warnMins = interaction.options.getInteger('warning') ?? 30;
        const deadMins = interaction.options.getInteger('dead')    ?? 60;

        if (deadMins <= warnMins) {
          return interaction.reply({ content: `❌ The **dead** timer (${deadMins}m) must be greater than the **warning** timer (${warnMins}m).`, flags: 64 });
        }

        cfg.deadChatConfig.set(channel.id, {
          enabled,
          warning:     warnMins * 60 * 1000,
          dead:        deadMins * 60 * 1000,
          lastMessage: Date.now(),
          warned:      false,
          deadSent:    false
        });
        cfg.saveConfig();

        return interaction.reply({
          content: `✅ Dead chat configured for <#${channel.id}>\n• **Enabled:** ${enabled}\n• **Warning:** after ${warnMins} minute(s)\n• **Dead:** after ${deadMins} minute(s)`,
          flags: 64
        });
      }
    }
  });
};
