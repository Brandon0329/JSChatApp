const room = require('./chatRoom');

const utils = {
  /** Add a user to server data structures when user connects.
   *  @param {net.Socket} socket source client
   *  @param {String} command client's command
   */
  c(socket, command) {
    console.log("new user connecting");
    let user = command.split(' ')[1];

    if(user === undefined)
      console.log('This should not occur');
    else {
      this.users.set(user, socket);
      this.sockets.set(socket, user);
    }
  },

  /** Add a user to the client's friend list.
   *  @param {net.Socket} socket source client
   *  @param {String} command client's command
   */
  f(socket, command) {
    return;
  },

  /** List users on server.
   *  @param {net.Socket} socket source client
   *  @param {String} command client's command
   */
  l(socket, command) {
    return;
  },

  /** Send a message to appropriate user(s). 
   *  @param {net.Socket} socket source client
   *  @param {String} command client's command
   */
  m(socket, command) {
    // Debugging...
    console.log(command);
    /* Removing command from message. */
    let message = command.slice(3);
    let src = this.sockets.get(socket);
    let dest = message.split(' ')[0];

    // Need to handle case where user types bad username
    console.log(message); // For debugging
    if(dest === '$MAINSERVER') {
      for(let user of this.users.values())
        if(user !== socket)
          user.write(`$MAINSERVER ${src}> ${message.slice(dest.length + 1)}`);
    }
    else if(this.users.get(dest) === undefined)
      socket.write('This user does not exist. Run \\l command to list users.');
    else
      this.users.get(dest).write(`${src} ${src}> ${message.slice(dest.length + 1)}`);
  },

  /* Create a new chat room....maybe.
   *  @param {net.Socket} socket source client
   *  @param {String} command client's command
   */
  n(socket, command) {
    let roomName = command.split(' ')[1];

    /* If roomName was supplied, attempt to create a chat room. */
    if(roomName) {
      let i = 0;
      while(i < this.availablePorts.length && this.availablePorts[i])
        i++;

      if(i == this.availablePorts.length) {
        /* Let user know that no more ports available; can't create chat room. */
        /* Find a way to make sure that this message is never queued. This is an IMPORTANT message. */
        socket.write('$MAINSERVER Server> No more chat rooms can be created at this time. Try again later.');
      } else {
        this.availablePorts[i] = true;
        let chatRoom = new room(roomName, 8000 + i + 1);
        chatRoom.init().start(8000 + i + 1);
        // Should probably make sure that nothing went wrong before mapping the chat room.
        this.chatRooms.set(roomName, chatRoom);
        // Send port number to user.
        socket.write(`$ ${roomName} ${8000 + i + 1}`);
      }
    } else
    return;
  },

  /** I forgot what this was supposed to do...
   *  @param {net.Socket} socket source client
   *  @param {String} command client's command
   */
  u(socket, command) {
    return;
  }
};

module.exports = utils;