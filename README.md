# 🔵 Plana Discord Bot

> **⚠️ IMPORTANT NOTICE:**  
> This repository is **source-available for educational purposes only**.  
> The official "Plana Bot" is owned and operated exclusively by **Rui-sensei**.  
> You may study the code and run it privately, but **hosting a public competing bot is not permitted**.  
> See [LICENSE](LICENSE) for full terms.

A feature-rich Discord bot based on **Plana** from Blue Archive, with interactive commands, trivia, gacha mechanics, birthday tracking, and dead chat detection.

![Blue Archive](https://img.shields.io/badge/Blue_Archive-Plana-8A2BE2?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord)
![Status](https://img.shields.io/badge/Status-Online-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-Custom-orange?style=for-the-badge)
![Source Available](https://img.shields.io/badge/Source-Available-blueviolet?style=for-the-badge)

---

## ✨ Features

- 💖 **Interactive Commands** - Touch, pat, kiss, and more Plana interactions
- 🎲 **Gacha System** - Pull for different rarity Plana cards
- 📚 **Blue Archive Trivia** - Test your knowledge with questions about students
- 🎂 **Birthday Tracker** - Never forget a server member's birthday
- 💤 **Dead Chat Detection** - Automatic reminders when chat goes quiet
- 🔵 **Mention Responses** - Plana responds with voice clips when mentioned
- 💘 **Ship Command** - Calculate compatibility between members
- 🎱 **Magic 8-Ball** - Ask Plana questions
- ⚙️ **Customizable** - Configure all features to your server's needs

---

## 📋 Commands

### 🎲 Fun & Games

| Command | Description | Example |
|---------|-------------|---------|
| `!random` / `/random` | Pick a random server member | `!random` |
| `!pull` / `/pull` | Gacha pull (blue/yellow/purple rarity) | `!pull` |
| `!trivia` / `/trivia` | Start a Blue Archive trivia question | `!trivia` |
| `!ship @user1 @user2` | Ship two members with compatibility % | `!ship @Alice @Bob` |
| `/8ball [question]` | Ask Plana a magic 8-ball question | `/8ball Will I win today?` |

### 💖 Plana Interactions

| Command | Description |
|---------|-------------|
| `!plana touch` / `/plana interact` | Touch Plana gently |
| `!plana blush` | Make Plana blush |
| `!plana kiss` | Kiss Plana |
| `!plana lick` | Lick Plana |
| `!plana spin` | Spin Plana around |
| `!plana pat` | Pat Plana on the head |
| `!plana stop` | Plana stops you |
| `!plana pinch` | Pinch Plana's cheeks |
| `!plana cry` | Plana cries |
| `!plana 8ball [question]` | Ask Plana a question |
| `!plana profile [@user]` | View user profile with birthday |

### 🎂 Birthday System

| Command | Description |
|---------|-------------|
| `/birthday set [month] [day]` | Set your birthday |
| `/birthday remove` | Remove your birthday |
| `/birthday check` | Check your saved birthday |
| `/profile [@user]` | View user profile with birthday (leave empty for yourself) |
| `!plana profile [@user]` | View user profile with birthday (text command) |
| `/plana birthday config [channel]` | Set birthday announcement channel (Admin) |

### ⚙️ Configuration (Admin Only)

| Command | Description |
|---------|-------------|
| `/plana deadchat config` | Configure dead chat tracking |
| `/plana mention config` | Configure mention spam protection |
| `/plana random config` | Configure random command messages |
| `/plana config reset` | Reset all configuration to defaults |

### 🔵 General

| Command | Description |
|---------|-------------|
| `!help` / `/help` | Opens the help menu |
| `@Plana` | Mention Plana to get a voice response |

---

## 🎨 Special Features

### 🔵 Mention System
- Mention Plana to receive a random voice clip response
- **Spam Protection**: Mention 5 times quickly → Plana disappears for 5 minutes
- Configurable threshold and cooldown time

### 💤 Dead Chat Detection
- Automatically detects when a channel goes quiet
- **Warning** at 30 minutes of inactivity (configurable)
- **Dead Chat** message at 60 minutes (configurable)
- Plays themed audio clips

### 🎂 Birthday Announcements
- Set your birthday with `/birthday set`
- Bot automatically announces birthdays at midnight
- Includes custom Plana birthday image and message
- Configurable announcement channel

### 📚 Trivia System
- Questions from **SchaleDB** (official Blue Archive data)
- Includes student schools, roles, weapons, clubs, and birthdays
- 30-second timer with emoji reactions
- Multiple choice format (A, B, C, D)

---

## 📊 Bot Statistics

- **Memory Usage:** ~74-78 MB
- **Dependencies:** discord.js, dotenv, node-fetch
- **Trivia Sources:** SchaleDB + torikushiii API
- **Commands:** 30+ commands and interactions

---

## 📁 Project Structure

```
randombot/
├── commands/          # Command modules
│   ├── birthday.js    # Birthday tracking system
│   ├── help.js        # Help menu with buttons
│   ├── interactions.js # Plana interaction commands
│   ├── ship.js        # Ship compatibility calculator
│   ├── trivia.js      # Blue Archive trivia
│   └── slashCommands.js # Slash command registration
├── handlers/          # Event handlers
│   ├── messages.js    # Text message handler
│   └── interactions.js # Slash command & button handler
├── audio/             # Audio files for responses
├── images/            # Image files for embeds
├── data/              # JSON data files
├── config.js          # Bot configuration management
├── index.js           # Main bot file
└── package.json       # Dependencies
```

---

## 🤝 Contributing

This is a **source-available** project! While the official bot instance is exclusive to Rui-sensei, contributions to improve the code are welcome! 💜

### Ways to Contribute:
- 🐛 **Report bugs** - Help us find and fix issues
- 💡 **Suggest features** - Share your ideas
- 🔧 **Submit pull requests** - Add new features or fix bugs
- 📖 **Improve documentation** - Help others understand the code
- ⭐ **Star the repository** - Show your support!

**Please read [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.**

**Note:** Contributions are for improving the codebase. The official public bot instance remains exclusive to Rui-sensei.

---

## 🌐 Community & Support

<div align="center">

### Join the Community!

[![Discord](https://img.shields.io/badge/Discord-Join_Server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/KYbNqZeM3H)
[![YouTube](https://img.shields.io/badge/YouTube-Subscribe-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@Rui_sensei02)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support_Me-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/ruisensei)

**Support the development! ☕💜**

</div>

---

## 📝 Credits

- **Plana Character:** Blue Archive by Nexon
- **Trivia Data:** [SchaleDB](https://github.com/SchaleDB/SchaleDB) & [torikushiii](https://api.ennead.cc/)
- **Art Credits:** See individual image footers in commands

---

## 📜 License & Usage Rights

This project is licensed under a **Custom Source-Available License** - see the [LICENSE](LICENSE) file for full details.

### ✅ What You CAN Do:
- View and study the code
- Use code snippets in your own projects (with credit)
- Run a private instance for your personal servers
- Fork for learning purposes
- Contribute improvements via pull requests

### ❌ What You CANNOT Do:
- Host a public competing bot service
- Use the "Plana Bot" name/branding
- Claim this code as your own
- Redistribute as a ready-to-use service
- Remove copyright notices

**The official "Plana Bot" is owned and operated exclusively by Rui-sensei. Only ONE authorized public instance exists.**

For commercial use or special permissions, please contact the owner.

---

## ⚠️ Disclaimer

This is a fan-made bot. Blue Archive and all related characters are property of Nexon Games. This project is not affiliated with or endorsed by Nexon.

Also I got some help with some friends so don't expect too much from me~

---

<div align="center">

**Made with 💜 by Rui-sensei**

[![GitHub](https://img.shields.io/badge/GitHub-Rui--sensei-8A2BE2?style=flat&logo=github)](https://github.com/Rui-sensei)
[![Discord](https://img.shields.io/badge/Discord-Join_Server-5865F2?style=flat&logo=discord)](https://discord.gg/KYbNqZeM3H)
[![YouTube](https://img.shields.io/badge/YouTube-Subscribe-FF0000?style=flat&logo=youtube)](https://www.youtube.com/@Rui_sensei02)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat&logo=ko-fi)](https://ko-fi.com/ruisensei)

*"...Plana is ready to assist. Don't make her repeat herself, Sensei."*

</div>
