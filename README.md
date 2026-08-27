# SecureAuth — Full-Stack Authentication & Authorization Platform

SecureAuth is a full-stack authentication platform built with **Spring Boot, Spring Security, React, TypeScript, and MySQL**. It demonstrates secure authentication flows, token lifecycle management, OAuth2 login, role-based authorization, rate limiting, account recovery, session management, audit logging, automated testing, Docker support, and CI/CD.

> The repository started from a learning-oriented authentication application and has been substantially refactored and extended into a structured portfolio project. Only claim features you can explain and demonstrate in an interview.

## Key Features

### Authentication
- Email/password registration and login
- BCrypt password hashing
- Short-lived JWT access tokens
- HTTP-only refresh-token cookie
- Refresh-token rotation and database-backed revocation
- Automatic frontend token refresh with concurrent-request queueing
- Google OAuth2
- GitHub OAuth2 with verified-email lookup

### Account Security
- Backend and frontend validation
- Multi-layer login/register/password-reset rate limiting
- Email verification
- Forgot-password and secure reset-token flow
- Change password with session revocation
- Account deletion
- Active session listing and per-session revocation
- Role-based authorization (`GUEST`, `ADMIN`)
- Security audit logs
- No passwords or tokens returned from user DTOs

### Engineering
- Layered Spring Boot architecture
- Centralized API error responses
- JUnit/Mockito-ready backend test suite
- Vitest + Testing Library frontend tests
- Swagger/OpenAPI documentation
- Spring Boot Actuator health/metrics
- Docker and Docker Compose
- Mailpit for local email testing
- GitHub Actions CI
- Environment-based configuration
- In-memory Bucket4j rate limiting with IP burst protection and per-account failed-login protection

## Architecture

```text
                 ┌─────────────────────────┐
                 │       React + TS        │
                 │   React Router + RHF     │
                 │   Zustand + Axios       │
                 └────────────┬────────────┘
                              │ HTTPS / JSON
                              ▼
                 ┌─────────────────────────┐
                 │       Spring Boot       │
                 │      Spring Security    │
                 ├─────────────────────────┤
                 │ JWT / OAuth2             │
                 │ Validation / Rate Limit │
                 │ Services / Controllers  │
                 │ Audit / Session APIs    │
                 └────────────┬────────────┘
                              │
               ┌──────────────┼───────────────┐
               ▼              ▼               ▼
            MySQL          Mailpit        OAuth Providers
```

## Authentication Flow

### Password login

```text
React login form
      ↓
POST /api/v1/auth/login
      ↓
Spring Security authentication
      ↓
BCrypt password verification
      ↓
Short-lived access JWT
+
HTTP-only refresh cookie
      ↓
React keeps access token in memory
```

### Refresh-token rotation

```text
API request
   ↓
401 Access token expired
   ↓
POST /api/v1/auth/refresh
   ↓
Lock + validate current refresh token
   ↓
Revoke old token
   ↓
Create replacement refresh token
   ↓
Issue new access token
   ↓
Retry original request
```

The backend stores refresh-token metadata and revocation state in MySQL. The frontend does not persist the access token in `localStorage`.

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- Framer Motion
- Vitest
- Testing Library

### Backend
- Java 21
- Spring Boot 3.5
- Spring Security
- Spring Data JPA / Hibernate
- JWT (JJWT)
- OAuth2 Client
- Bean Validation
- Bucket4j
- Spring Mail
- Spring Boot Actuator
- SpringDoc OpenAPI
- Lombok

### Infrastructure
- MySQL 8.4
- Docker
- Docker Compose
- Mailpit
- GitHub Actions

## Project Structure

```text
secure-auth/
├── auth-backend/
│   ├── src/main/java/
│   │   └── com/substring/auth/app/
│   │       ├── auth/
│   │       │   ├── config/
│   │       │   ├── controllers/
│   │       │   ├── entities/
│   │       │   ├── payload/
│   │       │   ├── repositories/
│   │       │   └── services/
│   │       ├── config/
│   │       ├── dtos/
│   │       └── exceptions/
│   ├── src/main/resources/
│   ├── src/test/
│   ├── Dockerfile
│   └── pom.xml
│
├── auth-front/
│   ├── src/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── config/
│   │   ├── models/
│   │   ├── pages/
│   │   └── services/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── .github/workflows/ci.yml
├── docker-compose.yml
├── .env.example
└── README.md
```

## Local Development

> Docker exposes MySQL on host port 3307 by default to avoid conflicts with a local MySQL installation on port 3306. Override with `MYSQL_HOST_PORT` when needed.


### Prerequisites

- Java 21
- Maven 3.9+
- Node.js 22+
- npm
- MySQL 8+
- Git

### 1. Backend

Create the database:

```sql
CREATE DATABASE auth_app;
```

Copy the environment template and configure values:

```bash
cd auth-backend
cp .env.example .env
```

