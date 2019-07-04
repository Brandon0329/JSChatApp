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
	}

	/* Connect to server and setup handlers. */
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
			data = data.toString();
			let sender = data.match(/$.+$/);
			if(!sender)
				console.log(`Can't find recipient. Here was the message:\n ${data}`);
			else {
				/* Still not considering server logic or chat room case. */
				data = data.slice(sender.length + 1);
				sender = sender.replace(/$/, '');
				if(sender === this.openChat)
					console.log(`${sender}> ${data}`);
				else {
					/* If not the currently open chat, queue message. */
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

	commandHandler(command) {

	}
}