#!/bin/bash
# Seed a demo user for development
curl -s -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@clawdesk.io","password":"demo1234","name":"Demo User"}' | jq .
echo "Demo user: demo@clawdesk.io / demo1234"
