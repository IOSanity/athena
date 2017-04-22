FROM node:6.10

MAINTAINER Sergio Medina Toledo <lumasepa@gmail.com>

ENV DEBUG AthenaServer

ADD . /opt/athena

RUN cd /opt/athena && npm i --production

WORKDIR /opt/athena

CMD sleep 5 && npm start --config athena.config.json