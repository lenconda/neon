FROM node:10

WORKDIR /app
COPY . .

# install cron
RUN apt-get update && apt-get install cron -y

# add crontab file and configure
ADD neon-publisher /etc/cron.d/neon-publisher
RUN chmod 0644 /etc/cron.d/neon-publisher
RUN crontab /etc/cron.d/neon-publisher

# install pm2
RUN npm install pm2 -g

# install dependencies
RUN npm i

RUN npm run clear-redis
RUN npm run init-publisher

CMD cron \
  && pm2 start publisher.config.js \
  && pm2-docker start workers.config.js
#  && pm2 stop neon-publisher \
#  && npm run clear-redis \
#  && npm run init-publisher \
#  && pm2 start neon-publisher
