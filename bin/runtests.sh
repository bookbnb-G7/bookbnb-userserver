#!/bin/sh

docker-compose up -d
docker exec bookbnb-userserver_web npm test
docker-compose down
