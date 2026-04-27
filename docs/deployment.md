# Deployment

## Railway

Use the root `Dockerfile` and `railway.json`. Railway runs one service that serves the frontend, backend API, and WebSocket endpoint from the same domain.

See [Railway Deployment](railway.md).

## clawdesk.space checklist

Point DNS for `clawdesk.space` to your server, then run the app with these values:

```bash
FRONTEND_ORIGIN=https://clawdesk.space
BACKEND_PUBLIC_URL=https://clawdesk.space
VITE_API_URL=https://clawdesk.space/api
OPENCLAW_JWT_SECRET=$(openssl rand -hex 32)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

OAuth callback URLs:

```text
Google: https://clawdesk.space/api/auth/google/callback
GitHub: https://clawdesk.space/api/auth/github/callback
```

Your edge proxy must send:

```text
/api/* -> backend port 3001
/ws/*  -> backend port 3001
/*     -> frontend
```

## Docker (recommended)

```bash
cp .env.example .env
# Fill in OAuth secrets and OPENCLAW_JWT_SECRET
docker compose up -d
```

## Manual VPS

```bash
# On your server
cargo build --release
cd frontend && npm run build
# Serve frontend with nginx, proxy /api and /ws to backend
OPENCLAW_JWT_SECRET=your-secret ./target/release/clawdesk
```

## Environment

Set `FRONTEND_ORIGIN` and `BACKEND_PUBLIC_URL` to your real domain for OAuth callbacks to work.
