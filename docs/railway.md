# Railway Deployment

Deploy this repo as a single Railway service. The root `Dockerfile` builds the Vite frontend, builds the Rust backend, and runs one `clawdesk` process that serves:

- `/api/*` from the backend
- `/ws/*` from the backend
- `/*` from the built SPA

## Railway variables

Set these in Railway:

```bash
FRONTEND_ORIGIN=https://clawdesk.space
BACKEND_PUBLIC_URL=https://clawdesk.space
VITE_API_URL=https://clawdesk.space/api
OPENCLAW_JWT_SECRET=<generated-secret>
OPENCLAW_DB_PATH=/data/mission_control.db
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
GITHUB_CLIENT_ID=<github-client-id>
GITHUB_CLIENT_SECRET=<github-client-secret>
```

Railway provides `PORT`; do not set it manually.

## Domain

Add `clawdesk.space` as a custom domain in Railway, then point your DNS records to the target Railway gives you.

OAuth callbacks:

```text
https://clawdesk.space/api/auth/google/callback
https://clawdesk.space/api/auth/github/callback
```

## Storage note

SQLite is stored at `/data/mission_control.db`. Attach a Railway volume mounted at `/data` if you want data to survive redeploys.
