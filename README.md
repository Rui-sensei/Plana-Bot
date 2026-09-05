# 🔵 Plana Discord Bot

A feature-rich Discord bot based on **Plana** from Blue Archive, with interactive commands, trivia, gacha mechanics, birthday tracking, and dead chat detection.

![Blue Archive](https://img.shields.io/badge/Blue_Archive-Plana-8A2BE2?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord)
![Status](https://img.shields.io/badge/Status-Online-success?style=for-the-badge)

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

### 🎂 Birthday System

| Command | Description |
|---------|-------------|
| `/birthday set [month] [day]` | Set your birthday |
| `/birthday remove` | Remove your birthday |
| `/birthday check` | Check your saved birthday |
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

## 🔧 Configuration Files

### `config.js`
Manages all bot settings including:
- Dead chat detection per channel
- Mention spam thresholds
- Custom messages
- Auto-saves to `plana_config.json`

### `data/trivia.json`
Custom trivia questions (fallback if API fails)

### `data/birthdays.json`
Stores user birthdays and announcement channels

---

## 📊 Bot Statistics

- **Memory Usage:** ~74-78 MB
- **Dependencies:** discord.js, dotenv, node-fetch
- **Trivia Sources:** SchaleDB + torikushiii API
- **Commands:** 30+ commands and interactions

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 📝 Credits

- **Plana Character:** Blue Archive by Nexon
- **Trivia Data:** [SchaleDB](https://github.com/SchaleDB/SchaleDB) & [torikushiii](https://api.ennead.cc/)
- **Art Credits:** See individual image footers in commands

---

## ⚠️ Disclaimer

This is a fan-made bot. Blue Archive and all related characters are property of Nexon Games.

---

## 📞 Support

Having issues? Check the logs or open an issue on GitHub!

---

<div align="center">

**Made with 💜 by Rui-sensei**

[![GitHub](https://img.shields.io/badge/GitHub-Rui--sensei-8A2BE2?style=flat&logo=github)](https://github.com/Rui-sensei)

*"...Plana is ready to assist. Don't make her repeat herself, Sensei."*

</div>

