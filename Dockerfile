FROM node:10

# copy app files
WORKDIR /app
COPY . .

# add crontab file and configure
RUN npm config set registry https://registry.npm.taobao.org

# install pm2
RUN npm install pm2 -g

# install dependencies
RUN npm i

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
