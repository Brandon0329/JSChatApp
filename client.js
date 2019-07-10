const net = require('net');

class ChatClient {
  construtor() {
    this.socket = null;
    this.username = '';
    this.users = new Set();
    this.currChatID = '';
  }

  connectToServer(port=8000, host='localhost', username) {
    this.socket = new net.Socket();
    this.socket.setEncoding('utf8');

    this.socket.on('data', function(data) {
      console.log(data);
    });

    /* Do error handling better... */
    this.socket.on('error', function(err) {
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
}

module.exports = ChatClient;