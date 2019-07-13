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