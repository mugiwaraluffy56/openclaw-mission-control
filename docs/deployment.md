# Deployment

## Docker (recommended)

```bash
cp .env.example .env
# Set OPENCLAW_JWT_SECRET
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

Set `CLAWDESK_PUBLIC_URL` to your domain for OAuth callbacks to work.
