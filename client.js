const Socket = require('./index.js');
const socket = new Socket.Client('ws://127.0.0.1:8080');

socket.on('open', () => {
    console.log('Connected!');

    socket.on('message', (msg) => {
        console.log(msg);
    });

    socket.send('Message');
    socket.end();
});