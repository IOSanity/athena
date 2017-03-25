import Router from '../src/Router';
import {assert} from 'chai';

describe('Router', () => {
    let routeDescriptions = [
        {
            "field": "messageType",
            "value": "createUser",
            "route": {
                "broker": "rabbitmq1",
                "queue": "createUser"
            }
        },
        {
            "field": "messageType",
            "value": "createUser",
            "route": {
                "broker": "kafka1",
                "queue": "createUser"
            }
        },
        {
            "field": "messageType",
            "value": "updateUser",
            "route": {
                "broker": "rabbitmq1",
                "queue": "updateUser"
            }
        }
    ];

    describe('should init Router with routeDescriptions', ()=> {
        let routerInstance = new Router(routeDescriptions);
        assert(routerInstance instanceof Router);

        it('routeDescriptions should have all router descriptions', ()=> {
            assert.deepEqual(routerInstance._routeDescriptions, routeDescriptions)
        });

        describe('should return a router description for its own message', ()=> {
            it('message type: createUser', ()=>{
                let message = {messageType: "createUser"};
                let spectatedRoutesSet = [];

                for(let routeDescription of routeDescriptions){
                    if(routeDescription.value === 'createUser'){
                        spectatedRoutesSet.push(routeDescription.route)
                    }
                }

                assert.deepEqual(routerInstance.route(message),spectatedRoutesSet)
            });

            it('message type: updateUser', ()=>{
                let message = {messageType: "updateUser"};
                let spectatedRoutesSet = [];

                for(let routeDescription of routeDescriptions){
                    if(routeDescription.value === 'updateUser'){
                        spectatedRoutesSet.push(routeDescription.route)
                    }
                }

                assert.d1eepEqual(routerInstance.route(message),spectatedRoutesSet)
            });
        })
    });

});