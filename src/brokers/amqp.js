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

    start = () => {
        console.log(`Connecting to ${this.amqpURL}`);
        return amqp.connect(this.amqpURL)
            .then((connection) => {
                this.connection = connection;
                console.log("Connected to AMQP broker");
                return connection.createChannel()
            })
            .then((ch) => {
                this.channel = ch;
                this.stoped = false;
                this.registerInstance();
                return ch.assertQueue(this.comsumptionQueue)
                    .then((ok) => {
                        return this.channel.consume(this.comsumptionQueue, this.consume)
                    })
            })
            .catch((error) => {
                console.error(`${error.stack}\nAMQP error : ${error}`)
            });
    };

    isStoped = () =>{
        return this.stoped
    };

    stop = async () =>{
        await this.channel.close();
        await this.connection.close();
        this.stoped = true;
    };

    produce = (message, queue) => {
        let _this = this;
        return this.channel.assertQueue(queue).then((ok) => {
            return _this.channel.sendToQueue(queue, new Buffer(message))
        })
    };

    consume = (raw_message) => {
        let message = raw_message.content.toString();
        this.comsumptionCb(message)

    };

    registerInstance = () => {
        this.produce(this.comsumptionQueue, "athena.instances")
    };
}