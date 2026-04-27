# Contributing

ClawDesk is a Rust Axum API plus a Vite React dashboard.

## Local setup

1. Install Rust stable and Node 20 or newer.
2. Run `cd frontend && npm install`.
3. Run `./start.sh` from the repository root.

## Quality bar

- Backend changes must pass `cd backend && cargo build --release`.
- Frontend changes must pass `cd frontend && npm run build`.
- Keep APIs tenant-scoped by authenticated user or organization.
- Never log SSH credentials, gateway tokens, JWTs, or webhook secrets.

## Pull requests

Include a concise summary, verification commands, screenshots for UI changes, and migration notes for schema changes.
