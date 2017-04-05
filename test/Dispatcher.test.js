jest.mock('Broker')

import Dispatcher from '../src/Dispatcher';
import Router from '../src/Router';
import Broker from 'Broker';

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
    ['mockedBroker1','mockedBroker2'].forEach((brokerName)=> amqpBrokers[brokerName] = new Broker(brokerName));
    let routerInstance = new Router(routeDescriptions);
    let dispatcherInstance = new Dispatcher(routerInstance, amqpBrokers);


    const resetAMQPBrokers = () =>{
        amqpBrokers = {};
        // Set two brokers
        ['mockedBroker1','mockedBroker2'].forEach(
            (brokerName)=> amqpBrokers[brokerName] = new Broker(brokerName)
        );
        routerInstance = new Router(routeDescriptions);
        dispatcherInstance = new Dispatcher(routerInstance, amqpBrokers);
    };

    describe('should init Dispatcher with a Router and a Broker',()=>{



        it('Dispatcher init',()=>{
            expect(dispatcherInstance instanceof Dispatcher).toBeTruthy();
        });

        it('Dispatcher broker length should be 2', ()=>{
            expect(Object.keys(dispatcherInstance._Brokers).length).toEqual(2)
        });

        it('Dispatcher router should be instance of Router with routeDescriptions',()=>{
            expect(dispatcherInstance._Router instanceof Router).toBeTruthy()
        });

        describe('Dispatch',()=>{
            let createUserMessage = {messageType: "createUser"};
            let updateUserMessage = {messageType: "updateUser"};


            describe('message type:"createUser", queue:"createUser"', ()=>{
                beforeAll(()=>{
                    resetAMQPBrokers();
                    dispatcherInstance.dispatch(createUserMessage);
                });

                it('mockedBroker1 and mockedBroker2 produce should be called once when message type "createUser"',()=>{
                    expect(dispatcherInstance._Brokers["mockedBroker1"].produceCalls.length).toEqual(1);
                    expect(dispatcherInstance._Brokers["mockedBroker2"].produceCalls.length).toEqual(1)
                });

                it('mockedBroker1 and mockedBroker2 produce should be called with message type "createUser" and queue "createUser',()=>{
                    expect(dispatcherInstance._Brokers["mockedBroker1"].produceCalls[0][0]).toEqual(createUserMessage);
                    expect(dispatcherInstance._Brokers["mockedBroker1"].produceCalls[0][1]).toEqual("createUser");
                    expect(dispatcherInstance._Brokers["mockedBroker2"].produceCalls[0][0]).toEqual(createUserMessage);
                    expect(dispatcherInstance._Brokers["mockedBroker2"].produceCalls[0][1]).toEqual("createUser");
                });
            });

            describe('message type:"updateUser, queue:"updateUser"', ()=>{
                beforeAll(()=>{
                    resetAMQPBrokers();
                    dispatcherInstance.dispatch(updateUserMessage);
                });

                it('mockedBroker2 produce should not be called',()=>{
                    expect(dispatcherInstance._Brokers["mockedBroker2"].produceCalls.length).toEqual(0)
                });

                it('mockedBroker1 produce should be called',()=>{
                    expect(dispatcherInstance._Brokers["mockedBroker1"].produceCalls[0][0]).toEqual(updateUserMessage);
                    expect(dispatcherInstance._Brokers["mockedBroker1"].produceCalls[0][1]).toEqual("updateUser");
                })

            });

        })
    })

});