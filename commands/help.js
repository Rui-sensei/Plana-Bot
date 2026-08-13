const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function buildHelpEmbed(section) {
  switch (section) {
    case "main":
      return new EmbedBuilder()
        .setTitle("📖 Plana Help Menu")
        .setDescription("Choose a section below to learn more.")
        .setColor(0x8A2BE2)
        .addFields(
          { name: "💖 Interactions", value: "Plana interaction commands", inline: true },
          { name: "🎲 Gacha", value: "Pull and random commands", inline: true },
          { name: "⚙️ Configs", value: "Bot configuration commands", inline: true },
          { name: "🔵 General", value: "Misc commands", inline: true }
        )
        .setFooter({ text: "Use the buttons below to navigate sections" });

    case "interactions":
      return new EmbedBuilder()
        .setTitle("💖 Interactions — Plana Help")
        .setColor(0x8A2BE2)
        .addFields(
          { name: "!plana touch / /plana interact", value: "Touch Plana gently" },
          { name: "!plana blush", value: "Make Plana blush" },
          { name: "!plana kiss", value: "Kiss Plana" },
          { name: "!plana lick", value: "Lick Plana" },
          { name: "!plana spin", value: "Spin Plana around" },
          { name: "!plana pat", value: "Pat Plana on the head" },
          { name: "!plana stop", value: "Plana stops you" },
          { name: "!plana pinch", value: "Pinch Plana's cheeks" },
          { name: "!plana cry", value: "Plana cries" },
          { name: "!plana 8ball / /8ball [question]", value: "Ask Plana a magic 8-ball question" }
        )
        .setFooter({ text: "← Back to main menu" });

    case "gacha":
      return new EmbedBuilder()
        .setTitle("🎲 Gacha — Plana Help")
        .setColor(0x8A2BE2)
        .addFields(
          { name: "!pull / /pull", value: "Pull from the gacha (blue / yellow / purple rarity)" },
          { name: "!random / /random", value: "Pick a random server member" },
          { name: "!trivia / /trivia", value: "Start a Blue Archive trivia question" },
          { name: "!ship @user1 @user2", value: "Ship two members with a compatibility percentage" }
        )
        .setFooter({ text: "← Back to main menu" });

    case "configs":
      return new EmbedBuilder()
        .setTitle("⚙️ Configs — Plana Help")
        .setColor(0x8A2BE2)
        .addFields(
          { name: "/plana deadchat config", value: "Configure dead chat tracking\n`value` — enable/disable\n`channel` — target channel\n`warning` — minutes before warning (default: 30)\n`dead` — minutes before dead message (default: 60)" },
          { name: "/plana mention config", value: "Configure Plana disappear on consecutive mentions\n`threshold` — mentions before disappearing (default: 5)\n`cooldown` — minutes she's gone for (default: 5)" },
          { name: "/plana random config", value: "Configure the random command messages\n`default` — message shown when no note is given" },
          { name: "/plana config reset", value: "Reset all bot configuration to defaults" }
        )
        .setFooter({ text: "← Back to main menu" });

    case "general":
      return new EmbedBuilder()
        .setTitle("🔵 General — Plana Help")
        .setColor(0x8A2BE2)
        .addFields(
          { name: "!help / /help", value: "Opens this help menu" },
          { name: "Mention Plana", value: "Plana responds with a voice clip (mention 5x to trigger disappear)" },
          { name: "💤 Dead Chat System", value: "Automatically sends messages when chat goes quiet" },
          { name: "🎂 Birthday Tracker", value: "Set your birthday with `/birthday set` — Plana announces it on the day" }
        )
        .setFooter({ text: "← Back to main menu" });

    default:
      return null;
  }
}

function buildHelpRow(section) {
  if (section === "main") {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("help_interactions").setLabel("💖 Interactions").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("help_gacha").setLabel("🎲 Gacha").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("help_configs").setLabel("⚙️ Configs").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("help_general").setLabel("🔵 General").setStyle(ButtonStyle.Secondary)
    );
  }
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("help_main").setLabel("◀ Back").setStyle(ButtonStyle.Primary)
  );
}

module.exports = { buildHelpEmbed, buildHelpRow };
