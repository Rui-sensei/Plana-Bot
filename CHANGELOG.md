# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-05

### 🎉 Initial Release

#### Added
- 💖 **Plana Interactions** - Touch, pat, kiss, lick, spin, blush, cry, pinch, stop
- 🎲 **Gacha System** - Pull command with 3 rarities (blue/yellow/purple)
- 📚 **Blue Archive Trivia** - Dynamic questions from SchaleDB API
- 🎂 **Birthday Tracker** - Set birthdays and automatic announcements
- 💤 **Dead Chat Detection** - Automatic reminders when chat goes quiet
- 🔵 **Mention Responses** - Voice clips when Plana is mentioned
- 💘 **Ship Command** - Calculate compatibility between members
- 🎱 **Magic 8-Ball** - Ask Plana questions
- !random command - Pick random server members
- !help command - Interactive help menu with buttons
- Slash command support for all major features
- Configuration system for dead chat, mentions, and more
- Health check endpoint for hosting platforms

#### Features
- Mention spam protection (disappear mechanic)
- Customizable configuration per server
- Audio response system
- Image embeds for interactions
- Birthday announcement scheduling
- Admin-only configuration commands

#### Technical
- Discord.js v14
- Node.js 18+ support
- Render.com deployment ready
- Environment variable configuration
- Auto-save configuration system

---

## Future Plans

### Planned Features
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Multi-language support
- [ ] Custom command system
- [ ] Level/XP system
- [ ] Economy system
- [ ] More trivia categories
- [ ] Moderation commands
- [ ] Music playback
- [ ] Server statistics
- [ ] Custom embeds builder

### Under Consideration
- [ ] Web dashboard
- [ ] Slash command autocomplete
- [ ] Reaction roles
- [ ] Welcome messages
- [ ] Logging system
- [ ] Backup/restore functionality

---

## Version Format

- **Major (X.0.0)**: Breaking changes
- **Minor (0.X.0)**: New features (backwards compatible)
- **Patch (0.0.X)**: Bug fixes and small improvements

---

[1.0.0]: https://github.com/Rui-sensei/Rui/releases/tag/v1.0.0
