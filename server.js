'use strict';

const net = require('net');
const utils = require('./serverUtils');

const UTF8 = 'utf8';

/* ALL MESSAGES SENT MUST GO THROUGH SERVER. */
/* PORTS CAN'T BE CACHED ON CLIENT-SIDE BUT USERNAMES CAN. */

class ChatServer {
  constructor() {
    this.server = null;
    this.users = new Map();
    this.sockets = new Map();
    /* Have separate servers as chat rooms? */
    /* <string, Server> */
    this.chatRooms = new Map();
  }

  init() {
    /* Saving server reference for function binding later. */
    /* Reference changes to socket reference in handler. */
    let serverRef = this;

    /* Thinking that every message sent by a user is a "command". */
    this.server = net.createServer(function(socket) {
      /* When receiving a command... e.g. utils[command_name].bind(this)(socket, message). */
      socket.setEncoding('utf8');
      socket.on('data', function(data) {
        data = data.toString();

        if(data[0] != '\\')
          console.log('This should not happen. Every message must start with \\');
        else {
          /* Parse command from client input. */
          let command = data.split(' ')[0].slice(1);
          command = utils[command];
          if(!command)
            socket.write('This is not a valid command.', 'utf8'); /* List commands here. */
          else
            command.bind(serverRef)(socket, data);
        }
      });

      socket.on('error', function(err) {
        if(err.code === 'ECONNRESET') {
          /* TODO: Send message to every user that this user has left. */
          let user = serverRef.sockets.get(this);
          console.log(`${user} has left the chat.`);
          /* Remove user from chat. */
          serverRef.sockets.delete(this);
          serverRef.users.delete(user);
        } else
          throw err;
      });
    });

    this.server.on('error', function(err) {
      console.log('Do some error handling here.');
    });

    return this;
  }

  start(port=8000, host='localhost') {
    this.server.listen(port, host);
    console.log(`Server is listening on port ${port}`);
  }
}

module.exports = ChatServer;