/* Spawn a client of the server. */
const client = require('./client');

/* For testing. Add database logic later. */
let ID = Math.floor(Math.random() * 500000);
let user = new client()
user.connectToServer(8000, 'localhost', `user${ID}`);

/* Main logic of how clients will communicate
 * Have handler instead of just writing.
 */
process.stdin.on('data', function(data) {
  user.socket.write(`\\m ${data}`, 'utf8');
});

/* This test causes the server to act weird. */
// setTimeout(function() {
//   for(let i = 0; i < 10; i++)
//     user.socket.write(`\\m This is a test from ${ID}: ${i}\n`);
// }, 1000);