/* Starts the Main server. */
const server = require('./server');

const mainServer = new server()
mainServer.init().start(8000, 'localhost');

process.on('SIGINT', function(code) {
  /* End all chat room servers.*/
  /* Maybe send this message to everyone online. */
  console.log('Server going down..');

  /* Ensure that every open chat room is closed before main server closes. */
  const promiseArr = Array.from(mainServer.chatRooms.values()).map(function(room) {
    return new Promise(function(resolve, reject) {
      room.purgeUsers();
      room.server.close(function(err) {
        if(err)
          reject(err);
        else 
          resolve();
      });
    });
  });

  Promise.all(promiseArr)
    .then(function() {
      process.exit(0);
    })
    .catch(function(err) {
      console.log('Error with closing one or more chat rooms:');
      console.log(err.message);
      process.exit(1);
    });
}); 