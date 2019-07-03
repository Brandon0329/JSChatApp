'use strict';

const net = require('net');
const UTF8 = 'utf8';
const PORT = 8000;
const HOST = 'localhost';

class ChatServer {
  constructor() {
    this.users = new Map();       /* Maps users to Sockets. */
    this.sockets = new Map();     /* Maps sockets to users. */
    this.chatSpaces = New Set();  /* Set for open chat rooms. */
    this.server = null;
  }

  init(debug) {
    this.server = net.createServer(function(socket) {
      if(debug)
        console.log('New connection created');

      socket.write('Welcome to the JSChatApp!', UTF8);
      socket.on('data', function(data) {
        if(data[0] === '\\')
          userCommandHandler(socket, data);
        else {
          /* Determine way of finding destination message.
           * Message may be to a single user or to a chat room.
           */
        }
      });
    });

    return this;
  }

  start() {
    this.server.listen(PORT, HOST);
  }

  userCommandHandler(socket, command) {
    command = command.split(' ');

    switch(command[0]) {
      case '\\l':
        listUsers(socket);
        break;
      case '\\s'
        setUserAndSocket(socket, command[1]);
      default:
        socket.write('This is not a valid command. Here is a list of valid commands:\n');
        /* List valid commands here. */
    }
  }

  listUsers(socket) {
    socket.write('List of users:\n\n', UTF8);

    Array.from(users.keys()).forEach(function(user) {
      socket.write(`${user}\n`, UTF8);
    });
  }

  setUserAndSocket(socket, user) {
    this.uses.set(user, socket);
    this.sockets.set(socket, user);
  }

  globalMessage(msg) {
    Array.from(users.values()).forEach(function(socket) {
      socket.write(msg, UTF8);
      /* Need a way to send message to every chat room.
       * Trying to figure out implementation for chat rooms.
       */
    });
  }
}