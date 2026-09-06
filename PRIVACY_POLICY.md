# Privacy Policy - Plana Bot

**Last Updated: September 6, 2026**

This Privacy Policy describes how Plana Bot ("the Bot", "we", "us", or "our") collects, uses, stores, and protects your information when you use our Discord bot service. By using the Bot, you agree to the collection and use of information in accordance with this policy.

## 1. Information We Collect

### 1.1 Automatically Collected Data

When you interact with Plana Bot, we automatically collect:

**User IDs:**
- Discord User IDs (unique numerical identifiers assigned by Discord)
- Used to identify users for features like birthday tracking, cooldowns, and interactions

**Server/Guild Information:**
- Server IDs (guild IDs)
- Channel IDs where the Bot is used
- Used for server-specific configurations (birthday announcements, dead chat tracking, etc.)

**Message Content:**
- Command text when you invoke Bot commands (e.g., `!plana profile`, `/trivia`)
- Message content is processed in real-time and NOT permanently stored
- Only used to execute the requested command

### 1.2 User-Provided Data

**Birthday Information:**
- Birth month and day (year is NOT collected)
- Provided voluntarily via `/birthday set` command
- Used for birthday announcements and profile display

### 1.3 Temporary/Cached Data

**Usage Statistics:**
- Mention counters (to prevent spam)
- Command cooldowns
- Dead chat tracking timestamps
- This data is temporary and reset when the Bot restarts

## 2. Why We Collect Data

We collect and process data for the following purposes:

### 2.1 Core Bot Functionality
- **User IDs**: To identify and respond to specific users, track birthdays, and enforce cooldowns
- **Birthday Data**: To provide birthday tracking features and send birthday announcements
- **Message Content**: To parse and execute commands you send to the Bot
- **Server/Channel IDs**: To apply server-specific configurations

### 2.2 Anti-Abuse Protection
- Mention spam detection and cooldowns
- Rate limiting to prevent Bot abuse
- Command usage tracking to enforce fair use

### 2.3 Service Improvement
- Understanding feature usage to improve the Bot
- Debugging and error tracking
- Performance optimization

## 3. How We Store Your Data

### 3.1 Storage Method
- **Birthday Data**: Stored in a local JSON file (`data/birthdays.json`) on our server
- **Configuration Data**: Stored in a local JSON file (`plana_config.json`) on our server
- **Temporary Data**: Stored in memory (RAM) and cleared when the Bot restarts

### 3.2 Data Location
- Data is stored on secure servers provided by Render.com (hosting provider)
- Server location: United States (may vary based on hosting provider)

### 3.3 Data Security
We implement reasonable security measures to protect your data:
- Restricted access to server files
- Environment variables for sensitive credentials
- Regular security updates and patches
- No public database exposure

**However, please note:**
- No method of electronic storage is 100% secure
- We cannot guarantee absolute security
- Use the Bot at your own risk

## 4. How We Use Your Data

We use collected data **ONLY** for the following purposes:

✅ **Allowed Uses:**
- Providing Bot features and functionality
- Birthday announcements and reminders
- Server-specific configurations
- Anti-spam and abuse prevention
- Debugging and improving the Bot

❌ **We Will NEVER:**
- Sell your data to third parties
- Share your data with advertisers
- Use your data for marketing purposes
- Track you across other Discord servers or platforms
- Collect data beyond what's necessary for Bot functionality

## 5. Data Retention

### 5.1 How Long We Keep Data

**Birthday Data:**
- Stored indefinitely until you remove it via `/birthday remove` command
- You can delete your data at any time

**Configuration Data:**
- Stored as long as the Bot is in your server
- Removed when the Bot leaves the server or settings are reset

**Temporary Data:**
- Cleared automatically when the Bot restarts
- Cooldowns and counters reset periodically

### 5.2 Data Deletion

You have the right to delete your data at any time:
- Use `/birthday remove` to delete your birthday
- Remove the Bot from your server to delete server-specific data
- Contact us (see Section 11) to request manual data deletion

## 6. Third-Party Services

The Bot relies on third-party services that may have access to your data:

