# ClawDesk

A production-grade, multi-tenant SaaS dashboard for managing OpenClaw AI agent instances across any infrastructure: cloud, VPS, bare metal.

## Overview

ClawDesk lets teams monitor, control, and collaborate on OpenClaw agent deployments from a single unified interface. Connect any OpenClaw instance, manage multiple agents, stream live logs, run commands, and track activity, all with role-based access control.

## Features

- **Multi-tenant**: full workspace isolation, team management, role-based access
- **Fleet overview**: real-time status, uptime, and health across all agents
- **Live log streaming**: WebSocket-powered streaming with filtering and search
- **SSH command runner**: execute commands on any agent directly from the UI
- **Config management**: edit and apply `openclaw.json` across agents with diff view
- **Activity audit log**: full audit trail of all actions across your fleet
- **Notifications & alerts**: alert rules for agent down, high CPU, model failures
- **Webhook integrations**: outbound webhooks to Slack, Discord, PagerDuty, and more
- **Analytics**: usage metrics, model usage, message volume over time
- **Channel management**: view and manage Telegram/Discord channels per agent
- **Session viewer**: all active sessions across your fleet
- **Plugin manager**: installed plugins per agent
- **Scheduler**: cron job viewer per agent
- **Public status page**: share your fleet health with stakeholders
- **API access**: programmatic control via API keys
- **Team management**: invite members, assign roles, manage permissions

## Stack

| Layer | Technology |
|---|---|
| Backend | Rust + Axum + SQLite |
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Auth | JWT (30-day) + bcrypt |
| Real-time | WebSocket (native axum-ws) |
| Agent SSH | OpenSSH via subprocess |
| Charts | Recharts |
| State | Zustand + TanStack Query |
| CI/CD | GitHub Actions |

## Quick Start

```bash
# Clone
git clone https://github.com/mugiwaraluffy56/openclaw-mission-control
cd openclaw-mission-control

# Configure
cp .env.example .env
# edit .env

# Start (builds backend, starts both services)
./start.sh
```

Open [http://localhost:5173](http://localhost:5173), sign up, add your first agent.

## Adding an Agent

1. Sign up / log in
2. Click **Link Agent** on the dashboard
3. Provide:
   - **Name**: display name for the instance
   - **Server IP**: public IP of the VPS running OpenClaw
   - **SSH Credential**: paste the SSH credential used to connect to the host
   - **Gateway Token**: from `~/.openclaw/openclaw.json` → `gateway.auth.token`
4. Hit **Connect**. The instance will appear in your fleet.

## Project Structure

```
clawdesk/
├── backend/          Rust + Axum API server
├── frontend/         React + Vite dashboard
├── docs/             Documentation and guides
├── scripts/          Build, deploy, and maintenance scripts
├── infra/            Infrastructure as code (Terraform, Docker)
├── packages/         Shared packages and utilities
├── migrations/       Database migration files
├── sdk/              ClawDesk API SDK (TypeScript)
├── tests/            End-to-end tests
└── .github/          CI/CD workflows
```

## Documentation

- [Getting Started](docs/getting-started.md)
- [Deployment Guide](docs/deployment.md)
- [Railway Deployment](docs/railway.md)
- [API Reference](docs/api-reference.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## Security

- SSH credentials are never returned by API responses; deployers should place SQLite on encrypted storage for production
- All agent isolation enforced at the database level (user_id scoping)
- JWT tokens expire after 30 days
- All SSH connections use ephemeral temp files with 0600 permissions
- SSH credential material is never returned in agent status, list, or detail responses

## License

MIT. See [LICENSE](LICENSE).
