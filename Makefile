.PHONY: dev build test lint clean docker-up docker-down migrate

# Development
dev:
	@echo "Starting ClawDesk in development mode..."
	@./start.sh

# Build
build:
	@echo "Building backend..."
	@cd backend && cargo build --release
	@echo "Building frontend..."
	@cd frontend && npm run build

# Tests
test:
	@cd backend && cargo test
	@cd frontend && npm test

test-e2e:
	@cd tests && npm test

# Lint
lint:
	@cd backend && cargo clippy -- -D warnings
	@cd frontend && npm run lint

# Format
fmt:
	@cd backend && cargo fmt
	@cd frontend && npm run format

# Clean
clean:
	@cd backend && cargo clean
	@cd frontend && rm -rf dist node_modules
	@rm -f mission_control.db

# Docker
docker-up:
	@docker compose up -d

docker-down:
	@docker compose down

docker-build:
	@docker compose build

# Database
migrate:
	@echo "Running migrations..."
	@cd scripts && ./migrate.sh

migrate-rollback:
	@echo "Rolling back last migration..."
	@cd scripts && ./migrate-rollback.sh

# Deployment
deploy-fly:
	@cd scripts && ./deploy-fly.sh

deploy-hetzner:
	@cd scripts && ./deploy-hetzner.sh

# SDK
sdk-build:
	@cd sdk && npm run build

sdk-publish:
	@cd sdk && npm publish

# Docs
docs-serve:
	@cd docs && npx serve .

# Health check
health:
	@curl -sf http://localhost:3001/api/health && echo "Backend: OK" || echo "Backend: DOWN"
	@curl -sf http://localhost:5173 && echo "Frontend: OK" || echo "Frontend: DOWN"
