'use strict';

const net = require('net');
const UTF8 = 'utf8';
const PORT = 8000;
const HOST = 'localhost';

class chatServer {
    constructor() {
	   this.users = new Map(); 		/* Maps user names to Sockets. */
	   this.chatSpaces = new Set(); 	/* Set for open chat rooms. */
		/* Maybe have another Map for socket to user mappings? */
    }

    init(debug) {
	   this.server = net.createServer(function(socket) {
		  if(debug)
			 console.log('New connection cratead');

		  socket.write("Welcome to the JSChat App!", UTF8);

		  socket.on('data', function(data) {
			 if(data[0] === '\\')
				    userCommandHandler(socket, data);
			 else {
				    /* Determine way of finding destination of message.
					 * May be to a single user or to a chat room.
					 */
			 }
		  });
	   });

	   return this;
	}

    /** Make server listen for connections. init() must be called first. */
    start() {
	   this.server.listen(PORT, HOST);
    }

    /** Handle commands from users. */
    userCommandHandler(socket, command) {
	   command = command.split(' ');

	   switch(command[0]) {
		  case '\\l':
			 listUsers(socket);
			 break;
		  default:
			 socket.write('This is not a valid command. Here is a list of valid commands:\n');
			 /* List valid commands here. */
	   }
    }

    /** List all users online. */
    listUsers(socket) {
	   socket.write('List of users:\n\n', UTF8);

	   Array.from(users.keys()).forEach(function(user) {
		  socket.write(`${user}\n`, UTF8);
	   });
    }

    /** Send a message to every user in the server. */
    globalMessage(msg) {
	   Array.from(users.values()).forEach(function(socket) {
		  socket.write(msg, UTF8);
	   });
	   /* Need a way to send message to every chat room.
		* Trying to figure out functionality for that.
		*/
    }
}