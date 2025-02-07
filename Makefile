.PHONY: status-dev
status-dev: 
	docker compose -f docker/dev/compose.yaml ps

.PHONY: build-dev
build-dev: 
	docker compose -f docker/dev/compose.yaml build

.PHONY: start-dev
start-dev:
	docker compose -f docker/dev/compose.yaml up -d

.PHONY: stop-dev
stop-dev:
	docker compose -f docker/dev/compose.yaml down

.PHONY: status-prod
status-prod:
	docker compose -f docker/prod/compose.yaml ps

.PHONY: build-prod
build-prod:
	docker compose -f docker/prod/compose.yaml build

.PHONY: start-prod
start-prod:
	docker compose -f docker/prod/compose.yaml up -d

.PHONY: stop-prod
stop-prod: 
	docker compose -f docker/prod/compose.yaml down
