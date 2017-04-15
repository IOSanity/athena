import AMQPBroker from '../../src/brokers/amqp';
import {assert} from 'chai';
const uuid = require('uuid');

describe('AMQPBroker', () => {

    const timeout = (delay) => {
        return new Promise(function(resolve, reject) {
            setTimeout(resolve, delay);
        });
    };

    let consumed = [];

    let consume = (message) => {
        consumed.push(message)
    };

    let configuration =
        {
            "user": "guest",
            "password": "guest",
            "host": "127.0.0.1",
            "port": 5672,
            "vhost": "/",
            "serverId": uuid.v4(),
            "comsumptionCb": consume,
            "name": "rabbitmq1",
        };


    describe('should init AMQPBroker with configuration', ()=> {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 7000;

        let broker = new AMQPBroker(configuration);

        it('AMQPBroker should connect on call to start', async ()=>{
            await broker.start();
            assert(broker.hasOwnProperty("connection"), "No connection defined in AMQPBroker");
            assert(broker.hasOwnProperty("channel"), "No channel defined in AMQPBroker");

            await broker.produce("hi", broker.comsumptionQueue);

            await timeout(5000);

            consumed = consumed.pop();
            assert(consumed === "hi", "Message not consumed");

            await broker.stop();
            assert(broker.isStoped() , "Connection not closed !!")
        })

    });

    describe('should fail AMQPBroker with invalid configuration', ()=> {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 7000;

        let bad_configuration = configuration;
        bad_configuration["host"] = "kuilgsdf";

        let broker = new AMQPBroker(bad_configuration);

        it('AMQPBroker should not connect on call to start', async ()=>{
            await broker.start();
            assert(!broker.hasOwnProperty("connection"), "Connection defined in AMQPBroker");
            assert(!broker.hasOwnProperty("channel"), "Channel defined in AMQPBroker");
        })

    });

});