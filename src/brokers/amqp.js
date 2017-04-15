const amqp = require('amqplib');

export default class AMQPBroker {

    constructor(configuration){
        const amqpUser =  [configuration.user, configuration.password].join(':');
        const amqpHost =  [configuration.host, configuration.port].join(':');
        const amqpAuth = [amqpUser, amqpHost].join('@');

        this.amqpURL = ['amqp://', amqpAuth, configuration.vhost].join("");
        this.comsumptionQueue = "athena." + configuration.serverId;
        this.comsumptionCb = configuration.comsumptionCb;
        this.name = configuration.name;
        this.stoped = true;
    }

    start = async () => {
        console.log(`Connecting to ${this.name} : ${this.amqpURL}`);
        this.connection = await amqp.connect(this.amqpURL);
        console.log(`Connected to ${this.name}`);
        this.channel = await this.connection.createChannel();
        this.stoped = false;
        await this.registerInstance();
        await this.channel.assertQueue(this.comsumptionQueue);
        await this.channel.consume(this.comsumptionQueue, this.consume)
    };

    isStoped = () =>{
        return this.stoped
    };

    stop = async () =>{
        await this.channel.close();
        await this.connection.close();
        this.stoped = true;
    };

    produce = async (message, queue) => {
        await this.channel.assertQueue(queue);
        await this.channel.sendToQueue(queue, new Buffer(message));
        console.log(`Produced message in ${this.name} queue ${queue} : ${message}`);
    };

    consume = (raw_message) => {
        let message = raw_message.content.toString();
        console.log(`Consumed message from ${this.name} : ${message}`);
        this.comsumptionCb(message)
    };

    registerInstance = async () => {
        await this.produce(this.comsumptionQueue, "athena.instances");
        console.log(`Registered instance in ${this.name} : ${this.comsumptionQueue}`);
    };
}