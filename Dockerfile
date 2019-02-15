FROM ubuntu:18.04

COPY sources.list /etc/apt/sources.list

# install cron
RUN apt-get update && apt-get install cron wget xz-utils -y

# download node.js package
WORKDIR /opt
RUN wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-linux-x64.tar.xz
RUN xz -d node-v10.15.1-linux-x64.tar.xz
RUN tar xvf node-v10.15.1-linux-x64.tar
RUN mv node-v10.15.1-linux-x64 node
ENV PATH="/opt/node/bin:${PATH}"
RUN rm -f node-v10.15.1-linux-x64.tar

# copy app files
WORKDIR /app
COPY . .

# add crontab file and configure
ADD neon-publisher /etc/cron.d/neon-publisher
RUN chmod 0644 /etc/cron.d/neon-publisher
RUN crontab /etc/cron.d/neon-publisher
RUN npm config set registry https://registry.npm.taobao.org

# install pm2
RUN npm install pm2 -g

# install dependencies
RUN npm i

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
