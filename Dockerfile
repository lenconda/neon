FROM node:10

WORKDIR /app
COPY . .

# install cron
RUN apt-get update && apt-get install cron -y

# add crontab file and configure
ADD neon-publisher /etc/cron.d/neon-publisher
RUN chmod 0644 /etc/cron.d/neon-publisher
RUN crontab /etc/cron.d/neon-publisher

RUN npm config set registry https://registry.npm.taobao.org

# install pm2
RUN npm install pm2 -g

# install dependencies
RUN npm i

RUN chmod +x ./scheduler.sh
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
