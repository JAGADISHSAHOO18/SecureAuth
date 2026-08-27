# Contributing

## Development checks

Before opening a pull request:

```bash
cd auth-backend
./mvnw test
```

```bash
cd auth-front
npm install
npm run lint
npm run test:run
npm run build
```

## Security rules

Never commit:

- `.env` files
- passwords
- JWT secrets
- OAuth client secrets
- SMTP credentials
- access tokens
- refresh tokens

Authentication-related changes should include tests for the success path and relevant failure/edge cases.
