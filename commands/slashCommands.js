const { SlashCommandBuilder, REST, Routes, PermissionFlagsBits } = require('discord.js');

const TOKEN  = process.env.TOKEN;
const APP_ID = process.env.APP_ID;

const commands = [
  new SlashCommandBuilder()
    .setName('random')
    .setDescription('Pick a random server member')
    .addStringOption(opt =>
      opt.setName('note').setDescription('Optional spoiler message').setRequired(false)
    ),
  new SlashCommandBuilder().setName('pull').setDescription('Plana gacha pull'),
  new SlashCommandBuilder().setName('trivia').setDescription('Start a Blue Archive trivia question'),
  new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask Plana a question')
    .addStringOption(opt =>
      opt.setName('question').setDescription('Your question for Plana').setRequired(true)
    ),
  new SlashCommandBuilder().setName('help').setDescription('Plana help menu'),
  new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View user profile with birthday info')
    .addUserOption(opt =>
      opt.setName('user').setDescription('User to view profile (leave empty for yourself)').setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Birthday tracker')
    .addSubcommand(sub =>
      sub.setName('set').setDescription('Set your birthday')
        .addIntegerOption(opt =>
          opt.setName('month').setDescription('Month (1-12)').setRequired(true).setMinValue(1).setMaxValue(12)
        )
        .addIntegerOption(opt =>
          opt.setName('day').setDescription('Day').setRequired(true).setMinValue(1).setMaxValue(31)
        )
    )
    .addSubcommand(sub =>
      sub.setName('remove').setDescription('Remove your birthday')
    )
    .addSubcommand(sub =>
      sub.setName('check').setDescription('Check your saved birthday')
    ),
  new SlashCommandBuilder()
    .setName('plana')
    .setDescription('Plana system commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub.setName('interact').setDescription('Interact with Plana')
        .addStringOption(opt =>
          opt.setName('action').setDescription('Choose an interaction').setRequired(true)
            .addChoices(
              { name: '💖 Touch',  value: 'touch'  },
              { name: '😳 Blush',  value: 'blush'  },
              { name: '💋 Kiss',   value: 'kiss'   },
              { name: '👅 Lick',   value: 'lick'   },
              { name: '🌀 Spin',   value: 'spin'   },
              { name: '🤚 Pat',    value: 'pat'    },
              { name: '🛑 Stop',   value: 'stop'   },
              { name: '🤏 Pinch',  value: 'pinch'  },
              { name: '😢 Cry',    value: 'cry'    }
            )
        )
    )
    .addSubcommandGroup(g =>
      g.setName('mention').setDescription('Plana mention settings')
        .addSubcommand(sub =>
          sub.setName('config').setDescription('Configure Plana disappear on consecutive mentions')
            .addIntegerOption(opt => opt.setName('threshold').setDescription('Mentions before disappearing (default: 5)').setRequired(false).setMinValue(1))
            .addIntegerOption(opt => opt.setName('cooldown').setDescription('Minutes she disappears for (default: 5)').setRequired(false).setMinValue(1))
        )
    )
    .addSubcommandGroup(g =>
      g.setName('random').setDescription('Random command settings')
        .addSubcommand(sub =>
          sub.setName('config').setDescription('Configure the random command messages')
            .addStringOption(opt => opt.setName('default').setDescription('Message shown when no note is provided').setRequired(false))
        )
    )
    .addSubcommandGroup(g =>
      g.setName('test').setDescription('Test bot features')
        .addSubcommand(sub =>
          sub.setName('birthday').setDescription('Test the birthday announcement for yourself')
        )
    )
    .addSubcommandGroup(g =>
      g.setName('birthday').setDescription('Birthday announcement settings')
        .addSubcommand(sub =>
          sub.setName('config').setDescription('Set the channel for birthday announcements')
            .addChannelOption(opt =>
              opt.setName('channel').setDescription('Channel to send birthday announcements').setRequired(true)
            )
        )
    )
    .addSubcommandGroup(g =>
      g.setName('config').setDescription('Bot configuration')
        .addSubcommand(sub => sub.setName('reset').setDescription('Reset all bot configuration to defaults'))
    )
    .addSubcommandGroup(g =>
      g.setName('deadchat').setDescription('Dead chat tracking settings')
        .addSubcommand(sub =>
          sub.setName('config').setDescription('Configure dead chat tracking for a channel')
            .addBooleanOption(opt => opt.setName('value').setDescription('Enable or disable').setRequired(true))
            .addChannelOption(opt => opt.setName('channel').setDescription('Target channel').setRequired(true))
            .addIntegerOption(opt => opt.setName('warning').setDescription('Minutes before warning (default: 30)').setRequired(false).setMinValue(1))
            .addIntegerOption(opt => opt.setName('dead').setDescription('Minutes before dead message (default: 60)').setRequired(false).setMinValue(2))
        )
    )
].map(c => c.toJSON());

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log(`Registering ${commands.length} slash commands...`);
    const data = await rest.put(Routes.applicationCommands(APP_ID), { body: commands });
    console.log(`✅ Successfully registered ${data.length} slash commands:`, data.map(c => c.name).join(', '));
  } catch (err) {
    console.error("❌ Failed to register slash commands:", err);
  }
}

module.exports = { registerCommands };
