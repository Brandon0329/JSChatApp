const net = require('net');

class Client {
  construtor() {
    this.socket = null;
    this.username = '';
    this.friends = new Set();
    this.blocked = new Set();
    this.chatSpaces = new Set();
    this.queues = new Map();
    this.openChat = ''; /* May need this to be a socket depending on implementation of chat rooms. */
    /* Use when waiting for a particular response from a server. */
    this.serverReady = false;
    this.userFound = false;
  }

  /* Create socket, set up handlers and connect to server. */
  connectToServer(username, debug) {
    this.socket = new net.Socket();
    socket.setEncoding('utf8');

    socket.connect(8000, 'localhost', function() {
      if(debug)
        console.log('User successfully connected to server');
      socket.write(`\\c ${username}`);
    });

    socket.on('data', function(data) {
      /* Print out to user the data that was received or queue it. */
      /* Messages will be sent with a 'special tag' at the beginning. Extract it. */

      /* This is the case where the server sends a 1 or 0. */
      if(data.length === 1) {
        this.userFound = data == 1;
        this.serverReady = true;
        return;
      }

      data = data.toString();
      let sender = data.match(/$.+$/);
      if(!sender)
        console.log(`Can't find recipient. Here was the message:\n ${data}`);
      else {
        /* Still not considering server logic or chat room case. */
        data = data.slice(sender.length + 1);
        sender = sender.replace(/$/, '');
        if(sender === this.openChat || sender === 'SERVER')
          console.log(`${sender}> ${data}`);
        else {
          /* If not the currently open chat, queue message. */
          /* Have logic here for dealing with new connections. */
          let tempQueue = this.queues.get(sender) || [];
          tempQueue.push(data);
          this.queues.set(sender, tempQueue);
        }
      }
    });

    socket.on('error', function(err) {
      console.log('An error has occurred. Terminating connection');
      throw err;
    });
  }

  sendMessage(msg) {
    if(this.openChat.length === 0)
      console.log('Please select who to send a message to.\n Use this command to choose...');
    else
      this.socket.write(`$${this.openChat}$ ${msg}`);
  }

  commandHandler(command) {

  }

  openChat(name) {
    if(this.chatSpaces.has(name))
      this.openChat = name;
    else {
      this.socket.write(`\\v ${name}`);
      /* Wait until server gets back to us. */
      /* Maybe do something with setInterval/setTimeout. */
      while(!this.serverReady) {}
      this.serverReady = false;

      if(userFound) {
        this.openChat = name;
        console.log(`Now connected to ${name}`);
      } else
        console.log(`${name} not found`);
    }
  }
}