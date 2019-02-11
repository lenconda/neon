#!/bin/bash

cron \
&& npm run clear-redis \
&& npm run init-publisher \
&& sleep 10s \
&& pm2 start workers.config.js \
&& sleep 10s \
&& pm2 start publisher.config.js \
&& tail -f keepalive
