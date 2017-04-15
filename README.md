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

## TODO

- Server module.
- Kafka broker.
- Benchmark.
- Split coverage from test scripts.
- Usage of Promise and Async/Await instead of callbacks.
- Handle console logs, errors and  warnings.
 
## IDEAS
- HTTP proxy too.
- Usage of [debug](http://npmjs.com/package/debug) to handle console.
- Usage of [Bluebird](http://bluebirdjs.com)