import {WebSocketConnectionHelper} from './helpers';
import WebSocketServer from '../src/WebSocketServer';
import WebSocket from 'uws';


describe('WebSocketServer', () => {
    const uuidV4RegExp = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/i;
    const closeCb = jest.fn(() => WebSocketConnection.connection = false);
    const messageCb = jest.fn((message, id) => {});
    const errorCb = jest.fn(() =>  WebSocketConnection.connection = false);
    const message = 'Message sent from Client';
    const serverMessage = 'Message sent from WebSocketServer';
    const closeMessage = 'Closed by client';

    const wssConfiguration = {
        port: 8080,
        hostname: '127.0.0.1',
        messageCb: messageCb,
        closeCb: closeCb,
        errorCb: errorCb
    };

    const wsServer = new WebSocketServer(
        wssConfiguration.hostname,
        wssConfiguration.port,
        wssConfiguration.messageCb,
        wssConfiguration.closeCb,
        wssConfiguration.errorCb);

    let WebSocketConnection, wsServerClient;

    let wsClient;


    beforeEach((done)=>{
        jasmine.DEFAULT_TIMEOUT_INTERVAL=7000;
        closeCb.mockClear();
        messageCb.mockClear();
        WebSocketConnection = new WebSocketConnectionHelper();
        wsClient = new WebSocket('ws://' + wssConfiguration.hostname  + ":" + wssConfiguration.port);
        wsClient.on('open', ()=>{
            WebSocketConnection.connection = true;
            wsServerClient = Object.keys(wsServer.clients).map((client) => wsServer.clients[client]).reverse()[0];
            done()
        });
    });

    afterEach(()=>{
        wsClient = null;
    });

    describe('Should init with basic configuration',()=>{

        test('WebSocketServer init',()=>{
            expect(wsServer instanceof WebSocketServer).toBeTruthy()
        });

        test('Server property is Server instance', () =>{
            expect(wsServer.server instanceof WebSocket.Server).toBeTruthy()
        });

        test('MessageCb property is a function', () =>{
            expect(typeof wsServer.messageCb).toBe('function')
        });

        test('CloseCb property is a function', () =>{
            expect(typeof wsServer.closeCb).toBe('function')
        });

        describe('Should create a new client on connection', () => {

            test('Create new client with an uuid.v4',()=>{
                expect(wsServerClient).toHaveProperty('id');
                expect(wsServerClient.id).toMatch(uuidV4RegExp);
            });

            test('Client send message', async()=>{
                const mockedSendCallback = jest.fn(()=> WebSocketConnection.message = true);
                wsClient.send(message, mockedSendCallback);

                await WebSocketConnection.receiveMessage()
                    .then(() => expect(messageCb).toBeCalledWith(message, wsServerClient.id));
            });
        });

        describe('Should delete client on client close',()=>{

            test('Connection closed from client should remove client from server clients list', async() =>{
                wsClient.close(1000,closeMessage);

                await WebSocketConnection.isDisconnected();

                expect(closeCb).toBeCalledWith(wsServerClient.id);
                expect(wsServer.clients).not.toContainEqual(wsServerClient.id)
            });

            test('Connection error must delete client from server clients list and send message with error', async() =>{

                wsClient = new WebSocket('ws://' + wssConfiguration.hostname  + ":" + wssConfiguration.port, {
                    headers : {
                        origin: ""
                    }
                })

                wsClient.on('error', (error)=>{console.log(error)})
                await WebSocketConnection.isDisconnected();

                expect(errorCb).toBeCalledWith(wsServerClient.id);
                expect(wsServer.clients).not.toContainEqual(wsServerClient.id)
            })
        });

        describe('WebSocket Server send message',()=>{
            test('Sending message from server', async()=>{
                const spyWebSocketServerSend = jest.fn(()=> WebSocketConnection.message = true);

                wsServer.send(serverMessage, wsServerClient.id, spyWebSocketServerSend);

                await WebSocketConnection.receiveMessage();

                expect(spyWebSocketServerSend).toBeCalled();
            })

        })
    });
    describe('WebSocket Server connection fail, log error',()=>{
        test('Bad connection', async()=>{
            const wsServer = new WebSocketServer(
                "jshdfaryusd",
                8000,
                wssConfiguration.messageCb,
                wssConfiguration.closeCb);
        })

    })
});