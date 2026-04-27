# API Reference

All API routes live under `/api`. Authenticated routes require `Authorization: Bearer <jwt>`.

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/agents`
- `POST /api/agents`
- `GET /api/agents/:id`
- `PUT /api/agents/:id`
- `DELETE /api/agents/:id`
- `POST /api/agents/:id/start`
- `POST /api/agents/:id/stop`
- `POST /api/agents/:id/restart`
- `POST /api/agents/:id/command`
- `GET /api/agents/:id/config`
- `PUT /api/agents/:id/config`
- `GET /api/agents/:id/channels`
- `GET /api/agents/:id/plugins`
- `GET /api/agents/:id/sessions`
- `GET /api/agents/:id/stats`
- `GET /api/activity`
- `GET /api/webhooks`
- `POST /api/webhooks`
- `DELETE /api/webhooks/:id`
- `GET /api/notifications`
- `POST /api/notifications`
- `GET /api/team`
- `POST /api/team/invite`
- `GET /ws/logs/:id?token=<jwt>`
