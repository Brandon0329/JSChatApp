const utils = {
  /** Add a user to server data structures when user connects. */
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

  /** Add a user to the client's friend list. */
  f(socket, command) {
    return;
  },

  /** List users on server. */
  l(socket, command) {
    return;
  },

  /** Send a message to appropriate user(s). 
   *  @param {net.Socket} socket source client
   *  @param {String} command client's command
   */
  m(socket, command) {
    /* May not need to use promises here... */
    /* Tried using promises because messages weren't being parsed when sent to fast. */
    let slicePromise = function() {
      return new Promise(function(resolve, reject) {
        resolve(command.slice(3));
      });
    };

    let users = this.users.values();
    let sender = this.sockets.get(socket);
    slicePromise()
      .then(function(message) {
        console.log(message);
        for(let user of users)
          if(socket !== user)
            user.write(`${sender}> ${message}`, 'utf8');
      })
      .catch(function(err) {
        console.log(`Error in m command: ${err.code}`);
      });
    // let message = command.slice(3);
    // console.log(message);
    // for(let user of this.users.values())
    //   user.write(`Server> ${message}`, 'utf8');
  },


  u(socket, command) {
    return;
  }
};

module.exports = utils;