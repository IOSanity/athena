import path from 'path';
import Server from './Server';


let server, config;

process.argv.forEach((val, index, argvs) => {
    // console.log(`${index}: ${val}`);
    if(val === '--config' || val === '-c'){
        loadConfiguration(argvs[index+1])
    }
});


function loadConfiguration(configurationPath) {
    try{
        config = require(path.resolve(__dirname, '..', configurationPath));
        return config
    }
    catch(error) {
        console.error('error reading configuration', error)
    }
}


server = new Server(config);
server.run();



