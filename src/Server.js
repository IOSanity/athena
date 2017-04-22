import WebSocketServer from './WebSocketServer';
import Dispatcher from './Dispatcher'
import Router from './Router';
import JSONDecode from './decoders/json';
import AMQPBroker from './brokers/amqp';
import {v4 as uuid} from 'uuid';
import debug from 'debug';


const log = debug('Athena Server');

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
                log(`ERROR: decode failed : ${e}`);
                log(`message: ${message}`);
                log(`broker: ${broker}`);
            }

        }
    }

    _webSocketServerCloseCallback = (webSocketId) => {
        let message;
        try{
            message = JSON.stringify({webSocketId: webSocketId});
        }catch (e){
            log(`ERROR: decode failed : ${e}`);
            log(`websSocket Id: ${webSocketId}`);
        }
        webSocketId && this._sendCloseToQueue(message)
    };

    _webSocketServerErrorCallback = (error, webSocketId) => {
        let message;

        try{
            message = JSON.stringify({webSocketId: webSocketId, error: error});
        }catch (e){
            log(`ERROR: decode failed : ${e}`);
            log(`websSocket Id: ${webSocketId}`);
        }

        message && this._sendCloseToQueue(message)
    };

    _webSocketServerMessageCallback = (message) => {
        let decodedMessage;
        try{
            decodedMessage = this.decoder(message);
        }catch (e){
            log(`ERROR: decode failed : ${e}`);
            log(`Message: ${message}`);
        }
        decodedMessage && this.dispatcher.dispatch(decodedMessage, message)
    };

    _brokerConsumeCallback = (message) =>{
        let decodedMessage;
        try{
            decodedMessage = this.decoder(message);
        }catch (e){
            log(`ERROR: decode failed : ${e}`);
            log(`Message: ${message}`);
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
            log(`webSocketServer listening at ${this.webSocketConfiguration.hostname}:${this.webSocketConfiguration.port}`);
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

            log(`Brokers: ${this.brokers.length}`)
        }catch(error){
            console.error(`Error instancing brokers: ${error}`)
        }
    };

    _instanceRouter = () => {
        try{
            this.router = new Router(this.routeDescriptions);
            log('Router instanced')
        }catch (error){
            console.error(`Error instancing Router: ${error}`)
        }
    };

    _instanceDispatcher = () => {
        try{
            this.dispatcher = new Dispatcher(this.router, this.brokers);
            log('Dispatcher instanced')
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

        log('Starting brokers');
        await this._startBrokers();

    };
}