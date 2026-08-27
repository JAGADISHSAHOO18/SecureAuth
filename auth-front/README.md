# SecureAuth Frontend

React + TypeScript frontend for the SecureAuth authentication platform.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run test:run
npm run coverage
npm run build
```

## Environment

Copy:

```bash
cp .env.example .env
```

Set:

```text
VITE_API_BASE_URL=http://localhost:8082/api/v1
VITE_BACKEND_BASE_URL=http://localhost:8082
```

The frontend keeps the short-lived access token in memory and uses the backend's HTTP-only refresh-token cookie for session recovery.
