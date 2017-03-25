import Dispatcher from '../src/Dispatcher';
import Router from '../src/Router';

import {assert} from 'chai';


class MockBroker{
    constructor(name){
        this.name = name;
        this.produceCalls = []
    }

    produce = (message, queue) => {
        this.produceCalls.push([message,queue])
    }
}


describe('Dispatcher', () => {
    let routeDescriptions = [
        {
            "field": "messageType",
            "value": "createUser",
            "route": {
                "broker": "mockedBroker1",
                "queue": "createUser"
            }
        },
        {
            "field": "messageType",
            "value": "createUser",
            "route": {
                "broker": "mockedBroker2",
                "queue": "createUser"
            }
        },
        {
            "field": "messageType",
            "value": "updateUser",
            "route": {
                "broker": "mockedBroker1",
                "queue": "updateUser"
            }
        }
    ];

    let amqpBrokers = {};
    // Set two brokers
    ['mockedBroker1','mockedBroker2'].forEach((brokerName)=> amqpBrokers[brokerName] = new MockBroker(brokerName));
    let routerInstance = new Router(routeDescriptions);
    let dispatcherInstance = new Dispatcher(routerInstance, amqpBrokers);


    const resetAMQPBrokers = () =>{
        amqpBrokers = {};
        // Set two brokers
        ['mockedBroker1','mockedBroker2'].forEach(
            (brokerName)=> amqpBrokers[brokerName] = new MockBroker(brokerName)
        );
        routerInstance = new Router(routeDescriptions);
        dispatcherInstance = new Dispatcher(routerInstance, amqpBrokers);
    };

    describe('should init Dispatcher with a Router and a Broker',()=>{



        it('Dispatcher init',()=>{
            assert(dispatcherInstance instanceof Dispatcher);
        });

        it('Dispatcher broker length should be 2', ()=>{
            assert.equal(Object.keys(dispatcherInstance._Brokers).length,2)
        });

        it('Dispatcher router should be instance of Router with routeDescriptions',()=>{
            assert(dispatcherInstance._Router instanceof Router)
        });

        describe('Dispatch',()=>{
            let createUserMessage = {messageType: "createUser"};
            let updateUserMessage = {messageType: "updateUser"};


            describe('message type:"createUser", queue:"createUser"', ()=>{
                before('reset amqp brokers',()=>{
                    resetAMQPBrokers();
                    dispatcherInstance.dispatch(createUserMessage);
                });

                it('mockedBroker1 and mockedBroker2 produce should be called once when message type "createUser"',()=>{
                    assert.equal(dispatcherInstance._Brokers["mockedBroker1"].produceCalls.length, 1);
                    assert.equal(dispatcherInstance._Brokers["mockedBroker2"].produceCalls.length, 1)
                });

                it('mockedBroker1 and mockedBroker2 produce should be called with message type "createUser" and queue "createUser',()=>{
                    assert.equal(dispatcherInstance._Brokers["mockedBroker1"].produceCalls[0][0], createUserMessage);
                    assert.equal(dispatcherInstance._Brokers["mockedBroker1"].produceCalls[0][1], "createUser");
                    assert.equal(dispatcherInstance._Brokers["mockedBroker2"].produceCalls[0][0], createUserMessage);
                    assert.equal(dispatcherInstance._Brokers["mockedBroker2"].produceCalls[0][1], "createUser");
                });
            });

            describe('message type:"updateUser, queue:"updateUser"', ()=>{
                before('reset amqp brokers',()=>{
                    resetAMQPBrokers();
                    dispatcherInstance.dispatch(updateUserMessage);
                });

                it('mockedBroker2 produce should not be called',()=>{
                    assert.equal(dispatcherInstance._Brokers["mockedBroker2"].produceCalls.length, 0)
                });

                it('mockedBroker1 produce should be called',()=>{
                    assert.equal(dispatcherInstance._Brokers["mockedBroker1"].produceCalls[0][0], updateUserMessage);
                    assert.equal(dispatcherInstance._Brokers["mockedBroker1"].produceCalls[0][1], "updateUser");
                })

            });

        })
    })

});