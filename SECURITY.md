# Security Policy

## Reporting a vulnerability

Do not open a public issue containing credentials, tokens, exploitable proof-of-concept details, or other sensitive information.

For a real deployment, report security issues privately to the repository owner.

## Security assumptions

This project demonstrates application-level authentication security. Before production deployment, review:

- HTTPS and reverse proxy configuration
- Cookie `Secure` and `SameSite` settings
- CSP and other response security headers
- layered rate limiting (20 attempts/IP/minute + 5 failed logins/account/15 minutes); use distributed storage for multi-instance deployments
- database migrations
- secrets management
- OAuth redirect URI configuration
- email provider security
- logging and retention policies
