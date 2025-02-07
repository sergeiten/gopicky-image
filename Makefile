.PHONY: status-dev
status-dev: 
	docker compose --env-file .env.dev -f docker/dev/compose.yaml ps

.PHONY: build-dev
build-dev: 
	docker compose --env-file .env.dev -f docker/dev/compose.yaml build

.PHONY: start-dev
start-dev:
	docker compose --env-file .env.dev -f docker/dev/compose.yaml up -d --force-recreate

.PHONY: stop-dev
stop-dev:
	docker compose --env-file .env.dev -f docker/dev/compose.yaml down

.PHONY: status-prod
status-prod:
	docker compose --env-file .env.prod -f docker/prod/compose.yaml ps

.PHONY: build-prod
build-prod:
	docker compose --env-file .env.prod -f docker/prod/compose.yaml build

.PHONY: start-prod
start-prod:
	docker compose --env-file .env.prod -f docker/prod/compose.yaml up -d

.PHONY: stop-prod
stop-prod: 
	docker compose --env-file .env.prod -f docker/prod/compose.yaml down
