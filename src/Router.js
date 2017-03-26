
export default class Router {
    constructor(configuration){
        this._routeDescriptions = configuration
    }

    route = (message) =>{
        let routes = [];

        for(let routeDescription of this._routeDescriptions){
            if(message[routeDescription.field] === routeDescription.value){
                routes.push(routeDescription.route)
            }
        }

        return routes
    }
}