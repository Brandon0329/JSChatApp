/* Spawn a client of the server. */
const client = require('./client');

/* For testing. Add database logic later. */
let ID = Math.floor(Math.random() * 500000);
let user = new client();
user.connectToServer(8000, 'localhost', `user${ID}`);

/* Main logic of how clients will communicate
 * Have handler instead of just writing.
 */
process.stdin.on('data', function(data) {
  /* Data is appended with /r/n. Remove those characters. */
  /* Might need to change this. */
  data = data.toString().replace(/\r\n/, '');
  if(data.length > 0) {
    if(data[0] === '\\') {
      /* Run some handler here. */
      /* Or a switch statement... */
      let command = data.split(' ')[0];
      switch(command) {
        case '\\s':
          // TODO: Add logic for switching chat rooms. Should also change active socket.
          // Check if valid user before continuing... */
          user.activeChat = data.split(' ')[1];
          console.log(`Your messages will now be sent to ${user.activeChat}`);
          /* Flush any queued messages to from activeChat to client console. */
          user.flushMessages(user.activeChat);
          break;
        case '\\l': // List users or send to server??
        case '\\g': // Switch to global chat as active chat
          user.activeChat = '$MAINSERVER';
          console.log('Your messages will now be sent to the main server.');
          user.flushMessages('$MAINSERVER');
          break;
        // For debugging. This ain't working
        case '\\m':
          console.log(JSON.stringify(user.messageQueues.entries()));
          break;
        case '\\n':
          console.log('Creating new chat room. Please wait...');
          user.socket.write(data, 'utf8');
          break;
        default:
          console.log("This is not a command. List commands here...");
          break;
      }
    } else
      user.socket.write(`\\m ${user.activeChat} ${data}`, 'utf8');
  }
});

/* This test causes the server to act weird. */
// setTimeout(function() {
//   for(let i = 0; i < 10; i++)
//     user.socket.write(`\\m This is a test from ${ID}: ${i}\n`);
// }, 1000);

/* Testing. */
// let interval = setInterval(function() {
//   let randomChar = String.fromCodePoint(Math.floor(Math.random() * 26) + 'a'.codePointAt(0));
//   user.socket.write(`\\m ${randomChar}: ${ID}`, 'utf8');
// }, 1000);

// setTimeout(function() {
//   clearInterval(interval);
// }, 10000);