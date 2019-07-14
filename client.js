const net = require('net');

class ChatClient {
  constructor() {
    this.socket = null; // May need multiple sockets for different chat rooms

    /* A map for connections to chat rooms. */
    this.connections = new Map();

    this.username = '';
    this.users = new Set(); // Set<String>
    this.messageQueues = new Map(); // Map<String, Array<String>>
    this.activeChat = '$MAINSERVER';
  }

  connectToServer(port=8000, host='localhost', username) {
    this.socket = new net.Socket();
    this.socket.setEncoding('utf8');

    let clientRef = this;

    this.socket.on('data', function(data) { 
      let src = data.split(' ')[0];
      let message = data.slice(src.length + 1);

      if(src === '$') {
        /* Create a socket for the new chat room. */
        const [ roomName, roomPort ] = message.split(' ');
        let roomSocket = new net.Socket();

        roomSocket.setEncoding('utf8');

        roomSocket.on('data', function(data) {
          // If not active chat, then queue response, but print for now.
          console.log(data);
        });

        roomSocket.on('error', function(err) {
          if(err.code === 'ECONNRESET') {
            /* This means that the chat room is down. Switch back to global chat. */
            console.log('Chat room has closed. Switching back to global chat...');
            /* Destroy socket and switch back to global chat here. */
          } else
            throw err;
        });

        /* Connect and map this socket. */
        roomSocket.connect(roomPort, host, function() {
          console.log('New room has been created and the connection has been made. You may switch to chat room now.');
          console.log('Print command to switch...');
          clientRef.connections.set(roomName, roomSocket);
        });
        
      } else if(src !== clientRef.activeChat) {
        let tempQueue = clientRef.messageQueues.get(src) || [];
        tempQueue.push(message);
        clientRef.messageQueues.set(src, tempQueue);
        console.log(`${tempQueue.length} unread message(s) from ${src}`);
      } else
        console.log(message);
    });

    /* Do error handling better... */
    this.socket.on('error', function(err) {
      /* Maybe destroy socket after error... */
      if(err.code === 'ECONNRESET')
        console.log('Server is currently down. Try again later.');
      else if(err.code === 'ERR_STREAM_DESTROYED')
        throw err;
    });

    this.socket.connect(port, host, function() {
      this.write(`\\c ${username}`);
    });
  }

  commandHandler(command) {
    return;
  }

  /* Have a universal handler function instead of individual functions?? */
  /** Flush all messages from src and set a new queue
    * @param {String} src User source of messages
    */
  flushMessages(src) {
    let queue = this.messageQueues.get(src);
    if(queue) {
      queue.forEach(function(message) {
        console.log(message);
      });
      this.messageQueues.set(src, []);
    }
  }
}

module.exports = ChatClient;