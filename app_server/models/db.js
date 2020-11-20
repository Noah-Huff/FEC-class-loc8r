const mongoose = require('mongoose');
const host = process.env.DB_HOST || 'mongodb://127.0.0.1/Loc8r';
let dbURL = `${host}`;

console.log('Env = ', process.env.NODE_ENV);

mongoose.connect(dbURL, {useNewUrlParser: true});

mongoose.connection.on('connected', () => { 
    console.log(`Mongoose Connected to ${dbURL}`);
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
