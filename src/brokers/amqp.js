/**
 * Created by luma on 3/25/17.
 */

const amqp = require('amqplib');

class AMQPBroker {

    constructor(configuration){
        const amqpUser =  [configuration.user, configuration.password].join(':');
        const amqpHost =  [configuration.host, configuration.port].join(':');
        const amqpAuth = [amqpUser, amqpHost].join('@');

        this.amqpURL = ['amqp://', amqpAuth, configuration.vhost].join();
        this.comsumptionQueue = "athena." + configuration.serverId;
        this.serverId = configuration.serverId;
        this.comsumptionCb = configuration.comsumptionCb;
        this.name = configuration.name;
    }

    start = () => {
        let _this = this;
        amqp.connect(this.amqpURL)
            .then((connection) => {
                _this.connection = connection;
                console.log("Connected to AMQP broker");
                return connection.createChannel()
            })
            .then((ch) => {
                _this.channel = ch;
                _this.registerInstance();
                return ch.assertQueue(this.comsumptionQueue)
                    .then((ok) => {
                        return channel.consume(this.comsumptionQueue, _this.consume)
                    })
            })
            .catch((error) => {
                console.error("AMQP error : " + error)
            });
    };

    stop = () =>{
        this.channel.close();
        this.connection.close();
    };

    produce = (message, queue) => {
        let _this = this;
        this.channel.assertQueue(queue).then((ok) => {
            return _this.channel.sendToQueue(queue, new Buffer(message))
        })
    };

    consume = (message) => {
        this.comsumptionCb(message)

    };

    registerInstance = () => {
        this.produce(this.serverId, "athena.instances")
    };
}