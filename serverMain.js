/* Starts the Main server. */
const server = require('./server');

new server().init().start(8000, 'localhost');