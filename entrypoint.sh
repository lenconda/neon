#!/bin/bash

if [ $MODE == 'init' ];
then
  mkdir -p ./.neon/app \
  && touch ./.neon/app/wait.queue \
  && echo "[]" > ./.neon/app/wait.queue \
  && touch ./.neon/app/results.queue \
  && echo "[]" > ./.neon/app/results.queue
fi

npm run init-publisher \
&& sleep 10s \
&& pm2 start workers.config.js \
&& sleep 10s \
&& pm2 start publisher.config.js \
&& pm2-docker start ./keepalive.js
