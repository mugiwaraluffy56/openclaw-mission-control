#!/usr/bin/env bash
set -euo pipefail

DB="${MISSION_CONTROL_DB:-backend/mission_control.db}"
sqlite3 "$DB" <<'SQL'
INSERT OR IGNORE INTO users (id, email, name, password_hash)
VALUES ('seed-user', 'admin@openclaw.local', 'OpenClaw Admin', NULL);
SQL
