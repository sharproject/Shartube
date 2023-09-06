deploy-without-db:
	git pull
	export PORT=8081 &&	docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d --pull always