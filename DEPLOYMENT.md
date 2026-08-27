# Deployment Guide

## Frontend

Deploy `auth-front` as a Vite/React static application.

Build command:

```bash
npm install
npm run build
```

Output:

```text
dist/
```

Configure:

```text
VITE_API_BASE_URL=https://api.example.com/api/v1
VITE_BACKEND_BASE_URL=https://api.example.com
```

For Vercel, set the project root to `auth-front` and configure the same environment variables.

## Backend

The backend is containerized with `auth-backend/Dockerfile`.

Required production variables include:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
FRONT_END_URL
FRONT_END_SUCCESS_REDIRECT
FRONT_END_FAILURE_REDIRECT
JWT_COOKIE_SECURE=true
JWT_COOKIE_SAME_SITE=none
MAIL_ENABLED=true
MAIL_HOST
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
APP_ADMIN_EMAIL
JPA_DDL_AUTO=validate
```

Deploy the backend to a container-capable service such as Render, AWS, Railway, Fly.io, or another platform of your choice.

## Database

Use a managed MySQL-compatible database in production.

Do not use:

```text
DB_PASSWORD=root
JPA_DDL_AUTO=update
```

for a real deployment.

For a production environment, create migrations with Flyway or Liquibase and set:

```text
JPA_DDL_AUTO=validate
```

## OAuth callback URLs

After deployment, configure the providers with:

```text
https://api.example.com/login/oauth2/code/google
https://api.example.com/login/oauth2/code/github
```

## Cookie/security requirements

The frontend and backend must be served over HTTPS.

Use:

```text
JWT_COOKIE_SECURE=true
```

and choose the correct `SameSite` policy for your frontend/backend topology.

## Final smoke test

After deployment:

1. Register.
2. Verify email.
3. Login.
4. Refresh the page and confirm the session survives.
5. Wait for/force access-token expiry and verify silent refresh.
6. Open multiple requests and verify only one refresh occurs.
7. Logout.
8. Login with Google.
9. Login with GitHub.
10. Change password.
11. Revoke another session.
12. Request password reset.
13. Complete password reset.
14. Check audit logs.
15. Confirm non-admin users cannot access `/api/v1/admin/users`.
