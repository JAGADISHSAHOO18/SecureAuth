# OAuth2 setup

The base `docker-compose.yml` intentionally keeps OAuth disabled so normal email/password authentication remains independent of OAuth configuration.

## 1. Put real credentials in `.env`

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

Never commit `.env`.

## 2. Register these callback URLs

Google:
`http://localhost:8082/login/oauth2/code/google`

GitHub:
`http://localhost:8082/login/oauth2/code/github`

## 3. Start OAuth explicitly

Run the normal stack as usual for local authentication:

```powershell
docker compose up --build
```

When the four real OAuth credentials are ready, enable OAuth with the override file:

```powershell
docker compose -f docker-compose.yml -f docker-compose.oauth.yml up --build
```

This separation prevents OAuth configuration problems from changing or breaking the normal local authentication stack.
