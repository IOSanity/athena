import Asynchronous from './Asynchronous';

export default class WebSocketConnectionHelper extends Asynchronous{
    constructor(){
        super();
        this.connectionStatus = false;
        this.messageStatus = false;
    }

    set connection(bool){
        this.connectionStatus = bool
    }

    set message(bool){
        this.messageStatus = bool;
    }

//* Connection functions *//

    connectionIsClosed = () =>{
        return this.connectionStatus === false
    };

    connectionIsOpen = () =>{
        return this.connectionStatus === true
    };

    isConnected = () => {
        return this.waitFor(this.connectionIsOpen);
    };

    isDisconnected = () =>{
        return this.waitFor(this.connectionIsClosed);
    };

//* Message functions *//
    messageIsReceived = () =>{
      return this.messageStatus === true
    };

    messageIsNotReceived = () =>{
        return this.messageStatus === false
    };

    receiveMessage = () => {
        return this.waitFor(this.messageIsReceived);
    };

}