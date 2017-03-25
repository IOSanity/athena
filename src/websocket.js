const Server = require('uws').Server;
const uuid = require('uuid');

export default class WebSocketServer {

    constructor(port, host, messageCb, closeCb) {
        this.messageCb = messageCb;
        this.closeCb = closeCb;
        this.server = new Server({ port: port, host: host });
        this.clients = {};
        this.server.on('connection', this.newConnection);
    };

    newConnection = (webSocket) => {
        let server = this;
        webSocket.id = uuid.v4();

        webSocket.on('message', () => {
            server.messageCb(message, this.id)
        });

        webSocket.on('close', () => {
            this.closeCb(message, this.id);
            delete server.clients[this.id]
        });

        this.clients[webSocket.id] = webSocket;
    };

    send = (message, webSocketId) => {
        this.clients[webSocketId].send(message);
    };
}
