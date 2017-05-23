
export default class Router {
    constructor(configuration){
        this._routeDescriptions = configuration
    }

    route = (message) =>{
        let routes = [];

        this._routeDescriptions.forEach((routeDescription)=>{
            if(message[routeDescription.field] === routeDescription.value){
                routes.push(routeDescription.route)
            }
        });

        return routes
    }
}