import Router from '../src/Router';

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

        test('Dispatcher init',()=>{
            expect(routerInstance instanceof Router).toBeTruthy();
        });

        test('routeDescriptions should have all router descriptions', ()=> {
            expect(routerInstance._routeDescriptions).toEqual(routeDescriptions)
        });

        describe('should return a router description for its own message', ()=> {
            test('message type: createUser', ()=>{
                let message = {messageType: "createUser"};
                let spectatedRoutesSet = [];

                for(let routeDescription of routeDescriptions){
                    if(routeDescription.value === 'createUser'){
                        spectatedRoutesSet.push(routeDescription.route)
                    }
                }

                expect(routerInstance.route(message)).toEqual(spectatedRoutesSet)
            });

            test('message type: updateUser', ()=>{
                let message = {messageType: "updateUser"};
                let spectatedRoutesSet = [];

                for(let routeDescription of routeDescriptions){
                    if(routeDescription.value === 'updateUser'){
                        spectatedRoutesSet.push(routeDescription.route)
                    }
                }

                expect(routerInstance.route(message)).toEqual(spectatedRoutesSet)
            });
        })
    });

});