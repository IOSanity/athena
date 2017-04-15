# Athena
### Websockets to brokers (AMQP/Kafka) Proxy/Router

[![Build Status](https://travis-ci.org/IOSanity/athena.svg?branch=master)](https://travis-ci.org/IOSanity/athena) [![Coverage Status](https://coveralls.io/repos/github/IOSanity/athena/badge.svg?branch=master)](https://coveralls.io/github/IOSanity/athena?branch=master)

## Abstract
The purpose of this software is to be the entry point of a microservices
architecture based in queues systems. Athena can route messages from websockets
to the microservices using a user defined configuration and also send messages 
from the microservices to the websockets clients.
  
## Features

- AMQP Broker support.
- Kafka Broker support [WIP].
- Routing of websocket messages to different queues and brokers.
- Send messages to websocket clients through an AMQP queue.
- Register the instance of Athena in an AMQP queue.
- Support for encoders and decoders of messages. 
 
## How to run and test
- `npm install`
- `npm test`*

*will produce a coverage directory. 

## How to configure  [WIP]

## How to deploy [WIP]

## Why there is not a consumption topic in kafka ?
For consumption is needed automatic queues creation and that is not a 
good idea in kafka. Kafka have a limit of topics. Also there is no 
API for creation of topics. The unique way to create a topic is using
the `auto.create.topics.enable` setting. It creates the topic with 
the default configuration that is useless. If you want to send messages
tpo the websockets from the microservices use the AMQP broker. Your
microservices can consume from Kafka and produce in RabbitMQ.

## TODO

- Server module.
- Kafka broker.
- Benchmark.
- Split coverage from test scripts.
- Usage of Promise and Async/Await instead of callbacks.
- Handle console logs, errors and  warnings.
- Handle shutdown of Athena service
- Add decoder option in configuration
- Add examples of configuration based in user cases.

## IDEAS
- Add a mode of Athena consumption based in broadcast/subscription.
- YAML configuration option.
- HTTP proxy too.
- Usage of [debug](http://npmjs.com/package/debug) to handle console.
- Usage of [Bluebird](http://bluebirdjs.com)
- Add authentication support
- Add ssl support or example of use with a sslproxy