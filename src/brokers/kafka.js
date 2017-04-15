import Kafka from './KafkaPromised';

export default class KafkaBroker {

    constructor(configuration){
        this.kafkaURL = configuration.hosts.join(",");
        this.name = configuration.name;
        this.stoped = true;
        this.producer = new Kafka({"metadata.broker.list": this.kafkaURL});
    }

    start = async () => {
        console.log(`Connecting to ${this.name} : ${this.kafkaURL}`);
        await this.producer.start();
        console.log(`Connected to ${this.name}`);
        this.stoped = false;
    };

    isStoped = () =>{
        return this.stoped
    };

    stop = async () =>{
        await this.producer.stop();
        this.stoped = true;
    };

    produce = async (message, queue) => {
        await this.producer.produce(queue, message);
        console.log(`Produced message in ${this.name} queue ${queue} : ${message}`);
    };
}