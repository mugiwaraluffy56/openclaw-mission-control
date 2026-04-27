# Getting Started

## Prerequisites
- Rust 1.80+
- Node.js 22+
- An OpenClaw instance running on a VPS

## Install

```bash
git clone https://github.com/mugiwaraluffy56/openclaw-mission-control
cd openclaw-mission-control
cp .env.example .env
# Fill in OPENCLAW_JWT_SECRET at minimum
./start.sh
```

Open http://localhost:5173, sign up, then click **Link Agent**.

## Adding Your First Agent

You need three things:
1. **Server IP** — the public IP of the server running OpenClaw
2. **SSH Key** — paste the contents of your `.pem` or private key file
3. **Gateway Token** — found in `~/.openclaw/openclaw.json` → `gateway.auth.token`

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENCLAW_JWT_SECRET` | Yes | Secret for signing JWTs (min 32 chars) |
| `GOOGLE_CLIENT_ID` | OAuth | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth | Google OAuth app client secret |
| `GITHUB_CLIENT_ID` | OAuth | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | OAuth | GitHub OAuth app client secret |
| `CLAWDESK_PUBLIC_URL` | OAuth | Public URL of the backend (for OAuth redirects) |
