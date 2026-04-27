# clawdesk.space Setup

Use these exact production callback URLs:

```text
https://clawdesk.space/api/auth/google/callback
https://clawdesk.space/api/auth/github/callback
```

Set these environment variables on the server:

```bash
FRONTEND_ORIGIN=https://clawdesk.space
BACKEND_PUBLIC_URL=https://clawdesk.space
VITE_API_URL=https://clawdesk.space/api
OPENCLAW_JWT_SECRET=<generated-secret>
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
GITHUB_CLIENT_ID=<github-client-id>
GITHUB_CLIENT_SECRET=<github-client-secret>
```

DNS must point `clawdesk.space` at the host running the reverse proxy. HTTPS must be enabled before Google and GitHub OAuth will work in production.
