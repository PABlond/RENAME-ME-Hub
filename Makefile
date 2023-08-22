restart:
	docker-compose down && docker-compose up -d 

exec_bash:
	docker exec -ti api /bin/exec_bash

migrate:
	docker exec -ti api npx prisma migrate dev
	make restart

logs_api:
	docker container logs api -f

submodule_pull:
	git submodule update --init --recursive
