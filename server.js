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
    /* <String, ChatRooms> */
    this.chatRooms = new Map();
    this.availablePorts = []; // For chat rooms. ONLY 10 chatrooms allowed. Needed to bound this.
  }

  init() {
    /* Saving server reference for function binding later. */
    /* Reference changes to socket reference in handler. */
    let serverRef = this;

    /* Initialize available ports array. */
    for(let i = 0; i < 10; i++)
      this.availablePorts.push(false);

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
          // let command = data.split(' ')[0].slice(1);
          let command = utils[data.split(' ')[0].slice(1)];
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
          serverRef.globalMessage(`${user} has left the chat.`);
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

  /** Start the server.
    * @param {number} port port the server will listen on
    * @param {string} host address that will host the server
    */
  start(port=8000, host='localhost') {
    this.server.listen(port, host);
    console.log(`Server is listening on port ${port}`);
  }

  /** Send a message to all users online.
    * @param {String} message the message that will be sent
    */
  globalMessage(message) {
    /* Should also send the message to every chatroom. */
    /* TODO: code logic to send message to every chatroom. */
    for(let user of this.users.values())
      if(!user.destroyed)
        user.write(`$MAINSERVER Server> ${message}`);
  }
}

module.exports = ChatServer;