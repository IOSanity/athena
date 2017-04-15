import KafkaBroker from '../../src/brokers/kafka';
import {assert} from 'chai';
const uuid = require('uuid');

describe('KafkaBroker', () => {

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
            "hosts": ["127.0.0.1:9092"],
            "name": "kafka1",
        };


    describe('should init KafkaBroker with configuration', ()=> {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        let broker = new KafkaBroker(configuration);

        it('KafkaBroker should connect on call to start', async ()=>{
            await broker.start();
            assert(broker.hasOwnProperty("producer"), "No producer defined in KafkaBroker");


            //
            // await broker.produce("hi", broker.comsumptionQueue);
            //
            // await timeout(5000);
            //
            // consumed = consumed.pop();
            // assert(consumed === "hi", "Message not consumed");

            //await broker.stop();
            //assert(broker.isStoped() , "Connection not closed !!")
        })

    });

    // describe('should fail KafkaBroker with invalid configuration', () => {
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 7000;
    //
    //     let bad_configuration = configuration;
    //     bad_configuration["hosts"] = ["kuilgsdf"];
    //
    //     let broker = new KafkaBroker(bad_configuration);
    //
    //     it('KafkaBroker should not connect on call to start', async () => {
    //         try {
    //             await broker.start();
    //         } catch (error) {
    //
    //         }
    //         assert(!broker.hasOwnProperty("producer"), "producer defined in KafkaBroker");
    //     })
    //
    // });

});