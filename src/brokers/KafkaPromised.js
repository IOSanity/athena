const Kafka = require('node-rdkafka');
const Promise = require("bluebird");

export default class Producer {
    constructor(options){
        options['dr_cb'] = true;
        this.producer = new Kafka.Producer(options);
    };

    start = async ()=> {

        let is_connected = new Promise((resolve,reject) => {
            this.producer.on('ready', ()=>resolve(true));
            this.producer.on('error', (e)=>reject(e));
        });

        try{
            this.producer.connect();
        }catch (error){
            console.log(`Producer error: ${error}`);
        }

        let may_connected = await is_connected;
        if (may_connected !== true){
            throw may_connected;
        }
        this.producer.setPollInterval(100);
        this.producer.on('error', function(error) {
            console.log(`Producer error: ${error}`);
        });
        this.producer.on('delivery-report', function(error, report) {
            console.log(`Producer report: ${report}`);
            if (error){
                console.log(`Producer error: ${error}`);
            }
        });
    };

    stop = async () => {
        let is_disconnected = Promise.fromCallback((callback) => {
            this.producer.on('disconnected', callback)
        });
        this.producer.disconnect();
        await is_disconnected;
    };

    produce = async (topic, message) => {
        try {
            this.producer.produce(topic, null, message);
        } catch (err) {
            console.error('A problem occurred when sending our message');
            console.error(err);
        }
    };
}

// export default  { Producer: Producer};
