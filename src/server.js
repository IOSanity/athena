import WebSocketServer from './WebSocketServer';
import Dispatcher from './Dispatcher'
import Router from './Router';
import JSONDecode from './decoders/json';
import AMQPBroker from './brokers/amqp';
import {v4 as uuid} from 'uuid';

export default class Server {
    constructor(configuration){
        this.uuid = uuid();
        this.webSocketServer = undefined;
        this.dispatcher = undefined;
        this.router = undefined;
        this.brokers = [];
        this.webSocketConfiguration = Object.assign({}, configuration.websocket,
            {messageCb: this._webSocketServerMessageCallback},
            {closeCb: this._webSocketServerCloseCallback});
        this.brokersConfiguration = Object.assign({}, configuration.brokers);
        this.routeDescriptions = Object.assign({}, configuration.dispatcher);
        this.decoder = JSONDecode;
        this.closeQueue = 'athena.close'
    };

    _sendCloseToQueue(message){
        for(let broker in this.brokers){
            try{
                broker.produce(message,this.closeQueue)
            }catch (e){
                console.group('Close Queue: sending close');
                console.log(`ERROR: decode failed : ${e}`);
                console.log(`message: ${message}`);
                console.log(`broker: ${broker}`);
                console.groupEnd('Close Queue: sending close')
            }

        }
    }

    _webSocketServerCloseCallback = (webSocketId) => {
        let message;
        try{
            message = JSON.stringify({webSocketId: webSocketId});
        }catch (e){
            console.group('WebSocketServer:Close Callback');
            console.log(`ERROR: decode failed : ${e}`);
            console.log(`websSocket Id: ${webSocketId}`);
            console.groupEnd('WebSocketServer:Close Callback')
        }
        webSocketId && this._sendCloseToQueue(message)
    };

    _webSocketServerErrorCallback = (error, webSocketId) => {
        let message;

        try{
            message = JSON.stringify({webSocketId: webSocketId, error: error});
        }catch (e){
            console.group('WebSocketServer:Error Callback');
            console.log(`ERROR: decode failed : ${e}`);
            console.log(`websSocket Id: ${webSocketId}`);
            console.groupEnd('WebSocketServer:Error Callback')
        }

        message && this._sendCloseToQueue(message)
    };

    _webSocketServerMessageCallback = (message) => {
        let decodedMessage;
        try{
            decodedMessage = this.decoder(message);
        }catch (e){
            console.group('WebSocketServer:Message Callback');
            console.log(`ERROR: decode failed : ${e}`);
            console.log(`Message: ${message}`);
            console.groupEnd('WebSocketServer:Message Callback')
        }
        decodedMessage && this.dispatcher.dispatch(decodedMessage, message)
    };

    _brokerConsumeCallback = (message) =>{
        let decodedMessage;
        try{
            decodedMessage = this.decoder(message);
        }catch (e){
            console.group('Broker:Consume Callback');
            console.log(`ERROR: decode failed : ${e}`);
            console.log(`Message: ${message}`);
            console.groupEnd('Broker:Consume Callback')
        }

        decodedMessage && this.webSocketServer.send(decodedMessage.message, decodedMessage.id)
    };

    _startWebSocketServer = () =>{
        try {
            this.webSocketServer = new WebSocketServer(
                this.webSocketConfiguration.hostname,
                this.webSocketConfiguration.port,
                this.webSocketConfiguration.messageCb,
                this.webSocketConfiguration.closeCb,
                this._webSocketServerErrorCallback);
            console.log(`webSocketServer listening at ${this.webSocketConfiguration.hostname}:${this.webSocketConfiguration.port}`);
        }
        catch(error){
            console.error(`Error creating WebSocket instance: ${error}`)
        }
    };

    _instanceBrokers = () => {
        try {
            this.brokersConfiguration.amqp.forEach((brokerConfiguration)=>{
                brokerConfiguration["comsumptionCb"] = this._brokerConsumeCallback;
                brokerConfiguration["serverId"] = this.uuid;
                let broker = new AMQPBroker(brokerConfiguration);
                this.brokers.push(broker)
            });

            console.info(`Brokers: ${this.brokers.length}`)
        }catch(error){
            console.error(`Error instancing brokers: ${error}`)
        }
    };

    _instanceRouter = () => {
        try{
            this.router = new Router(this.routeDescriptions);
            console.info('Router instanced')
        }catch (error){
            console.error(`Error instancing Router: ${error}`)
        }
    };

    _instanceDispatcher = () => {
        try{
            this.dispatcher = new Dispatcher(this.router, this.brokers);
            console.log('Dispatcher instanced')
        }catch (error){
            console.error(`Error instancing Dispatcher: ${error}`)
        }
    };

    _startBrokers = async() => {

        await this.brokers.forEach(async (broker)=>{
            try{
                await broker.start()
            }catch(error){
                console.error(`Error starting broker ${broker.name}: ${error}`)
            }
        })
    };

    run = async() =>{
        this._startWebSocketServer();
        this._instanceBrokers();
        this._instanceRouter();
        this._instanceDispatcher();

        console.info('Starting brokers');
        await this._startBrokers();

    }
}