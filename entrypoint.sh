#!/bin/bash

npm run clear-redis \
&& npm run init-publisher \
&& sleep 10s \
&& pm2 start workers.config.js \
&& sleep 10s \
&& pm2 start publisher.config.js \
&& pm2-docker start ./keepalive.js
