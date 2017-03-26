export default class Broker {
    constructor(name){
        this.name = name;
        this.produceCalls = []
    }

    produce = (message, queue) => {
        this.produceCalls.push([message,queue])
    }
}