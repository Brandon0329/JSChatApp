const net = require('net');

class ChatClient {
  construtor() {
    this.socket = null;
    this.username = '';
    this.users = new Set();
    this.currChatID = '';
  }

  connectToServer(port = 8000, host = 'localhost', username) {
    this.socket = new net.Socket();
    this.socket.setEncoding('utf8');

    this.socket.on('data', function(data) {
      console.log(data);
    });

    this.socket.on('error', function(err) {
      console.log(`An error has occurred\n ERRCODE ${err.code}`);
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