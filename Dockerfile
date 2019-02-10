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

# exec init publisher
CMD npm run init-publisher
# exec start workers
CMD npm run start-worker
# exec start publisher
CMD npm run start-publisher

# exec crontab
CMD cron
