const net = require('net');

class ChatClient {
  constructor() {
    this.socket = null; // May need multiple sockets for different chat rooms
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

      /* If src isn't the active chat, queue response. */
      if(src !== clientRef.activeChat) {
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