### 6.1 Discord
- **Service**: Platform where the Bot operates
- **Data Shared**: All data processed by the Bot goes through Discord's API
- **Privacy Policy**: [https://discord.com/privacy](https://discord.com/privacy)
- **Note**: Discord has access to all messages, user IDs, and interactions

### 6.2 Render.com
- **Service**: Hosting provider for the Bot
- **Data Shared**: All stored data resides on Render's servers
- **Privacy Policy**: [https://render.com/privacy](https://render.com/privacy)
- **Note**: Render provides infrastructure security

### 6.3 SchaleDB API
- **Service**: Blue Archive data provider for trivia questions
- **Data Shared**: No personal data is shared; only API requests
- **Website**: [https://schaledb.com/](https://schaledb.com/)

### 6.4 GitHub
- **Service**: Source code repository
- **Data Shared**: No personal user data is stored on GitHub
- **Privacy Policy**: [https://docs.github.com/privacy](https://docs.github.com/privacy)

## 7. Your Rights

Under various data protection laws (GDPR, CCPA, etc.), you have the following rights:

### 7.1 Right to Access
- Request confirmation of what data we have about you
- Receive a copy of your data in a readable format

### 7.2 Right to Rectification
- Correct inaccurate or incomplete data
- Update your birthday information

### 7.3 Right to Erasure ("Right to be Forgotten")
- Request deletion of your data at any time
- Use `/birthday remove` or contact us

### 7.4 Right to Restriction
- Limit how we process your data
- Stop using certain Bot features

### 7.5 Right to Object
- Object to data processing for specific purposes
- Remove the Bot from your server

### 7.6 Right to Data Portability
- Request your data in a machine-readable format
- Transfer your data to another service

**To exercise these rights:**
- Use built-in commands (e.g., `/birthday remove`)
- Contact us via GitHub Issues (see Section 11)
- We will respond within 30 days

## 8. Children's Privacy

### 8.1 Age Requirements
- The Bot complies with Discord's Terms of Service
- Users must be at least 13 years old (or older in some countries)
- We do not knowingly collect data from children under 13

### 8.2 Parental Controls
If you believe a child under 13 has used the Bot:
- Contact us immediately
- We will delete any associated data
- Parents/guardians can request data deletion on behalf of minors

## 9. International Users

### 9.1 Data Transfers
- The Bot operates globally but stores data in the United States
- By using the Bot, you consent to data transfer to the US
- We comply with applicable international data protection laws

### 9.2 GDPR Compliance (EU Users)
If you are in the European Union:
- We process data based on your consent (by using the Bot)
- You have additional rights under GDPR (see Section 7)
- You can withdraw consent at any time
- Data transfers comply with GDPR requirements

### 9.3 CCPA Compliance (California Users)
If you are a California resident:
- You have the right to know what data we collect
- You have the right to delete your data
- You have the right to opt-out of data sales (we don't sell data)
- We do not discriminate based on privacy rights exercise

## 10. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Changes will be effective when posted.

### 10.1 Notification
- The "Last Updated" date will reflect changes
- Significant changes will be announced through appropriate channels
- Continued use after changes constitutes acceptance

### 10.2 Your Responsibility
- Review this policy periodically
- Check for updates on GitHub
- Contact us if you have questions about changes

## 11. Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or your data:

### Primary Contact Methods:
- **GitHub Issues**: [https://github.com/Rui-sensei/Plana-Bot/issues](https://github.com/Rui-sensei/Plana-Bot/issues)
- **GitHub Repository**: [https://github.com/Rui-sensei/Plana-Bot](https://github.com/Rui-sensei/Plana-Bot)

### Response Time:
- We aim to respond to privacy requests within 30 days
- Urgent matters will be prioritized
- Data deletion requests will be processed promptly

## 12. Data Breach Notification

In the unlikely event of a data breach:
- We will investigate immediately
- Affected users will be notified within 72 hours (where required by law)
- We will take steps to mitigate the breach
- We will report to relevant authorities as required

## 13. Consent

By using Plana Bot, you consent to:
- The collection and use of data as described in this policy
- Data processing for Bot functionality
- Data storage on third-party servers (Render.com)
- Data transfer through Discord's API

**You can withdraw consent at any time by:**
- Removing the Bot from your server
- Deleting your data via commands
- Contacting us to request data deletion

## 14. Additional Information

### 14.1 Do Not Track (DNT)
- The Bot does not respond to DNT signals
- The Bot only collects necessary functional data

### 14.2 Cookies
- The Bot does not use cookies
- The Bot does not track users across websites

### 14.3 Analytics
- We do not use third-party analytics services
- Usage statistics are minimal and for operational purposes only

## 15. Summary (TL;DR)

**What we collect:**
- User IDs, birthdays (if you provide them), server/channel IDs, command messages

**Why we collect it:**
- To make the Bot work (birthday announcements, commands, configurations)

**How we store it:**
- Locally in JSON files on secure servers (Render.com)

**Your rights:**
- Access, correct, or delete your data anytime

**We will NEVER:**
- Sell your data, share it with advertisers, or use it for marketing

**Questions?**
- Contact us on GitHub

---

**Thank you for trusting Plana Bot with your data. Your privacy matters to us, Sensei. (˶ᵔ ᵕ ᵔ˶)**

*For more information, see:*
- [Terms of Service](TERMS_OF_SERVICE.md)
- [License](LICENSE)
- [README](README.md)
