/* A chat room class. */
const net = require('net');

class ChatRoom {
  /* Maybe have the constructor take in args for each field... */
  constructor(serverName, port) {
    this.server = null;
    this.socket = null; // For communication to the main server.
    this.serverName = serverName;
    this.users = new Map();
    this.sockets = new Map();
    this.port = port;
  }

  /** Initialize this room's connection to the main server. */
  socketInit() {
    let socket = new net.Socket();
    socket.setEncoding('utf8');

    /* Store this chat room's refernce. */
    let roomRef = this;

    /* Receiving data from the main server. */
    /* Could be a command from the server or a global message. */
    socket.on('data', function(data) {
      // For now, echo message to everyone in room
      for(let user of roomRef.sockets.keys())
        user.write(data);
    });

    socket.on('error', function(err) {
      // Do some proper error handling here...
      console.log('Handle error here');
    });

    socket.connect(8000, 'localhost');

    return socket;
  }

  /** Initialize this room's server instance. */
  serverInit() {
    let server = net.createServer(function(socket) {
      socket.setEncoding('utf8');

      socket.on('data', function(data) {
        /* Do the same thing as in the main server. */
      });

      socket.on('error', function(err) {
        if(err.code === 'ECONNRESET') {
          /* This means that a user has left this chat room. */
          console.log("Add error handling here...");
        } else
          throw err;
      });
    });

    server.on('error', function(err) {
      /* Do error handling here. */
      console.log("Add error handling here...");
    });

    return server;
  }

  /** Initialize the server and the socket connected to the main server. */
  init() {
    this.socket = this.socketInit();
    this.server = this.serverInit();

    return this;
  }

  /** Start the server on port. Maybe don't pass in as args? */
  start(port) {
    this.server.listen(port, 'localhost');
  }
}

module.exports = ChatRoom;