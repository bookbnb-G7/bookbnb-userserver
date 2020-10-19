#!/bin/sh

docker-compose up -d 
docker exec bookbnb-userserver_web bash -c 'while !</dev/tcp/db/5432; do sleep 1; done;'
docker exec bookbnb-userserver_web npm test
docker-compose down
