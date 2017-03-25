FROM node:6.10

MAINTAINER Sergio Medina Toledo <lumasepa@gmail.com>

ADD . /opt/athena


RUN cd /opt/athena && npm i

WORKDIR /opt/athena/src

CMD ["node server.js"]