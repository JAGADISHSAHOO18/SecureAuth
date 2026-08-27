# Project Status

This repository has been refactored to cover the requested authentication, security, testing, Docker, CI, documentation, and account-management work.

## Implemented in the repository

- JWT access-token authentication
- HTTP-only refresh-token cookie
- Refresh-token rotation and DB revocation
- OAuth2 Google/GitHub support
- GitHub verified-email lookup
- BCrypt password hashing
- RBAC with guest/admin roles
- Backend validation
- Frontend Zod/React Hook Form validation
- Layered Bucket4j rate limiting with IP burst protection, per-account failed-login limits, retry headers, and stale-entry cleanup
- Email verification
- Password reset
- Profile update
- Password change
- Account deletion
- Session management and revocation
- Audit logs
- Spring Boot Actuator
- Swagger/OpenAPI
- Docker Compose with MySQL and Mailpit
- GitHub Actions CI
- Backend and frontend tests
- Environment templates and secret-safe `.gitignore`
- Professional README and security documentation

## Verification limitation in the build environment

The provided sandbox did not have Maven installed and could not download Maven/dependencies successfully, and the npm registry was not reachable. Therefore a full `mvn test` / `npm test` / `npm build` execution could not be completed inside this environment.

The source has been statically checked and the rate-limiting tests were added, but this is **not** a claim of mathematically zero bugs or successful production deployment. The final Maven test/build should still be executed locally.

After extracting the project locally, run:

```bash
cd auth-backend
./mvnw test
```

and:

```bash
cd auth-front
npm install
npm run lint
npm run test:run
npm run build
```

Then run:

```bash
docker compose up --build
```

and perform an end-to-end smoke test.


### Password-reset UX hardening
- Added a public reset-token validation endpoint so the frontend can detect expired/used reset links before showing the password form.
- Reused/expired links now show a clear recovery state with a direct link to request a new reset email.


## v15 Profile Image UX Update
- Added live profile image preview on Profile & security.
- Added avatar fallback to user initials when no/broken image URL is available.
- Added navbar avatar linking to Profile when an image URL is available.
- Added guidance for obtaining a direct public image URL.
