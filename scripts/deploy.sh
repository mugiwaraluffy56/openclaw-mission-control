#!/bin/bash
set -e
echo "Deploying ClawDesk..."
docker compose build
docker compose up -d
echo "Done. Visit http://$(curl -s ifconfig.me)"
