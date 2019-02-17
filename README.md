# NEON

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/lenconda/capture/blob/master/LICENSE)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/lenconda/capture/issues)

🐙 File link scraper for every site.

|Author|E-Mail|
|---|---|
|[Lenconda](https://github.com/lenconda)|i@lenconda.top|

## Introduction

Neon is a file link scraper, which can traverse the whole website and get all direct file download links from the website. Neon is written in JavaScript&trade; and Node.js&trade;, built and deployed with Docker&trade; and Docker Compose, manage process with PM2&trade; and store data with MongoDB&trade;.

## Features

- Save results to MongoDB container
- Breadth First Search (BFS)
- Apply producer-consumer model with RabbitMQ
- High availability supported
- Smooth restart supported
- Task queue localization supported

## Requirements

- OS (Windows later than 7, macOS later than Yosemite, Linux later than 2.6.x)
- Docker environment
- Python&trade; and `pip`
- Docker Compose environment

> **NOTICE**: For CentOS users, it is not recommended to run Docker Compose on the versions early than 7.x, and this solution is not officialy supported by CentOS community. If you want to start Neon on a CentOS server, please upgrade the system.

## Structure

The following tree structure describes the code file structure of Neon.

```
.
├── docker-compose.yml             # Docker Compose configurations
├── Dockerfile                     # Dockerfile to build image
├── entrypoint.sh                  # Execute the script after container starting
├── keepalive.js                   # A scheduler to restart publisher
├── LICENSE                        # MIT License file
├── package.json                   # NPM package info
├── publisher.config.js            # PM2 ecosystem file for publisher
├── README.md                      # README file
├── services
│   ├── init.service.js            # Clear localized task queues
│   ├── publisher.service.js       # Script to start publisher service
│   └── worker.service.js          # Script to start worker service
├── src
│   ├── config
│   │   ├── basic.js               # APP basic configurations
│   │   ├── index.js               # Export entry
│   │   ├── message_queue.js       # RabbitMQ configurations
│   │   └── mongo.js               # MongoDB configurations
│   ├── crawler.js                 # Crawler component
│   ├── database
│   │   ├── connection.js          # MongoDB connection instance
│   │   └── models
│   │       └── insert_item.js     # MongoDB model
│   ├── index.js                   # APP entry
│   ├── producer.js                # Producer component
│   ├── publisher.js               # Publisher component
│   ├── utils                      # Utils
│   │   ├── directories.js
│   │   ├── logger.js
│   │   ├── timer.js
│   │   └── url_parser.js
│   └── worker.js                  # Worker component
└── workers.config.js              # PM2 ecosystem file for workers
```

## Run

### Download

Neon is a [Free Software](https://www.fsf.org/), and the code has already been published at [GitHub](https://github.com), everyone can download, fork and clone the copy of Neon from [Neon GitHub Repository](https://github.com/lenconda/neon.git). For clonning the code to local disk, run: 

```bash
$ git clone https://github.com/lenconda/neon.git
```

### Configure

Since Neon depends on Docker and Docker Compose, you should configure the correct environment for it first. However, with the help of the Docker technologies, it is possible for you to run the project on a server without Node.js and PM2 environment, for the image to be built contains the environment.

Otherwise, please make sure that your Python and `pip` environment is correct and able to run Docker Compose. Take CentOS users for example, to install and configure the Docker environment, there is an easy way to run:

```bash
$ sudo yum update -y
$ sudo yum install docker -y
$ sudo systemctl enable docker
$ sudo systemctl start docker
```

and Docker Compose environment to run: 

```bash
$ sudo yum update -y
$ sudo yum install python-pip -y
$ sudo pip install docker-compose
```

So, the most important thing you are supposed to get informed is that the configuration file of Neon is just the `docker-compose.yml`  file, all the parameters should be passed through the BASH environment variables. However, it is okay to leave blanks to the configurations, since there is a default value for **every** parameter. 

Although the default values exists, you may also hope to able to customize your own crawler, so it is better to know the parameters and default values.

As you see, all of the information of configurations are as below:

|Name|Definition|Default|
|----|----------|-------|
|`MODE`|APP start mode, if you want to clear the data, you should add this parameter, and set the value to `'init'`|`'init'`|
|`APP_SEED_URL`|Seed URL to start BFS crawl|`'http://www.example.com'`|
|`APP_MAX_DEPTH`|Maximum depth to crawl, if pass `-1`, **the crawler will never stop**|`100`|
|`APP_LOG_DIR`|Directory for echo log files|`'${PROJ_DIR}/logs/'`|
|`MQ_HOST`|Hostname of RabbitMQ server|`'rabbitmq'`|
|`MQ_PORT`|Port of RabbitMQ server|`5672`|
|`MQ_LOGIN`|Login name for RabbitMQ|`'guest'`|
|`MQ_PASSWORD`|Password for login user to RabbitMQ|`'guest'`|
|`MQ_TIMEOUT`|Maximum timeout when connect to RabbitMQ server|`10000`|
|`MQ_QUEUE`|RabbitMQ message queue name for Neon|`'neon'`|
|`DB_HOST`|Hostname of MongoDB server|`'mongo'`|
|`DB_PORT`|Port of MongoDB server|`27017`|
|`DB_USER`|Username to login to MongoDB server|`''`|
|`DB_PASSWORD`|Password for login user|`''`|
|`DB_NAME`|Database name for Neon|`neon`|

The configurations are located in `docker-compose.yml` file, as below:

```yaml
version: '3.3'

services:
  mongo:
    image: mongo:3.4
    volumes:
      - ./.neon/mongo/data/db:/data/db
    restart: always
    ports:
      - 27017:27017
    expose:
      - 27017
  rabbitmq:
    image: rabbitmq:3-management
    environment:
      RABBITMQ_DEFAULT_USER: neon
      RABBITMQ_DEFAULT_PASS: neon123
    ports:
      - 5672:5672
      - 15672:15672
    expose:
      - 5672
      - 15672
    restart: always
  neon:
    build: .
    depends_on:
      - mongo
      - rabbitmq
    volumes:
      - ./.neon/logs:/app/logs
    environment:
      MODE: init
      APP_SEED_URL: http://www.example.com
      APP_MAX_DEPTH: -1
      APP_LOG_DIR: /app/logs/
      MQ_HOST: rabbitmq
      MQ_PORT: 5672
      MQ_LOGIN: neon
      MQ_PASSWORD: neon123
      MQ_TIMEOUT: 10000
      MQ_QUEUE: neon
      DB_HOST: mongo
      DB_PORT: 27017
      DB_NAME: neon
    restart: always
```

This is an example, the configurations can be found at `services.neon.environment` block.

> **NOTICE**: As you can see above, `MQ_HOST` and `DB_HOST` is the same name of service name as `rabbitmq` and `mongo` in the file. As [Docker Compose Docs](https://docs.docker.com/compose/) said, the hostname of each service should be the service name written in configuration files, so in the `neon` image, RabbitMQ's URL should be `rabbitmq:5672` and MongoDB's URL should be `mongo:27017`.

### Start

Start Neon is simple, just run: 

```bash
$ docker-compose up -d --build
```

Docker will automaticly build Neon, start Neon container and link RabbitMQ and MongDB containers.

## Manegement

Neon depends on Docker Compose, so the circumstances will be simplified when you want to stop, restart, destroy and rebuild Neon using Compose:

```bash
# stop & start Neon
$ docker-compose stop
$ docker-compose start

# restart Neon
$ docker-compose restart

# destroy Neon
$ docker-compose down

# up Neon service as daemon
$ docker-compose up -d

# up and rebuild Neon service as daemon
$ docker-copmose up -d --build
```

For more operations, go to [Docker Compose Docs](https://docs.docker.com/compose/).

You can alse expose RabbieMQ Management Panel and MongoDB ports to your server, if you want to connect to these service at home, you should expose these ports to the Internet:

```bash
$ iptables -I INPUT -p tcp --dport 15672 -j ACCEPT
$ iptables -I INPUT -p tcp --dport 27017 -j ACCEPT
```

Notice that if you choose to do this, you should set password for them!

## Issues

There are still many problems that may happen during Neon is running. For any problems, please open issues at 

[https://github.com/lenconda/neon/issues](https://github.com/lenconda/neon/issues)

EXCLUDE the following cases:

- Memory usage too large after a period of time
- Database connection issues
- The crawler stucks after a period of time

## Contribute

Thanks for your interest in this project. You are welcomed to make contributions on it. However, before you starting your contribution work, please read the following advice:

- Read the [README](https://github.com/lenconda/capture#readme) first
- Understand what changes you want to make
- Look through the issue list and check if there's an issue to solve the same problem
- **Publish** or/and **redistribute** this project should under [MIT](LICENSE) license

### Issues

As said above, before you starting your work, you should check [issue list](https://github.com/lenconda/neon/issues) first. The issue list of this project can probably contains known bugs, problems, new demands and future development plans. If you can find an issue or many issues that solves the same problem, it would be great if you can join them to solve the problem.

### Fork & Pull Requests

If you decide to write your code in this project, you can fork this project as your own repository, check out to a new branch, from the newest code at `master` branch. The new branch would be your work bench.

If you want to commit your changes, you are supposed to make an [pull request](https://help.github.com/articles/about-pull-requests/), once you submit the request, the review process will start, if the code meets the requirements, the pull request will pass, and then your code will be in the project. If the request does not be passed, please contact [i@lenconda.top](mailto:i@lenconda.top) or [prexustech@gmail.com](mailto:prexustech@gmail.com).

## LICENSE

```
MIT License

Copyright (c) 2017 Vladislav Stroev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
