#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "Building backend..."
cd "$ROOT/backend"
cargo build --release 2>&1

echo ""
echo "Starting backend on :3001..."
OPENCLAW_JWT_SECRET="${OPENCLAW_JWT_SECRET:-$(openssl rand -hex 32)}" \
  ./target/release/openclaw-mission-control &
BACKEND_PID=$!

echo "Starting frontend on :5173..."
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

echo ""
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop."
wait
