#!/bin/sh
bash -c 'while !</dev/tcp/db/5432; do sleep 1; done; npm start'
