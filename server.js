'use strict';

const net = require('net');
const UTF8 = 'utf8';
const PORT = 8000;
const HOST = 'localhost';

/* ALL MESSAGES SENT MUST GO THROUGH SERVER. */

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
          /* Assume no group chats for now. */
          let recvUser = data.match(/$.+$/i);
          let index = recvUser.length + 1;
          recvUser = this.users.get(recvUser.replace(/$/, ''));
          recvUser.write(`${this.sockets.get(socket)}$ ${data.slice(index)}`, UTF8);
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
      case '\\C':
        /* Connect to a chat room. */
      case '\\c':
        connectWithUser(socket, command);
      case '\\l':
        listUsers(socket);
        break;
      case '\\s'
        setUserAndSocket(socket, command[1]);
      case '\\v'
        verifyUser(socket, command[1]);
      default:
        socket.write('This is not a valid command. Here is a list of valid commands:\n');
        /* List valid commands here. */
    }
  }

  connectWithUser(socket, command) {
    let user = command.split(' ')[1];

    if(!user)
      socket.write('$SERVER$ Please specify a user.', UTF8);
    else if(!this.users.get(user))
      socket.write(`$SERVER$ ${user} not found.`, UTF8);
    else
      socket.write(`$SERVER$ Opened connection with ${user}.`, UTF8);
  } 

  listUsers(socket) {
    socket.write('List of users:\n\n', UTF8);

    Array.from(users.keys()).forEach(function(user) {
      socket.write(`$SERVER$ ${user}\n`, UTF8);
    });
  }

  setUserAndSocket(socket, user) {
    this.users.set(user, socket);
    this.sockets.set(socket, user);
  }

  verifyUser(socket, user) {
    if(this.users.has(user))
      sendBoolean(socket, 1);
    else
      sendBoolean(socket, 0);
  }

  globalMessage(msg) {
    Array.from(users.values()).forEach(function(socket) {
      socket.write(`$SERVER$ ${msg}`, UTF8);
      /* Need a way to send message to every chat room.
       * Trying to figure out implementation for chat rooms.
       */
    });
  }

  sendBoolean(socket, val) {
    socket.write(val, UTF8);
  }
}