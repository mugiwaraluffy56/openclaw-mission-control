# Deployment

Build and run ClawDesk with Docker Compose:

```bash
cp .env.example .env
docker compose build
docker compose up -d
```

The backend container needs `openssh-client` because agent lifecycle actions run over SSH. Store the SQLite database on a persistent volume in production.
