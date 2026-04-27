# API Reference

Base URL: `http://localhost:3001/api`

## Auth

| Method | Path | Description |
|---|---|---|
| POST | `/auth/signup` | Create account |
| POST | `/auth/login` | Sign in |
| GET | `/auth/me` | Current user |
| GET | `/auth/google` | Start Google OAuth |
| GET | `/auth/github` | Start GitHub OAuth |

## Agents

All endpoints require `Authorization: Bearer <token>`.

| Method | Path | Description |
|---|---|---|
| GET | `/agents` | List all agents with live status |
| POST | `/agents` | Link a new agent |
| GET | `/agents/:id` | Get agent detail |
| PUT | `/agents/:id` | Update agent metadata |
| DELETE | `/agents/:id` | Remove agent |
| POST | `/agents/:id/restart` | Restart gateway |
| POST | `/agents/:id/stop` | Stop gateway |
| POST | `/agents/:id/start` | Start gateway |
| GET | `/agents/:id/config` | Read openclaw.json |
| PUT | `/agents/:id/config` | Write openclaw.json + restart |
| GET | `/agents/:id/sessions` | Active sessions |
| GET | `/agents/:id/stats` | CPU/memory/uptime |
| POST | `/agents/:id/command` | Run SSH command |
| GET | `/agents/:id/channels` | Channel config |
| GET | `/agents/:id/plugins` | Installed plugins |

## WebSocket

`ws://localhost:3001/ws/logs/:agentId?token=<jwt>`

Streams live journalctl output for the agent's gateway service.
