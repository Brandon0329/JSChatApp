const utils = {
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

  /* List users on server. */
  l(socket, command) {
    return;
  },

  m(socket, command) {
    /* May not need to use promises here... */
    let slicePromise = function() {
      return new Promise(function(resolve, reject) {
        resolve(command.slice(3));
      });
    };

    let tempMap = this.users.values();
    slicePromise()
      .then(function(message) {
        console.log(message);
        for(let user of tempMap)
          user.write(`Server> ${message}`, 'utf8');
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