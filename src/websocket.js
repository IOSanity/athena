const Server = require('uws').Server;
const uuid = require('uuid');

export default class WebSocketServer {

    constructor(hostname, port, messageCb, closeCb) {
        this.messageCb = messageCb;
        this.closeCb = closeCb;
        this.server = this._initWebSocketServer(hostname,port);
        this.clients = {};
    };

    _initWebSocketServer = (hostname, port) => {
        const wsServer = new Server({hostname: hostname, port: port});

        wsServer.on('connection', (ws)=>this._newConnection(ws));
        wsServer.on('error',(error)=>console.error('WebSocketServer - ERROR:',error));

        return wsServer;
    };


    _newConnection = (webSocket) => {
        webSocket.id = uuid.v4();

        webSocket.on('message', (message) => {
            this.messageCb(message, webSocket.id)
        });

        webSocket.on('close', (code,message) => {
            this.closeCb(message, webSocket.id);
            delete this.clients[webSocket.id]
        });

        this.clients[webSocket.id] = webSocket;
    };

    send = (message, webSocketId, cb) => {
        let webSocket = this.clients[webSocketId];

        webSocket.send(message, cb);
    };
}
