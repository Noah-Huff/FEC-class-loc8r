const mongoose = require('mongoose');
let dbURI = 'mongodb://localhost/Loc8r';

mongoose.connect(dbURI, {useNewUrlParser: true});

mongoose.connection.on('connected', () => { 
    console.log(`Mongoose Connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err);
});

const gracefulShutdown = (msg, callback) => { 
    mongoose.connection.close( () => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};

//event listeners for shutting down mongo
//fornodemon restarts
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
//for app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
//for heroku
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

require('./locations');
