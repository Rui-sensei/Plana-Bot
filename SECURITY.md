# Security Policy

## Supported Versions

Currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

### 🔒 DO NOT create a public GitHub issue

Instead:

1. **Email:** Create a private security advisory on GitHub
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

### What to Report

Please report any of these security concerns:
- Authentication bypass
- Data leaks or exposure
- Command injection vulnerabilities
- Token or secret exposure
- Permission escalation
- DoS (Denial of Service) vulnerabilities

### What We Will Do

- Acknowledge receipt within 48 hours
- Provide a detailed response within 7 days
- Keep you updated on the fix progress
- Credit you in the security advisory (if desired)

### What NOT to Report

These are not security issues:
- Feature requests
- Regular bugs that don't pose security risks
- Issues in third-party dependencies (report to them directly)

## Best Practices for Users

### 🔐 Keep Your Token Safe
- Never commit `.env` file to Git
- Never share your bot token publicly
- Regenerate token if exposed
- Use environment variables for all secrets

### 🛡️ Server Security
- Restrict bot permissions to minimum needed
- Use role-based permissions for admin commands
- Monitor bot activity regularly
- Keep bot updated to latest version

### 📋 Hosting Security
- Use HTTPS for all connections
- Keep Node.js and dependencies updated
- Use environment variables for sensitive data
- Enable 2FA on hosting platform

## Security Updates

Security updates will be:
- Released as soon as possible
- Announced in GitHub Releases
- Documented in CHANGELOG (if available)

---

Thank you for helping keep Plana Bot secure! 🔒
