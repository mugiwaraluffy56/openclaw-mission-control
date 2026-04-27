FROM node:20-bookworm AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM rust:1-bookworm AS backend-build
WORKDIR /app
COPY backend/Cargo.toml backend/Cargo.lock ./backend/
COPY backend/src ./backend/src
WORKDIR /app/backend
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssh-client ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend-build /app/backend/target/release/clawdesk /usr/local/bin/clawdesk
COPY --from=frontend-build /app/frontend/dist /app/public
ENV CLAWDESK_STATIC_DIR=/app/public
ENV OPENCLAW_DB_PATH=/data/mission_control.db
EXPOSE 3001
CMD ["clawdesk"]
