
export default class Dispatcher {
    constructor(router, brokers){
        this._Router = router;
        this._Brokers = brokers;
    }

    dispatch = (decodedMessage, message) => {
        let routes = this._Router.route(decodedMessage);

        routes.forEach((route) => {
            this._Brokers[route.broker].produce(message, route.queue)
        })
    }

}