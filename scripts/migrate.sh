#!/usr/bin/env bash
set -euo pipefail

DB="${MISSION_CONTROL_DB:-backend/mission_control.db}"
for migration in migrations/*.sql; do
  echo "Applying ${migration}"
  sqlite3 "$DB" < "$migration"
done
