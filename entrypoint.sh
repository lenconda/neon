#!/bin/bash

cron \
&& npm run clear-redis \
&& npm run init-publisher \
&& pm2 start publisher.config.js \
&& pm2-docker start workers.config.js