Set the values in your shell/IDE or load them into your local environment. At minimum configure:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
FRONT_END_URL
FRONT_END_SUCCESS_REDIRECT
FRONT_END_FAILURE_REDIRECT
```

Run:

```bash
./mvnw spring-boot:run
```

Backend:

```text
http://localhost:8082
```

Swagger:

```text
http://localhost:8082/swagger-ui/index.html
```

Health:

```text
http://localhost:8082/actuator/health
```

### 2. Frontend

```bash
cd auth-front
cp .env.example .env
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### 3. Local OAuth2

Create Google and GitHub OAuth applications and configure:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

For local development, callback URLs should use:

```text
http://localhost:8082/login/oauth2/code/google
http://localhost:8082/login/oauth2/code/github
```

OAuth testing requires real provider credentials. Placeholder development values only allow the application to start; they do not create a working provider login.

## Docker Compose

The repository includes MySQL, Mailpit, Spring Boot, and the React/Nginx frontend.

```bash
docker compose up --build
```

Services:

| Service | Address |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8082 |
| Swagger | http://localhost:8082/swagger-ui/index.html |
| Mailpit UI | http://localhost:8025 |
| MySQL (host) | localhost:3307 |

For local Compose, email verification is enabled and messages are delivered to Mailpit.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Password login |
| POST | `/api/v1/auth/refresh` | Rotate refresh token |
| POST | `/api/v1/auth/logout` | Revoke current refresh token |
| POST | `/api/v1/auth/verify-email` | Verify email |
| POST | `/api/v1/auth/forgot-password` | Start password reset |
| POST | `/api/v1/auth/reset-password` | Complete password reset |
| GET | `/api/v1/auth/me` | Current user |
| GET | `/api/v1/auth/sessions` | Active sessions |
| DELETE | `/api/v1/auth/sessions/{id}` | Revoke session |
| GET | `/api/v1/auth/audit-log` | Recent security events |
| PUT | `/api/v1/users/me` | Update profile |
| POST | `/api/v1/users/me/password` | Change password |
| DELETE | `/api/v1/users/me` | Delete account |
| GET | `/api/v1/admin/users` | Admin-only user list |

OAuth entry points:

```text
/oauth2/authorization/google
/oauth2/authorization/github
```

## Security Decisions

### Access token
- Short-lived JWT
- Sent in the `Authorization: Bearer ...` header
- Kept in frontend memory rather than browser local storage

### Refresh token
- Stored in an HTTP-only cookie
- Stored server-side by JTI
- Rotated after successful refresh
- Previous token is revoked
- Expiration and ownership are checked
- Active sessions can be revoked

### Passwords
- BCrypt hashed
- Never returned by API responses
- Never logged

### Rate limiting
Bucket4j applies layered, instance-local limits: login attempts are protected by a 20-attempt/IP burst window (1 minute) plus 5 failed attempts per account (15 minutes), while registration and password-reset endpoints use their own IP-based limits. Rate-limit responses include a `Retry-After` header. For multi-instance production deployments, move the bucket state to a distributed store such as Redis.

### Audit logging
Security-relevant events include:
- Registration
- Successful/failed login
- OAuth login
- Token refresh
- Logout
- Email verification
- Password reset
- Password change
- Profile updates

## Testing

Backend tests:

```bash
cd auth-backend
./mvnw test
```

Frontend tests:

```bash
cd auth-front
npm run test:run
```

Coverage:

```bash
npm run coverage
```

The repository includes unit tests for JWT behavior, hashing, rate limiting, DTO mapping, authentication state, login validation, and OAuth UI rendering. The first local install regenerates `auth-front/package-lock.json`; the sandbox could not reach the npm registry to create a verified lockfile.

## CI

GitHub Actions runs:

```text
Push / Pull Request
        ↓
Backend tests
        ↓
Frontend install
        ↓
Frontend tests
        ↓
Frontend build
        ↓
Success
```

## Environment Variables

Secrets are intentionally excluded from version control.

Important backend variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
MAIL_ENABLED
MAIL_HOST
MAIL_PORT
APP_ADMIN_EMAIL
```

Frontend:

```text
VITE_API_BASE_URL
VITE_BACKEND_BASE_URL
```

Never commit real database passwords, OAuth secrets, JWT secrets, or email credentials.

## Production Notes

For a real production deployment:

1. Use HTTPS everywhere.
2. Set `JWT_COOKIE_SECURE=true`.
3. Use an appropriate `SameSite` policy for the deployment topology.
4. Provide a strong random `JWT_SECRET`.
5. Use a managed database.
6. Replace `ddl-auto=update` with a migration tool such as Flyway or Liquibase.
7. Configure real SMTP credentials.
8. Configure real Google/GitHub OAuth redirect URLs.
9. Put the backend behind a reverse proxy/load balancer.
10. Consider a distributed rate-limit store when running multiple backend instances.

## Resume Positioning

**Full-Stack Authentication & Authorization Platform**

Highlights to discuss in interviews:
- JWT access tokens and refresh-token rotation
- HTTP-only cookies
- OAuth2 identity-provider integration
- Rate limiting
- RBAC
- Session revocation
- Password recovery
- Validation and error handling
- Automated testing
- Docker and CI/CD

## License

Use or replace the license according to your own project/repository requirements.
