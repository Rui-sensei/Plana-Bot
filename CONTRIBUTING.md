# Contributing to Plana Discord Bot

Thank you for considering contributing to this project! 💜

## How to Contribute

### 🐛 Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/Rui-sensei/Rui/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Your environment (Node.js version, OS)

### ✨ Suggesting Features

1. Check [Issues](https://github.com/Rui-sensei/Rui/issues) for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Why it would be useful
   - How it should work
   - Any implementation ideas (optional)

### 🔧 Pull Requests

1. **Fork the repository**
2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly:**
   ```bash
   npm start
   ```
5. **Commit with clear messages:**
   ```bash
   git commit -m "Add: new trivia category for xyz"
   ```
6. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

### 📝 Commit Message Guidelines

- **Add:** New feature
- **Fix:** Bug fix
- **Update:** Changes to existing feature
- **Remove:** Removed feature or file
- **Docs:** Documentation changes
- **Style:** Code style changes (formatting, etc.)

Examples:
- ✅ `Add: ship command with compatibility calculator`
- ✅ `Fix: trivia timer not working properly`
- ✅ `Update: improve help menu embed design`
- ❌ `update` (too vague)
- ❌ `fixed stuff` (not descriptive)

### 🎨 Code Style

- Use **2 spaces** for indentation
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes
- Add **comments** for complex logic
- Keep functions **small and focused**

### ✅ Testing Checklist

Before submitting a PR, make sure:
- [ ] Code runs without errors
- [ ] New features are tested manually
- [ ] No sensitive data (tokens, IDs) in code
- [ ] README updated (if needed)
- [ ] Comments added for complex code

## Project Structure

```
commands/       # Command modules (birthday, trivia, etc.)
handlers/       # Event handlers (messages, interactions)
audio/          # Audio response files
images/         # Image assets for embeds
data/           # JSON data files
config.js       # Configuration management
index.js        # Main bot entry point
```

## Areas to Contribute

### 🎯 High Priority
- Add more trivia questions
- Improve error handling
- Add unit tests
- Database integration (MongoDB)
- Localization (multi-language support)

### 💡 Feature Ideas
- Custom commands system
- Level/XP system
- Economy/currency system
- Moderation commands
- Music commands
- More Blue Archive themed features

### 🐛 Known Issues
Check the [Issues](https://github.com/Rui-sensei/Rui/issues) page for current bugs

## Questions?

Feel free to:
- Open an issue for questions
- Reach out via GitHub Discussions (if enabled)
- Check existing issues and PRs

## Code of Conduct

- Be respectful and constructive
- Help others learn and grow
- Keep discussions on-topic
- No harassment or discrimination
- Follow GitHub's [Community Guidelines](https://docs.github.com/en/site-policy/github-terms/github-community-guidelines)

---

**Thank you for contributing! Plana appreciates your help. (˶˃ ᵕ ˂˶)**
