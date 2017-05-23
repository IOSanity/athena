import Server from '../src/Server';
import WebSocket from 'uws';


describe('Server', () => {

    const Configuration = {
        "websocket": {
            "port": 8000,
            "hostname": "0.0.0.0"
        },
        "brokers":{
            "amqp": [{
                "name": "rabbitmq1",
                "host": "rabbitmq",
                "port": "5672",
                "user": "guest",
                "password": "guest",
                "vHost": "/"
            }]
        },
        "dispatcher": [
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
                "value": "updateUser",
                "route": {
                    "broker": "rabbitmq1",
                    "queue": "updateUser"
                }
            }
        ]
    };

    const server = new Server(Configuration);
    server.run();
    let wsClient;


    beforeEach((done)=>{
        jasmine.DEFAULT_TIMEOUT_INTERVAL=7000;
        wsClient = new WebSocket('ws://' + Configuration.websocket.hostname  + ":" + Configuration.websocket.port);
        wsClient.on('open', done);
    });

    afterEach(()=>{
        wsClient = null;
    });

    describe('Should xxx',()=>{

        test('Server init',(done)=>{
            wsClient.send(JSON.stringify({messageType: "createUser"}));
            setTimeout(done,5000)
        });

    })
});