# Getting Started

Run ClawDesk locally:

```bash
cd ~/Desktop/openclaw-mission-control
cd frontend && npm install
cd ..
./start.sh
```

Frontend: http://localhost:5173

Backend: http://localhost:3001

Agents connect with a hostname or IP address, an SSH credential, and the OpenClaw gateway token from the remote host.

## OAuth

Google and GitHub login require provider apps with callback URLs:

- `http://localhost:3001/api/auth/google/callback`
- `http://localhost:3001/api/auth/github/callback`

Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `BACKEND_PUBLIC_URL`, and `FRONTEND_ORIGIN` before starting the backend.
